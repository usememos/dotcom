# Codebase Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the static marketing/docs codebase into explicit public, tools, future app/auth, feature, shared, server, and type boundaries without changing behavior.

**Architecture:** Preserve every URL while using App Router route groups for ownership: `(public)` for public content, `(tools)` for scratchpad, and inert `(auth)`/`(app)` folders for future product work. Move flat `src/components`, `src/hooks`, and `src/lib` files into feature-owned or shared folders, split large marketing data files into focused modules, and keep server folders inactive.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Fumadocs, Tailwind CSS 4, Biome, pnpm.

---

## File Structure Map

### Route Files

- Move: `src/app/(home)/page.tsx` -> `src/app/(public)/page.tsx`
- Move: `src/app/blog/` -> `src/app/(public)/blog/`
- Move: `src/app/brand/` -> `src/app/(public)/brand/`
- Move: `src/app/changelog/` -> `src/app/(public)/changelog/`
- Move: `src/app/docs/` -> `src/app/(public)/docs/`
- Move: `src/app/features/` -> `src/app/(public)/features/`
- Move: `src/app/pricing/` -> `src/app/(public)/pricing/`
- Move: `src/app/privacy/` -> `src/app/(public)/privacy/`
- Move: `src/app/social-previews/` -> `src/app/(public)/social-previews/`
- Move: `src/app/sponsors/` -> `src/app/(public)/sponsors/`
- Move: `src/app/use-cases/` -> `src/app/(public)/use-cases/`
- Move: `src/app/scratchpad/` -> `src/app/(tools)/scratchpad/`
- Keep: `src/app/api/search/route.ts`
- Keep: `src/app/og/**`
- Keep: `src/app/layout.tsx`, `src/app/global.css`, `src/app/sitemap.ts`, icons

### Feature And Shared Files

- Move marketing components into `src/features/marketing/components/`
- Move marketing data into `src/features/marketing/data/`
- Move docs components into `src/features/docs/components/`
- Move docs helpers into `src/features/docs/lib/`
- Move editorial components into `src/features/editorial/components/`
- Move editorial helpers into `src/features/editorial/lib/`
- Move scratchpad code into `src/features/scratchpad/`
- Move generic UI and helpers into `src/shared/`
- Create inactive future folders under `src/server/` and `src/types/`

### Important Constraint

Do not create `src/app/(public)/layout.tsx` from the old homepage layout. That layout uses `HomeLayout` and must only wrap the homepage. Convert it into a marketing shell component used by `src/app/(public)/page.tsx`.

---

### Task 1: Route Group Restructure

**Files:**
- Move: `src/app/(home)/page.tsx`
- Move: `src/app/(home)/layout.tsx`
- Move: top-level public route folders listed in the file map
- Move: `src/app/scratchpad/`
- Create: `src/app/(auth)/sign-in/.gitkeep`
- Create: `src/app/(auth)/sign-up/.gitkeep`
- Create: `src/app/(app)/dashboard/.gitkeep`
- Create: `src/app/(app)/memos/.gitkeep`
- Create: `src/app/(app)/settings/.gitkeep`
- Create: `src/features/marketing/components/marketing-site-layout.tsx`
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Check the starting status**

Run:

```bash
git status --short
```

Expected: the only pre-existing unrelated untracked file may be `docs/superpowers/plans/2026-05-30-cloudflare-workers-migration.md`. Do not stage it in this task.

- [ ] **Step 2: Create route group and marketing component directories**

Run:

```bash
mkdir -p \
  'src/app/(public)' \
  'src/app/(tools)' \
  'src/app/(auth)/sign-in' \
  'src/app/(auth)/sign-up' \
  'src/app/(app)/dashboard' \
  'src/app/(app)/memos' \
  'src/app/(app)/settings' \
  src/features/marketing/components
touch \
  'src/app/(auth)/sign-in/.gitkeep' \
  'src/app/(auth)/sign-up/.gitkeep' \
  'src/app/(app)/dashboard/.gitkeep' \
  'src/app/(app)/memos/.gitkeep' \
  'src/app/(app)/settings/.gitkeep'
```

Expected: command exits 0.

- [ ] **Step 3: Move the homepage page and turn its old layout into a component**

Run:

```bash
git mv 'src/app/(home)/page.tsx' 'src/app/(public)/page.tsx'
git mv 'src/app/(home)/layout.tsx' src/features/marketing/components/marketing-site-layout.tsx
rmdir 'src/app/(home)'
```

Expected: command exits 0 and `src/app/(home)` no longer exists.

- [ ] **Step 4: Replace the old layout file with a homepage-only shell component**

Edit `src/features/marketing/components/marketing-site-layout.tsx` so the whole file is:

```tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";

export function MarketingSiteLayout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
```

