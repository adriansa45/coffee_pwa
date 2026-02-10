"use server";

import { db } from "@/db";
import { features as featuresTable } from "@/db/schema";
import { unstable_cache } from "next/cache";

export const getFeatures = unstable_cache(
    async () => {
        try {
            const results = await db.select().from(featuresTable).orderBy(featuresTable.name);
            return { success: true, data: results };
        } catch (error) {
            console.error("Error fetching features:", error);
            return { success: false, error: "Failed to fetch features" };
        }
    },
    ["coffee-features"],
    { revalidate: 86400, tags: ["features"] }
);
