"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { unstable_cache, revalidateTag } from "next/cache";
import { db } from "@/db";
import { visits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { cache } from "react";
import { CACHE_TAGS, getUserVisitsTag, getShopTag } from "@/lib/cache-tags";
import { rewards, unlockedRewards, badges, userBadges, user } from "@/db/schema";
import { and, gt, sql, count, gte } from "drizzle-orm";

export async function registerVisitByCode(userCode: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { success: false, message: "No autorizado" };
    }

    const { role, shopId, id: staffId } = session.user as any;

    if (!["coffee_shop", "CafeStaff", "CafeAdmin"].includes(role) || !shopId) {
        return { success: false, message: "No tienes permisos de cafetería" };
    }

    const payload = await getPayload();

    // 1. Find user by code
    const [targetUser] = await db.select()
        .from(user)
        .where(eq(user.userCode, userCode))
        .limit(1);

    if (!targetUser) return { success: false, message: "Código de usuario inválido" };

    try {
        // 2. Cooldown check
        const shop = await payload.findByID({
            collection: 'coffee-shops',
            id: shopId,
            select: { visitCooldownHours: true }
        });

        const cooldownHours = shop.visitCooldownHours || 4;
        const cooldownDate = new Date();
        cooldownDate.setHours(cooldownDate.getHours() - cooldownHours);

        const recentVisits = await db.select({ count: count() })
            .from(visits)
            .where(
                and(
                    eq(visits.userId, targetUser.id),
                    eq(visits.shopId, shopId),
                    gt(visits.visitedAt, cooldownDate)
                )
            );

        if (recentVisits[0].count > 0) {
            return { success: false, message: `El usuario ya registró una visita recientemente (Cooldown: ${cooldownHours}h)` };
        }

        // 3. Register visit
        const visitId = crypto.randomUUID();
        await db.insert(visits).values({
            id: visitId,
            userId: targetUser.id,
            shopId: shopId,
            staffId: staffId,
            method: "qr_scan",
            visitedAt: new Date(),
        });

        // 4. Check for rewards & badges
        await checkAndUnlockLoyalty(targetUser.id, shopId);

        // 5. Update Global Tier
        await updateUserTier(targetUser.id);

        revalidateTag(CACHE_TAGS.VISITS);
        revalidateTag(getUserVisitsTag(targetUser.id));
        revalidateTag(getShopTag(shopId));

        return { success: true, message: `¡Visita registrada para ${targetUser.name}!` };
    } catch (error) {
        console.error("Error registering visit:", error);
        return { success: false, message: "Error al registrar la visita" };
    }
}

async function checkAndUnlockLoyalty(userId: string, shopId: string) {
    // Get total visits in this shop
    const totalVisitsResult = await db.select({ count: count() })
        .from(visits)
        .where(and(eq(visits.userId, userId), eq(visits.shopId, shopId)));
    
    const visitCount = totalVisitsResult[0].count;

    // Check Rewards
    const pendingRewards = await db.select()
        .from(rewards)
        .where(
            and(
                eq(rewards.shopId, shopId),
                eq(rewards.isActive, true),
                sql`${rewards.id} NOT IN (SELECT reward_id FROM ${unlockedRewards} WHERE user_id = ${userId})`
            )
        );

    for (const reward of pendingRewards) {
        if (visitCount >= Number(reward.visitsRequired)) {
            await db.insert(unlockedRewards).values({
                id: crypto.randomUUID(),
                userId,
                rewardId: reward.id,
            });
        }
    }

    // Check Badges
    const pendingBadges = await db.select()
        .from(badges)
        .where(
            and(
                eq(badges.shopId, shopId),
                sql`${badges.id} NOT IN (SELECT badge_id FROM ${userBadges} WHERE user_id = ${userId})`
            )
        );

    for (const badge of pendingBadges) {
        if (badge.criteria === "visits_count" && visitCount >= Number(badge.criteriaValue)) {
            await db.insert(userBadges).values({
                id: crypto.randomUUID(),
                userId,
                badgeId: badge.id,
            });
        }
    }
}

async function updateUserTier(userId: string) {
    // 1. Get total lifetime visits
    const [totalVisitsResult] = await db.select({ count: count() })
        .from(visits)
        .where(eq(visits.userId, userId));
    
    const countTotal = totalVisitsResult.count;

    // 2. Determine Tier
    let tier = "Explorador/a";
    if (countTotal > 70) tier = "Coffee Legend";
    else if (countTotal > 30) tier = "Barista Pro";
    else if (countTotal > 10) tier = "Coffee Lover";

    // 3. Update User
    await db.update(user)
        .set({ 
            totalVisitsCount: countTotal.toString(),
            currentTier: tier 
        })
        .where(eq(user.id, userId));
}

const getUserVisitsInternal = async (userId: string) => {
    const results = await db.query.visits.findMany({
        where: eq(visits.userId, userId),
        orderBy: [desc(visits.visitedAt)],
        with: {
            shop: true
        }
    });
    return results;
};

export const getUserVisits = cache(async (targetUserId?: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userId = targetUserId || session?.user?.id;

    if (!userId) {
        return { success: false, data: [] };
    }

    try {
        const fetchVisits = unstable_cache(
            async (uId: string) => getUserVisitsInternal(uId),
            [getUserVisitsTag(userId)],
            { tags: [CACHE_TAGS.VISITS, getUserVisitsTag(userId)], revalidate: 3600 }
        );

        const data = await fetchVisits(userId);
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching visits:", error);
        return { success: false, data: [] };
    }
});