- [ ] **Step 5: Wrap only the homepage with the marketing shell**

In `src/app/(public)/page.tsx`, add this import:

```tsx
import { MarketingSiteLayout } from "@/features/marketing/components/marketing-site-layout";
```

Then change the first line of the component return from:

```tsx
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col overflow-x-hidden bg-white dark:bg-zinc-950">
  );
}
```

to:

```tsx
export default function HomePage() {
  return (
    <MarketingSiteLayout>
      <main className="flex flex-1 flex-col overflow-x-hidden bg-white dark:bg-zinc-950">
```

Then change the final closing lines of the returned JSX from:

```tsx
    </main>
  );
}
```

to:

```tsx
      </main>
    </MarketingSiteLayout>
  );
}
```

- [ ] **Step 6: Move public route folders under `(public)`**

Run:

```bash
git mv src/app/blog 'src/app/(public)/blog'
git mv src/app/brand 'src/app/(public)/brand'
git mv src/app/changelog 'src/app/(public)/changelog'
git mv src/app/docs 'src/app/(public)/docs'
git mv src/app/features 'src/app/(public)/features'
git mv src/app/pricing 'src/app/(public)/pricing'
git mv src/app/privacy 'src/app/(public)/privacy'
git mv src/app/social-previews 'src/app/(public)/social-previews'
git mv src/app/sponsors 'src/app/(public)/sponsors'
git mv src/app/use-cases 'src/app/(public)/use-cases'
```

Expected: command exits 0. URLs remain unchanged because route groups do not add path segments.

- [ ] **Step 7: Move scratchpad under `(tools)`**

Run:

```bash
git mv src/app/scratchpad 'src/app/(tools)/scratchpad'
```

Expected: `/scratchpad` remains the URL because `(tools)` is a route group.

- [ ] **Step 8: Run route-level checks**

Run:

```bash
pnpm lint
```

Expected: exits 0. If it fails because the homepage wrapper edit damaged JSX, fix only `src/app/(public)/page.tsx` and rerun.

- [ ] **Step 9: Commit route group restructure**

Run:

```bash
git add \
  'src/app/(public)' \
  'src/app/(tools)' \
  'src/app/(auth)' \
  'src/app/(app)' \
  src/features/marketing/components/marketing-site-layout.tsx
git commit -m "refactor(routes): group public and tool routes"
```

Expected: commit succeeds and does not include the unrelated `docs/superpowers/plans/2026-05-30-cloudflare-workers-migration.md` file.

---

### Task 2: Shared Utilities And Config

**Files:**
- Move: `src/lib/seo.ts` -> `src/shared/lib/seo.ts`
- Move: `src/lib/utils.ts` -> `src/shared/lib/utils.ts`
- Move: `src/components/ui/card.tsx` -> `src/shared/ui/card.tsx`
- Move: `src/app/layout.config.tsx` -> `src/shared/config/layout.tsx`
- Modify: `src/app/layout.tsx`
- Modify: all files importing `@/lib/seo`, `@/lib/utils`, `@/components/ui/card`, or `@/app/layout.config`

- [ ] **Step 1: Create shared folders and move generic files**

Run:

```bash
mkdir -p src/shared/lib src/shared/config src/shared/ui
git mv src/lib/seo.ts src/shared/lib/seo.ts
git mv src/lib/utils.ts src/shared/lib/utils.ts
git mv src/components/ui/card.tsx src/shared/ui/card.tsx
git mv src/app/layout.config.tsx src/shared/config/layout.tsx
```

Expected: command exits 0.

- [ ] **Step 2: Update imports mechanically**

Run:

```bash
rg -l '@/lib/seo' src | xargs perl -pi -e 's#@/lib/seo#@/shared/lib/seo#g'
rg -l '@/lib/utils' src | xargs perl -pi -e 's#@/lib/utils#@/shared/lib/utils#g'
rg -l '@/components/ui/card' src | xargs perl -pi -e 's#@/components/ui/card#@/shared/ui/card#g'
rg -l '@/app/layout.config' src | xargs perl -pi -e 's#@/app/layout.config#@/shared/config/layout#g'
```

Expected: command exits 0.

- [ ] **Step 3: Update the layout config comment**

In `src/shared/config/layout.tsx`, replace the existing comment with:

```tsx
/**
 * Shared Fumadocs layout configuration.
 *
 * The homepage applies this through MarketingSiteLayout.
 * The docs area applies this through its own docs layout.
 */
```

Keep the exported `baseOptions` object unchanged except for import paths already updated by Step 2.

- [ ] **Step 4: Verify old shared imports are gone**

Run:

```bash
rg '@/lib/(seo|utils)|@/components/ui/card|@/app/layout.config' src
```

Expected: no matches and exit code 1.

