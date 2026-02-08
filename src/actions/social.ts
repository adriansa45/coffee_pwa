"use server";

import { db } from "@/db";
import { follows } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function followUser(followingId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return { success: false, error: "Unauthorized" };

    try {
        await db.insert(follows).values({
            followerId: session.user.id,
            followingId: followingId,
        });

        revalidatePath(`/users/${followingId}`);
        return { success: true };
    } catch (error) {
        console.error("Error following user:", error);
        return { success: false, error: "Failed to follow user" };
    }
}

export async function unfollowUser(followingId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return { success: false, error: "Unauthorized" };

    try {
        await db.delete(follows).where(
            and(
                eq(follows.followerId, session.user.id),
                eq(follows.followingId, followingId)
            )
        );

        revalidatePath(`/users/${followingId}`);
        return { success: true };
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return { success: false, error: "Failed to unfollow user" };
    }
}

export async function isFollowing(targetUserId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return false;

    try {
        const result = await db.query.follows.findFirst({
            where: and(
                eq(follows.followerId, session.user.id),
                eq(follows.followingId, targetUserId)
            )
        });
        return !!result;
    } catch (error) {
        return false;
    }
}
