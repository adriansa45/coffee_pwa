"use server";

import { db } from "@/db";
import { coffee_shops as coffeeShops, coffee_shops_rels as coffeeShopsRels, reviews, shopFollows, visits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CACHE_TAGS, getShopTag, getUserFollowsTag } from "@/lib/cache-tags";
import { and, asc, desc, eq, exists, ilike, inArray, notInArray, or, sql } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { cache } from "react";

const getCoffeeShopByIdInternal = async (id: string) => {
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

    if (!shop) return null;

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

    const [followerStats] = await db.select({
        count: sql<number>`COUNT(*)`,
    })
        .from(shopFollows)
        .where(eq(shopFollows.shopId, id));

    return {
        ...shop,
        gallery,
        features,
        avgRating: ratingStats?.avgRating || 0,
        avgCoffee: ratingStats?.avgCoffee || 0,
        avgFood: ratingStats?.avgFood || 0,
        avgPlace: ratingStats?.avgPlace || 0,
        avgPrice: ratingStats?.avgPrice || 0,
        reviewCount: ratingStats?.reviewCount || 0,
        followerCount: Number(followerStats?.count) || 0,
    };
};

export const getCoffeeShopById = cache(async (id: string) => {
    try {
        const fetchShop = unstable_cache(
            async (id: string) => getCoffeeShopByIdInternal(id),
            [getShopTag(id)],
            { tags: [CACHE_TAGS.COFFEE_SHOPS, getShopTag(id)], revalidate: 3600 }
        );

        const data = await fetchShop(id);
        if (!data) return { success: false, error: "Shop not found" };

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching coffee shop detail:", error);
        return { success: false, error: "Failed to fetch shop details" };
    }
});

type FilterType = "all" | "collected" | "missing";
type SortByType = "name" | "rating";

const getCoffeeShopsInternal = async (params: any, userId?: string) => {
    const {
        page = 1,
        limit = 10,
        filter = "all",
        featureIds = [],
        search = "",
        sortBy = "name",
        sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    // Fetch visited shop IDs for the current user
    const visitedShopIds = userId
        ? (await db.select({ shopId: visits.shopId }).from(visits).where(eq(visits.userId, userId))).map(v => v.shopId)
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
    if (search) {
        conditions.push(
            or(
                ilike(coffeeShops.name, `%${search}%`),
                ilike(coffeeShops.address, `%${search}%`)
            )
        );
    }

    if (filter === "collected") {
        if (visitedShopIds.length === 0) return { data: [], hasMore: false };
        conditions.push(inArray(coffeeShops.id, visitedShopIds));
    } else if (filter === "missing" && visitedShopIds.length > 0) {
        conditions.push(notInArray(coffeeShops.id, visitedShopIds));
    }

    if (featureIds.length > 0) {
        featureIds.forEach((fid: string) => {
            conditions.push(
                exists(
                    db
                        .select({ id: sql`1` })
                        .from(coffeeShopsRels)
                        .where(
                            and(
                                eq(coffeeShopsRels.parent, coffeeShops.id),
                                eq(coffeeShopsRels.path, "features"),
                                eq(coffeeShopsRels.featuresID, Number(fid))
                            )
                        )
                )
            );
        });
    }

    const query = db
        .select({
            id: coffeeShops.id,
        })
        .from(coffeeShops)
        .leftJoin(ratingsSubquery, eq(coffeeShops.id, ratingsSubquery.shopId))
        .where(and(...conditions));

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
        return { data: [], hasMore: false };
    }

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

    const sortedResults = ids.map(id => results.find(r => r.id === id)!);

    const finalResults = await Promise.all(sortedResults.map(async (shop) => {
        const [ratingStats] = await db.select({
            avgRating: sql<number>`COALESCE(AVG(NULLIF(${reviews.rating}::numeric, 0)), 0)`,
            reviewCount: sql<number>`COUNT(${reviews.id})`,
        })
            .from(reviews)
            .where(eq(reviews.shopId, shop.id));

        const [followerStats] = await db.select({
            count: sql<number>`COUNT(*)`,
        })
            .from(shopFollows)
            .where(eq(shopFollows.shopId, shop.id));

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
            features,
            followerCount: Number(followerStats?.count) || 0,
        };
    }));

    return {
        data: finalResults,
        hasMore: pagedIds.length === limit
    };
};

