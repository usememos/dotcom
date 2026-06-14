# Design: Vitest TDD Test Suite for Dashboard & Scratchpad

**Date:** 2026-06-14
**Status:** Approved (design phase)

## Goal

Add comprehensive Vitest tests across every dashboard- and scratchpad-related
file — libs, storage, hooks, components, and pages — using strict
test-driven development. Where existing code buries logic in event handlers or
is otherwise untestable, extract that logic into pure functions
(red-green-refactor) and test the result, rather than testing the tangled code
as-is.

## Decisions

These were settled during brainstorming and drive the whole design:

1. **TDD style:** Strict TDD via refactor. For each unit, write a failing test
   for the *intended* behavior first; if the existing implementation is wrong,
   unclear, or untestable, fix or refactor it to pass. Behavior may change where
   the current behavior is a genuine bug.
2. **Breadth:** Everything, all layers — pure libs, storage, hooks, components,
   and page/layout entry files.
3. **Definition of done:** Comprehensive behavioral coverage — every in-scope
   file has a co-located test exercising its meaningful branches and edge cases.
   **No** enforced numeric coverage threshold and **no** coverage tooling.
4. **IndexedDB:** Add the `fake-indexeddb` devDependency and test the real
   storage code against it (honest CRUD/transaction/index semantics).
5. **Refactor appetite:** Aggressive — extract imperative logic from the large
   components (`workspace.tsx`, `card-item.tsx`) into pure lib functions, TDD
   those functions, then cover the thinner component shell with RTL.

## Existing State

- Vitest is configured: jsdom environment, React plugin, RTL +
  `@testing-library/jest-dom` + user-event, `@` path alias. Config in
  `vitest.config.ts`; global cleanup in `vitest.setup.ts`. `pnpm test` runs
  `vitest run`.
- Only three test files exist, all establishing the project's conventions:
  - `src/features/dashboard/components/connect-prompt.test.tsx`
  - `src/features/dashboard/components/connect-onboarding.test.tsx`
  - `src/features/memos/components/memos-connection-form.test.tsx`
- Established conventions to follow: co-located `*.test.tsx` files; explicit
  imports (Vitest globals are **off**); module mocks via `vi.mock(...)` declared
  before importing the unit under test; RTL `render`/`screen` + `userEvent`;
  `beforeEach(() => vi.clearAllMocks())`.

## Approach

Bottom-up by layer. Build shared test infrastructure first, then work up the
stack: pure libs → storage → hooks → components (with extractions) → pages.
Strict TDD needs a test-backed lib substrate before component logic is extracted
into it; the extraction work from the large components produces new pure
functions that land in an already-tested lib layer.

`pnpm test` must be green before moving from one layer to the next.

## Test Infrastructure

A one-time setup task, completed before writing feature tests.

- Add `fake-indexeddb` to `devDependencies`.
- Extend `vitest.setup.ts`:
  - Register `fake-indexeddb/auto` and reset the database between tests so
    storage tests are isolated.
  - Polyfill jsdom gaps used by scratchpad code: `window.matchMedia`,
    `ResizeObserver`, `URL.createObjectURL` / `URL.revokeObjectURL`, and
    `Element.prototype.setPointerCapture` / `releasePointerCapture` /
    `hasPointerCapture`.
  - Provide a reusable helper for stubbing `getBoundingClientRect` in
    layout-dependent tests (jsdom returns zeros by default).
- Deterministic helpers for code using `Date.now()` / `Math.random()` (e.g.
  `createFileData`): drive via `vi.useFakeTimers()` and a `Math.random` spy.
- `window.confirm` is stubbed per-test where used (e.g. `use-scratchpad`).
- Tests remain co-located as `*.test.ts` / `*.test.tsx` next to their sources.

## Coverage Map

Every file below gets a co-located test. Items marked **(extract)** require
refactoring imperative logic into pure functions first.

### Dashboard

**Libs (pure unit tests)**
- `lib/stats.ts` — `classifyStatsFailure`, `connectedHeaderLabel`,
  `describeStatsError`, and siblings, across each failure reason and input shape.
- `lib/heatmap.ts` — day/cell mapping and bucketing.
- `lib/sample-stats.ts` — shape and stable sample values.
- `lib/stats-cache.ts` — `read`/`write`/`clear` against localStorage, including
  malformed JSON, schema-validation failures, missing storage, and quota/throw
  branches (all best-effort no-ops).

**Components (RTL)**
- `components/stat-tiles.tsx` — renders tiles from stats.
- `components/dashboard-header.tsx` — user, secondary label, manage-connection
  action.
