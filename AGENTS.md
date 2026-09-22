# AGENTS.md

## Project Snapshot

This repository is the official website for Memos at `usememos.com`. It is a Next.js + TypeScript + Tailwind app with a static public marketing/editorial site, Fumadocs documentation, and an account app at `/dashboard` and `/settings/connections`. The account app uses Clerk sign-in and calls the user's connected Memos instance directly from the browser. `/api/search` is a public static documentation index.

Treat it as a **Next.js 16 marketing/docs site plus an account app**. Current account pages are static client-auth shells; no server-authenticated product API, application database, `src/server/` directory, or request middleware exists. Follow `docs/architecture.md` when adding request-dependent pages, persistence, Cloudflare bindings, or external dependencies.

## Branding Authority

Read `docs/brand-guidelines.md` before changing product messaging, taglines, default metadata, or social-preview copy. It is the authoritative messaging contract. Reuse `src/shared/lib/branding.ts` for approved brand strings.

## Public Website Design Authority

Before changing any project-owned public `(site)` page or a component under `src/features/marketing/` or `src/features/editorial/`, read `DESIGN_SYSTEM.md` in full. It is the authoritative design contract for those surfaces. Only an explicit, locally scoped user instruction may override it; current implementation does not create an exception.

`DESIGN_SYSTEM.md` does not apply to Docs, Dashboard/App, or Auth. Website design-system work must not redesign or migrate those surfaces, and changes to shared CSS or UI primitives must be checked for unintended effects on them.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **Runtime target**: Cloudflare Workers through OpenNext
- **Content**: Fumadocs, MDX, and file-based content under `content/`
- **Styling**: Tailwind CSS 4.x with the local design system
- **UI primitives**: shadcn/ui (`base-nova`) backed by Base UI, configured in `components.json`
- **Icons**: Lucide React using the `XxxIcon` naming convention
- **Validation**: Zod content schemas in `source.config.ts`; client-safe connection parsing in `src/shared/memos/`
- **Auth**: Clerk (`@clerk/nextjs`), currently client-side and scoped to `(app)`
- **Node.js**: 24.0.0 or newer (pinned in `.nvmrc`)

## Common Commands

Use `pnpm` for all package scripts, with the version declared in `package.json`.

| Task | Command | Notes |
| --- | --- | --- |
| Install dependencies | `pnpm install` | Regenerates Fumadocs sources and the docs-scoped UI stylesheet |
| Develop locally | `pnpm dev` | Starts Next.js with Turbopack on port 3000 |
| Run tests | `pnpm test` | Vitest (`*.test.ts`/`*.test.tsx`); `pnpm test:watch` to watch |
| Build | `pnpm build` | Full production build for the static site |
| Start production server | `pnpm start` | Runs the local Next.js production server |
| Lint | `pnpm lint` | Runs static revalidation audit, metadata audit, and Biome |
| Format | `pnpm format` | Runs Biome format with `--write` |
| Check and write fixes | `pnpm check` | Runs `biome check --write` |
| Refresh generated docs | `pnpm docs:refresh` | Downloads OpenAPI specs, regenerates and formats API MDX, and rebuilds Fumadocs source and scoped styles |
| Generate Fumadocs source | `pnpm docs:generate:source` | Rebuilds ignored `.source/` files without downloading API specs |
| Generate scoped docs styles | `pnpm docs:generate:styles` | Rebuilds the generated `/docs`-scoped Fumadocs stylesheet |
| Generate Cloudflare types | `pnpm typegen` | Writes `cloudflare-env.d.ts` |
| Build Cloudflare Worker | `pnpm run build:worker` | Generates sources/styles, runs the Next.js build, and creates the OpenNext artifact |
| Cloudflare preview | `pnpm run preview` | Builds with OpenNext and serves the Workers runtime on port 8788 |
| Cloudflare deploy | `pnpm run deploy` | Deploys an existing OpenNext artifact, preserving existing vars |
| Cloudflare version upload | `pnpm run upload` | Uploads an existing OpenNext artifact without promoting it |
| Cloudflare dry run | `pnpm run deploy:dry-run` | Builds and packages through Wrangler without deploying |
| Smoke test | `SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke` | Run against `pnpm run preview` |
| Metadata audit | `pnpm run metadata:audit` | Checks metadata title rules |
| Open Graph audit | `pnpm run og:audit` | Audits OG output |

For day-to-day work, use `pnpm dev`. Before deployment-sensitive changes, prefer `pnpm run preview` because it runs the built app in the Cloudflare Workers runtime instead of the local Node.js server.

Standard verification is `pnpm test`, `pnpm lint`, and `pnpm build`, with `pnpm run preview` plus smoke tests when the change could affect production routing or runtime behavior. CI runs `test`, `lint`, and the Cloudflare dry-run build.

