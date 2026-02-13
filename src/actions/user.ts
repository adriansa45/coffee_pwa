"use server";

import { db } from "@/db";
import { user as userTable, visits, reviews, follows, shopFollows } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sql, or, and, desc, count, ilike, ne, getTableColumns } from "drizzle-orm";

export async function searchUsers(query: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return { success: false, data: [] };

    try {
        const results = await db.select({
            id: userTable.id,
            name: userTable.name,
            image: userTable.image,
            isFollowing: sql<boolean>`CASE WHEN ${follows.followerId} IS NOT NULL THEN TRUE ELSE FALSE END`
        })
            .from(userTable)
            .leftJoin(follows, and(
                eq(userTable.id, follows.followingId),
                eq(follows.followerId, session.user.id)
            ))
            .where(
                and(
                    ilike(userTable.name, `%${query}%`),
                    ne(userTable.id, session.user.id) // Don't show current user
                )
            )
            .limit(20);

        return { success: true, data: results };
    } catch (error) {
        console.error("Error searching users:", error);
        return { success: false, data: [] };
    }
}

export async function getUserProfile(userId: string) {
    try {
        const profile = await db.query.user.findFirst({
            where: eq(userTable.id, userId),
            with: {
                followers: true,
                following: true,
            }
        });

        if (!profile) return { success: false, error: "User not found" };

        const [stats] = await db.select({
            visitCount: count(visits.id),
            reviewCount: count(reviews.id),
        })
            .from(userTable)
            .leftJoin(visits, eq(userTable.id, visits.userId))
            .leftJoin(reviews, eq(userTable.id, reviews.userId))
            .where(eq(userTable.id, userId))
            .groupBy(userTable.id);

        const [socialStats] = await db.select({
            followersCount: sql<number>`(SELECT count(*) FROM ${follows} WHERE ${follows.followingId} = ${userId})`,
            followingCount: sql<number>`(SELECT count(*) FROM ${follows} WHERE ${follows.followerId} = ${userId})`,
            followedShopsCount: sql<number>`(SELECT count(*) FROM ${shopFollows} WHERE ${shopFollows.userId} = ${userId})`,
        }).from(userTable).where(eq(userTable.id, userId));

        return {
            success: true,
            data: {
                ...profile,
                stats: {
                    visits: stats?.visitCount || 0,
                    reviews: stats?.reviewCount || 0,
                    followers: Number(socialStats?.followersCount) || 0,
                    following: Number(socialStats?.followingCount) || 0,
                    followedShops: Number(socialStats?.followedShopsCount) || 0,
                }
            }
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return { success: false, error: "Failed to fetch profile" };
    }
}

export async function updateUserFcmToken(token: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.update(userTable)
            .set({ fcmToken: token, updatedAt: new Date() })
            .where(eq(userTable.id, session.user.id));

        return { success: true };
    } catch (error) {
        console.error("Error updating FCM token:", error);
        return { success: false, error: "Failed to update FCM token" };
    }
}

export async function getAutocompleteUsers(query: string) {
    if (!query || query.length < 2) return { success: true, data: [] };

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    try {
        const results = await db.select({
            id: userTable.id,
            name: userTable.name,
            image: userTable.image,
            isFollowing: sql<boolean>`CASE WHEN ${follows.followerId} IS NOT NULL THEN TRUE ELSE FALSE END`
        })
            .from(userTable)
            .leftJoin(follows, and(
                eq(userTable.id, follows.followingId),
                session?.user?.id ? eq(follows.followerId, session.user.id) : undefined
            ))
            .where(
                and(
                    ilike(userTable.name, `%${query}%`),
                    session?.user?.id ? ne(userTable.id, session.user.id) : undefined
                )
            )
            .limit(3);

        return { success: true, data: results };
    } catch (error) {
        console.error("Error in getAutocompleteUsers:", error);
        return { success: false, data: [] };
    }
}

export async function getUserRankings() {
    try {
        // Top 3 Reviewers
        const topReviewers = await db.select({
            id: userTable.id,
            name: userTable.name,
            image: userTable.image,
            count: count(reviews.id),
        })
            .from(userTable)
            .innerJoin(reviews, eq(userTable.id, reviews.userId))
            .groupBy(userTable.id, userTable.name, userTable.image)
            .orderBy(desc(count(reviews.id)))
            .limit(3);

        // Top 3 Explorers (Visits)
        const topExplorers = await db.select({
            id: userTable.id,
            name: userTable.name,
            image: userTable.image,
            count: count(visits.id),
        })
            .from(userTable)
            .innerJoin(visits, eq(userTable.id, visits.userId))
            .groupBy(userTable.id, userTable.name, userTable.image)
            .orderBy(desc(count(visits.id)))
            .limit(3);

        // Top 3 Followed
        const topFollowed = await db.select({
            id: userTable.id,
            name: userTable.name,
            image: userTable.image,
            count: count(follows.followingId),
        })
            .from(userTable)
            .innerJoin(follows, eq(userTable.id, follows.followingId))
            .groupBy(userTable.id, userTable.name, userTable.image)
            .orderBy(desc(count(follows.followingId)))
            .limit(3);

        return {
            success: true,
            data: {
                topReviewers,
                topExplorers,
                topFollowed
            }
        };
    } catch (error) {
        console.error("Error in getUserRankings:", error);
        return { success: false, data: null };
    }
}
