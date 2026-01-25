"use server";

import { db } from "@/db";
import { coffeeShops, reviews, visits, reviewsTags } from "@/db/schema";
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

        // 2. Filter by Tags (if provided)
        if (tagIds.length > 0) {
            // Find shops that have reviews with these tags
            // We need shops where EXISTS (review -> reviewTags -> tagId IN tagIds)
            // Or join reviews and reviewsTags.

            // Subquery for shops matching ALL provided tags (strict) or ANY (loose)?
            // Usually filters are "Any" or "All". Let's assume "Any" of selected tags for now, or "All"?
            // "Motivo por el cual ir" implies attributes. "Good coffee" AND "Good bread". 
            // If I check both, I usually want shops that have BOTH, or at least one?
            // Let's do shops that have AT LEAST ONE of the selected tags for broader discovery first, 
            // or we could do intersection.
            // Let's go with "Any" (OR) logic for simplicity in SQL `IN`.
            // If the user wants specific "Work" AND "Coffee", `IN` might show shops with just "Coffee".
            // Let's stick to `IN` for now.

            const matchingShops = await db.selectDistinct({ shopId: reviews.shopId })
                .from(reviews)
                .innerJoin(reviewsTags, eq(reviews.id, reviewsTags.reviewId))
                .where(inArray(reviewsTags.tagId, tagIds));

            const matchingShopIds = matchingShops.map(s => s.shopId).filter((id): id is string => id !== null);

            if (matchingShopIds.length === 0) {
                return { success: true, data: [], hasMore: false };
            }
            conditions.push(inArray(coffeeShops.id, matchingShopIds));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Main Query
        const shopsQuery = db.select({
            id: coffeeShops.id,
            name: coffeeShops.name,
            description: coffeeShops.description,
            latitude: coffeeShops.latitude,
            longitude: coffeeShops.longitude,
            address: coffeeShops.address,
            googleMapsUrl: coffeeShops.googleMapsUrl,
            avgRating: sql<number>`COALESCE(AVG(${reviews.rating}::numeric), 0)`,
            reviewCount: sql<number>`COUNT(${reviews.id})`,
        })
            .from(coffeeShops)
            .leftJoin(reviews, eq(coffeeShops.id, reviews.shopId))
            .where(whereClause)
            .groupBy(coffeeShops.id)
            .limit(limit)
            .offset(offset);

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
            const v = await db.select().from(visits).where(eq(visits.userId, currentUserId));
            v.forEach(visit => visitsMap.set(visit.shopId, visit.visitedAt));
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
