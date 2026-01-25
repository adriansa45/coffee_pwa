"use server";

import { db } from "@/db";
import { visits, coffeeShops, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, count, and, sql } from "drizzle-orm";

export async function getVisitStats() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    try {
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
            success: true,
            data: {
                totalVisits,
                recentVisits,
                frequentVisits,
                userName: session.user.name.split(' ')[0] // First name
            },
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}

export async function getLeaderboard({ shopId }: { shopId?: string } = {}) {
    try {
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

        return { success: true, data: leaderboard };
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return { success: false, error: "Failed to fetch leaderboard" };
    }
}