export const getCoffeeShops = cache(async (params: any = {}) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const userId = session?.user?.id;

        const fetchShops = unstable_cache(
            async (p: any, uId?: string) => getCoffeeShopsInternal(p, uId),
            [JSON.stringify(params), userId || "anonymous"],
            { tags: [CACHE_TAGS.COFFEE_SHOPS], revalidate: 3600 }
        );

        const result = await fetchShops(params, userId);
        return { success: true, ...result };
    } catch (error) {
        console.error("Error fetching coffee shops:", error);
        return { success: false, error: "Failed to fetch coffee shops" };
    }
});

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

            revalidateTag(CACHE_TAGS.FOLLOWS);
            revalidateTag(getShopTag(shopId));
            revalidateTag(getUserFollowsTag(userId));

            return { success: true, isFollowing: false };
        } else {
            // Follow
            await db.insert(shopFollows).values({
                userId,
                shopId,
            });

            revalidateTag(CACHE_TAGS.FOLLOWS);
            revalidateTag(getShopTag(shopId));
            revalidateTag(getUserFollowsTag(userId));

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

const getTopRatedCoffeeShopsInternal = async (limit: number, userId?: string) => {
    // Fetch visited shop IDs
    const visitedShopIds = userId
        ? (await db.select({ shopId: visits.shopId }).from(visits).where(eq(visits.userId, userId))).map(v => v.shopId)
        : [];

    // 1. Subquery to calculate ratings for all shops
    const ratingsSubquery = db
        .select({
            shopId: reviews.shopId,
            avgRating: sql<number>`AVG(NULLIF(${reviews.rating}::numeric, 0))`.as('avg_rating'),
            reviewCount: sql<number>`COUNT(${reviews.id})`.as('review_count'),
        })
        .from(reviews)
        .groupBy(reviews.shopId)
        .as('ratings_sq');

    // 2. Select IDs sorted by rating
    const pagedIds = await db
        .select({
            id: coffeeShops.id,
        })
        .from(coffeeShops)
        .leftJoin(ratingsSubquery, eq(coffeeShops.id, ratingsSubquery.shopId))
        .orderBy(desc(sql`COALESCE(${ratingsSubquery.avgRating}, 0)`))
        .limit(limit);

    const ids = pagedIds.map(row => row.id);

    if (ids.length === 0) {
        return [];
    }

    // 3. Fetch full objects for the selected IDs
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

        const [followerStats] = await db.select({
            count: sql<number>`COUNT(*)`,
        })
            .from(shopFollows)
            .where(eq(shopFollows.shopId, shop.id));

        return {
            ...shop,
            avgRating: Number(ratingStats?.avgRating) || 0,
            reviewCount: Number(ratingStats?.reviewCount) || 0,
            isVisited: visitedShopIds.includes(shop.id),
            image: gallery[0]?.url || null,
            gallery,
            features,
            followerCount: Number(followerStats?.count) || 0,
        };
    }));

    return finalResults;
};

export const getTopRatedCoffeeShops = cache(async (limit: number = 6) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const userId = session?.user?.id;

        const fetchTopRated = unstable_cache(
            async (l: number, uId?: string) => getTopRatedCoffeeShopsInternal(l, uId),
            ["top-rated", limit.toString(), userId || "anonymous"],
            { tags: [CACHE_TAGS.COFFEE_SHOPS], revalidate: 3600 }
        );

        const data = await fetchTopRated(limit, userId);
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching top rated coffee shops:", error);
        return { success: false, error: "Failed to fetch top rated shops" };
    }
});
