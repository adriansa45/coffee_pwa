"use server";

import { db } from "@/db";
import { coffee_shops as coffeeShops, reviews, visits } from "@payload-schema";
import { auth } from "@/lib/auth";
import { eq, sql, and, desc, asc, notInArray, inArray } from "drizzle-orm";
import { headers } from "next/headers";

type FilterType = "all" | "collected" | "missing";

export async function getCoffeeShops({
    page = 1,
    limit = 10,
    filter = "all",
    tagIds = [],
    search = "",
    minCoffee = 0,
    minFood = 0,
    minPlace = 0,
    minPrice = 0,
}: {
    page?: number;
    limit?: number;
    filter?: FilterType;
    tagIds?: string[];
    search?: string;
    minCoffee?: number;
    minFood?: number;
    minPlace?: number;
    minPrice?: number;
} = {}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const currentUserId = session?.user?.id;
        const offset = (page - 1) * limit;

        // Fetch visited shop IDs
        const visitedShopIds = currentUserId
            ? (await db.select({ shopId: visits.shop }).from(visits).where(eq(visits.user, currentUserId))).map(v => v.shopId)
            : [];

        // Build Where Clause
        const conditions = [];

        // Search
        if (search) {
            conditions.push(sql`LOWER(${coffeeShops.name}) LIKE ${`%${search.toLowerCase()}%`}`);
        }

        // 1. Filter by Collection Status
        if (filter === "collected") {
            if (visitedShopIds.length === 0) return { success: true, data: [], hasMore: false };
            conditions.push(inArray(coffeeShops.id, visitedShopIds));
        } else if (filter === "missing") {
            if (visitedShopIds.length > 0) {
                conditions.push(notInArray(coffeeShops.id, visitedShopIds));
            }
        }

        const havingConditions = [];
        if (minCoffee > 0) havingConditions.push(sql`COALESCE(AVG(NULLIF(${reviews.coffeeRating}, 0)), 0) > ${minCoffee - 1}`);
        if (minFood > 0) havingConditions.push(sql`COALESCE(AVG(NULLIF(${reviews.foodRating}, 0)), 0) > ${minFood - 1}`);
        if (minPlace > 0) havingConditions.push(sql`COALESCE(AVG(NULLIF(${reviews.placeRating}, 0)), 0) > ${minPlace - 1}`);
        if (minPrice > 0) havingConditions.push(sql`COALESCE(AVG(NULLIF(${reviews.priceRating}, 0)), 0) > ${minPrice - 1}`);

        const havingClause = havingConditions.length > 0 ? and(...havingConditions) : undefined;
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Main Query with Category Averages
        const shopsQuery = db.select({
            id: coffeeShops.id,
            name: coffeeShops.name,
            description: coffeeShops.description,
            latitude: coffeeShops.latitude,
            longitude: coffeeShops.longitude,
            address: coffeeShops.address,
            googleMapsUrl: coffeeShops.googleMapsUrl,
            avgRating: sql<number>`COALESCE(AVG(NULLIF(${reviews.rating}::numeric, 0)), 0)`,
            avgCoffee: sql<number>`COALESCE(AVG(NULLIF(${reviews.coffeeRating}, 0)), 0)`,
            avgFood: sql<number>`COALESCE(AVG(NULLIF(${reviews.foodRating}, 0)), 0)`,
            avgPlace: sql<number>`COALESCE(AVG(NULLIF(${reviews.placeRating}, 0)), 0)`,
            avgPrice: sql<number>`COALESCE(AVG(NULLIF(${reviews.priceRating}, 0)), 0)`,
            reviewCount: sql<number>`COUNT(${reviews.id})`,
        })
            .from(coffeeShops)
            .leftJoin(reviews, eq(coffeeShops.id, reviews.shop))
            .where(whereClause)
            .groupBy(coffeeShops.id)
            .limit(limit)
            .offset(offset);

        if (havingClause) {
            shopsQuery.having(havingClause);
        }

        // Sort collected first if 'all'
        if (filter === "all" && visitedShopIds.length > 0) {
            shopsQuery.orderBy(sql`CASE WHEN ${coffeeShops.id} IN ${visitedShopIds} THEN 0 ELSE 1 END`, asc(coffeeShops.name));
        } else {
            shopsQuery.orderBy(asc(coffeeShops.name));
        }

        const shops = await shopsQuery;

        // Visits Map
        const visitsMap = new Map();
        if (currentUserId && visitedShopIds.length > 0) {
            const v = await db.select().from(visits).where(eq(visits.user, currentUserId));
            v.forEach(visit => visitsMap.set(visit.shop, visit.visitedAt));
        }

        const finalResults = shops.map(shop => ({
            ...shop,
            isVisited: visitsMap.has(shop.id),
            visitedAt: visitsMap.get(shop.id) || null
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
