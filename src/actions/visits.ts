"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { visits, user, coffeeShops } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function registerVisitByCode(userCode: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return { success: false, message: "No autorizado" };
    }

    // Role check: must be coffee_shop
    // We need to cast or access the role if it's in additionalFields
    const role = (session.user as any).role;
    const shopId = (session.user as any).shopId;

    if (role !== "coffee_shop" || !shopId) {
        return { success: false, message: "No tienes permisos de cafetería" };
    }

    // Find the user by code
    const targetUser = await db.query.user.findFirst({
        where: eq(user.userCode, userCode)
    });

    if (!targetUser) {
        return { success: false, message: "Código de usuario inválido" };
    }

    // Optional: Check if already visited today? Or just allow multiple stamps?
    // Let's allow multiple for now, or maybe limit to 1 per day per shop.
    // For simplicity: just insert.

    try {
        await db.insert(visits).values({
            userId: targetUser.id,
            shopId: shopId,
            visitedAt: new Date(),
        });

        revalidatePath("/dashboard");
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
        const userVisits = await db.query.visits.findMany({
            where: eq(visits.userId, session.user.id),
            with: {
                shop: true
            },
            orderBy: (visits, { desc }) => [desc(visits.visitedAt)]
        });

        return { success: true, data: userVisits };
    } catch (error) {
        console.error("Error fetching visits:", error);
        return { success: false, data: [] };
    }
}
