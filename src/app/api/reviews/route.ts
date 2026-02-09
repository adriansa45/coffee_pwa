import { db } from "@/db";
import { reviews, user, coffee_shops as coffeeShops } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");

    if (!shopId) {
        return NextResponse.json({ error: "shopId is required" }, { status: 400 });
    }

    try {
        const result = await db.select({
            id: reviews.id,
            rating: reviews.rating,
            comment: reviews.comment,
            createdAt: reviews.createdAt,
            userName: user.name,
        })
            .from(reviews)
            .leftJoin(user, eq(reviews.userId, user.id))
            .where(eq(reviews.shopId, shopId))
            .orderBy(desc(reviews.createdAt));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { shopId, rating, comment } = await request.json();

        if (!shopId || !rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const reviewId = crypto.randomUUID();
        const newReview = await db.insert(reviews).values({
            id: reviewId,
            userId: session.user.id,
            shopId: shopId,
            rating: rating.toString(),
            comment: comment,
        }).returning();

        return NextResponse.json(newReview[0]);
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}