- [ ] **Step 5: Run lint**

Run:

```bash
pnpm lint
```

Expected: exits 0.

- [ ] **Step 6: Commit shared utility move**

Run:

```bash
git add src/app src/components src/features src/shared
git commit -m "refactor(shared): move generic config and utilities"
```

Expected: commit succeeds.

---

### Task 3: Marketing Components And Data

**Files:**
- Move: marketing components from `src/components/*.tsx` to `src/features/marketing/components/`
- Move: `src/lib/sponsors.ts` -> `src/features/marketing/data/sponsors.ts`
- Split: `src/lib/features.ts` -> `src/features/marketing/data/features/{types.ts,slugs.ts,data.ts,index.ts}`
- Split: `src/lib/use-cases.ts` -> `src/features/marketing/data/use-cases/{types.ts,slugs.ts,data.ts,index.ts}`
- Modify: public marketing pages and footer imports
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Move marketing component files**

Run:

```bash
git mv src/components/docker-command.tsx src/features/marketing/components/docker-command.tsx
git mv src/components/feature-card.tsx src/features/marketing/components/feature-card.tsx
git mv src/components/footer.tsx src/features/marketing/components/footer.tsx
git mv src/components/hero-section.tsx src/features/marketing/components/hero-section.tsx
git mv src/components/home-cta-section.tsx src/features/marketing/components/home-cta-section.tsx
git mv src/components/home-deploy-section.tsx src/features/marketing/components/home-deploy-section.tsx
git mv src/components/home-discover-section.tsx src/features/marketing/components/home-discover-section.tsx
git mv src/components/home-features-section.tsx src/features/marketing/components/home-features-section.tsx
git mv src/components/home-scratchpad-section.tsx src/features/marketing/components/home-scratchpad-section.tsx
git mv src/components/home-stats-section.tsx src/features/marketing/components/home-stats-section.tsx
git mv src/components/home-use-cases-section.tsx src/features/marketing/components/home-use-cases-section.tsx
git mv src/components/marketing-page.tsx src/features/marketing/components/marketing-page.tsx
git mv src/components/memo-hero-mock.tsx src/features/marketing/components/memo-hero-mock.tsx
git mv src/components/section-header.tsx src/features/marketing/components/section-header.tsx
git mv src/components/sponsors-section.tsx src/features/marketing/components/sponsors-section.tsx
git mv src/components/stats-card.tsx src/features/marketing/components/stats-card.tsx
```

Expected: command exits 0.

- [ ] **Step 2: Move sponsor data**

Run:

```bash
mkdir -p src/features/marketing/data
git mv src/lib/sponsors.ts src/features/marketing/data/sponsors.ts
```

Expected: command exits 0.

- [ ] **Step 3: Split feature data module**

Run:

```bash
mkdir -p src/features/marketing/data/features
git mv src/lib/features.ts src/features/marketing/data/features/data.ts
```

Create `src/features/marketing/data/features/types.ts`:

```ts
import type { LucideIcon } from "lucide-react";
import type { FEATURE_SLUGS } from "./slugs";

export interface FeatureDefinition {
  title: string;
  description: string;
  icon: LucideIcon;
  wip?: boolean;
  hero: {
    title: string;
    subtitle: string;
  };
  benefits: string[];
  useCases: Array<{
    title: string;
    description: string;
  }>;
  techDetails: string[];
}

export type FeatureSlug = (typeof FEATURE_SLUGS)[number];
```

Create `src/features/marketing/data/features/slugs.ts`:

```ts
export const FEATURE_SLUGS = [
  "self-hosted",
  "data-ownership",
  "open-source",
  "no-fees",
  "no-dependencies",
  "instant-save",
  "quick-capture",
  "markdown-support",
  "media-integration",
  "universal-search",
  "tags",
  "timeline-view",
  "public-sharing",
  "microblog",
  "beautiful-design",
  "pwa-support",
  "customizable-ui",
  "cross-platform",
  "performance",
  "lightweight",
  "database-support",
  "api-first",
  "community",
  "multi-language",
  "keyboard-shortcuts",
  "import",
  "export",
] as const;
```

Edit `src/features/marketing/data/features/data.ts`:

```ts
import {
  ClockIcon,
  CloudOffIcon,
  CodeIcon,
  DatabaseIcon,
  DollarSignIcon,
  DownloadIcon,
  FeatherIcon,
  FileTextIcon,
  GitBranchIcon,
  GlobeIcon,
  HeartIcon,
  ImageIcon,
  KeyboardIcon,
  LayersIcon,
  LockIcon,
  MessageCircleIcon,
  MonitorSmartphoneIcon,
  PaletteIcon,
  PlusCircleIcon,
  SaveIcon,
  SearchIcon,
  ServerIcon,
  Share2Icon,
  TagIcon,
  UploadIcon,
  ZapIcon,
} from "lucide-react";
import type { FeatureDefinition } from "./types";
import { FEATURE_SLUGS } from "./slugs";
```

