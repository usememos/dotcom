import { readFileSync } from "node:fs";

import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// API reference versions, kept in sync with src/features/docs/lib/api-docs.ts.
// Used to build the version-aware /docs/api redirects below.
const API_DOCS_VERSIONS = JSON.parse(readFileSync(new URL("./src/features/docs/lib/api-docs-versions.json", import.meta.url), "utf8"));
const API_DOCS_VERSION_PATTERN = API_DOCS_VERSIONS.map((version) => version.slug).join("|");
const API_DOCS_LATEST_VERSION = API_DOCS_VERSIONS.find((version) => version.isLatest)?.slug ?? "latest";

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
// immutable until redeploy (pages are `revalidate = false`). Workers Caching
// keys entries by Worker version, so a deploy replaces the cache namespace;
// the long s-maxage avoids needless hourly Worker invocations between deploys.
// No stale-while-revalidate: the version-keyed cache is discarded on every
// deploy (far more often than yearly), so the post-s-maxage stale window is
// never reached. Scoped here to marketing/docs routes. Routes not listed here
// (e.g. /scratchpad, /api/search) set no explicit Cache-Control and fall back
// to Workers Caching's heuristic freshness; authenticated routes such as
// /dashboard are force-dynamic and return no-store, which bypasses the cache.
const PUBLIC_CACHE_HEADERS = [
  {
    key: "Cache-Control",
    value: "public, s-maxage=31536000",
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
        // redirect was ~408ms CPU/hit (~2M CPU-ms/7d on Workers). Other version-less
        // /docs/api/* URLs are normalized by the version-aware redirect below —
        // `dynamicParams = false` on the docs route 404s unknown slugs before the
        // page's normalizeApiDocsSlug() fallback can run.
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
      // Dead docs URLs (no matching content file) that still draw crawler/inbound
      // traffic. An unmatched /docs/[...slug] loads the full fumadocs+MDX+shiki
      // route module only to call notFound() — ~450-510ms CPU/hit, and the
      // read-only incremental cache can never persist it, so every hit re-pays.
      // Redirecting at the routing layer costs ~0 CPU and recovers link equity.
      {
        source: "/docs/installation/docker",
        destination: "/docs/deploy/docker",
        permanent: true,
      },
      {
        source: "/docs/getting-started/content-syntax",
        destination: "/docs/usage/writing-markdown",
        permanent: true,
      },
      {
        source: "/docs/guides/shortcuts",
        destination: "/docs/usage/shortcuts",
        permanent: true,
      },
      {
        source: "/docs/security/access-tokens",
        destination: "/docs/integrations/api-access",
        permanent: true,
      },
      // API service-index paths (e.g. /docs/api/latest/memoservice) have no
      // index.mdx — only per-operation leaves are pages — so a direct hit is an
      // expensive on-demand 404 (~300-440ms CPU, uncached). Send the service
      // level to its version overview. The :version guard restricts this to real
      // versions so it does not mis-fire on version-less operation URLs like
      // /docs/api/memoservice/ListMemos (handled by the redirect below).
      {
        source: `/docs/api/:version(${API_DOCS_VERSION_PATTERN})/:service`,
        destination: "/docs/api/:version",
        permanent: false,
      },
      // Version-less API URLs — the first segment after /api is not a known
      // version, e.g. /docs/api/memoservice/ListMemos — normalize to the latest
      // version at the routing boundary. This replaces the in-page
      // normalizeApiDocsSlug() redirect, which `dynamicParams = false` makes
      // unreachable (unknown slugs 404 before the page runs). `permanent: false`
      // because "latest" is a moving target.
      {
        source: `/docs/api/:segment((?!(?:${API_DOCS_VERSION_PATTERN})(?:/|$))[^/]+)/:rest*`,
        destination: `/docs/api/${API_DOCS_LATEST_VERSION}/:segment/:rest*`,
        permanent: false,
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
      {
        // Guardrail: Workers Caching heuristically stores any 200 without an
        // explicit Cache-Control (2h), and a request Cookie (Clerk's `__session`)
        // does NOT trigger a cache bypass — so an authenticated API handler that
        // forgets `no-store` would be cached and cross-served to other users.
        // Force no-store on all /api/* except the public static /api/search index.
        // Handlers should still set their own no-store; this is defense-in-depth.
        source: "/api/:path((?!search$).*)",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      ...PUBLIC_CACHEABLE_PATHS.map((source) => ({
        source,
        headers: PUBLIC_CACHE_HEADERS,
      })),
    ];
  },
};

export default withMDX(config);
