import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Early exit for static assets and internal Next.js paths
    if (
        pathname.includes('.') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    let session = null;
    try {
        const response = await betterFetch<Session>(
            "/api/auth/get-session",
            {
                baseURL: request.nextUrl.origin,
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            },
        );
        session = response.data;
    } catch (error) {
        console.error("Middleware session fetch error:", error);
    }

    const isAuthRoute = pathname.startsWith("/auth");
    const isPayloadRoute = pathname.startsWith("/admin");
    const isPublicRoute = isAuthRoute || isPayloadRoute;

    // If user is not logged in and trying to access a protected route
    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // If user is logged in and trying to access login/register, redirect to home
    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