Then remove the old `LucideIcon` import, `FeatureDefinition` interface, `FeatureSlug` type, `FEATURE_SLUGS` declaration, `getFeature`, and `getAllFeatureSlugs` from `data.ts`. Leave the existing `FEATURES` object literal body and its `as const satisfies Record<(typeof FEATURE_SLUGS)[number], FeatureDefinition>;` suffix unchanged.

Create `src/features/marketing/data/features/index.ts`:

```ts
import { FEATURES } from "./data";
import { FEATURE_SLUGS } from "./slugs";
import type { FeatureDefinition, FeatureSlug } from "./types";

export { FEATURES, FEATURE_SLUGS };
export type { FeatureDefinition, FeatureSlug };

export function getFeature(slug: string): FeatureDefinition | null {
  return FEATURES[slug as FeatureSlug] || null;
}

export function getAllFeatureSlugs(): readonly FeatureSlug[] {
  return FEATURE_SLUGS;
}
```

- [ ] **Step 4: Split use-case data module**

Run:

```bash
mkdir -p src/features/marketing/data/use-cases
git mv src/lib/use-cases.ts src/features/marketing/data/use-cases/data.ts
```

Create `src/features/marketing/data/use-cases/types.ts`:

```ts
import type { LucideIcon } from "lucide-react";
import type { USE_CASE_SLUGS } from "./slugs";

export interface UseCaseDefinition {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  workflows: string[];
  whyMemos: string[];
  features: Array<{
    name: string;
    slug: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];
```

Create `src/features/marketing/data/use-cases/slugs.ts`:

```ts
export const USE_CASE_SLUGS = [
  "self-hosting",
  "family",
  "developers",
  "writers",
  "personal-knowledge",
  "hobbyists-makers",
  "students-researchers",
  "privacy-professionals",
  "teams",
] as const;
```

Edit `src/features/marketing/data/use-cases/data.ts`:

```ts
import { BookOpenIcon, CodeIcon, GraduationCapIcon, PencilIcon, ServerIcon, ShieldCheckIcon, UsersIcon, WrenchIcon } from "lucide-react";
import type { UseCaseDefinition } from "./types";
import { USE_CASE_SLUGS } from "./slugs";
```

Then remove the old `LucideIcon` import, `UseCaseDefinition` interface, `UseCaseSlug` type, `USE_CASE_SLUGS` declaration, `getUseCase`, and `getAllUseCaseSlugs` from `data.ts`. Leave the existing `USE_CASES` object literal body and its `as const satisfies Record<(typeof USE_CASE_SLUGS)[number], UseCaseDefinition>;` suffix unchanged.

Create `src/features/marketing/data/use-cases/index.ts`:

```ts
import { USE_CASES } from "./data";
import { USE_CASE_SLUGS } from "./slugs";
import type { UseCaseDefinition, UseCaseSlug } from "./types";

export { USE_CASES, USE_CASE_SLUGS };
export type { UseCaseDefinition, UseCaseSlug };

export function getUseCase(slug: string): UseCaseDefinition | null {
  return USE_CASES[slug as UseCaseSlug] || null;
}

export function getAllUseCaseSlugs(): readonly UseCaseSlug[] {
  return USE_CASE_SLUGS;
}
```

- [ ] **Step 5: Update marketing import paths**

Run:

```bash
rg -l '@/components/(docker-command|feature-card|footer|hero-section|home-cta-section|home-deploy-section|home-discover-section|home-features-section|home-scratchpad-section|home-stats-section|home-use-cases-section|marketing-page|memo-hero-mock|section-header|sponsors-section|stats-card)' src \
  | xargs perl -pi -e 's#@/components/(docker-command|feature-card|footer|hero-section|home-cta-section|home-deploy-section|home-discover-section|home-features-section|home-scratchpad-section|home-stats-section|home-use-cases-section|marketing-page|memo-hero-mock|section-header|sponsors-section|stats-card)#@/features/marketing/components/$1#g'
rg -l '@/lib/features' src | xargs perl -pi -e 's#@/lib/features#@/features/marketing/data/features#g'
rg -l '@/lib/use-cases' src | xargs perl -pi -e 's#@/lib/use-cases#@/features/marketing/data/use-cases#g'
rg -l '@/lib/sponsors' src | xargs perl -pi -e 's#@/lib/sponsors#@/features/marketing/data/sponsors#g'
```

Expected: command exits 0.

- [ ] **Step 6: Update intra-marketing imports**

Run:

