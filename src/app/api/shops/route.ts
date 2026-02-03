import { db } from "@/db";
import { coffee_shops as coffeeShops, reviews } from "@payload-schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const shops = await db.select({
            id: coffeeShops.id,
            name: coffeeShops.name,
            latitude: coffeeShops.latitude,
            longitude: coffeeShops.longitude,
            googleMapsUrl: coffeeShops.googleMapsUrl,
            avgRating: sql<number>`COALESCE(AVG(${reviews.rating}::numeric), 0)`,
            reviewCount: sql<number>`COUNT(${reviews.id})`,
        })
            .from(coffeeShops)
            .leftJoin(reviews, eq(coffeeShops.id, reviews.shop))
            .groupBy(
                coffeeShops.id,
                coffeeShops.name,
                coffeeShops.latitude,
                coffeeShops.longitude,
                coffeeShops.googleMapsUrl
            );

        return NextResponse.json(shops);
    } catch (error) {
        console.error("Error fetching shops details:", error);
        return NextResponse.json({
            error: "Failed to fetch shops",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
