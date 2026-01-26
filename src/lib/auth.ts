import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: false, // Don't allow user to set their role
            },
            userCode: {
                type: "string",
                required: false,
                input: false,
            },
            shopId: {
                type: "string",
                required: false,
                input: false,
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache session for 5 minutes
        },
    },
});
