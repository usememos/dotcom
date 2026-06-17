import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// Applied only to the OG image routes below. Cloudflare serves the static
// /og-image.png from public/_headers — keep that file's CORS block in sync.
const CORS_HEADERS = [
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET, HEAD, OPTIONS",
  },
];

const SECURITY_HEADERS = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

// Edge-cache the static public pages so Cloudflare's CDN can serve repeat hits
// to the same URL without invoking the Worker (zero CPU/request). Content is
// immutable until redeploy (pages are `revalidate = false`); s-maxage keeps it
// fresh for an hour and stale-while-revalidate serves instantly while the edge
// refreshes in the background. Scoped to public routes only — never /api,
// /dashboard, /sign-in, /sign-up, or /scratchpad (those stay no-store/dynamic).
const PUBLIC_CACHE_HEADERS = [
  {
    key: "Cache-Control",
    value: "public, s-maxage=3600, stale-while-revalidate=86400",
  },
];
const PUBLIC_CACHEABLE_PATHS = [
  "/",
  "/docs/:path*",
  "/blog/:path*",
  "/changelog/:path*",
  "/features/:path*",
  "/use-cases/:path*",
  "/compare/:path*",
  "/pricing",
  "/brand",
  "/privacy",
  "/sponsors",
];

/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    remotePatterns: [], // Prevent external image loading
    unoptimized: true, // Disable built-in image optimization
    qualities: [75, 85], // Support both default (75) and higher quality (85)
  },
  async redirects() {
    return [
      {
        // Bare /docs/api normalizes to the "latest" version. Doing it here (routing
        // layer) instead of via redirect() inside the docs page avoids loading the
        // heavy fumadocs-openapi route module just to emit the 307 — that in-page
        // redirect was ~408ms CPU/hit (~2M CPU-ms/7d on Workers). The page-level
        // normalizeApiDocsSlug() stays as the fallback for other /docs/api/* cases.
        source: "/docs/api",
        destination: "/docs/api/latest",
        permanent: false,
      },
      {
        source: "/docs/troubleshooting/common-issues",
        destination: "/docs/troubleshooting",
        permanent: true,
      },
      {
        source: "/docs/admin/tokens",
        destination: "/docs/integrations/api-access",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/og-image.png",
        headers: CORS_HEADERS,
      },
      {
        source: "/og/:path*",
        headers: CORS_HEADERS,
      },
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      ...PUBLIC_CACHEABLE_PATHS.map((source) => ({
        source,
        headers: PUBLIC_CACHE_HEADERS,
      })),
    ];
  },
};

export default withMDX(config);
