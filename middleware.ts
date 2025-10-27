import { NextResponse, type NextRequest } from "next/server";

// Known malicious bot user-agents
const BLOCKED_USER_AGENTS = [
  "python-requests",
  "curl",
  "wget",
  "go-http-client",
  "scrapy",
  "headless",
  "phantom",
  "selenium",
  "bot",
  "crawler",
  "spider",
] as const;

const BLOCKED_MESSAGE = { error: "Access denied." };

function isBlockedUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const lowerUA = userAgent.toLowerCase();
  return BLOCKED_USER_AGENTS.some((blocked) => lowerUA.includes(blocked));
}

export function middleware(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  // Block known malicious bots
  const userAgent = request.headers.get("user-agent");
  if (isBlockedUserAgent(userAgent)) {
    return NextResponse.json(BLOCKED_MESSAGE, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes except static assets and images
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, etc (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