```bash
rg -l '@/components/' src/features/marketing | xargs perl -pi -e 's#@/components/#@/features/marketing/components/#g'
rg -l '@/shared/lib/utils' src/features/marketing
```

Expected: the first command exits 0. The second command lists marketing files that use `cn`; those imports should already point at `@/shared/lib/utils`.

- [ ] **Step 7: Run marketing checks**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0.

- [ ] **Step 8: Commit marketing restructure**

Run:

```bash
git add src/app src/features/marketing src/shared src/lib
git commit -m "refactor(marketing): group components and data"
```

Expected: commit succeeds. If `src/lib` is empty at this point, Git will ignore it.

---

### Task 4: Docs And Editorial Domains

**Files:**
- Move docs components into `src/features/docs/components/`
- Move docs helpers into `src/features/docs/lib/`
- Move docs-only hooks into `src/features/docs/hooks/`
- Move editorial components into `src/features/editorial/components/`
- Move editorial helpers into `src/features/editorial/lib/`
- Move cross-domain breadcrumbs into `src/shared/ui/breadcrumbs.tsx`
- Modify imports in public pages, OG routes, docs layouts, and feature modules

- [ ] **Step 1: Move docs components and helpers**

Run:

```bash
mkdir -p src/features/docs/components src/features/docs/lib src/features/docs/hooks
git mv src/components/ads-section.tsx src/features/docs/components/ads-section.tsx
git mv src/components/api-version-selector.tsx src/features/docs/components/api-version-selector.tsx
git mv src/components/docs-carbon-ad-card.tsx src/features/docs/components/docs-carbon-ad-card.tsx
git mv src/components/docs-sponsor-card.tsx src/features/docs/components/docs-sponsor-card.tsx
git mv src/components/toc-footer.tsx src/features/docs/components/toc-footer.tsx
git mv src/components/toc-sidebar.tsx src/features/docs/components/toc-sidebar.tsx
git mv src/hooks/use-media-query.ts src/features/docs/hooks/use-media-query.ts
git mv src/lib/api-docs.ts src/features/docs/lib/api-docs.ts
git mv src/lib/api-docs-versions.json src/features/docs/lib/api-docs-versions.json
git mv src/lib/source.ts src/features/docs/lib/source.ts
git mv src/lib/toc-config.tsx src/features/docs/lib/toc-config.tsx
```

Expected: command exits 0.

- [ ] **Step 2: Move editorial components and helpers**

Run:

```bash
mkdir -p src/features/editorial/components src/features/editorial/lib
git mv src/components/blog-article-body.tsx src/features/editorial/components/blog-article-body.tsx
git mv src/components/blog-post-footer.tsx src/features/editorial/components/blog-post-footer.tsx
git mv src/components/blog-post-header.tsx src/features/editorial/components/blog-post-header.tsx
git mv src/components/blog-post-hero-image.tsx src/features/editorial/components/blog-post-hero-image.tsx
git mv src/components/changelog-article-body.tsx src/features/editorial/components/changelog-article-body.tsx
git mv src/components/changelog-footer.tsx src/features/editorial/components/changelog-footer.tsx
git mv src/components/changelog-header.tsx src/features/editorial/components/changelog-header.tsx
git mv src/components/editorial-index.tsx src/features/editorial/components/editorial-index.tsx
git mv src/lib/blog.ts src/features/editorial/lib/blog.ts
git mv src/lib/changelog.ts src/features/editorial/lib/changelog.ts
git mv src/lib/social-preview.ts src/features/editorial/lib/social-preview.ts
git mv src/lib/social-preview-image.tsx src/features/editorial/lib/social-preview-image.tsx
```

Expected: command exits 0.

- [ ] **Step 3: Move breadcrumbs into shared UI**

Run:

```bash
mkdir -p src/shared/ui
git mv src/components/breadcrumbs.tsx src/shared/ui/breadcrumbs.tsx
```

Expected: command exits 0.

- [ ] **Step 4: Update docs, editorial, and breadcrumb imports**

Run:

