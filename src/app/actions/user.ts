"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { success: false, error: "No autorizado" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { success: false, error: "No se proporcionó ningún archivo" };
    }

    try {
        // Upload to Vercel Blob in the 'users' folder
        const filename = `users/${session.user.id}-${Date.now()}.${file.name.split(".").pop()}`;
        const blob = await put(filename, file, {
            access: "public",
        });

        // Update user record in database
        await db.update(userTable)
            .set({ image: blob.url })
            .where(eq(userTable.id, session.user.id));

        revalidatePath("/profile");
        revalidatePath("/profile/preferences");
        
        return { success: true, url: blob.url };
    } catch (error) {
        console.error("Error updating profile image:", error);
        return { success: false, error: "Error al subir la imagen" };
    }
}
