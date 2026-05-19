import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory rate limiting map: ip -> array of request timestamps
const rateLimitMap = new Map<string, number[]>();

// Limit: 10 requests per minute for sensitive endpoints
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || "";

  // 1. Enforce HTTPS in production
  if (process.env.NODE_ENV === "production" && proto === "http") {
    return NextResponse.redirect(`https://${host}${pathname}${request.nextUrl.search}`, 301);
  }

  // 2. Simple Rate Limiting for sensitive API routes
  const sensitiveRoutes = [
    "/api/auth/register",
    "/api/auth/callback/credentials", // next-auth credential login
    "/api/inquiries",
    "/api/contact",
    "/api/upload"
  ];

  const isApi = sensitiveRoutes.some((route) => pathname.startsWith(route));
  
  // Also catch generic credentials sign-in calls via nextauth
  const isSignIn = pathname.includes("/api/auth/signin") || pathname.includes("/api/auth/callback");

  if (request.method === "POST" && (isApi || isSignIn)) {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
    const now = Date.now();

    let timestamps = rateLimitMap.get(ip) || [];
    // Clean up timestamps outside the current window
    timestamps = timestamps.filter((timestamp) => now - timestamp < LIMIT_WINDOW);

    if (timestamps.length >= MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again in a minute." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