`pnpm test` runs the TypeScript tests under `src/` using `vitest.config.mts`. The Node tests in `scripts/*.test.mjs` are separate and are not run by that command or the current CI test job; run relevant ones explicitly for configuration changes.

## Architecture

See `docs/architecture.md` for current routes, browser-side account data flow, content generation, caching, and deployment. Its server-domain and store-interface guidance applies when a future feature first needs a backend; those abstractions are not implemented today.

### Routes

- `src/app/(public)/(site)/` contains project-owned marketing, blog, and changelog routes.
- `src/app/(public)/docs/` serves Fumadocs documentation.
- `src/app/(public)/(site)/blog/` serves blog posts from `content/blog/`.
- `src/app/(public)/(site)/changelog/` serves release notes from `content/changelog/`.
- `src/app/(public)/(site)/features/` contains the feature index and SEO pages at `/features/[slug]`.
- `src/app/(public)/(site)/brand/`, `compare/`, `pricing/`, `privacy/`, `sponsors/`, `use-cases/`, and `web-clipper/` contain static marketing pages.
- `src/app/(app)/` mounts Clerk and the account shell and sets noindex metadata. `/dashboard` and `/settings/connections` render static shells; their client components handle sign-in and load account/instance data. The layout does not enforce server-side authentication. Sign-in uses Clerk's modal; there is no `(auth)` route group.
- `src/app/api/search/route.ts` generates the public search index. Other static handlers provide `/og/` images, `/blog/feed.xml`, `/llms.txt`, `/llms-full.txt`, and `/llms.mdx/[...slug]` exports.

### Account data

- `useMemosConnection` stores one `{ instanceUrl, accessToken }` connection in Clerk `unsafeMetadata.memos`. Its reload-and-compare check detects previously changed data but is not an atomic write lock.
- `src/shared/memos/` handles browser requests to the instance, version compatibility, and statistics normalization. There is no website API proxy for these requests.
- The overview uses a best-effort `localStorage` statistics cache. There is no IndexedDB memo store or sync engine.
- `/settings/connections` is the canonical connection page. `?source=web-clipper` changes return guidance only; the old `/dashboard?setup=memos` entry redirects here.

### Content

- Documentation MDX lives in `content/docs/`.
- Blog MDX lives in `content/blog/`.
- Changelog MDX lives in `content/changelog/`.
- `source.config.ts` defines content schemas and MDX processing.
- `src/shared/content/source.ts` configures Fumadocs loaders for docs, blog, and changelog content.
- `.source/` is generated by `fumadocs-mdx`; never edit it directly.
- `src/features/docs/lib/api-docs-versions.json` controls API snapshots and navigation: publish Latest (`main`) and the two newest minor series. Keep `src/shared/memos/supported-versions.ts` aligned when rotating versions.
- `openapi/*.yaml` and `content/docs/api/` are committed generated content; regenerate them with `pnpm docs:refresh`. Preserve retired YAML snapshots, remove their rendered pages, and verify the manifest-driven redirects to the upgrade guide.
- Search and the sitemap include only Latest API pages; versioned API pages are noindex. Markdown exports include prose docs, blog, and changelog content, excluding generated API references.

### Feature and Use-Case Data

- Feature page data lives under `src/features/marketing/data/features/`.
- Use-case page data lives under `src/features/marketing/data/use-cases/`.
- Feature SEO pages are statically generated from feature slugs with `generateStaticParams`.
- To add a feature page, update the relevant slug, data, and accessor modules together.

### Components

- Marketing components: `src/features/marketing/components/`
- Docs components and helpers: `src/features/docs/components/` and `src/features/docs/lib/`
- Editorial components and helpers: `src/features/editorial/components/` and `src/features/editorial/lib/`
- Markdown discovery/export builders: `src/features/ai-discovery/`
- Product overview components and helpers: `src/features/overview/`
- Connection settings components and hooks: `src/features/connections/`
- Account shell and Clerk provider: `src/features/account/`
- Client-safe Memos protocol and connection data helpers: `src/shared/memos/`
- Shared UI primitives: `src/shared/ui/`
- Docs layout options: `src/features/docs/lib/layout-options.tsx`
- Shared navigation data: `src/shared/lib/seo.ts`
- Shared utilities, including `cn()`: `src/shared/lib/utils.ts`

## Coding Conventions

