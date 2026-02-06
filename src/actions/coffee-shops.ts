"use server";

import { db } from "@/db";
import { coffee_shops as coffeeShops, reviews, visits, coffee_shops_rels as rels } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql, and, asc, notInArray, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCoffeeShopById(id: string) {
    try {
        const [shop] = await db.select().from(coffeeShops).where(eq(coffeeShops.id, id));

        if (!shop) return { success: false, error: "Shop not found" };

        // Fetch gallery images through relations
        const galleryResults = await db.query.coffee_shops_rels.findMany({
            where: and(eq(rels.parentId, id), eq(rels.path, "gallery")),
            with: {
                mediaID: true
            }
        });

        const gallery = galleryResults.map((r: any) => r.mediaID?.url).filter(Boolean);

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
    search = "",
}: {
    page?: number;
    limit?: number;
    filter?: FilterType;
    tagIds?: string[];
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

        // Main Query with Joins for Gallery
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
                    where: eq(rels.path, "gallery"),
                    with: {
                        mediaID: true
                    }
                }
            },
            limit: limit,
            offset: offset,
            orderBy: [asc(coffeeShops.name)]
        });

        const finalResults = await Promise.all(results.map(async (shop) => {
            const [ratingStats] = await db.select({
                avgRating: sql<number>`COALESCE(AVG(NULLIF(${reviews.rating}::numeric, 0)), 0)`,
                reviewCount: sql<number>`COUNT(${reviews.id})`,
            })
                .from(reviews)
                .where(eq(reviews.shopId, shop.id));

            return {
                ...shop,
                avgRating: ratingStats?.avgRating || 0,
                reviewCount: ratingStats?.reviewCount || 0,
                isVisited: visitedShopIds.includes(shop.id),
                image: (shop as any)._rels?.[0]?.mediaID?.url || null,
                gallery: (shop as any)._rels?.map((r: any) => r.mediaID?.url).filter(Boolean) || []
            };
        }));

        return {
            success: true,
            data: finalResults,
            hasMore: finalResults.length === limit
        };
    } catch (error) {
        console.error("Error fetching coffee shops:", error);
        return { success: false, error: "Failed to fetch coffee shops" };
    }
}
