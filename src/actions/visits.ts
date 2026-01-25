"use server";

import { db } from "@/db";
import { visits } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function registerVisit(shopId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if already visited
        const existing = await db.select().from(visits).where(eq(visits.userId, session.user.id));
        // Filter in memory or add combined index/query
        if (existing.some((v) => v.shopId === shopId)) {
            return { success: false, error: "Already visited" };
        }

        await db.insert(visits).values({
            userId: session.user.id,
            shopId: shopId,
        });

        return { success: true };
    } catch (error) {
        console.error("Error registering visit:", error);
        return { success: false, error: "Failed to register visit" };
    }
}

export async function getUserVisits() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const userVisits = await db.select().from(visits).where(eq(visits.userId, session.user.id));
        return { success: true, data: userVisits };
    } catch (error) {
        console.error("Error fetching user visits:", error);
        return { success: false, error: "Failed to fetch visits" };
    }
}
