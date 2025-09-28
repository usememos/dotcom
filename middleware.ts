import { NextResponse, type NextRequest } from "next/server";

import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientIdentifier } from "@/lib/client-identity";

const EDGE_RATE_LIMIT = {
  limit: 80,
  windowMs: 60_000,
} as const;

const RETRY_MESSAGE = { error: "Too many requests from this source. Please slow down." };

function applyRateLimitHeaders(headers: Headers, limit: number, remaining: number, reset: number) {
  headers.set("RateLimit-Limit", limit.toString());
  headers.set("RateLimit-Remaining", Math.max(0, remaining).toString());
  headers.set("RateLimit-Reset", reset.toString());
}

export function middleware(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const identity = `${getClientIdentifier(request)}|edge`;
  const state = consumeRateLimit(identity, EDGE_RATE_LIMIT);

  const headers = new Headers();
  applyRateLimitHeaders(headers, state.limit, state.remaining, state.reset);

  if (!state.allowed) {
    headers.set("Retry-After", state.retryAfter.toString());
    return NextResponse.json(RETRY_MESSAGE, {
      status: 429,
      headers,
    });
  }

  const response = NextResponse.next();
  for (const [key, value] of headers.entries()) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: ["/api/search/:path*", "/sitemap.xml"],
};
