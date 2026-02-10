"use server";

import { db } from "@/db";
import { coffee_shops as coffeeShops, reviews, shopFollows, visits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, asc, desc, eq, inArray, notInArray, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCoffeeShopById(id: string) {
    try {
        const shop = await db.query.coffee_shops.findFirst({
            where: eq(coffeeShops.id, id),
            with: {
                _rels: {
                    with: {
                        mediaID: true,
                        // @ts-ignore
                        featuresID: true
                    }
                }
            }
        });

        if (!shop) return { success: false, error: "Shop not found" };

        const shopRels = (shop as any)._rels || [];
        const gallery = shopRels
            .filter((r: any) => r.path === "gallery")
            .map((r: any) => r.mediaID)
            .filter(Boolean);

        const features = shopRels
            .filter((r: any) => r.path === "features")
            .map((r: any) => r.featuresID)
            .filter(Boolean);

        // Fetch rating stats from Drizzle
        const [ratingStats] = await db.select({
            avgRating: sql<number>`COALESCE(AVG(NULLIF(${reviews.rating}::numeric, 0)), 0)`,
            avgCoffee: sql<number>`COALESCE(AVG(NULLIF(${reviews.coffeeRating}, 0)), 0)`,
            avgFood: sql<number>`COALESCE(AVG(NULLIF(${reviews.foodRating}, 0)), 0)`,
            avgPlace: sql<number>`COALESCE(AVG(NULLIF(${reviews.placeRating}, 0)), 0)`,
            avgPrice: sql<number>`COALESCE(AVG(NULLIF(${reviews.priceRating}, 0)), 0)`,
            reviewCount: sql<number>`COUNT(${reviews.id})`,
        })
            .from(reviews)
            .where(eq(reviews.shopId, id));

        return {
            success: true,
            data: {
                ...shop,
                gallery,
                features,
                avgRating: ratingStats?.avgRating || 0,
                avgCoffee: ratingStats?.avgCoffee || 0,
                avgFood: ratingStats?.avgFood || 0,
                avgPlace: ratingStats?.avgPlace || 0,
                avgPrice: ratingStats?.avgPrice || 0,
                reviewCount: ratingStats?.reviewCount || 0,
            }
        };
    } catch (error) {
        console.error("Error fetching coffee shop detail:", error);
        return { success: false, error: "Failed to fetch shop details" };
    }
}

type FilterType = "all" | "collected" | "missing";
type SortByType = "name" | "rating";

export async function getCoffeeShops({
    page = 1,
    limit = 10,
    filter = "all",
    tagIds = [],
    featureIds = [],
    search = "",
    sortBy = "name",
    sortOrder = "desc",
}: {
    page?: number;
    limit?: number;
    filter?: FilterType;
    tagIds?: string[];
    featureIds?: string[];
    search?: string;
    sortBy?: SortByType;
    sortOrder?: "asc" | "desc";
} = {}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const currentUserId = session?.user?.id;
        const offset = (page - 1) * limit;

        // Fetch visited shop IDs for the current user
        const visitedShopIds = currentUserId
            ? (await db.select({ shopId: visits.shopId }).from(visits).where(eq(visits.userId, currentUserId))).map(v => v.shopId)
            : [];

        // 1. Subquery to calculate ratings for all relevant shops
        const ratingsSubquery = db
            .select({
                shopId: reviews.shopId,
                avgRating: sql<number>`AVG(NULLIF(${reviews.rating}::numeric, 0))`.as('avg_rating'),
                reviewCount: sql<number>`COUNT(${reviews.id})`.as('review_count'),
            })
            .from(reviews)
            .groupBy(reviews.shopId)
            .as('ratings_sq');

        // 2. Select IDs with filtering and sorting
        const conditions = [];
        if (search) conditions.push(sql`${coffeeShops.name} ILIKE ${`%${search}%`}`);

        if (filter === "collected") {
            if (visitedShopIds.length === 0) return { success: true, data: [], hasMore: false };
            conditions.push(inArray(coffeeShops.id, visitedShopIds));
        } else if (filter === "missing" && visitedShopIds.length > 0) {
            conditions.push(notInArray(coffeeShops.id, visitedShopIds));
        }

        const query = db
            .select({
                id: coffeeShops.id,
            })
            .from(coffeeShops)
            .leftJoin(ratingsSubquery, eq(coffeeShops.id, ratingsSubquery.shopId))
            .where(and(...conditions));

        // Applying sort order
        if (sortBy === "name") {
            query.orderBy(sortOrder === "asc" ? asc(coffeeShops.name) : desc(coffeeShops.name));
        } else if (sortBy === "rating") {
            query.orderBy(
                sortOrder === "asc"
                    ? asc(sql`COALESCE(${ratingsSubquery.avgRating}, 0)`)
                    : desc(sql`COALESCE(${ratingsSubquery.avgRating}, 0)`)
            );
        }

        const pagedIds = await query.limit(limit).offset(offset);
        const ids = pagedIds.map(row => row.id);

        if (ids.length === 0) {
            return { success: true, data: [], hasMore: false };
        }

        // 3. Fetch full objects for the selected IDs using findMany to get relations
        const results = await db.query.coffee_shops.findMany({
            where: (table, { inArray }) => inArray(table.id, ids),
            with: {
                _rels: {
                    with: {
                        mediaID: true,
                        // @ts-ignore
                        featuresID: true
                    }
                }
            }
        });

        // Re-sort results to match the IDs order from the paged query
        const sortedResults = ids.map(id => results.find(r => r.id === id)!);

        const finalResults = await Promise.all(sortedResults.map(async (shop) => {
            const [ratingStats] = await db.select({
                avgRating: sql<number>`COALESCE(AVG(NULLIF(${reviews.rating}::numeric, 0)), 0)`,
                reviewCount: sql<number>`COUNT(${reviews.id})`,
            })
                .from(reviews)
                .where(eq(reviews.shopId, shop.id));

            const shopRels = (shop as any)._rels || [];
            const gallery = shopRels
                .filter((r: any) => r.path === "gallery")
                .map((r: any) => r.mediaID)
                .filter(Boolean);

            const features = shopRels
                .filter((r: any) => r.path === "features")
                .map((r: any) => {
                    const feat = r.featuresID;
                    if (!feat) return null;
                    return {
                        id: feat.id,
                        name: feat.name,
                        icon: feat.icon,
                        color: feat.color
                    };
                })
                .filter(Boolean);

            return {
                ...shop,
                avgRating: Number(ratingStats?.avgRating) || 0,
                reviewCount: Number(ratingStats?.reviewCount) || 0,
                isVisited: visitedShopIds.includes(shop.id),
                image: gallery[0]?.url || null,
                gallery,
                features
            };
        }));

        return {
            success: true,
            data: finalResults,
            hasMore: pagedIds.length === limit
        };
    } catch (error) {
        console.error("Error fetching coffee shops:", error);
        return { success: false, error: "Failed to fetch coffee shops" };
    }
}

