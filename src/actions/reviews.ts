"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";
import { db } from "@/db";
import { reviews, reviewTags } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

export async function getTags() {
    try {
        const payload = await getPayload();
        const allTags = await payload.find({
            collection: 'tags',
            limit: 100,
        });

        return { success: true, data: allTags.docs };
    } catch (error) {
        console.error("Error fetching tags:", error);
        return { success: false, error: "Failed to fetch tags" };
    }
}

export async function createReview(data: {
    shopId: string;
    rating?: number;
    comment: string;
    tagIds?: string[];
    coffeeRating?: number;
    foodRating?: number;
    placeRating?: number;
    priceRating?: number;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const { shopId, comment, tagIds, coffeeRating = 0, foodRating = 0, placeRating = 0, priceRating = 0 } = data;

        const ratings = [coffeeRating, foodRating, placeRating, priceRating].filter(r => r > 0);
        const avgRating = ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : "0.0";

        const reviewId = crypto.randomUUID();

        await db.transaction(async (tx) => {
            await tx.insert(reviews).values({
                id: reviewId,
                userId: session.user.id,
                shopId: shopId,
                rating: avgRating,
                coffeeRating: coffeeRating.toString(),
                foodRating: foodRating.toString(),
                placeRating: placeRating.toString(),
                priceRating: priceRating.toString(),
                comment: comment,
            });

            if (tagIds && tagIds.length > 0) {
                await tx.insert(reviewTags).values(
                    tagIds.map(tagId => ({
                        reviewId: reviewId,
                        tagId: tagId,
                    }))
                );
            }
        });

        return { success: true, data: { id: reviewId } };
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, error: "Failed to create review" };
    }
}

export async function getReviews(shopId: string) {
    try {
        // Fetch reviews from Drizzle with joined user and tags
        const results = await db.query.reviews.findMany({
            where: eq(reviews.shopId, shopId),
            orderBy: [desc(reviews.createdAt)],
            with: {
                user: true,
                reviewTags: {
                    with: {
                        tag: true
                    }
                }
            }
        });

        const mappedReviews = results.map((r: any) => ({
            id: r.id,
            userName: r.user?.name || 'Usuario',
            userImage: r.user?.image,
            rating: r.rating,
            coffeeRating: parseFloat(r.coffeeRating),
            foodRating: parseFloat(r.foodRating),
            placeRating: parseFloat(r.placeRating),
            priceRating: parseFloat(r.priceRating),
            comment: r.comment,
            createdAt: r.createdAt,
            tags: r.reviewTags?.map((rt: any) => rt.tag?.name).filter(Boolean) || []
        }));

        return { success: true, data: mappedReviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Failed to fetch reviews" };
    }
}
