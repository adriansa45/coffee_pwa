"use server";

import { db } from "@/db";
import { reviews, tags, reviewsTags, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, inArray } from "drizzle-orm";

export async function getTags() {
    try {
        const allTags = await db.select().from(tags);

        // // Seed if empty (auto-seed for now, should be a separate script but this is convenient for the user)
        // if (allTags.length === 0) {
        //     const defaultTags = ["Buen café", "Buen pan", "Para leer", "Para trabajar", "Aesthetic"];
        //     const inserted = await db.insert(tags).values(defaultTags.map(name => ({ name }))).returning();
        //     return { success: true, data: inserted };
        // }

        return { success: true, data: allTags };
    } catch (error) {
        console.error("Error fetching tags:", error);
        return { success: false, error: "Failed to fetch tags" };
    }
}

export async function createReview(data: { shopId: string; rating: number; comment: string; tagIds: string[] }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const { shopId, rating, comment, tagIds } = data;

        // Transaction would be ideal but Drizzle-Kit sometimes has issues with transactions depending on driver/version in server actions? 
        // PG driver supports it. Let's try simple sequential inserts first for robustness if not using `db.transaction`.
        // Actually, db.transaction is standard.

        const newReview = await db.transaction(async (tx) => {
            const [review] = await tx.insert(reviews).values({
                userId: session.user.id,
                shopId: shopId,
                rating: rating.toString(),
                comment: comment,
            }).returning();

            if (tagIds && tagIds.length > 0) {
                await tx.insert(reviewsTags).values(
                    tagIds.map(tagId => ({
                        reviewId: review.id,
                        tagId: tagId
                    }))
                );
            }
            return review;
        });

        return { success: true, data: newReview };
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, error: "Failed to create review" };
    }
}

export async function getReviews(shopId: string) {
    try {
        // Fetch reviews with user info and tags
        // This is a bit complex with Drizzle's query builder for relation arrays without `with`.
        // `drizzle-orm` query builder `query.reviews.findMany` is easier if set up?
        // We set up relations, so we can use `db.query.reviews.findMany`.

        const shopReviews = await db.query.reviews.findMany({
            where: eq(reviews.shopId, shopId),
            orderBy: [desc(reviews.createdAt)],
            with: {
                user: true,
                tags: {
                    with: {
                        tag: true
                    }
                }
            }
        });

        // Map to simpler format if needed by UI, or usage in UI adapts.
        // UI expects: { id, userName, userImage, rating, comment, createdAt, tags?: string[] }

        const mappedReviews = shopReviews.map(r => ({
            id: r.id,
            userName: r.user.name,
            userImage: r.user.image,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            tags: r.tags.map(rt => rt.tag.name)
        }));

        return { success: true, data: mappedReviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Failed to fetch reviews" };
    }
}
