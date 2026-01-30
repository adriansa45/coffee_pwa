import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                //get the cookie from the request
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    // const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
    // const isPublicRoute = request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/register";

    // // If user is not logged in and trying to access a protected route
    // if (!session && !isAuthRoute) {
    //     return NextResponse.redirect(new URL("/auth/login", request.url));
    // }

    // // If user is logged in and trying to access login/register
    // if (session && isPublicRoute) {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    // // If accessing root, redirect to dashboard (or login via the above check)
    // if (request.nextUrl.pathname === "/") {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images folder)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    ],
};
