"use server";

import { db } from "@/db";
import { visits, coffee_shops as coffeeShops, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, count, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS, getUserVisitsTag } from "@/lib/cache-tags";

const getVisitStatsInternal = async (userId: string, userName: string) => {
    // Total Visits
    const [totalVisitsResult] = await db
        .select({ count: count() })
        .from(visits)
        .where(eq(visits.userId, userId));

    const totalVisits = totalVisitsResult.count;

    // Recent Visits
    const recentVisits = await db
        .select({
            id: visits.id,
            visitedAt: visits.visitedAt,
            shopId: coffeeShops.id,
            shopName: coffeeShops.name,
            shopAddress: coffeeShops.address,
        })
        .from(visits)
        .innerJoin(coffeeShops, eq(visits.shopId, coffeeShops.id))
        .where(eq(visits.userId, userId))
        .orderBy(desc(visits.visitedAt))
        .limit(5);

    // Frequent Visits (Top 5 shops visited by user)
    const frequentVisits = await db
        .select({
            shopId: visits.shopId,
            shopName: coffeeShops.name,
            visitCount: count(visits.id),
        })
        .from(visits)
        .innerJoin(coffeeShops, eq(visits.shopId, coffeeShops.id))
        .where(eq(visits.userId, userId))
        .groupBy(visits.shopId, coffeeShops.name)
        .orderBy(desc(count(visits.id)))
        .limit(5);

    return {
        totalVisits,
        recentVisits,
        frequentVisits,
        userName: userName.split(' ')[0] // First name
    };
};

export const getVisitStats = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    try {
        const fetchStats = unstable_cache(
            async (uId: string, uName: string) => getVisitStatsInternal(uId, uName),
            ["user-stats", userId],
            { tags: [CACHE_TAGS.VISITS, getUserVisitsTag(userId)], revalidate: 3600 }
        );

        const data = await fetchStats(userId, session.user.name);
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
});

const getLeaderboardInternal = async (shopId?: string) => {
    const query = db
        .select({
            userId: visits.userId,
            userName: user.name,
            userImage: user.image,
            visitCount: count(visits.id),
        })
        .from(visits)
        .innerJoin(user, eq(visits.userId, user.id));

    if (shopId && shopId !== 'all') {
        query.where(eq(visits.shopId, shopId));
    }

    const leaderboard = await query
        .groupBy(visits.userId, user.name, user.image)
        .orderBy(desc(count(visits.id)))
        .limit(20); // Top 20

    return leaderboard;
};

export const getLeaderboard = cache(async ({ shopId }: { shopId?: string } = {}) => {
    try {
        const fetchLeaderboard = unstable_cache(
            async (sId?: string) => getLeaderboardInternal(sId),
            ["leaderboard", shopId || "all"],
            { tags: [CACHE_TAGS.VISITS], revalidate: 3600 }
        );

        const data = await fetchLeaderboard(shopId);
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return { success: false, error: "Failed to fetch leaderboard" };
    }
});
