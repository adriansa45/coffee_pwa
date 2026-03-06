"use server";

import { db } from "@/db";
import { 
    visits, 
    coffee_shops as coffeeShops, 
    user, 
    rewards, 
    unlockedRewards, 
    badges, 
    userBadges 
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, count, sql, and, gte, lt } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS, getShopTag, getUserVisitsTag } from "@/lib/cache-tags";
import crypto from "crypto";

// --- REWARDS ACTIONS ---

export async function getShopRewards(shopId: string) {
    try {
        const data = await db.select()
            .from(rewards)
            .where(eq(rewards.shopId, shopId))
            .orderBy(desc(rewards.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Error al obtener recompensas" };
    }
}

export async function createReward(shopId: string, payload: {
    name: string;
    description: string;
    visitsRequired: number;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !["coffee_shop", "CafeAdmin"].includes((session.user as any).role)) {
        return { success: false, error: "No autorizado" };
    }

    try {
        await db.insert(rewards).values({
            id: crypto.randomUUID(),
            shopId,
            name: payload.name,
            description: payload.description,
            visitsRequired: payload.visitsRequired.toString(),
            isActive: true,
        });

        revalidateTag(getShopTag(shopId));
        return { success: true, message: "Recompensa creada" };
    } catch (error) {
        return { success: false, error: "Error al crear recompensa" };
    }
}

// --- BADGES ACTIONS ---

export async function getShopBadges(shopId: string) {
    try {
        const data = await db.select()
            .from(badges)
            .where(eq(badges.shopId, shopId))
            .orderBy(desc(badges.createdAt));
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Error al obtener insignias" };
    }
}

export async function createBadge(shopId: string, payload: {
    name: string;
    description: string;
    criteria: string;
    criteriaValue: number;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !["coffee_shop", "CafeAdmin"].includes((session.user as any).role)) {
        return { success: false, error: "No autorizado" };
    }

    try {
        await db.insert(badges).values({
            id: crypto.randomUUID(),
            shopId,
            name: payload.name,
            description: payload.description,
            criteria: payload.criteria,
            criteriaValue: payload.criteriaValue.toString(),
        });

        revalidateTag(getShopTag(shopId));
        return { success: true, message: "Insignia creada" };
    } catch (error) {
        return { success: false, error: "Error al crear insignia" };
    }
}

// --- USER LOYALTY DATA ---

export async function getUserLoyalty(userId: string, shopId: string) {
    try {
        const [visitsCount] = await db.select({ count: count() })
            .from(visits)
            .where(and(eq(visits.userId, userId), eq(visits.shopId, shopId)));

        const unlocked = await db.select({
            id: unlockedRewards.id,
            rewardId: rewards.id,
            name: rewards.name,
            description: rewards.description,
            visitsRequired: rewards.visitsRequired,
            unlockedAt: unlockedRewards.unlockedAt,
            redeemedAt: unlockedRewards.redeemedAt
        })
        .from(unlockedRewards)
        .innerJoin(rewards, eq(unlockedRewards.rewardId, rewards.id))
        .where(eq(unlockedRewards.userId, userId));

        const userBadgesList = await db.select({
            badgeId: badges.id,
            name: badges.name,
            description: badges.description,
            imageUrl: badges.imageUrl,
            earnedAt: userBadges.earnedAt
        })
        .from(userBadges)
        .innerJoin(badges, eq(userBadges.badgeId, badges.id))
        .where(eq(userBadges.userId, userId));

        return { 
            success: true, 
            data: {
                totalVisits: visitsCount.count,
                unlockedRewards: unlocked,
                earnedBadges: userBadgesList
            }
        };
    } catch (error) {
        return { success: false, error: "Error al obtener datos de lealtad" };
    }
}

// --- DASHBOARD METRICS ---

export async function getShopDashboardMetrics(shopId: string, rangeDays: number = 30) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !["coffee_shop", "CafeAdmin"].includes((session.user as any).role)) {
        return { success: false, error: "No autorizado" };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeDays);

    try {
        // 1. Total Visits & Unique Users
        const [basics] = await db.select({
            totalVisits: count(),
            uniqueUsers: sql<number>`count(distinct ${visits.userId})`
        })
        .from(visits)
        .where(eq(visits.shopId, shopId));

        // 2. Recurrent Users (more than 1 visit)
        const recurrentQuery = await db.select({ userId: visits.userId })
            .from(visits)
            .where(eq(visits.shopId, shopId))
            .groupBy(visits.userId)
            .having(sql`count(*) > 1`);
        
        const recurrentUsers = recurrentQuery.length;

        // 3. Visits per day (Chart data)
        const visitsPerDay = await db.select({
            day: sql<string>`DATE(${visits.visitedAt})`,
            count: count()
        })
        .from(visits)
        .where(and(eq(visits.shopId, shopId), gte(visits.visitedAt, startDate)))
        .groupBy(sql`DATE(${visits.visitedAt})`)
        .orderBy(sql`DATE(${visits.visitedAt})`);

        // 4. Top Clients
        const topClients = await db.select({
            userId: user.id,
            name: user.name,
            image: user.image,
            visitCount: count(visits.id)
        })
        .from(visits)
        .innerJoin(user, eq(visits.userId, user.id))
        .where(eq(visits.shopId, shopId))
        .groupBy(user.id, user.name, user.image)
        .orderBy(desc(count(visits.id)))
        .limit(10);

        // 5. Most unlocked rewards
        const rewardStats = await db.select({
            rewardName: rewards.name,
            unlockCount: count(unlockedRewards.id)
        })
        .from(unlockedRewards)
        .innerJoin(rewards, eq(unlockedRewards.rewardId, rewards.id))
        .where(eq(rewards.shopId, shopId))
        .groupBy(rewards.name)
        .orderBy(desc(count(unlockedRewards.id)));

        return {
            success: true,
            data: {
                totalVisits: basics.totalVisits,
                uniqueUsers: basics.uniqueUsers,
                recurrentUsers,
                visitsPerDay,
                topClients,
                rewardStats
            }
        };
    } catch (error) {
        console.error("Error dashboard metrics:", error);
        return { success: false, error: "Error al calcular métricas" };
    }
}
