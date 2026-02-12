"use server";

import { db } from "@/db";
import { reviewLikes, reviews, reviewTags, tags as tagsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CACHE_TAGS, getShopReviewsTag, getShopTag } from "@/lib/cache-tags";
import crypto from "crypto";
import { and, desc, eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { cache } from "react";

export async function getTags() {
    try {
        const results = await db.select().from(tagsTable).limit(100);
        return { success: true, data: results };
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

        // Revalidate related caches
        revalidateTag(CACHE_TAGS.REVIEWS);
        revalidateTag(CACHE_TAGS.COFFEE_SHOPS);
        revalidateTag(getShopReviewsTag(shopId));
        revalidateTag(getShopTag(shopId));

        return { success: true, data: { id: reviewId } };
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, error: "Failed to create review" };
    }
}

const getReviewsInternal = async (shopId: string, page: number = 1, limit: number = 10, currentUserId?: string) => {
    // Fetch reviews from Drizzle with joined user and tags
    const results = await db.query.reviews.findMany({
        where: eq(reviews.shopId, shopId),
        orderBy: [desc(reviews.createdAt)],
        limit: limit,
        offset: (page - 1) * limit,
        with: {
            user: true,
            reviewTags: {
                with: {
                    tag: true
                }
            },
            likes: true,
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
        tags: r.reviewTags?.map((rt: any) => rt.tag?.name).filter(Boolean) || [],
        likeCount: r.likes?.length || 0,
        isLiked: currentUserId ? r.likes?.some((l: any) => l.userId === currentUserId) : false,
    }));

    return mappedReviews;
};

export const getReviews = cache(async (shopId: string, page: number = 1, limit: number = 10) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const userId = session?.user?.id;

        const fetchReviews = unstable_cache(
            async (sId: string, p: number, l: number, uId?: string) => getReviewsInternal(sId, p, l, uId),
            [getShopReviewsTag(shopId), `page-${page}`, `limit-${limit}`, userId || "anonymous"],
            { tags: [CACHE_TAGS.REVIEWS, getShopReviewsTag(shopId)], revalidate: 3600 }
        );

        const data = await fetchReviews(shopId, page, limit, userId);
        return { success: true, data, hasMore: data.length >= limit };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Failed to fetch reviews" };
    }
});

export async function toggleReviewLike(reviewId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Check if already liked
        const [existing] = await db
            .select()
            .from(reviewLikes)
            .where(and(eq(reviewLikes.userId, userId), eq(reviewLikes.reviewId, reviewId)));

        if (existing) {
            // Unlike
            await db
                .delete(reviewLikes)
                .where(and(eq(reviewLikes.userId, userId), eq(reviewLikes.reviewId, reviewId)));

            revalidateTag(CACHE_TAGS.REVIEWS);
            return { success: true, isLiked: false };
        } else {
            // Like
            await db.insert(reviewLikes).values({
                id: crypto.randomUUID(),
                userId,
                reviewId,
            });

            revalidateTag(CACHE_TAGS.REVIEWS);
            return { success: true, isLiked: true };
        }
    } catch (error) {
        console.error("Error toggling review like:", error);
        return { success: false, error: "Failed to toggle review like" };
    }
}
