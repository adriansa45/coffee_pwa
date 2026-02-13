"use server";

import { db } from "@/db";
import { follows, user as userTable, shopFollows, coffee_shops, media } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/notifications";

export async function followUser(followingId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return { success: false, error: "Unauthorized" };

    if (session.user.id === followingId) {
        return { success: false, error: "No puedes seguirte a ti mismo" };
    }

    try {
        await db.insert(follows).values({
            followerId: session.user.id,
            followingId: followingId,
        });

        // Send push notification to the followed user
        await sendPushNotification(followingId, {
            title: "Nuevo seguidor 🚀",
            body: `${session.user.name || "Alguien"} ha empezado a seguirte.`,
            data: {
                type: "new_follower",
                followerId: session.user.id
            }
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
export async function getUserFollowers(userId: string) {
    try {
        const results = await db.select({
            id: userTable.id,
            name: userTable.name,
            image: userTable.image,
        })
            .from(follows)
            .innerJoin(userTable, eq(follows.followerId, userTable.id))
            .where(eq(follows.followingId, userId));

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching followers:", error);
        return { success: false, data: [] };
    }
}

export async function getUserFollowing(userId: string) {
    try {
        const results = await db.select({
            id: userTable.id,
            name: userTable.name,
            image: userTable.image,
        })
            .from(follows)
            .innerJoin(userTable, eq(follows.followingId, userTable.id))
            .where(eq(follows.followerId, userId));

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching following:", error);
        return { success: false, data: [] };
    }
}

export async function getFollowedShops(userId: string) {
    try {
        const results = await db.select({
            id: coffee_shops.id,
            name: coffee_shops.name,
            image: media.url,
            followedAt: shopFollows.createdAt,
        })
            .from(shopFollows)
            .innerJoin(coffee_shops, eq(shopFollows.shopId, coffee_shops.id))
            .leftJoin(media, eq(coffee_shops.mainImage, media.id))
            .where(eq(shopFollows.userId, userId));

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching followed shops:", error);
        return { success: false, data: [] };
    }
}
