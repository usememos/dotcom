# Scratchpad Card-First Usability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Scratchpad easier to understand and use by making cards visually primary, hiding secondary chrome until useful, and improving dark-mode/menu polish.

**Architecture:** Keep the existing local-only Scratchpad architecture. Add small pure helpers for card style and transient zoom visibility so behavior can be tested without browser-only component tests, then wire those helpers into existing components.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Tailwind CSS 4, Lucide React, Node built-in test runner for scratchpad pure logic tests, Biome.

---

## File Structure

- Modify `src/features/scratchpad/lib/card-style.ts`: centralize card tone, selection, text, resize-handle, and card-surface classes.
- Create `src/features/scratchpad/lib/card-style.test.mjs`: verify card style helpers expose light/dark and selected-state classes.
- Create `src/features/scratchpad/lib/zoom-visibility.ts`: pure helper for transient zoom-control visibility.
- Create `src/features/scratchpad/lib/zoom-visibility.test.mjs`: verify zoom controls are hidden by default, shown after interaction, and hidden after timeout.
- Modify `src/features/scratchpad/components/card-item.tsx`: apply card-first selection, hover, editing, resize, and text affordances.
- Modify `src/features/scratchpad/components/scratchpad-card-body.tsx`: make edit/read placeholders clearer and dark-mode safe.
- Modify `src/features/scratchpad/components/scratchpad-attachment-grid.tsx`: quiet attachment styling and remove-button affordance.
- Modify `src/features/scratchpad/components/scratchpad-canvas-background.tsx`: neutral light/dark canvas and faint grid.
- Modify `src/features/scratchpad/components/scratchpad-empty-state.tsx`: reduce empty-state card chrome and keep action text minimal.
- Modify `src/features/scratchpad/components/scratchpad-toolbar.tsx`: flatter Notion-like menu and trigger.
- Modify `src/features/scratchpad/components/scratchpad-zoom-controls.tsx`: support visible/hidden presentation and dark mode.
- Modify `src/features/scratchpad/components/workspace.tsx`: track zoom-control reveal state from zoom, pan, hover, and focus interactions.

## Task 1: Add Tested Card Style Helpers

**Files:**
- Modify: `src/features/scratchpad/lib/card-style.ts`
- Create: `src/features/scratchpad/lib/card-style.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `src/features/scratchpad/lib/card-style.test.mjs`:

```js
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

import { createScratchpadItem } from "./item-model.ts";
import {
  CARD_TEXT_CLASS_NAME,
  getCardChromeClassNames,
  getCardResizeHandleClassNames,
  getCardRingClass,
  getCardToneClassNames,
} from "./card-style.ts";

