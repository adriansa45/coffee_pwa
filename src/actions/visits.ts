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
import { CACHE_TAGS, getUserVisitsTag } from "@/lib/cache-tags";

export async function registerVisitByCode(userCode: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { success: false, message: "No autorizado" };
    }

    const role = (session.user as any).role;
    const shopId = (session.user as any).shopId;

    if (role !== "coffee_shop" || !shopId) {
        return { success: false, message: "No tienes permisos de cafetería" };
    }

    const payload = await getPayload();

    // Find the user by code (User catalog is still in Payload)
    const users = await payload.find({
        collection: 'users',
        where: {
            userCode: {
                equals: userCode,
            },
        },
    });

    const targetUser = users.docs[0];

    if (!targetUser) {
        return { success: false, message: "Código de usuario inválido" };
    }

    try {
        await db.insert(visits).values({
            id: crypto.randomUUID(),
            userId: targetUser.id,
            shopId: shopId,
            visitedAt: new Date(),
        });

        revalidateTag(CACHE_TAGS.VISITS);
        revalidateTag(getUserVisitsTag(targetUser.id));

        return { success: true, message: `Visita registrada para ${targetUser.name}` };
    } catch (error) {
        console.error("Error registering visit:", error);
        return { success: false, message: "Error al registrar la visita" };
    }
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
