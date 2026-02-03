import { db } from "@/db";
import { reviews, users as user, coffee_shops as coffeeShops } from "@payload-schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPayload } from "@/lib/payload";

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
            .leftJoin(user, eq(reviews.user, user.id))
            .where(eq(reviews.shop, shopId))
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

        const payload = await getPayload();
        const newReview = await payload.create({
            collection: 'reviews',
            data: {
                user: session.user.id,
                shop: shopId,
                rating: rating.toString(),
                comment: comment,
            },
        });

        return NextResponse.json(newReview);
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}