```bash
rg -l '@/components/(ads-section|api-version-selector|docs-carbon-ad-card|docs-sponsor-card|toc-footer|toc-sidebar)' src \
  | xargs perl -pi -e 's#@/components/(ads-section|api-version-selector|docs-carbon-ad-card|docs-sponsor-card|toc-footer|toc-sidebar)#@/features/docs/components/$1#g'
rg -l '@/components/(blog-article-body|blog-post-footer|blog-post-header|blog-post-hero-image|changelog-article-body|changelog-footer|changelog-header|editorial-index)' src \
  | xargs perl -pi -e 's#@/components/(blog-article-body|blog-post-footer|blog-post-header|blog-post-hero-image|changelog-article-body|changelog-footer|changelog-header|editorial-index)#@/features/editorial/components/$1#g'
rg -l '@/components/breadcrumbs' src | xargs perl -pi -e 's#@/components/breadcrumbs#@/shared/ui/breadcrumbs#g'
rg -l '@/hooks/use-media-query' src | xargs perl -pi -e 's#@/hooks/use-media-query#@/features/docs/hooks/use-media-query#g'
rg -l '@/lib/api-docs' src | xargs perl -pi -e 's#@/lib/api-docs#@/features/docs/lib/api-docs#g'
rg -l '@/lib/source' src | xargs perl -pi -e 's#@/lib/source#@/features/docs/lib/source#g'
rg -l '@/lib/toc-config' src | xargs perl -pi -e 's#@/lib/toc-config#@/features/docs/lib/toc-config#g'
rg -l '@/lib/blog' src | xargs perl -pi -e 's#@/lib/blog#@/features/editorial/lib/blog#g'
rg -l '@/lib/changelog' src | xargs perl -pi -e 's#@/lib/changelog#@/features/editorial/lib/changelog#g'
rg -l '@/lib/social-preview-image' src | xargs perl -pi -e 's#@/lib/social-preview-image#@/features/editorial/lib/social-preview-image#g'
rg -l '@/lib/social-preview' src | xargs perl -pi -e 's#@/lib/social-preview#@/features/editorial/lib/social-preview#g'
```

Expected: command exits 0.

- [ ] **Step 5: Fix intra-domain imports introduced by moves**

Run:

```bash
rg -n '@/components|@/lib' src/features/docs src/features/editorial src/shared src/app/'(public)' src/app/og src/app/api src/app/sitemap.ts
```

Expected: any matches are imports that need direct new paths. Replace docs imports with the exact `@/features/docs/` path for the moved file, editorial imports with the exact `@/features/editorial/` path, marketing imports with the exact `@/features/marketing/` path, breadcrumbs or shared helper imports with the exact `@/shared/` path, and scratchpad imports with the exact `@/features/scratchpad/` path. Rerun the command until there are no matches for moved files.

- [ ] **Step 6: Run docs/editorial checks**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0.

- [ ] **Step 7: Commit docs and editorial restructure**

Run:

```bash
git add src/app src/features/docs src/features/editorial src/shared src/lib src/components
git commit -m "refactor(content): group docs and editorial code"
```

Expected: commit succeeds. If `src/components` or `src/lib` is empty at this point, Git will ignore it.

---

### Task 5: Scratchpad Feature Boundary And Focused Splits

**Files:**
- Move: `src/components/scratch/**` -> `src/features/scratchpad/components/**`
- Move: `src/hooks/use-scratchpad.ts` -> `src/features/scratchpad/hooks/use-scratchpad.ts`
- Move: `src/hooks/use-scratchpad-editor.ts` -> `src/features/scratchpad/hooks/use-scratchpad-editor.ts`
- Move: `src/lib/scratch/**` -> `src/features/scratchpad/lib/**`
- Move: `src/lib/scratch/types.ts` -> `src/features/scratchpad/types.ts`
- Create: `src/features/scratchpad/hooks/use-attachment-previews.ts`
- Create: `src/features/scratchpad/lib/card-style.ts`
- Modify: `src/features/scratchpad/components/card-item.tsx`
- Modify: `src/app/(tools)/scratchpad/page.tsx`

- [ ] **Step 1: Move scratchpad folders**

Run:

```bash
mkdir -p src/features/scratchpad/components src/features/scratchpad/hooks src/features/scratchpad/lib
git mv src/components/scratch/card-item.tsx src/features/scratchpad/components/card-item.tsx
git mv src/components/scratch/instance-setup-form.tsx src/features/scratchpad/components/instance-setup-form.tsx
git mv src/components/scratch/scratchpad-toolbar.tsx src/features/scratchpad/components/scratchpad-toolbar.tsx
git mv src/components/scratch/scratchpad-viewport-lock.tsx src/features/scratchpad/components/scratchpad-viewport-lock.tsx
git mv src/components/scratch/theme-provider.tsx src/features/scratchpad/components/theme-provider.tsx
git mv src/components/scratch/workspace.tsx src/features/scratchpad/components/workspace.tsx
git mv src/hooks/use-scratchpad.ts src/features/scratchpad/hooks/use-scratchpad.ts
git mv src/hooks/use-scratchpad-editor.ts src/features/scratchpad/hooks/use-scratchpad-editor.ts
git mv src/lib/scratch/api.ts src/features/scratchpad/lib/api.ts
git mv src/lib/scratch/editor.ts src/features/scratchpad/lib/editor.ts
git mv src/lib/scratch/encryption.ts src/features/scratchpad/lib/encryption.ts
git mv src/lib/scratch/indexeddb.ts src/features/scratchpad/lib/indexeddb.ts
git mv src/lib/scratch/interactions.ts src/features/scratchpad/lib/interactions.ts
git mv src/lib/scratch/storage.ts src/features/scratchpad/lib/storage.ts
git mv src/lib/scratch/viewport.ts src/features/scratchpad/lib/viewport.ts
git mv src/lib/scratch/types.ts src/features/scratchpad/types.ts
```