- Use **View / Views** (**视图**) in product copy and `MemoView` / `MemoViews` in code and API identifiers. Saving is an action: **Save as view / 保存为视图**; the resulting object remains a View. Preserve legacy identifiers when documenting historical APIs or migration sources.
- Prefer existing feature-folder patterns over creating new top-level structures.
- Add reusable primitives through shadcn/ui and keep them in `src/shared/ui/`. Application code should import the shadcn wrappers rather than `@base-ui/react` directly.
- Do not add Radix UI dependencies or direct Radix imports. Radix packages may still exist transitively through Fumadocs.
- Rendered MDX uses the owned shadcn Typeset stylesheet in `src/app/typeset.css`: blog and changelog use the `typeset-editorial` preset, while documentation uses the denser `typeset-docs` preset. Fumadocs still owns docs layout, navigation, and interactive MDX components.
- Use the `@/*` alias for imports from `src/*`.
- Use `@/.source` only for generated Fumadocs output from `.source/server.ts`.
- Import Lucide icons as `XxxIcon`, for example `import { ShieldIcon } from "lucide-react"`.
- Pass icons as React elements to components, not as string names.
- Keep project-owned baseline MDX components in `src/mdx-components.tsx`; extend them with Fumadocs components only in the docs MDX registry. Element primitives that depend on a typeset preset (`a`, `img`, `pre`) live in the registry that owns that preset — see `src/features/editorial/lib/mdx-components.ts`.
- Wrap public `(site)` sections in `site-container` for the shared page width. Do not set an outer `max-w-*` on a page shell; `src/features/marketing/site-layout-boundary.test.ts` fails CI on `max-w-5xl`/`max-w-6xl` under `src/app/(public)/(site)`, `src/features/marketing`, and `src/features/editorial`. The width itself is `--site-layout-width` in `src/app/global.css`.
- Keep `fumadocs-ui`, its provider, CSS, and search UI scoped to `/docs`. Blog and changelog may use the headless `fumadocs-mdx` and `fumadocs-core/source` pipeline.
- Maintain dark mode support with `dark:` classes when changing UI.
- Follow `DESIGN_SYSTEM.md` for public-site composition, typography, spacing, radius, color, actions, motion, verification, and migration. Do not replace those contextual rules with generic marketing defaults.
- Remove emojis from marketing content; use Lucide icons instead.
- Keep pages mobile-first and responsive.

## SEO and Metadata

- Preserve comprehensive Open Graph and Twitter card metadata.
- Keep feature pages search-oriented with clear titles, descriptions, benefits, use cases, and technical details.
- Update `src/app/sitemap.ts` when adding routes that should be discoverable.
- Run metadata or OG audits when changing metadata structure.

## Cloudflare Notes

OpenNext uses `staticAssetsIncrementalCache` with cache interception, and Wrangler enables caching before Worker execution. Treat content updates as rebuild and redeploy events. Only the `ASSETS` binding is configured; design a persistent cache backend before adding ISR or runtime revalidation.

Keep personalized data out of cached HTML. Future server-authenticated routes must verify the session and return `Cache-Control: private, no-store`; a client-auth shell is not a server authorization boundary. `next.config.mjs` also enforces no-store for `/api/*` except `/api/search`.

Preserve the pinned OpenNext 404-cache patch and `experimental.prefetchInlining: false` until adapter upgrades are verified in Workers preview. See `docs/architecture.md` for their purpose. Do not add `runtime = "edge"`; OpenNext uses the Workers runtime with Node compatibility.

Cloudflare Workers Builds uses the repository root with these commands:

- Build command: `pnpm run build:worker`
- Deploy command: `pnpm run deploy`
- Version command: `pnpm run upload`

The build command creates `.open-next/` once. The deploy command promotes that artifact to production, while the version command uploads it without promotion for non-production builds. Deploy and upload do not rebuild it.

Use `pnpm run preview` or `pnpm run deploy:dry-run` to validate Cloudflare production behavior. `pnpm start` only validates the local Next.js production server.

## Gotchas

- `postinstall` regenerates the ignored Fumadocs `.source/` files and the ignored docs-scoped UI stylesheet (`src/app/(public)/docs/fumadocs-scoped.css`). Neither is committed, and `pnpm build` regenerates both. CI installs with `--ignore-scripts`, so the test job regenerates the stylesheet explicitly. Run `pnpm docs:refresh` explicitly when refreshing the committed OpenAPI specs and generated API MDX. The refresh falls back to committed `openapi/*.yaml` files if the network fetch fails.
- `pnpm-workspace.yaml` explicitly allows dependency build scripts for Clerk shared code, esbuild, sharp, and workerd. Investigate new blocked-build warnings rather than assuming they are cosmetic.
- The production build generates hundreds of static pages, so `pnpm build` can take a while.
- Do not edit generated files in `.source/`.
- Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` before building the static account routes; deploy and upload check that it is present. There are no current `CLERK_SECRET_KEY` consumers or server-side Clerk handlers. Introduce server credentials and narrowly matched auth middleware together when a feature needs them.
- Ordinary builds use committed API schemas. `pnpm docs:refresh` can fall back to a local snapshot after a failed download; inspect its log before claiming a snapshot is current.
- Before adding persistence or a binding, document the feature's requirements and follow `docs/architecture.md` ("Future data layer"). D1, Drizzle, KV, and Clerk user-sync webhooks are not existing infrastructure or mandatory next steps.
