"use server";

import { db } from "@/db";
import { user as userTable, visits, reviews, follows } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sql, or, and, desc, count, ilike, ne } from "drizzle-orm";

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
        })
            .from(userTable)
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

        return {
            success: true,
            data: {
                ...profile,
                stats: {
                    visits: stats?.visitCount || 0,
                    reviews: stats?.reviewCount || 0,
                    // followers: profile.followers.length,
                    // following: profile.following.length,
                }
            }
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return { success: false, error: "Failed to fetch profile" };
    }
}
