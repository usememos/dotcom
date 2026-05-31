# AGENTS.md

## Project overview

This is the official website for Memos (usememos.com), built with Next.js, TypeScript, and Tailwind CSS. It serves as a marketing site, documentation hub, blog, changelog, and features showcase.

This is a **Next.js 16 static marketing/docs website**. No external services, databases, or environment variables are required.

### Tech stack

- **Framework**: Next.js 16 with App Router
- **Content**: Fumadocs for documentation, MDX for blogs/changelogs
- **Styling**: Tailwind CSS 4.x with custom design system
- **Icons**: Lucide React (use `XxxIcon` naming convention)
- **Database**: File-based content (MDX files in `/content/`)
- **Node**: Requires Node.js 22.0.0 or higher

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Dev server | `pnpm dev` | 3000 | Uses Turbopack; hot-reloads on file changes |
| Cloudflare preview | `pnpm run preview` | 8788 | Builds through OpenNext and runs in the Workers runtime |

### Key commands

Refer to `package.json` scripts for the full list. Quick reference:

- **Install**: `pnpm install`
- **Lint**: `pnpm lint` (runs Biome)
- **Format**: `pnpm format` (runs Biome format with `--write`)
- **Build**: `pnpm build` (full production build, generates 300+ static pages)
- **Dev**: `pnpm dev` (starts on port 3000 with Turbopack)
- **Start**: `pnpm start` (runs the local Next.js production server)
- **Postinstall**: `pnpm postinstall` (processes MDX content; runs automatically on install)
- **Cloudflare preview**: `pnpm run preview` (OpenNext build + local Workers runtime)
- **Cloudflare deploy**: `pnpm run deploy` (OpenNext build + Cloudflare deploy)
- **Cloudflare dry run**: `pnpm run deploy:dry-run` (OpenNext build + Wrangler dry-run packaging)
- **Smoke test**: `SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke`

Use `pnpm dev` for day-to-day local development. Use `pnpm run preview` before deployment because it runs the built app in the Workers runtime instead of the local Node.js Next server.

OpenNext is configured with static-assets incremental cache for this mostly static site. Treat content updates as rebuild/redeploy events. If future runtime ISR/revalidation is required, design a persistent cache backend such as R2/KV first.

## Architecture

### Page structure

- `src/app/(public)/` - Unauthenticated public site routes
- `src/app/(public)/docs/` - Documentation using Fumadocs
- `src/app/(public)/blog/` - Blog posts from `/content/blog/`
- `src/app/(public)/changelog/` - Release notes from `/content/changelog/`
- `src/app/(public)/features/` - SEO feature pages with individual `/features/[slug]` routes
- `src/app/(public)/brand/`, `src/app/(public)/pricing/`, `src/app/(public)/privacy/`, `src/app/(public)/sponsors/`, `src/app/(public)/use-cases/` - Static marketing pages
- `src/app/(tools)/scratchpad/` - Standalone client-side scratchpad tool
- `src/app/(auth)/` and `src/app/(app)/` - Future-facing route boundaries; do not add runtime auth/database behavior without an explicit integration task

### Content management

- **Documentation**: MDX files in `/content/docs/` with frontmatter schemas
- **Blog posts**: MDX files in `/content/blog/` with author, date, tags
- **Changelogs**: MDX files in `/content/changelog/` with version, features, fixes
- **Configuration**: `source.config.ts` defines MDX schemas and processing with Zod validation
- **Source loaders**: `src/shared/content/source.ts` configures Fumadocs loaders for docs, blog, and changelog
- **Feature pages**: Static feature data lives under `src/features/marketing/data/features/`
- **Use-case pages**: Static use-case data lives under `src/features/marketing/data/use-cases/`

### Component system

- **Marketing components**: `src/features/marketing/components/`
- **Docs components and helpers**: `src/features/docs/components/` and `src/features/docs/lib/`
- **Editorial components and helpers**: `src/features/editorial/components/` and `src/features/editorial/lib/`
- **Scratchpad components, hooks, and helpers**: `src/features/scratchpad/`
- **Shared UI primitives**: `src/shared/ui/`
- **Layout/config**: `src/shared/config/layout.tsx` defines baseOptions for navigation and branding

### Styling patterns

- Use `py-24` for section padding and `rounded-2xl` for cards
- Use the teal/cyan color scheme (`teal-600`, `cyan-600`) for primary actions
- Maintain dark mode support with `dark:` prefixes

### Feature pages system

Individual SEO pages at `/features/[slug]` are generated from `src/features/marketing/data/features/`:

- Feature data is split into type, slug, data, and accessor modules
- Static generation at build time uses `generateStaticParams` with feature slugs
- Hero sections include titles/subtitles
- Benefits lists use `CheckCircleIcon` from lucide-react
- Use cases use `StarIcon`
- Technical details appear in gradient cards
- To add a new feature: add the slug, data, and any accessor updates in the feature data modules

## Key conventions

### Icon usage

- Import Lucide icons with `XxxIcon` naming: `import { ShieldIcon } from "lucide-react"`
- Pass icons as React elements to components, not strings

### MDX components

- Custom components available in MDX: Card, Cards, Callout, CodeBlock
- Register new components in `src/mdx-components.tsx` via `getMDXComponents`
- Components are automatically available in all MDX files (docs, blog, changelog)

### Path aliases

- `@/*` maps to `src/*` (for example, `@/components/ui/card`)
- `@/.source` maps to `.source/server.ts` (generated by fumadocs-mdx for content)

### Metadata and SEO

- Comprehensive OpenGraph tags on all pages
- Twitter card support
- Feature pages optimized for search with detailed descriptions
- Sitemap generation in `src/app/sitemap.ts`

## Important files

- `next.config.mjs` - Next.js configuration with Fumadocs MDX integration
- `source.config.ts` - MDX content schemas and processing configuration (docs, blog, changelog)
- `src/shared/content/source.ts` - Fumadocs loaders for content collections
- `src/features/marketing/data/features/` - Feature page data and accessors
- `src/features/marketing/data/use-cases/` - Use-case page data and accessors
- `src/mdx-components.tsx` - Custom MDX component registration
- `src/shared/config/layout.tsx` - Shared navigation and branding configuration
- `src/shared/lib/utils.ts` - Utility functions including `cn()` for className merging

## Content guidelines

- Remove emojis from marketing content and use Lucide icons instead
- Use consistent gradient backgrounds and shadow patterns
- Maintain responsive design with a mobile-first approach

### Gotchas

- The `postinstall` script downloads OpenAPI specs from GitHub (`raw.githubusercontent.com`) and generates MDX + Fumadocs source files. If the network fetch fails during `pnpm install`, the generated API docs will be missing. Rerun `pnpm install` to retry.
- pnpm may warn about ignored build scripts for `esbuild` and `sharp`. This warning is cosmetic and does not block development or builds.
- There are no automated test suites (no `test` script in `package.json`). Verification is done via `pnpm lint` and `pnpm build`.
- The `.source/` directory is auto-generated by `fumadocs-mdx` during `postinstall`. Do not edit files in it directly.
- `pnpm start` runs the local Next.js production server. Use `pnpm run preview` or `pnpm run deploy:dry-run` to validate Cloudflare production behavior.
