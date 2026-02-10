"use server";

import { db } from "@/db";
import { coffee_shops as coffeeShops, reviews, visits, coffee_shops_rels as rels, shopFollows } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql, and, asc, notInArray, inArray } from "drizzle-orm";
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

export async function getCoffeeShops({
    page = 1,
    limit = 10,
    filter = "all",
    tagIds = [],
    featureIds = [],
    search = "",
}: {
    page?: number;
    limit?: number;
    filter?: FilterType;
    tagIds?: string[];
    featureIds?: string[];
    search?: string;
} = {}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const currentUserId = session?.user?.id;
        const offset = (page - 1) * limit;

        // Fetch visited shop IDs
        const visitedShopIds = currentUserId
            ? (await db.select({ shopId: visits.shopId }).from(visits).where(eq(visits.userId, currentUserId))).map(v => v.shopId)
            : [];

        // Main Query with Joins for Gallery and Features
        const results = await db.query.coffee_shops.findMany({
            where: (table, { and, ilike, inArray, notInArray }) => {
                const conditions = [];
                if (search) conditions.push(ilike(table.name, `%${search}%`));

                if (filter === "collected") {
                    if (visitedShopIds.length === 0) return sql`1=0`; // No results
                    conditions.push(inArray(table.id, visitedShopIds));
                } else if (filter === "missing" && visitedShopIds.length > 0) {
                    conditions.push(notInArray(table.id, visitedShopIds));
                }

                return and(...conditions);
            },
            with: {
                _rels: {
                    with: {
                        mediaID: true,
                        // @ts-ignore - features table might not be in types yet
                        featuresID: true
                    }
                }
            },
            limit: limit,
            offset: offset,
            orderBy: [asc(coffeeShops.name)]
        });

        let finalResults = await Promise.all(results.map(async (shop) => {
            const [ratingStats] = await db.select({
                avgRating: sql<number>`COALESCE(AVG(NULLIF(${reviews.rating}::numeric, 0)), 0)`,
                reviewCount: sql<number>`COUNT(${reviews.id})`,
            })
                .from(reviews)
                .where(eq(reviews.shopId, shop.id));

            const shopRels = (shop as any)._rels || [];
            const gallery = shopRels
                .filter((r: any) => r.path === "gallery")
                .map((r: any) => r.mediaID?.url)
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
                avgRating: ratingStats?.avgRating || 0,
                reviewCount: ratingStats?.reviewCount || 0,
                isVisited: visitedShopIds.includes(shop.id),
                image: gallery[0] || null,
                gallery,
                features
            };
        }));

        // Client-side filtering for features if needed (or deep join if preferred)
        if (featureIds.length > 0) {
            finalResults = finalResults.filter(shop => 
                featureIds.every(fid => shop.features.some((f: any) => f.id === fid))
            );
        }

        return {
            success: true,
            data: finalResults,
            hasMore: results.length === limit
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
