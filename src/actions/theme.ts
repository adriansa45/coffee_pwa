"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBrandColor(color: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.update(userTable)
            .set({ brandColor: color })
            .where(eq(userTable.id, session.user.id));

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating brand color:", error);
        return { success: false, error: "Failed to update color" };
    }
}
