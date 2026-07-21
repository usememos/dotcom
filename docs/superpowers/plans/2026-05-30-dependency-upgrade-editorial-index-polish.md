# Dependency Upgrade and Editorial Index Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade all dependencies to latest versions and make `/blog` and `/changelog` use one consistent editorial index presentation.

**Architecture:** Run the package upgrade first so API breakage is visible before UI refactors. Add one focused shared component module for editorial index pages, then map the existing blog and changelog data into those primitives while keeping each page's source loading, sorting, metadata, and SEO logic local.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS 4, Fumadocs MDX, Biome, pnpm.

---

### File Structure

- Modify: `package.json` and `pnpm-lock.yaml` for latest dependency versions.
- Create: `src/components/editorial-index.tsx` for shared index page/header/list/list item/empty state components.
- Modify: `src/app/blog/page.tsx` to render through shared editorial components.
- Modify: `src/app/changelog/page.tsx` to render through shared editorial components.
- Delete: `src/components/blog-list-item.tsx` during the blog page migration.
- Delete: `src/components/changelog-list-item.tsx` during the changelog page migration.
- Leave unchanged: generated `.source/` files unless the dependency migration requires regeneration through the normal project commands.

### Task 1: Upgrade Dependencies

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Confirm the working tree before dependency changes**

Run:

```bash
git status --short
```

Expected: the existing unrelated untracked file `docs/superpowers/plans/2026-05-30-cloudflare-workers-migration.md` may be present. Do not stage, edit, or remove it.

- [ ] **Step 2: Upgrade every dependency to latest**

Run:

```bash
pnpm update --latest
```

Expected: `package.json` and `pnpm-lock.yaml` change. The command may also run lifecycle scripts depending on pnpm behavior.

- [ ] **Step 3: Install and regenerate project-managed outputs**

Run:

```bash
pnpm install
```

Expected: install completes. If the `postinstall` script runs, it may regenerate OpenAPI/Fumadocs outputs. Review any generated changes before keeping them.

- [ ] **Step 4: Inspect dependency changes**

Run:

```bash
git diff -- package.json pnpm-lock.yaml
```

Expected: dependency versions move to latest available releases. Confirm no unrelated source files were changed by package manager side effects before continuing.

- [ ] **Step 5: Commit dependency upgrade checkpoint**

Run:

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: upgrade dependencies"
```

Expected: a commit containing only dependency metadata.

### Task 2: Add Shared Editorial Index Components

**Files:**
- Create: `src/components/editorial-index.tsx`

- [ ] **Step 1: Create the shared component module**

Create `src/components/editorial-index.tsx` with this content:

```tsx
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo";
import { cn } from "@/lib/utils";

export interface EditorialIndexMetric {
  icon?: ReactNode;
  label: ReactNode;
}

export interface EditorialIndexHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  description: ReactNode;
  eyebrow: string;
  metrics?: readonly EditorialIndexMetric[];
  title: ReactNode;
}

export interface EditorialLabel {
  label: ReactNode;
  tone?: "default" | "accent" | "danger";
}

interface EditorialIndexShellProps {
  children: ReactNode;
}

interface EditorialListProps {
  children: ReactNode;
}

interface EditorialListItemProps {
  actionLabel: string;
  description?: ReactNode;
  href: string;
  labels?: readonly EditorialLabel[];
  meta?: ReactNode;
  title: ReactNode;
}

interface EditorialEmptyStateProps {
  description: ReactNode;
  icon: ReactNode;
  title: ReactNode;
}

function getLabelClassName(tone: EditorialLabel["tone"] = "default") {
  if (tone === "accent") {
    return "text-amber-700 dark:text-amber-300";
  }

  if (tone === "danger") {
    return "text-red-700 dark:text-red-300";
  }

  return "text-zinc-700/90 dark:text-zinc-300";
}

export function EditorialIndexShell({ children }: EditorialIndexShellProps) {
  return (
    <section className="px-4 py-14 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-[48rem]">{children}</div>
    </section>
  );
}