test("card tone classes include restrained light and dark surfaces", () => {
  const item = createScratchpadItem(0, 0, 1);

  const classes = getCardToneClassNames(item);

  assert.match(classes, /bg-\[#f7f0c6\]/);
  assert.match(classes, /dark:bg-\[#343126\]/);
  assert.match(classes, /dark:text-stone-100/);
});

test("selected card ring is subtle and dark-mode aware", () => {
  assert.equal(getCardRingClass(false), "");

  const selected = getCardRingClass(true);
  assert.match(selected, /ring-1/);
  assert.match(selected, /dark:ring-stone-200\/30/);
  assert.doesNotMatch(selected, /ring-2/);
});

test("card chrome helpers keep affordances quiet until interaction", () => {
  assert.match(getCardChromeClassNames(), /rounded-\[6px\]/);
  assert.match(getCardChromeClassNames(), /shadow-\[/);
  assert.match(getCardResizeHandleClassNames(), /opacity-0/);
  assert.match(getCardResizeHandleClassNames(), /group-hover\/card:opacity-100/);
});

test("card text class stays readable without viewport-scaled type", () => {
  assert.match(CARD_TEXT_CLASS_NAME, /text-\[14px\]/);
  assert.match(CARD_TEXT_CLASS_NAME, /leading-6/);
  assert.doesNotMatch(CARD_TEXT_CLASS_NAME, /vw|vh|clamp/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/card-style.test.mjs
```

Expected: FAIL because `getCardChromeClassNames` and `getCardResizeHandleClassNames` are not exported, and current card tone/ring classes do not match the new restrained design.

- [ ] **Step 3: Implement the minimal style helpers**

Update `src/features/scratchpad/lib/card-style.ts`:

```ts
import type { ScratchpadCardTone, ScratchpadItem } from "../types";
import { getScratchpadCardTone } from "./item-model";

export const SCRATCHPAD_CARD_TONE_CLASS_NAMES: Record<ScratchpadCardTone, string> = {
  yellow: "border-[#e3d99f] bg-[#f7f0c6] text-stone-900 dark:border-[#514b36] dark:bg-[#343126] dark:text-stone-100",
  pink: "border-rose-200 bg-rose-50 text-stone-900 dark:border-rose-900/50 dark:bg-[#35282d] dark:text-rose-50",
  blue: "border-sky-200 bg-sky-50 text-stone-900 dark:border-sky-900/50 dark:bg-[#25313a] dark:text-sky-50",
  green: "border-emerald-200 bg-emerald-50 text-stone-900 dark:border-emerald-900/50 dark:bg-[#26342d] dark:text-emerald-50",
  purple: "border-violet-200 bg-violet-50 text-stone-900 dark:border-violet-900/50 dark:bg-[#302b3b] dark:text-violet-50",
};

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getCardRotation(item: ScratchpadItem): number {
  const rotationBucket = (hashString(item.id) % 5) - 2;
  return rotationBucket * 0.35;
}

export function getCardRingClass(isSelected?: boolean): string {
  if (isSelected) return "ring-1 ring-stone-900/20 shadow-[0_18px_40px_rgba(28,25,23,0.14)] dark:ring-stone-200/30";
  return "";
}

export function getCardToneClassNames(item: ScratchpadItem): string {
  return SCRATCHPAD_CARD_TONE_CLASS_NAMES[getScratchpadCardTone(item)];
}

export function getCardChromeClassNames(): string {
  return "rounded-[6px] border shadow-[0_10px_26px_rgba(28,25,23,0.08)] dark:shadow-[0_18px_44px_rgba(0,0,0,0.28)]";
}

export function getCardResizeHandleClassNames(): string {
  return "absolute bottom-0 right-0 h-8 w-8 cursor-se-resize opacity-0 transition-opacity group-hover/card:opacity-100 group-focus-within/card:opacity-100";
}

export const CARD_TEXT_CLASS_NAME = "font-sans text-[14px] leading-6 tracking-normal";
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/card-style.test.mjs
```

Expected: PASS, with only the existing Node `MODULE_TYPELESS_PACKAGE_JSON` warning if the project still emits it.

- [ ] **Step 5: Commit**

```bash
git add src/features/scratchpad/lib/card-style.ts src/features/scratchpad/lib/card-style.test.mjs
git commit -m "style(scratchpad): define card-first style tokens"
```

## Task 2: Apply Card-First Affordances

**Files:**
- Modify: `src/features/scratchpad/components/card-item.tsx`
- Modify: `src/features/scratchpad/components/scratchpad-card-body.tsx`
- Modify: `src/features/scratchpad/components/scratchpad-attachment-grid.tsx`

- [ ] **Step 1: Run the card style test before component wiring**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/card-style.test.mjs
```

Expected: PASS. This confirms the helper contract before applying it in components.

- [ ] **Step 2: Update card container and resize affordance**

In `src/features/scratchpad/components/card-item.tsx`, update the imports:

```ts
import { getCardChromeClassNames, getCardResizeHandleClassNames, getCardRingClass, getCardRotation, getCardToneClassNames } from "../lib/card-style";
```

Replace the card container `className` with:

```tsx
className={`group/card absolute flex flex-col overflow-hidden transition-[box-shadow,transform,border-color] duration-150 focus:outline-none ${getCardChromeClassNames()} ${getCardToneClassNames(item)} ${
  isEditing ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"
} ${getCardRingClass(isSelected)}`}
```

Replace the overlay gradient with:

```tsx
<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.02))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0))]" />
```

Replace the body wrapper with:

```tsx
<div className="relative flex-1 px-4 pt-3.5 pb-4">
```

Replace the resize wrapper with:

```tsx
<div
  onPointerDown={handleResizePointerDown}
  onPointerMove={handleResizePointerMove}
  onPointerUp={handleResizePointerUp}
  onPointerCancel={handleResizePointerCancel}
  className={getCardResizeHandleClassNames()}
  title="Resize"
>
  <div className="absolute bottom-2 right-2 h-3 w-3 border-r border-b border-stone-500/45 transition-colors group-hover/card:border-stone-700/70 dark:border-stone-300/35 dark:group-hover/card:border-stone-100/70" />
</div>
```

- [ ] **Step 3: Update card body placeholder and dark-mode text**

In `src/features/scratchpad/components/scratchpad-card-body.tsx`, replace the editing textarea placeholder with:

```tsx
placeholder={hasAttachments ? "Add a note..." : "Write something..."}
```

Replace the textarea `className` with:

```tsx
className={`w-full min-h-[150px] resize-none border-none bg-transparent px-0 pt-0 pb-1.5 outline-none cursor-text placeholder:text-stone-400 dark:placeholder:text-stone-500 ${textClassName} ${CARD_TEXT_CLASS_NAME}`}
```

Replace the read-only empty text expression with:

```tsx
{hasBody ? body : hasAttachments ? "Double-click to add a note" : "Double-click to write"}
```

- [ ] **Step 4: Update attachment grid chrome**

In `src/features/scratchpad/components/scratchpad-attachment-grid.tsx`, replace the attachment item container class with:

```tsx
className={`group relative overflow-hidden rounded-[5px] border border-stone-900/10 bg-white/35 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] dark:border-white/10 dark:bg-white/5 ${
  isImage ? "pb-3" : ""
}`}
```

Replace the remove button class with:

```tsx
className="absolute right-1.5 top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-900/55 text-white opacity-0 transition hover:bg-stone-900/75 group-hover:opacity-100 dark:bg-stone-100/20 dark:hover:bg-stone-100/30"
```

Replace the image class with:

```tsx
className="h-24 w-full object-cover pointer-events-none opacity-95"
```

- [ ] **Step 5: Run lint and focused tests**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/card-style.test.mjs
pnpm lint
```

Expected: card style test PASS; `pnpm lint` exits 0, allowing the existing Biome schema-version info if still present.

- [ ] **Step 6: Commit**

```bash
git add src/features/scratchpad/components/card-item.tsx src/features/scratchpad/components/scratchpad-card-body.tsx src/features/scratchpad/components/scratchpad-attachment-grid.tsx
git commit -m "style(scratchpad): make cards the primary surface"
```

## Task 3: Add Contextual Zoom Visibility

**Files:**
- Create: `src/features/scratchpad/lib/zoom-visibility.ts`
- Create: `src/features/scratchpad/lib/zoom-visibility.test.mjs`
- Modify: `src/features/scratchpad/components/scratchpad-zoom-controls.tsx`
- Modify: `src/features/scratchpad/components/workspace.tsx`

- [ ] **Step 1: Write the failing zoom visibility test**

Create `src/features/scratchpad/lib/zoom-visibility.test.mjs`:

```js
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

import { ZOOM_CONTROLS_HIDE_DELAY_MS, shouldShowZoomControls } from "./zoom-visibility.ts";

test("zoom controls are hidden before interaction", () => {
  assert.equal(shouldShowZoomControls({ hovered: false, focused: false, lastInteractionAt: null, now: 1000 }), false);
});

test("zoom controls show while hovered or focused", () => {
  assert.equal(shouldShowZoomControls({ hovered: true, focused: false, lastInteractionAt: null, now: 1000 }), true);
  assert.equal(shouldShowZoomControls({ hovered: false, focused: true, lastInteractionAt: null, now: 1000 }), true);
});

test("zoom controls show briefly after interaction", () => {
  assert.equal(
    shouldShowZoomControls({
      hovered: false,
      focused: false,
      lastInteractionAt: 1000,
      now: 1000 + ZOOM_CONTROLS_HIDE_DELAY_MS - 1,
    }),
    true,
  );

  assert.equal(
    shouldShowZoomControls({
      hovered: false,
      focused: false,
      lastInteractionAt: 1000,
      now: 1000 + ZOOM_CONTROLS_HIDE_DELAY_MS + 1,
    }),
    false,
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/zoom-visibility.test.mjs
```

Expected: FAIL because `zoom-visibility.ts` does not exist.

- [ ] **Step 3: Implement the zoom visibility helper**

Create `src/features/scratchpad/lib/zoom-visibility.ts`:

```ts
export const ZOOM_CONTROLS_HIDE_DELAY_MS = 1400;

interface ZoomControlsVisibilityInput {
  hovered: boolean;
  focused: boolean;
  lastInteractionAt: number | null;
  now: number;
}

export function shouldShowZoomControls({ hovered, focused, lastInteractionAt, now }: ZoomControlsVisibilityInput): boolean {
  if (hovered || focused) return true;
  if (lastInteractionAt === null) return false;
  return now - lastInteractionAt <= ZOOM_CONTROLS_HIDE_DELAY_MS;
}
```

- [ ] **Step 4: Run the zoom visibility test to verify it passes**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/zoom-visibility.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Add visibility props to zoom controls**

Update `src/features/scratchpad/components/scratchpad-zoom-controls.tsx` props:

```ts
interface ScratchpadZoomControlsProps {
  zoomLabel: string;
  visible: boolean;
  onVisibleInteraction: () => void;
  onHoverChange: (hovered: boolean) => void;
  onFocusChange: (focused: boolean) => void;
  onZoomOut: () => void;
  onReset: () => void;
  onZoomIn: () => void;
}
```

Update the component signature:

```ts
export function ScratchpadZoomControls({
  zoomLabel,
  visible,
  onVisibleInteraction,
  onHoverChange,
  onFocusChange,
  onZoomOut,
  onReset,
  onZoomIn,
}: ScratchpadZoomControlsProps) {
```

Replace the wrapper with:

```tsx
<div
  data-scratchpad-ui="true"
  onMouseEnter={() => onHoverChange(true)}
  onMouseLeave={() => onHoverChange(false)}
  onFocusCapture={() => onFocusChange(true)}
  onBlurCapture={() => onFocusChange(false)}
  className={`absolute right-3 bottom-3 flex items-center gap-1 rounded-md border border-stone-200/80 bg-white/88 p-1 shadow-sm transition-all duration-200 dark:border-white/10 dark:bg-stone-900/88 ${
    visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
  }`}
>
```

For each zoom button `onClick`, wrap the existing handler:

```tsx
onClick={() => {
  onVisibleInteraction();
  onZoomOut();
}}
```

Use the same pattern for reset and zoom in.

- [ ] **Step 6: Wire transient visibility in workspace**

In `src/features/scratchpad/components/workspace.tsx`, import:

```ts
import { shouldShowZoomControls } from "@/features/scratchpad/lib/zoom-visibility";
```

Add state near other workspace state:

```ts
const [zoomControlsHovered, setZoomControlsHovered] = useState(false);
const [zoomControlsFocused, setZoomControlsFocused] = useState(false);
const [lastZoomInteractionAt, setLastZoomInteractionAt] = useState<number | null>(null);
const [zoomVisibilityClock, setZoomVisibilityClock] = useState(Date.now());
```

Add helper inside the component:

```ts
const revealZoomControls = () => {
  const now = Date.now();
  setLastZoomInteractionAt(now);
  setZoomVisibilityClock(now);
};
```

Add effect:

```ts
useEffect(() => {
  if (lastZoomInteractionAt === null || zoomControlsHovered || zoomControlsFocused) return;

  const timeoutId = window.setTimeout(() => {
    setZoomVisibilityClock(Date.now());
  }, 1450);

  return () => window.clearTimeout(timeoutId);
}, [lastZoomInteractionAt, zoomControlsFocused, zoomControlsHovered]);
```

Call `revealZoomControls()` after these interactions:

```ts
const zoomFromViewportCenter = (factor: number) => {
  if (!workspaceRef.current) return;

  revealZoomControls();
  const rect = workspaceRef.current.getBoundingClientRect();
  updateViewport((current) => zoomScratchpadViewportFromCenter(current, rect, factor));
};
```

Inside `applyZoomFactorAtPoint`, before `updateViewport(...)`:

```ts
revealZoomControls();
```

Inside `handleWorkspacePointerMove`, when panning has started and before `updateViewport(...)`:

```ts
revealZoomControls();
```

Inside non-zoom wheel pan path before `updateViewport(...)`:

```ts
revealZoomControls();
```

Before the return, compute:

```ts
const zoomControlsVisible = shouldShowZoomControls({
  hovered: zoomControlsHovered,
  focused: zoomControlsFocused,
  lastInteractionAt: lastZoomInteractionAt,
  now: zoomVisibilityClock,
});
```

Pass the new props:

```tsx
<ScratchpadZoomControls
  zoomLabel={zoomLabel}
  visible={zoomControlsVisible}
  onVisibleInteraction={revealZoomControls}
  onHoverChange={setZoomControlsHovered}
  onFocusChange={setZoomControlsFocused}
  onZoomOut={() => zoomFromViewportCenter(1 / 1.15)}
  onReset={() => {
    revealZoomControls();
    updateViewport(DEFAULT_SCRATCHPAD_VIEWPORT);
  }}
  onZoomIn={() => zoomFromViewportCenter(1.15)}
/>
```

- [ ] **Step 7: Run focused tests and lint**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/zoom-visibility.test.mjs
pnpm lint
```

Expected: zoom visibility test PASS; lint exits 0, allowing the existing Biome schema-version info if still present.

- [ ] **Step 8: Commit**

```bash
git add src/features/scratchpad/lib/zoom-visibility.ts src/features/scratchpad/lib/zoom-visibility.test.mjs src/features/scratchpad/components/scratchpad-zoom-controls.tsx src/features/scratchpad/components/workspace.tsx
git commit -m "feat(scratchpad): reveal zoom controls contextually"
```

## Task 4: Simplify Canvas, Empty State, And Menu

**Files:**
- Modify: `src/features/scratchpad/components/scratchpad-canvas-background.tsx`
- Modify: `src/features/scratchpad/components/scratchpad-empty-state.tsx`
- Modify: `src/features/scratchpad/components/scratchpad-toolbar.tsx`

- [ ] **Step 1: Update canvas background**

In `src/features/scratchpad/components/scratchpad-canvas-background.tsx`, replace `backgroundImage` with:

```ts
backgroundImage:
  "linear-gradient(to right, rgba(82,82,82,0.055) 1px, transparent 1px), " +
  "linear-gradient(to bottom, rgba(82,82,82,0.055) 1px, transparent 1px), " +
  "linear-gradient(to right, rgba(82,82,82,0.075) 1px, transparent 1px), " +
  "linear-gradient(to bottom, rgba(82,82,82,0.075) 1px, transparent 1px)",
```

Replace the rendered div class:

```tsx
className="pointer-events-none absolute inset-0 bg-stone-100 dark:bg-[#191919]"
```

- [ ] **Step 2: Simplify empty state**

In `src/features/scratchpad/components/scratchpad-empty-state.tsx`, replace the component return with:

```tsx
return (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
    <div className="text-center">
      <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Double-click anywhere to write</p>
      <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">Paste or drop files to collect them here.</p>
    </div>
  </div>
);
```

- [ ] **Step 3: Simplify top-right menu trigger and content**

In `src/features/scratchpad/components/scratchpad-toolbar.tsx`, replace the selected-actions wrapper class with:

```tsx
className="flex items-center gap-1.5 rounded-md border border-stone-200/80 bg-white/88 px-2 py-1 shadow-sm dark:border-white/10 dark:bg-stone-900/88"
```

Replace selected count text class:

```tsx
className="text-[11px] font-medium text-stone-500 dark:text-stone-400"
```

Replace delete button class:

```tsx
className="rounded-md p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-red-500 dark:hover:bg-white/10"
```

Replace menu trigger class:

```tsx
className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-200/80 bg-white/88 text-stone-500 shadow-sm transition hover:bg-white hover:text-stone-900 dark:border-white/10 dark:bg-stone-900/88 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
```

Replace menu content class:

```tsx
className="z-50 min-w-[188px] rounded-lg border border-stone-200 bg-white p-1 shadow-lg shadow-stone-900/8 dark:border-white/10 dark:bg-stone-900 dark:shadow-black/30"
```

Replace menu item classes with:

```tsx
className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-stone-600 outline-none hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/10"
```

Replace separator class:

```tsx
className="my-1 h-px bg-stone-200 dark:bg-white/10"
```

Apply the same neutral menu item class to theme subtrigger, theme items, and Back to Main Site. Replace subcontent class with:

```tsx
className="z-50 min-w-[144px] rounded-lg border border-stone-200 bg-white p-1 shadow-lg shadow-stone-900/8 dark:border-white/10 dark:bg-stone-900 dark:shadow-black/30"
```

- [ ] **Step 4: Run lint**

Run:

```bash
pnpm lint
```

Expected: exits 0, allowing the existing Biome schema-version info if still present.

- [ ] **Step 5: Commit**

```bash
git add src/features/scratchpad/components/scratchpad-canvas-background.tsx src/features/scratchpad/components/scratchpad-empty-state.tsx src/features/scratchpad/components/scratchpad-toolbar.tsx
git commit -m "style(scratchpad): simplify canvas and utility menu"
```

## Task 5: Browser Verification And Final Build

**Files:**
- No source edits expected unless verification reveals a defect.

- [ ] **Step 1: Run all scratchpad pure tests**

Run:

```bash
node --experimental-strip-types src/features/scratchpad/lib/item-model.test.mjs
node --experimental-strip-types src/features/scratchpad/lib/editor.test.mjs
node --experimental-strip-types src/features/scratchpad/lib/storage.test.mjs
node --experimental-strip-types src/features/scratchpad/lib/card-style.test.mjs
node --experimental-strip-types src/features/scratchpad/lib/zoom-visibility.test.mjs
```

Expected: all PASS, with only the existing Node `MODULE_TYPELESS_PACKAGE_JSON` warning if it still appears.

- [ ] **Step 2: Run project checks**

Run:

```bash
pnpm lint
pnpm build
```

Expected: both exit 0. `pnpm lint` may print the existing Biome schema-version info. `pnpm build` may print the existing Next middleware deprecation warning.

- [ ] **Step 3: Start local dev server**

Run:

```bash
pnpm dev
```

Expected: server reports a local URL. If port 3000 is occupied, run:

```bash
pnpm exec next dev --turbo -p 3001
```

- [ ] **Step 4: Verify scratchpad in browser**

Open `/scratchpad` in the in-app browser and verify:

- Default view shows cards as the dominant objects.
- Empty state is minimal if local storage is empty.
- Top-right menu is compact and neutral.
- Zoom controls are not visible by default.
- Zoom controls appear after wheel zoom, trackpad/pinch zoom, pan, hover/focus near the controls, and zoom button use.
- Zoom controls hide after the configured delay when not hovered or focused.
- Light mode and dark mode have readable cards, menu, canvas, zoom controls, and selection states.
- Creating a card by double-clicking still focuses the empty card.
- Editing, selecting, dragging, resizing, deleting, pasting files, dropping files, and removing attachments still work.

- [ ] **Step 5: Fix defects found during browser verification**

If verification finds a defect, make the smallest source change in the relevant component, then repeat:

```bash
pnpm lint
```

If the defect affects pure helper behavior, add or update the focused `.test.mjs` file first, run it to watch it fail, then implement the fix and re-run it.

- [ ] **Step 6: Final commit**

If browser verification required source changes:

```bash
git add src/features/scratchpad
git commit -m "fix(scratchpad): polish card-first usability details"
```

If no browser-verification source changes were needed, do not create an empty commit.