Expected: command exits 0.

- [ ] **Step 2: Update scratchpad imports**

Run:

```bash
rg -l '@/components/scratch/' src | xargs perl -pi -e 's#@/components/scratch/#@/features/scratchpad/components/#g'
rg -l '@/hooks/use-scratchpad-editor' src | xargs perl -pi -e 's#@/hooks/use-scratchpad-editor#@/features/scratchpad/hooks/use-scratchpad-editor#g'
rg -l '@/hooks/use-scratchpad' src | xargs perl -pi -e 's#@/hooks/use-scratchpad#@/features/scratchpad/hooks/use-scratchpad#g'
rg -l '@/lib/scratch/types' src | xargs perl -pi -e 's#@/lib/scratch/types#@/features/scratchpad/types#g'
rg -l '@/lib/scratch/' src | xargs perl -pi -e 's#@/lib/scratch/#@/features/scratchpad/lib/#g'
rg -l 'from "./types"' src/features/scratchpad/lib | xargs perl -pi -e 's#from "./types"#from "../types"#g'
```

Expected: command exits 0.

- [ ] **Step 3: Extract card style helpers**

Create `src/features/scratchpad/lib/card-style.ts`:

```ts
import type { ScratchpadItem } from "../types";

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function getCardRotation(item: ScratchpadItem): number {
  const rotationBucket = (hashString(item.id) % 7) - 3;
  return rotationBucket * 0.65;
}

export function getCardRingClass(item: ScratchpadItem, isSelected?: boolean): string {
  if (isSelected) {
    return "ring-2 ring-[#d0b449]/55 shadow-[0_30px_70px_rgba(145,120,41,0.2)]";
  }

  if (item.sync.status === "error") {
    return "ring-2 ring-red-300/80 shadow-[0_24px_60px_rgba(148,67,49,0.18)]";
  }

  if (item.sync.status === "saving") {
    return "ring-2 ring-amber-300/80 shadow-[0_24px_60px_rgba(163,116,38,0.18)]";
  }

  if (item.sync.status === "synced") {
    return "ring-2 ring-emerald-200/80 shadow-[0_24px_60px_rgba(108,125,87,0.14)]";
  }

  return "";
}

export const CARD_TEXT_CLASS_NAME = "font-serif text-[14px] leading-7 text-[#6e5d23]";
```

In `src/features/scratchpad/components/card-item.tsx`, remove the local `hashString`, `getCardRotation`, `getCardRingClass`, and `CARD_TEXT_CLASS_NAME` declarations. Add:

```tsx
import { CARD_TEXT_CLASS_NAME, getCardRingClass, getCardRotation } from "../lib/card-style";
```

- [ ] **Step 4: Extract attachment preview hook**

Create `src/features/scratchpad/hooks/use-attachment-previews.ts`:

```ts
import { useEffect, useMemo, useState } from "react";
import { getFile } from "../lib/indexeddb";
import type { FileData, ScratchpadItem } from "../types";

export interface AttachmentPreview {
  id: string;
  fileData: FileData | null;
  previewUrl: string | null;
}

export function useAttachmentPreviews(attachments: ScratchpadItem["attachments"]) {
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    const loadAttachments = async () => {
      const previews = await Promise.all(
        attachments.map(async (attachment) => {
          const fileData = await getFile(attachment.id);
          if (!fileData) {
            return {
              id: attachment.id,
              fileData: null,
              previewUrl: null,
            };
          }

          if (fileData.type.startsWith("image/")) {
            const url = URL.createObjectURL(fileData.blob);
            urls.push(url);
            return {
              id: attachment.id,
              fileData,
              previewUrl: url,
            };
          }

          return {
            id: attachment.id,
            fileData,
            previewUrl: null,
          };
        }),
      );

      if (!cancelled) {
        setAttachmentPreviews(previews);
      }
    };

    void loadAttachments();

    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [attachments]);

  return useMemo(() => new Map(attachmentPreviews.map((preview) => [preview.id, preview])), [attachmentPreviews]);
}
```

In `src/features/scratchpad/components/card-item.tsx`, remove the local `AttachmentPreview` interface, `attachmentPreviews` state, attachment-loading `useEffect`, and `previewMap` `useMemo`. Add:

```tsx
import { useAttachmentPreviews } from "../hooks/use-attachment-previews";
```

Then add this inside `CardItem`:

```tsx
const previewMap = useAttachmentPreviews(item.attachments);
```

