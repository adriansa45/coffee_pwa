"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { visits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

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

        revalidatePath("/");
        return { success: true, message: `Visita registrada para ${targetUser.name}` };
    } catch (error) {
        console.error("Error registering visit:", error);
        return { success: false, message: "Error al registrar la visita" };
    }
}

export async function getUserVisits() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { success: false, data: [] };
    }

    try {
        const results = await db.query.visits.findMany({
            where: eq(visits.userId, session.user.id),
            orderBy: [desc(visits.visitedAt)],
            with: {
                shop: true
            }
        });

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching visits:", error);
        return { success: false, data: [] };
    }
}
