"use server";

import { db } from "@/db";
import { user as userTable } from "@/db/schema/auth-schema";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import sharp from "sharp";

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
        // Convert File to Buffer for sharp
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Process image with sharp: resize and convert to webp
        const optimizedBuffer = await sharp(buffer)
            .resize({
                width: 1024,
                height: 1024,
                fit: "inside",
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();

        // Upload to Vercel Blob in the 'users' folder
        // Use .webp extension as we converted it
        const filename = `users/${session.user.id}-${Date.now()}.webp`;
        const blob = await put(filename, optimizedBuffer, {
            access: "public",
            contentType: "image/webp"
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
        return { success: false, error: "Error al procesar o subir la imagen" };
    }
}