- [ ] **Step 5: Remove now-unused card item imports**

In `src/features/scratchpad/components/card-item.tsx`, remove imports that are no longer used after the extraction:

```tsx
import { getFile } from "@/features/scratchpad/lib/indexeddb";
import type { FileData } from "@/features/scratchpad/types";
```

Keep `ScratchpadItem` imported from `@/features/scratchpad/types`.

- [ ] **Step 6: Run scratchpad checks**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0.

- [ ] **Step 7: Commit scratchpad boundary**

Run:

```bash
git add src/app/'(tools)' src/features/scratchpad src/components src/hooks src/lib
git commit -m "refactor(scratchpad): isolate tool feature code"
```

Expected: commit succeeds. If `src/components`, `src/hooks`, or `src/lib` is empty at this point, Git will ignore it.

---

### Task 6: Future Server And Types Boundaries

**Files:**
- Create: `src/server/api/.gitkeep`
- Create: `src/server/auth/.gitkeep`
- Create: `src/server/db/.gitkeep`
- Create: `src/types/.gitkeep`
- Remove: empty `src/components/`, `src/hooks/`, and `src/lib/` directories if no files remain

- [ ] **Step 1: Create inactive future boundary folders**

Run:

```bash
mkdir -p src/server/api src/server/auth src/server/db src/types
touch src/server/api/.gitkeep src/server/auth/.gitkeep src/server/db/.gitkeep src/types/.gitkeep
```

Expected: command exits 0.

- [ ] **Step 2: Verify old broad source roots contain no files**

Run:

```bash
find src/components src/hooks src/lib -type f 2>/dev/null
```

Expected: no output. If a file remains, move it into the correct `src/features/*` or `src/shared/*` folder and update imports directly.

- [ ] **Step 3: Remove empty old roots**

Run:

```bash
rmdir src/components/scratch 2>/dev/null || true
rmdir src/components/ui 2>/dev/null || true
rmdir src/components 2>/dev/null || true
rmdir src/hooks 2>/dev/null || true
rmdir src/lib/scratch 2>/dev/null || true
rmdir src/lib 2>/dev/null || true
```

Expected: command exits 0.

- [ ] **Step 4: Verify no stale imports remain**

Run:

```bash
rg '@/components|@/hooks|@/lib' src
```

Expected: no output and exit code 1.

- [ ] **Step 5: Run boundary checks**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit skeleton boundaries**

Run:

```bash
git add src/server src/types src
git commit -m "refactor: add future product boundaries"
```

Expected: commit succeeds.

---

### Task 7: Final Verification

**Files:**
- Verify: entire repository
- Modify: only files needed to fix lint, type, build, or smoke failures caused by this restructure

- [ ] **Step 1: Inspect final tree shape**

Run:

```bash
find src/app -maxdepth 4 -type f | sort
find src/features src/shared src/server src/types -maxdepth 4 -type f | sort
```

Expected: route files are under `(public)`, `(tools)`, `(auth)`, `(app)`, `api`, or `og`; feature files are under `src/features`; generic files are under `src/shared`; inactive future folders contain only `.gitkeep`.

- [ ] **Step 2: Run required verification**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0.

- [ ] **Step 3: Run Cloudflare preview verification**

Run:

```bash
pnpm run preview
```

Expected: preview starts on port 8788. Leave it running for the smoke test.

- [ ] **Step 4: Run smoke test in a second terminal**

Run:

```bash
SMOKE_BASE_URL=http://localhost:8788 pnpm run smoke
```

Expected: smoke test exits 0.

- [ ] **Step 5: Stop preview**

Press `Ctrl+C` in the terminal running `pnpm run preview`.

Expected: preview process exits.

- [ ] **Step 6: Check final git status**

Run:

```bash
git status --short
```

Expected: only the unrelated pre-existing `docs/superpowers/plans/2026-05-30-cloudflare-workers-migration.md` file remains untracked, unless the user has changed other files during execution.

- [ ] **Step 7: Commit verification fixes if any were needed**

If Step 2 or Step 4 required code fixes, run:

```bash
git add src
git commit -m "fix: repair restructure regressions"
```

Expected: commit succeeds only if fixes were made. If no fixes were needed, do not create an empty commit.

---

## Self-Review

- Spec coverage: route boundaries, scratchpad isolation, domain modules, no integration code, clean-break imports, and verification are covered by Tasks 1 through 7.
- Scope check: this is one coherent cleanup plan. It does not implement Clerk, D1, protected routes, new bindings, or UI redesign.
- Risk control: each task has a lint or build checkpoint and its own commit.
- Import consistency: all old `@/components`, `@/hooks`, and `@/lib` imports are replaced directly with `@/features/*` or `@/shared/*` paths.