export async function toggleFollowShop(shopId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Check if already following
        const [existing] = await db
            .select()
            .from(shopFollows)
            .where(and(eq(shopFollows.userId, userId), eq(shopFollows.shopId, shopId)));

        if (existing) {
            // Unfollow
            await db
                .delete(shopFollows)
                .where(and(eq(shopFollows.userId, userId), eq(shopFollows.shopId, shopId)));
            return { success: true, isFollowing: false };
        } else {
            // Follow
            await db.insert(shopFollows).values({
                userId,
                shopId,
            });
            return { success: true, isFollowing: true };
        }
    } catch (error) {
        console.error("Error toggling follow:", error);
        return { success: false, error: "Failed to toggle follow" };
    }
}

export async function isFollowingShop(shopId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: true, isFollowing: false };
        }

        const [existing] = await db
            .select()
            .from(shopFollows)
            .where(and(eq(shopFollows.userId, session.user.id), eq(shopFollows.shopId, shopId)));

        return { success: true, isFollowing: !!existing };
    } catch (error) {
        console.error("Error checking follow status:", error);
        return { success: false, isFollowing: false };
    }
}

export async function getTopRatedCoffeeShops(limit: number = 6) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const currentUserId = session?.user?.id;

        // Fetch visited shop IDs
        const visitedShopIds = currentUserId
            ? (await db.select({ shopId: visits.shopId }).from(visits).where(eq(visits.userId, currentUserId))).map(v => v.shopId)
            : [];

        // Fetch all shops with their relations
        const results = await db.query.coffee_shops.findMany({
            with: {
                _rels: {
                    with: {
                        mediaID: true,
                        // @ts-ignore
                        featuresID: true
                    }
                }
            },
            limit: 50 // Fetch more than needed to ensure we have enough with ratings
        });

        // Calculate ratings for each shop
        const shopsWithRatings = await Promise.all(results.map(async (shop) => {
            const [ratingStats] = await db.select({
                avgRating: sql<number>`COALESCE(AVG(NULLIF(${reviews.rating}::numeric, 0)), 0)`,
                reviewCount: sql<number>`COUNT(${reviews.id})`,
            })
                .from(reviews)
                .where(eq(reviews.shopId, shop.id));

            const shopRels = (shop as any)._rels || [];
            const gallery = shopRels
                .filter((r: any) => r.path === "gallery")
                .map((r: any) => r.mediaID)
                .filter(Boolean);

            const features = shopRels
                .filter((r: any) => r.path === "features")
                .map((r: any) => {
                    const feat = r.featuresID;
                    if (!feat) return null;
                    return {
                        id: feat.id,
                        name: feat.name,
                        icon: feat.icon,
                        color: feat.color
                    };
                })
                .filter(Boolean);

            return {
                ...shop,
                avgRating: Number(ratingStats?.avgRating) || 0,
                reviewCount: Number(ratingStats?.reviewCount) || 0,
                isVisited: visitedShopIds.includes(shop.id),
                image: gallery[0]?.url || null,
                gallery,
                features
            };
        }));

        // Sort by rating and take top N
        const topRated = shopsWithRatings
            .sort((a, b) => (b.avgRating as number) - (a.avgRating as number))
            .slice(0, limit);

        return {
            success: true,
            data: topRated
        };
    } catch (error) {
        console.error("Error fetching top rated coffee shops:", error);
        return { success: false, error: "Failed to fetch top rated shops" };
    }
}
