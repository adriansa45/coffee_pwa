import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";

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

        const payload = await getPayload();
        const newReview = await payload.create({
            collection: 'reviews',
            data: {
                user: session.user.id,
                shop: shopId,
                rating: avgRating,
                coffeeRating,
                foodRating,
                placeRating,
                priceRating,
                comment: comment,
                tags: tagIds || [],
            },
        });

        return { success: true, data: newReview };
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, error: "Failed to create review" };
    }
}

export async function getReviews(shopId: string) {
    try {
        const payload = await getPayload();
        const shopReviews = await payload.find({
            collection: 'reviews',
            where: {
                shop: {
                    equals: shopId,
                },
            },
            sort: '-createdAt',
            depth: 1, // Populate user and tags
        });

        const mappedReviews = shopReviews.docs.map((r: any) => ({
            id: r.id,
            userName: r.user?.name || 'Usuario',
            userImage: r.user?.image,
            rating: r.rating,
            coffeeRating: r.coffeeRating,
            foodRating: r.foodRating,
            placeRating: r.placeRating,
            priceRating: r.priceRating,
            comment: r.comment,
            createdAt: r.createdAt,
            tags: r.tags?.map((t: any) => t.name) || []
        }));

        return { success: true, data: mappedReviews };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Failed to fetch reviews" };
    }
}