- `components/activity-heatmap.tsx` — renders cells from `days`.
- `components/dashboard.tsx` — RTL with mocked Clerk config, account actions,
  memos connection, `getMemosStats`, and stats-cache. Covers every state: `ok`,
  `signed-out`, `not-connected`, `error`, `failed`, loading skeleton, and
  `notFound()` when Clerk is unconfigured; plus cache-hydration on mount and
  reload-on-settings-change.
- `components/connect-prompt.tsx`, `components/connect-onboarding.tsx` — already
  covered; extend only to fill gaps, do not rewrite.

**Page**
- `src/app/(app)/dashboard/page.tsx` — renders `<Dashboard/>`; exported
  `metadata` and `dynamic` are correct.

### Scratchpad

**Pure libs (unit tests)**
- `lib/item-positioning.ts`, `lib/item-model.ts`, `lib/viewport.ts`,
  `lib/zoom-visibility.ts`, `lib/card-style.ts`, `lib/context-menu-position.ts`,
  `lib/dom-targets.ts`, `lib/attachment-preview.ts`, `lib/interactions.ts`,
  `lib/editor.ts`.
- `types.ts` — only if it carries runtime guards/helpers worth testing.

**Storage**
- `lib/indexeddb.ts` — `saveFile`/`getFile`/`getAllFiles`/`deleteFile`/
  `clearAllFiles` round-trips, `getTotalFileSize`, `deleteOldFiles` (age
  threshold), and `createFileData` (deterministic id/shape) against
  fake-indexeddb. Includes the `window === undefined` / open-error branches.
- `lib/storage.ts` — localStorage ↔ IndexedDB interplay, serialization, and
  error handling.

**Hooks (`renderHook`)**
- `hooks/use-scratchpad-editor.ts` — item CRUD, selection, layout/body updates,
  viewport, `isClient` gating, with storage/indexeddb mocked.
- `hooks/use-scratchpad.ts` — delegation to the editor and the
  `confirm`-gated `handleDeleteSelected` (count message, cancel path, empty
  selection no-op).
- `hooks/use-attachment-previews.ts` — `createObjectURL` preview generation and
  `revokeObjectURL` cleanup on unmount/change.

**Components (RTL)**
- `components/workspace.tsx` **(extract)** — pull pointer-pan, wheel-zoom,
  marquee-selection, and drag-move math into pure lib functions (consolidating
  with `interactions.ts`/`viewport.ts`); TDD those, then RTL-test the shell.
- `components/card-item.tsx` **(extract)** — pull resize/drag and edit-commit
  logic into pure functions; TDD those, then RTL-test the shell.
- `components/scratchpad-toolbar.tsx`, `scratchpad-zoom-controls.tsx`,
  `scratchpad-attachment-grid.tsx`, `scratchpad-attachment-viewer.tsx`,
  `scratchpad-account-menu-section.tsx`, `scratchpad-empty-state.tsx`,
  `scratchpad-drop-overlay.tsx`, `scratchpad-canvas-background.tsx`,
  `scratchpad-card-body.tsx`, `scratchpad-viewport-lock.tsx` — RTL render and
  interaction tests scaled to each component's behavior.

**Pages**
- `src/app/(tools)/scratchpad/page.tsx` — `useScratchpad` mocked; `isClient`
  gating (renders `null` then the workspace) and prop wiring to `Workspace`.
- `src/app/(tools)/scratchpad/layout.tsx` — exported `metadata`/`dynamic`;
  renders `ScratchpadViewportLock` and children.

### Marketing

- `src/features/marketing/components/home-scratchpad-section.tsx` — RTL: renders
  the four feature strings, the "Type. Save. Done." heading, and a "Launch
  Scratchpad" link pointing to `/scratchpad`.

## Refactor / Extraction Targets

The two large components carry imperative logic that strict TDD requires we
extract before testing:

- **`workspace.tsx` (492 lines):** extract pointer-pan, wheel-zoom,
  marquee-selection, and drag-move math into pure lib functions. Prefer
  consolidating into the existing `lib/interactions.ts` and `lib/viewport.ts`
  rather than creating parallel modules.
- **`card-item.tsx` (500 lines):** extract resize/drag geometry and
  edit-commit logic into pure functions.

Each extraction follows red-green-refactor: write the failing lib test for the
intended behavior, implement/extract the function, then have the component
consume it. Extractions must not change user-visible behavior except where they
fix a genuine bug (call those out explicitly during implementation).

## Out of Scope (YAGNI)

- No coverage threshold, no coverage tooling, no CI gate.
- No Playwright / end-to-end / visual-regression tests.
- No rewrite of the three already-passing test files (gap-fill only).
- No new feature behavior; refactors are test-enabling and behavior-preserving
  except for explicitly-flagged bug fixes.

## Verification

- `pnpm test` green after each layer and at completion.
- `pnpm lint` and `pnpm build` pass at completion (project standard
  verification), since extractions touch implementation files.
