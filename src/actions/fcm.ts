"use server";

import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function updateFcmToken(fcmToken: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        await db.update(userTable)
            .set({ fcmToken })
            .where(eq(userTable.id, session.user.id));

        return { success: true };
    } catch (error) {
        console.error("Error updating FCM token:", error);
        return { success: false, error: "Failed to update FCM token" };
    }
}
