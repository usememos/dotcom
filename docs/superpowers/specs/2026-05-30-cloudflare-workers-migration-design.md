# Cloudflare Workers Migration Design

## Context

The Memos dotcom project is a Next.js 16 App Router marketing and documentation site. It uses Fumadocs and MDX for documentation, blog posts, changelogs, and generated OpenAPI reference pages. The production build currently prerenders nearly all routes, including docs, blog, changelog, feature pages, feed, sitemap, and Open Graph image routes. The current dynamic surface is limited to `/api/search`.

Future auth is expected to be simple and isolated to specific future pages. It is not part of the content system and does not require a framework rewrite.

Cloudflare's current guidance favors Workers and Workers Static Assets for new deployments. For Next.js, Cloudflare recommends deploying with the Cloudflare OpenNext adapter on Workers. A pure static Next export is documented as a narrower use case and would require redesigning the existing dynamic search route and future auth/API routes.

## Goals

- Move deployment from Vercel to Cloudflare without changing the public website experience.
- Keep the existing Next.js 16, App Router, Fumadocs, MDX, and OpenAPI generation architecture.
- Support the existing `/api/search` route on Cloudflare.
- Preserve room for future isolated auth and API routes.
- Add a Cloudflare runtime preview path so deployment is verified under `workerd`, not only under local Node.js.

## Non-Goals

- Do not migrate to Astro, Docusaurus, VitePress, or another framework.
- Do not convert the app to pure static export.
- Do not implement future auth as part of this migration.
- Do not redesign content, routing, visual UI, or Fumadocs structure.
- Do not introduce Cloudflare storage products until a concrete auth/API feature requires them.

## Recommended Approach

Keep Next.js and deploy with `@opennextjs/cloudflare` on Cloudflare Workers.

This approach preserves the current app model and lets OpenNext split the build output into static assets plus a Worker runtime. Static pages and generated assets are served from Cloudflare assets. Dynamic route handlers, including `/api/search` and future isolated auth/API routes, run inside the Worker.

## Alternatives Considered

### Pure Static Export

This would use Next.js `output: "export"` and deploy the `out` directory as static assets. It has the smallest runtime surface, but it does not fit the known direction because `/api/search` is currently dynamic and future auth/API routes would need to live outside the Next app or be redesigned. That creates unnecessary split architecture.

### Framework Migration To Astro

Astro is a strong content-oriented Cloudflare framework, but this repository already has substantial Next/Fumadocs-specific structure. Migrating would add high churn for little benefit, and future auth/API routes would still require Worker runtime logic.

### Cloudflare Pages Static Next

Cloudflare Pages can host static Next exports, but Cloudflare's guidance points full Next.js applications to Workers with OpenNext. Pages static export should only be used for a specific static-only use case, which this project no longer has because of search and future auth/API needs.

## Architecture

The deployment architecture is:

- Next.js remains the application framework.
- Fumadocs and MDX remain the content system.
- `@opennextjs/cloudflare` builds the Next app for Cloudflare.
- `wrangler` previews and deploys the generated Worker and static assets.
- Static content is emitted into OpenNext assets and served by Cloudflare.
- Dynamic route handlers are served by the generated Worker.

The expected Cloudflare files are:

- `wrangler.jsonc`, with:
  - Worker name.
  - Current compatibility date.
  - `nodejs_compat` compatibility flag.
  - `main` set to `.open-next/worker.js`.
  - assets directory set to `.open-next/assets`.
  - observability enabled.
- `open-next.config.ts`, with a minimal `defineCloudflareConfig()` export.

The expected package scripts are:

- `preview`: build through OpenNext and run the result locally in the Workers runtime.
- `deploy`: build through OpenNext and deploy to Cloudflare.
- `cf-typegen`: generate Cloudflare environment types for future bindings.

Existing scripts remain:

- `dev`: fast local Next development with Turbopack.
- `build`: standard Next production build.
- `lint`: Biome checks.

## Runtime Compatibility

The migration should assume Cloudflare Workers are not a traditional Node.js server. Future API and auth code should prefer Web Platform APIs, fetch-compatible libraries, and Cloudflare bindings.

The current compatibility checks must include:

- `/api/search`, because it is the only current dynamic route.
- Open Graph image routes, because they use `next/og` and local asset reads while being prerendered.
- sitemap and feed routes, because they are generated route handlers.

Future auth should avoid dependencies that require:

- Long-running Node processes.
- Runtime filesystem writes.
- Unsupported TCP database drivers.
- Assumptions tied to Vercel-only request or cache behavior.

## Data Flow

Build-time flow:

1. `postinstall` or build setup generates OpenAPI MDX and Fumadocs source files.
2. `next build` validates and prerenders static routes.
3. OpenNext transforms the Next output into a Cloudflare Worker and assets.
4. Wrangler previews or deploys the Worker and assets together.

Request flow:

1. Static pages and generated assets are served directly from Cloudflare assets where possible.
2. Requests requiring dynamic logic route to the generated Worker.
3. `/api/search` runs in the Worker and returns the same sanitized JSON response as today.
4. Future isolated auth/API routes run in the same Worker by default. A separate Worker or service binding is out of scope for this migration and should require its own design if a future feature needs isolation.

## Error Handling

- Preserve existing `notFound()` and redirect behavior.
- Use OpenNext preview as the compatibility gate for runtime differences.
- Treat Worker preview failures as blockers before production cutover.
- Keep the first migration minimal so any runtime issue is attributable to deployment changes, not unrelated refactors.

## Verification

Required verification before deployment:

- `pnpm lint`
- `pnpm build`
- `pnpm preview`

Required smoke tests against the preview server:

- `/`
- one docs page
- one blog page
- one changelog page
- `/api/search?query=memo`
- `/sitemap.xml`
- `/blog/feed.xml`
- one generated Open Graph image route

## Rollout

1. Add OpenNext and Wrangler configuration.
2. Verify locally with lint, build, and Worker preview.
3. Configure Cloudflare Workers build/deploy settings.
4. Deploy to a Workers preview URL.
5. Smoke test preview URL.
6. Cut over the custom domain after preview behavior matches production.
7. Keep Vercel available until the Cloudflare production domain has been verified.

## Expected Public Impact

The migration is intended to be behavior-preserving. Public URLs, content, metadata, generated docs, and visual UI should remain unchanged. The only expected operational changes are deployment commands, preview environment, runtime platform, and domain hosting.