export function EditorialIndexHeader({ breadcrumbs, description, eyebrow, metrics = [], title }: EditorialIndexHeaderProps) {
  return (
    <div className="mb-12 border-b border-zinc-200 pb-10 dark:border-white/10 sm:mb-16">
      <Breadcrumbs items={breadcrumbs} className="mb-10" />
      <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">{eyebrow}</p>
      <h1 className="text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p>

      {metrics.length > 0 ? (
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          {metrics.map((metric, index) => (
            <div key={typeof metric.label === "string" ? metric.label : `metric-${index}`} className="inline-flex items-center gap-2">
              {metric.icon ? <span className="flex h-4 w-4 items-center justify-center text-zinc-500 dark:text-zinc-400">{metric.icon}</span> : null}
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function EditorialList({ children }: EditorialListProps) {
  return <div className="space-y-8 sm:space-y-10">{children}</div>;
}

export function EditorialListItem({ actionLabel, description, href, labels = [], meta, title }: EditorialListItemProps) {
  return (
    <article className="group">
      <Link href={href} className="block rounded-lg px-4 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5">
        {labels.length > 0 ? (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
            {labels.map((item, index) => (
              <span key={typeof item.label === "string" ? item.label : `label-${index}`} className={cn("leading-5", getLabelClassName(item.tone))}>
                {item.label}
              </span>
            ))}
          </div>
        ) : null}

        <h2 className="max-w-4xl text-balance font-serif text-2xl font-semibold tracking-normal text-zinc-950 transition-colors duration-300 dark:text-zinc-100 sm:text-3xl lg:text-[2.6rem] lg:leading-[1.08]">
          {title}
        </h2>

        {description ? <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p> : null}

        {meta ? <div className="mt-6 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">{meta}</div> : null}

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition-colors duration-300 dark:text-zinc-200 sm:text-base">
          <span>{actionLabel}</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}

export function EditorialEmptyState({ description, icon, title }: EditorialEmptyStateProps) {
  return (
    <div className="py-12 text-center sm:py-16">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 dark:bg-white/5 sm:mb-6 sm:h-16 sm:w-16">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-medium text-zinc-900 dark:text-zinc-100 sm:text-lg">{title}</h3>
      <p className="px-4 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">{description}</p>
    </div>
  );
}
```

- [ ] **Step 2: Format the new component**

Run:

```bash
pnpm exec biome format --write src/components/editorial-index.tsx
```

Expected: the file formats without syntax errors.

- [ ] **Step 3: Commit shared components**

Run:

```bash
git add src/components/editorial-index.tsx
git commit -m "feat: add shared editorial index components"
```

Expected: a commit containing only the shared component module.

### Task 3: Migrate Blog Index Page

**Files:**
- Modify: `src/app/blog/page.tsx`
- Delete: `src/components/blog-list-item.tsx`

- [ ] **Step 1: Replace direct blog list rendering**

Modify `src/app/blog/page.tsx` so the imports are:

```tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CalendarIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { EditorialEmptyState, EditorialIndexHeader, EditorialIndexShell, EditorialList, EditorialListItem } from "@/components/editorial-index";
import { Footer } from "@/components/footer";
import { formatBlogDate } from "@/lib/blog";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { getBlogIndexSocialPreview, getOpenGraphImages, getTwitterImages } from "@/lib/social-preview";
import { blogSource } from "@/lib/source";
```

- [ ] **Step 2: Replace the `<section>` body in `BlogPage`**

Inside `BlogPage`, keep the `posts` sort logic unchanged and replace the returned section content with:

```tsx
        <EditorialIndexShell>
          <EditorialIndexHeader
            breadcrumbs={breadcrumbItems}
            eyebrow="Blog"
            title="Notes from the project."
            description="Product thinking, self-hosting notes, and updates from the team building Memos."
          />

          {posts.length > 0 ? (
            <EditorialList>
              {posts.map((post) => (
                <EditorialListItem
                  key={post.url}
                  href={post.url}
                  title={post.data.title}
                  description={post.data.description}
                  labels={post.data.tags?.map((tag) => ({ label: tag }))}
                  meta={
                    <>
                      <CalendarIcon className="h-4 w-4 flex-shrink-0 text-zinc-700 dark:text-zinc-200" />
                      <span className="leading-6">{formatBlogDate(post.data.published_at)}</span>
                    </>
                  }
                  actionLabel="Read article"
                />
              ))}
            </EditorialList>
          ) : (
            <EditorialEmptyState
              icon={<UserIcon className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="No blog posts yet"
              description="Check back soon for insights and updates from the Memos team."
            />
          )}
        </EditorialIndexShell>
```

- [ ] **Step 3: Remove the old blog list item component**

Run:

```bash
rg "BlogListItem"
```

Expected: only `src/components/blog-list-item.tsx` remains. Delete `src/components/blog-list-item.tsx`.

- [ ] **Step 4: Format the blog files**

Run:

```bash
pnpm exec biome format --write src/app/blog/page.tsx src/components/editorial-index.tsx
```

Expected: files format cleanly.

- [ ] **Step 5: Commit blog migration**

Run:

```bash
git add src/app/blog/page.tsx src/components/blog-list-item.tsx
git commit -m "refactor: render blog index with editorial components"
```

Expected: commit succeeds and includes the blog page migration plus deletion of the old blog list item component.

### Task 4: Migrate Changelog Index Page

**Files:**
- Modify: `src/app/changelog/page.tsx`
- Delete: `src/components/changelog-list-item.tsx`

- [ ] **Step 1: Replace direct changelog list rendering**

Modify `src/app/changelog/page.tsx` so the imports are:

```tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { EditorialEmptyState, EditorialIndexHeader, EditorialIndexShell, EditorialList, EditorialListItem } from "@/components/editorial-index";
import { Footer } from "@/components/footer";
import { formatChangelogDate, getChangelogDescription, getChangelogVersion, sortChangelogPages } from "@/lib/changelog";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { getChangelogIndexSocialPreview, getOpenGraphImages, getTwitterImages } from "@/lib/social-preview";
import { changelogSource } from "@/lib/source";
```

- [ ] **Step 2: Replace the `<section>` body in `ChangelogPage`**

Inside `ChangelogPage`, keep `entries`, `latestEntry`, and `latestVersion`. Replace the returned section content with:

```tsx
        <EditorialIndexShell>
          <EditorialIndexHeader
            breadcrumbs={breadcrumbItems}
            eyebrow="Release History"
            title="Changelog"
            description="Stay up to date with new features, improvements, and bug fixes in Memos."
            metrics={[
              {
                icon: <CalendarIcon className="h-4 w-4" />,
                label: `${entries.length} documented releases`,
              },
              ...(latestVersion ? [{ label: `Latest ${latestVersion}` }] : []),
            ]}
          />

          {entries.length > 0 ? (
            <EditorialList>
              {entries.map((entry, index) => {
                const version = getChangelogVersion(entry.data.title);

                return (
                  <EditorialListItem
                    key={entry.url}
                    href={entry.url}
                    title={version}
                    description={getChangelogDescription(version, entry.data.description)}
                    labels={[
                      ...(index === 0 ? [{ label: "Latest", tone: "accent" as const }] : []),
                      ...(entry.data.breaking ? [{ label: "Breaking", tone: "danger" as const }] : []),
                    ]}
                    meta={
                      entry.data.date ? (
                        <>
                          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-zinc-700 dark:text-zinc-200" />
                          <span className="leading-6">{formatChangelogDate(entry.data.date)}</span>
                        </>
                      ) : undefined
                    }
                    actionLabel="Read release"
                  />
                );
              })}
            </EditorialList>
          ) : (
            <EditorialEmptyState
              icon={<CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="No changelog entries yet"
              description="Check back soon for updates and new releases."
            />
          )}
        </EditorialIndexShell>
```

- [ ] **Step 3: Remove the old changelog list item component**

Run:

```bash
rg "ChangelogListItem"
```

Expected: only `src/components/changelog-list-item.tsx` remains. Delete `src/components/changelog-list-item.tsx`.

- [ ] **Step 4: Format the changelog files**

Run:

```bash
pnpm exec biome format --write src/app/changelog/page.tsx src/components/editorial-index.tsx
```

Expected: files format cleanly.

- [ ] **Step 5: Commit changelog migration**

Run:

```bash
git add src/app/changelog/page.tsx src/components/changelog-list-item.tsx
git commit -m "refactor: render changelog index with editorial components"
```

Expected: commit succeeds and includes the changelog page migration plus deletion of the old changelog list item component.

### Task 5: Resolve Upgrade Breakage and Verify

**Files:**
- Modify: only files named by `pnpm lint` or `pnpm build` diagnostics.
- Likely candidates: `source.config.ts`, `next.config.mjs`, `tsconfig.json`, `src/lib/source.ts`, `src/mdx-components.tsx`, and files under `src/app/` or `src/components/`.

- [ ] **Step 1: Run lint**

Run:

```bash
pnpm lint
```

Expected: `biome check` exits successfully. If Biome reports formatting or lint diagnostics, run `pnpm check`, inspect the resulting diff, keep only scoped changes, and rerun `pnpm lint`.

- [ ] **Step 2: Run production build**

Run:

```bash
pnpm build
```

Expected: `next build` exits successfully. If the build reports Fumadocs, TypeScript, React, or Next.js diagnostics, make the smallest edit in the named file that removes the first reported diagnostic, then rerun `pnpm build`. Repeat until the build passes.

- [ ] **Step 3: Confirm no generated files were edited directly**

Run:

```bash
git status --short
```

Expected: no changes under `.source/` unless a normal generation command produced them. The unrelated untracked cloudflare plan may still be present and must remain unstaged.

- [ ] **Step 4: Commit verification fixes**

Run:

```bash
git add package.json pnpm-lock.yaml src content next.config.mjs source.config.ts tsconfig.json
git status --short
git commit -m "fix: resolve latest dependency compatibility"
```

Expected: commit only files changed for compatibility and editorial polish. If there are no remaining changes after earlier commits, skip this commit.

### Task 6: Final Review

**Files:**
- Inspect: all files changed by this plan.

- [ ] **Step 1: Review cumulative diff**

Run:

```bash
git diff be84a52..HEAD --stat
```

Expected: diff includes dependency metadata, the shared editorial component, blog/changelog page migrations, and focused compatibility fixes.

- [ ] **Step 2: Re-run final verification**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both commands pass.

- [ ] **Step 3: Summarize final state**

Prepare a final implementation summary containing:

```markdown
- Upgraded dependencies to latest versions.
- Added shared editorial index components for blog and changelog pages.
- Migrated `/blog` and `/changelog` to matching header, list item, metadata, CTA, and empty-state patterns.
- Verification: `pnpm lint` passed; `pnpm build` passed.
```

If a dependency had to be pinned below latest, replace the first bullet with the exact package name, selected version, and reason.
