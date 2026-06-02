# Scratchpad Polish Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor scratchpad around grouped item/document types and smaller UI components while applying restrained sticky-board polish.

**Architecture:** Introduce a normalized scratchpad document model with grouped item fields, migrate legacy flat items at the storage boundary, then update editor commands and UI consumers to use the new shape. Split large card and workspace render paths into focused presentational components while keeping pointer interaction logic in `CardItem` and `Workspace`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Tailwind CSS 4, Lucide React, Biome, Node `node:test`.

---

## File Structure

- Modify `src/features/scratchpad/types.ts`: define grouped item/document/editor patch types.
- Create `src/features/scratchpad/lib/item-model.ts`: item factories, legacy normalization, grouped item helpers, and tone selection.
- Create `src/features/scratchpad/lib/item-model.test.mjs`: migration and hydration regression tests.
- Modify `src/features/scratchpad/lib/editor.ts`: move item creation/patching to grouped item model and document state.
- Create `src/features/scratchpad/lib/editor.test.mjs`: reducer operation tests for grouped item structure.
- Modify `src/features/scratchpad/lib/storage.ts`: persist `ScratchpadDocument` envelope version 3 and migrate legacy version 2/array payloads.
- Modify `src/features/scratchpad/hooks/use-scratchpad-editor.ts`: replace flat item reads/writes with grouped helper accessors and typed patches.
- Modify `src/features/scratchpad/hooks/use-attachment-previews.ts`: accept grouped item attachment refs.
- Modify `src/features/scratchpad/hooks/use-scratchpad.ts`: update sync patches and save reads for grouped items.
- Modify `src/features/scratchpad/lib/api.ts`: read body and attachments from grouped item content.
- Modify `src/features/scratchpad/lib/card-style.ts`: replace one-off sticky colors with reusable tone tokens.
- Modify `src/features/scratchpad/components/card-item.tsx`: compose new card subcomponents while keeping drag/resize logic local.
- Create `src/features/scratchpad/components/scratchpad-card-body.tsx`: note body read/edit rendering.
- Create `src/features/scratchpad/components/scratchpad-attachment-grid.tsx`: attachment preview grid and remove controls.
- Create `src/features/scratchpad/components/scratchpad-sync-badge.tsx`: sync status indicators.
- Modify `src/features/scratchpad/components/workspace.tsx`: extract canvas background, empty state, drop overlay, and zoom controls.
- Create `src/features/scratchpad/components/scratchpad-canvas-background.tsx`: board background/grid styles.
- Create `src/features/scratchpad/components/scratchpad-empty-state.tsx`: empty board prompt.
- Create `src/features/scratchpad/components/scratchpad-drop-overlay.tsx`: file drop overlay.
- Create `src/features/scratchpad/components/scratchpad-zoom-controls.tsx`: zoom controls.

## Task 1: Grouped Item Model And Migration Helpers

**Files:**
- Modify: `src/features/scratchpad/types.ts`
- Create: `src/features/scratchpad/lib/item-model.ts`
- Create: `src/features/scratchpad/lib/item-model.test.mjs`

- [ ] **Step 1: Write the failing migration tests**

Create `src/features/scratchpad/lib/item-model.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { createScratchpadItem, normalizeScratchpadItem, normalizeScratchpadItems } from "./item-model.ts";

test("normalizes legacy flat scratchpad items into grouped items", () => {
  const createdAt = "2026-01-01T00:00:00.000Z";
  const updatedAt = "2026-01-02T00:00:00.000Z";

  const [item] = normalizeScratchpadItems([
    {
      id: "item-1",
      x: 12,
      y: 24,
      width: 280,
      height: 180,
      zIndex: 3,
      body: "hello",
      attachments: [{ id: "file-1", name: "a.png", type: "image/png", size: 123 }],
      createdAt,
      updatedAt,
      sync: { status: "synced", instanceId: "instance-1", memoRef: { resourceName: "memos/1" } },
    },
  ]);

  assert.deepEqual(item.layout, { x: 12, y: 24, width: 280, height: 180, zIndex: 3 });
  assert.deepEqual(item.content, {
    body: "hello",
    attachments: [{ id: "file-1", name: "a.png", type: "image/png", size: 123 }],
  });
  assert.equal(item.sync.status, "synced");
  assert.equal(item.sync.memoRef?.resourceName, "memos/1");
  assert.ok(item.timestamps.createdAt instanceof Date);
  assert.ok(item.timestamps.updatedAt instanceof Date);
});

test("normalizes grouped scratchpad items without changing their data", () => {
  const createdAt = new Date("2026-01-01T00:00:00.000Z");
  const updatedAt = new Date("2026-01-02T00:00:00.000Z");

  const item = normalizeScratchpadItem({
    id: "item-2",
    layout: { x: 8, y: 9, width: 320, height: 240, zIndex: 2 },
    content: { body: "grouped", attachments: [] },
    sync: { status: "local" },
    timestamps: { createdAt, updatedAt },
  });

  assert.deepEqual(item.layout, { x: 8, y: 9, width: 320, height: 240, zIndex: 2 });
  assert.equal(item.content.body, "grouped");
  assert.equal(item.timestamps.createdAt, createdAt);
  assert.equal(item.timestamps.updatedAt, updatedAt);
});

test("creates grouped scratchpad items with default content and timestamps", () => {
  const item = createScratchpadItem(10, 20, 5);

  assert.equal(item.layout.x, 10);
  assert.equal(item.layout.y, 20);
  assert.equal(item.layout.zIndex, 5);
  assert.equal(item.content.body, "");
  assert.deepEqual(item.content.attachments, []);
  assert.equal(item.sync.status, "local");
  assert.ok(item.timestamps.createdAt instanceof Date);
});
```

- [ ] **Step 2: Run the migration tests and verify they fail**

Run:

```bash
node --test src/features/scratchpad/lib/item-model.test.mjs
```

Expected: FAIL with an import error because `src/features/scratchpad/lib/item-model.ts` does not exist.

- [ ] **Step 3: Update scratchpad type definitions**

In `src/features/scratchpad/types.ts`, replace the flat `ScratchpadItem` fields with grouped types and add document/patch/tone types:

```ts
export interface ScratchpadItemLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface ScratchpadItemContent {
  body: string;
  attachments: ScratchpadAttachmentRef[];
}

export interface ScratchpadItemTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export type ScratchpadCardTone = "yellow" | "pink" | "blue" | "green" | "purple";

export interface ScratchpadItem {
  id: string;
  layout: ScratchpadItemLayout;
  content: ScratchpadItemContent;
  sync: ScratchpadSyncState;
  timestamps: ScratchpadItemTimestamps;
  tone?: ScratchpadCardTone;
}

export interface ScratchpadDocument {
  items: ScratchpadItem[];
}

export interface ScratchpadItemPatch {
  layout?: Partial<ScratchpadItemLayout>;
  content?: Partial<ScratchpadItemContent>;
  sync?: Partial<ScratchpadSyncState>;
  timestamps?: Partial<ScratchpadItemTimestamps>;
  tone?: ScratchpadCardTone;
}
```

- [ ] **Step 4: Implement item model helpers**

Create `src/features/scratchpad/lib/item-model.ts`:

```ts
import type {
  ScratchpadAttachmentRef,
  ScratchpadCardTone,
  ScratchpadItem,
  ScratchpadItemPatch,
  ScratchpadSyncState,
} from "../types";

const CARD_TONES: ScratchpadCardTone[] = ["yellow", "pink", "blue", "green", "purple"];

interface LegacyScratchpadItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  body?: string;
  attachments?: ScratchpadAttachmentRef[];
  createdAt: string | Date;
  updatedAt?: string | Date;
  sync?: ScratchpadSyncState;
}

type StoredScratchpadItem = ScratchpadItem | LegacyScratchpadItem;

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function normalizeDate(value: string | Date | undefined, fallback: Date = new Date()): Date {
  if (!value) return fallback;
  return value instanceof Date ? value : new Date(value);
}

function createSyncState(overrides: Partial<ScratchpadSyncState> = {}): ScratchpadSyncState {
  return {
    status: "local",
    ...overrides,
  };
}

export function getScratchpadCardTone(item: Pick<ScratchpadItem, "id" | "tone">): ScratchpadCardTone {
  return item.tone ?? CARD_TONES[hashString(item.id) % CARD_TONES.length];
}

export function createScratchpadItem(
  x: number,
  y: number,
  zIndex: number,
  attachments: ScratchpadAttachmentRef[] = [],
): ScratchpadItem {
  const now = new Date();

  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    layout: {
      x,
      y,
      width: attachments.length > 0 ? 320 : 280,
      height: attachments.length > 0 ? 300 : 180,
      zIndex,
    },
    content: {
      body: "",
      attachments,
    },
    sync: createSyncState(),
    timestamps: {
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function normalizeScratchpadItem(item: StoredScratchpadItem, index: number = 0): ScratchpadItem {
  if ("layout" in item && "content" in item && "timestamps" in item) {
    return {
      ...item,
      layout: {
        ...item.layout,
        zIndex: item.layout.zIndex ?? index + 1,
      },
      content: {
        body: item.content.body ?? "",
        attachments: item.content.attachments ?? [],
      },
      sync: createSyncState(item.sync),
      timestamps: {
        createdAt: normalizeDate(item.timestamps.createdAt),
        updatedAt: normalizeDate(item.timestamps.updatedAt, normalizeDate(item.timestamps.createdAt)),
      },
    };
  }

  const createdAt = normalizeDate(item.createdAt);

  return {
    id: item.id,
    layout: {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      zIndex: item.zIndex ?? index + 1,
    },
    content: {
      body: item.body ?? "",
      attachments: item.attachments ?? [],
    },
    sync: createSyncState(item.sync),
    timestamps: {
      createdAt,
      updatedAt: normalizeDate(item.updatedAt, createdAt),
    },
  };
}

export function normalizeScratchpadItems(items: StoredScratchpadItem[]): ScratchpadItem[] {
  return items.map((item, index) => normalizeScratchpadItem(item, index));
}

export function patchScratchpadItem(item: ScratchpadItem, patch: ScratchpadItemPatch): ScratchpadItem {
  return {
    ...item,
    layout: patch.layout ? { ...item.layout, ...patch.layout } : item.layout,
    content: patch.content ? { ...item.content, ...patch.content } : item.content,
    sync: patch.sync ? { ...item.sync, ...patch.sync } : item.sync,
    timestamps: patch.timestamps ? { ...item.timestamps, ...patch.timestamps } : item.timestamps,
    tone: patch.tone ?? item.tone,
  };
}
```

- [ ] **Step 5: Run the migration tests and verify they pass**

Run:

```bash
node --test src/features/scratchpad/lib/item-model.test.mjs
```

Expected: PASS with 3 tests.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add src/features/scratchpad/types.ts src/features/scratchpad/lib/item-model.ts src/features/scratchpad/lib/item-model.test.mjs
git commit -m "refactor(scratchpad): group item model fields"
```

## Task 2: Document Storage And Reducer Updates

**Files:**
- Modify: `src/features/scratchpad/lib/editor.ts`
- Modify: `src/features/scratchpad/lib/storage.ts`
- Create: `src/features/scratchpad/lib/editor.test.mjs`

- [ ] **Step 1: Write failing reducer tests**

Create `src/features/scratchpad/lib/editor.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  createScratchpadEditorState,
  getSelectedScratchpadItems,
  scratchpadEditorReducer,
} from "./editor.ts";
import { createScratchpadItem } from "./item-model.ts";
import { DEFAULT_SCRATCHPAD_VIEWPORT } from "./viewport.ts";

test("editor reducer stores items under document", () => {
  const item = createScratchpadItem(10, 20, 1);
  const state = scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "run-transaction",
    id: 1,
    reason: "item.create",
    persistence: "immediate",
    operations: [{ type: "add-item", item }],
  });

  assert.equal(state.document.items.length, 1);
  assert.equal(state.document.items[0].layout.x, 10);
  assert.equal(state.viewport, DEFAULT_SCRATCHPAD_VIEWPORT);
});

test("editor reducer patches layout, content, and sync independently", () => {
  const item = createScratchpadItem(10, 20, 1);
  const withItem = scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "run-transaction",
    id: 1,
    reason: "item.create",
    persistence: "immediate",
    operations: [{ type: "add-item", item }],
  });

  const state = scratchpadEditorReducer(withItem, {
    type: "run-transaction",
    id: 2,
    reason: "item.patch",
    persistence: "immediate",
    operations: [
      {
        type: "patch-item",
        id: item.id,
        patch: {
          layout: { x: 30 },
          content: { body: "updated" },
          sync: { status: "dirty" },
        },
      },
    ],
  });

  assert.equal(state.document.items[0].layout.x, 30);
  assert.equal(state.document.items[0].layout.y, 20);
  assert.equal(state.document.items[0].content.body, "updated");
  assert.equal(state.document.items[0].sync.status, "dirty");
});

test("selected item selector reads from document state", () => {
  const item = createScratchpadItem(10, 20, 1);
  const selected = scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "run-transaction",
    id: 1,
    reason: "item.create-select",
    persistence: "immediate",
    operations: [
      { type: "add-item", item },
      { type: "select-item", id: item.id, additive: false },
    ],
  });

  assert.deepEqual(
    getSelectedScratchpadItems({
      document: selected.document,
      selectedItemIds: selected.selectedItemIds,
    }).map((candidate) => candidate.id),
    [item.id],
  );
});
```

- [ ] **Step 2: Run reducer tests and verify they fail**

Run:

```bash
node --test src/features/scratchpad/lib/editor.test.mjs
```

Expected: FAIL because `ScratchpadEditorState` does not yet expose `document`.

- [ ] **Step 3: Update editor reducer state and operations**

In `src/features/scratchpad/lib/editor.ts`:

- import `ScratchpadDocument` and `ScratchpadItemPatch`
- import `createScratchpadItem`, `normalizeScratchpadItems`, and `patchScratchpadItem` from `./item-model`
- remove the local `createSyncState`, `createScratchpadItem`, and `normalizeScratchpadItems` implementations
- change state shape to:

```ts
export interface ScratchpadEditorState {
  document: ScratchpadDocument;
  selectedItemIds: string[];
  viewport: ScratchpadViewport;
  lastTransaction: ScratchpadEditorTransaction | null;
}
```

- change `ScratchpadEditorOperation` patch type to:

```ts
| { type: "patch-item"; id: string; patch: ScratchpadItemPatch }
```

- update item selectors:

```ts
export function getNextScratchpadZIndex(items: ScratchpadItem[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.layout.zIndex || 0)) + 1;
}

export function getSelectedScratchpadItems(state: Pick<ScratchpadEditorState, "document" | "selectedItemIds">): ScratchpadItem[] {
  return state.document.items.filter((item) => state.selectedItemIds.includes(item.id));
}
```

- update reducer item operations to read and write `state.document.items`
- use `patchScratchpadItem(item, operation.patch)` for `patch-item`
- set hydrate state to:

```ts
document: {
  items: normalizeScratchpadItems(action.items),
},
```

- export `createScratchpadItem` from `editor.ts` for existing imports:

```ts
export { createScratchpadItem } from "./item-model";
```

- [ ] **Step 4: Update storage to persist `ScratchpadDocument`**

In `src/features/scratchpad/lib/storage.ts`:

- change `ITEM_STORAGE_VERSION` from `2` to `3`
- import `ScratchpadDocument`
- import `normalizeScratchpadItems`
- replace `ScratchpadItemEnvelope` with:

```ts
interface ScratchpadDocumentEnvelope {
  version: number;
  document: ScratchpadDocument;
}
```

- update `parseStoredItems` so:
  - legacy arrays return `{ document: { items: migratedItems }, migrated: true }`
  - version 2 payloads with `items` return grouped normalized items and `migrated: true`
  - version 3 payloads with `document.items` return normalized grouped items and `migrated: false`
- keep `itemStorage.getAll()` returning `ScratchpadItem[]` for now so hook changes stay smaller
- update `itemStorage.save(items)` to write:

```ts
const payload: ScratchpadDocumentEnvelope = {
  version: ITEM_STORAGE_VERSION,
  document: { items },
};
```

- [ ] **Step 5: Run reducer and migration tests**

Run:

```bash
node --test src/features/scratchpad/lib/item-model.test.mjs src/features/scratchpad/lib/editor.test.mjs
```

Expected: PASS for all item model and editor tests.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add src/features/scratchpad/lib/editor.ts src/features/scratchpad/lib/storage.ts src/features/scratchpad/lib/editor.test.mjs
git commit -m "refactor(scratchpad): persist grouped document state"
```

## Task 3: Update Hooks And API Consumers

**Files:**
- Modify: `src/features/scratchpad/hooks/use-scratchpad-editor.ts`
- Modify: `src/features/scratchpad/hooks/use-attachment-previews.ts`
- Modify: `src/features/scratchpad/hooks/use-scratchpad.ts`
- Modify: `src/features/scratchpad/lib/api.ts`
- Modify: `src/features/scratchpad/lib/card-style.ts`

- [ ] **Step 1: Run TypeScript and capture grouped-type failures**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: FAIL with references to flat fields such as `item.x`, `item.body`, `item.attachments`, `item.createdAt`, `item.width`, and `Partial<ScratchpadItem>`.

- [ ] **Step 2: Update editor hook reads and patches**

In `src/features/scratchpad/hooks/use-scratchpad-editor.ts`:

- change `state.items` reads to `state.document.items`
- change `stateRef.current.items` reads to `stateRef.current.document.items`
- change layout reads/writes from `item.x` to `item.layout.x`, `item.width` to `item.layout.width`, and so on
- change body edits to:

```ts
patchItem(
  id,
  {
    content: { body },
    timestamps: { updatedAt: new Date() },
    sync: markScratchpadItemDirty(item.sync),
  },
  "debounced",
  "item.body",
);
```

- change attachment removal to patch `content.attachments`
- change file attachment to append to `targetItem.content.attachments`
- update `patchItem` signature:

```ts
const patchItem = (
  id: string,
  patch: ScratchpadItemPatch,
  persistence: ScratchpadTransactionPersistence = "debounced",
  reason: string = "item.patch",
) => {
  runTransaction(reason, [{ type: "patch-item", id, patch }], persistence);
};
```

- return `items: state.document.items`

- [ ] **Step 3: Update attachment preview hook type**

In `src/features/scratchpad/hooks/use-attachment-previews.ts`:

- change the import from:

```ts
import type { FileData, ScratchpadItem } from "../types";
```

to:

```ts
import type { FileData, ScratchpadAttachmentRef } from "../types";
```

- change the function signature to:

```ts
export function useAttachmentPreviews(attachments: ScratchpadAttachmentRef[]): Map<string, AttachmentPreview> {
```

- [ ] **Step 4: Update scratchpad orchestration hook**

In `src/features/scratchpad/hooks/use-scratchpad.ts`:

- change selected-items file check to:

```ts
const selectedItemsRequireFiles = selectedItems.some((item) => item.content.attachments.length > 0);
```

- change empty check to:

```ts
if (!item.content.body.trim() && item.content.attachments.length === 0) {
  alert("Cannot save an empty card to Memos.");
  return;
}
```

- change attachment file loading to map `item.content.attachments`
- change sync patches to:

```ts
sync: {
  ...item.sync,
  status: "saving",
  lastError: undefined,
},
```

inside the grouped patch object:

```ts
editor.patchItem(
  id,
  {
    sync: {
      ...item.sync,
      status: "saving",
      lastError: undefined,
    },
  },
  "immediate",
  "item.sync-saving",
);
```

- change successful save patch to:

```ts
{
  timestamps: { updatedAt: syncedAt },
  sync: {
    instanceId: readyInstance.id,
    memoRef: memo.memoRef,
    status: "synced",
    lastSyncedAt: syncedAt,
  },
}
```

- [ ] **Step 5: Update API save reads**

In `src/features/scratchpad/lib/api.ts`, update `saveScratchpadItemToMemos`:

```ts
const trimmedBody = item.content.body.trim();
const attachmentSummary = files.map((file) => file.name);
```

No endpoint behavior changes.

- [ ] **Step 6: Update card style helper**

In `src/features/scratchpad/lib/card-style.ts`:

- import `getScratchpadCardTone` from `./item-model`
- replace single yellow constants with a tone map:

```ts
export const SCRATCHPAD_CARD_TONE_CLASS_NAMES = {
  yellow: {
    frame: "border-[#e5d57d] bg-[#fff2a8] text-stone-700",
    overlay: "bg-[linear-gradient(180deg,rgba(255,250,210,0.28),rgba(255,240,157,0.95))]",
    text: "text-[#6e5d23]",
    placeholder: "placeholder:text-[#c8bb7e]",
  },
  pink: {
    frame: "border-rose-200 bg-rose-100 text-rose-950",
    overlay: "bg-[linear-gradient(180deg,rgba(255,245,247,0.35),rgba(255,228,233,0.9))]",
    text: "text-rose-950",
    placeholder: "placeholder:text-rose-300",
  },
  blue: {
    frame: "border-sky-200 bg-sky-100 text-sky-950",
    overlay: "bg-[linear-gradient(180deg,rgba(240,249,255,0.35),rgba(224,242,254,0.9))]",
    text: "text-sky-950",
    placeholder: "placeholder:text-sky-300",
  },
  green: {
    frame: "border-emerald-200 bg-emerald-100 text-emerald-950",
    overlay: "bg-[linear-gradient(180deg,rgba(236,253,245,0.35),rgba(209,250,229,0.9))]",
    text: "text-emerald-950",
    placeholder: "placeholder:text-emerald-300",
  },
  purple: {
    frame: "border-violet-200 bg-violet-100 text-violet-950",
    overlay: "bg-[linear-gradient(180deg,rgba(245,243,255,0.35),rgba(237,233,254,0.9))]",
    text: "text-violet-950",
    placeholder: "placeholder:text-violet-300",
  },
} as const;

export function getCardToneClassNames(item: ScratchpadItem) {
  return SCRATCHPAD_CARD_TONE_CLASS_NAMES[getScratchpadCardTone(item)];
}
```

- keep `getCardRotation` and `getCardRingClass`
- change `CARD_TEXT_CLASS_NAME` to omit color, so text color comes from the tone:

```ts
export const CARD_TEXT_CLASS_NAME = "font-serif text-[14px] leading-7";
```

- [ ] **Step 7: Run TypeScript and focused tests**

Run:

```bash
node --test src/features/scratchpad/lib/item-model.test.mjs src/features/scratchpad/lib/editor.test.mjs
pnpm exec tsc --noEmit
```

Expected: both commands exit 0.

- [ ] **Step 8: Commit Task 3**

Run:

```bash
git add src/features/scratchpad/hooks/use-scratchpad-editor.ts src/features/scratchpad/hooks/use-attachment-previews.ts src/features/scratchpad/hooks/use-scratchpad.ts src/features/scratchpad/lib/api.ts src/features/scratchpad/lib/card-style.ts
git commit -m "refactor(scratchpad): use grouped item fields"
```

## Task 4: Split Card And Workspace Presentation

**Files:**
- Modify: `src/features/scratchpad/components/card-item.tsx`
- Create: `src/features/scratchpad/components/scratchpad-card-body.tsx`
- Create: `src/features/scratchpad/components/scratchpad-attachment-grid.tsx`
- Create: `src/features/scratchpad/components/scratchpad-sync-badge.tsx`
- Modify: `src/features/scratchpad/components/workspace.tsx`
- Create: `src/features/scratchpad/components/scratchpad-canvas-background.tsx`
- Create: `src/features/scratchpad/components/scratchpad-empty-state.tsx`
- Create: `src/features/scratchpad/components/scratchpad-drop-overlay.tsx`
- Create: `src/features/scratchpad/components/scratchpad-zoom-controls.tsx`

- [ ] **Step 1: Run TypeScript before UI split**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS before starting presentation extraction.

- [ ] **Step 2: Create `ScratchpadCardBody`**

Create `src/features/scratchpad/components/scratchpad-card-body.tsx`:

```tsx
"use client";

import { CARD_TEXT_CLASS_NAME } from "@/features/scratchpad/lib/card-style";

interface ScratchpadCardBodyProps {
  body: string;
  hasAttachments: boolean;
  isEditing: boolean;
  textClassName: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onBlur: () => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPointerDown: (event: React.PointerEvent<HTMLTextAreaElement>) => void;
}

export function ScratchpadCardBody({
  body,
  hasAttachments,
  isEditing,
  textClassName,
  textareaRef,
  onBlur,
  onChange,
  onKeyDown,
  onPointerDown,
}: ScratchpadCardBodyProps) {
  const hasBody = body.trim().length > 0;

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={body}
        onBlur={onBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        placeholder={hasAttachments ? "Add context for these attachments..." : "Type here..."}
        className={`w-full min-h-[150px] resize-none border-none bg-transparent px-0 pt-0 pb-1.5 outline-none cursor-text ${CARD_TEXT_CLASS_NAME} ${textClassName}`}
      />
    );
  }

  return (
    <div
      className={`min-h-[150px] px-0 pt-0 pb-1.5 ${CARD_TEXT_CLASS_NAME} ${
        hasBody ? `whitespace-pre-wrap break-words ${textClassName}` : "select-none text-stone-400/80"
      }`}
    >
      {hasBody ? body : hasAttachments ? "Double-click to describe these attachments..." : "Double-click to type"}
    </div>
  );
}
```

- [ ] **Step 3: Create `ScratchpadAttachmentGrid`**

Create `src/features/scratchpad/components/scratchpad-attachment-grid.tsx`:

```tsx
"use client";

import { FileIcon, XIcon } from "lucide-react";
import type { ScratchpadAttachmentRef } from "@/features/scratchpad/types";

interface AttachmentPreview {
  previewUrl?: string | null;
}

interface ScratchpadAttachmentGridProps {
  attachments: ScratchpadAttachmentRef[];
  previewMap: Map<string, AttachmentPreview>;
  onRemoveAttachment: (attachmentId: string) => void;
}

export function ScratchpadAttachmentGrid({ attachments, previewMap, onRemoveAttachment }: ScratchpadAttachmentGridProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="relative px-4 pt-4 pb-2.5">
      <div className="grid grid-cols-2 gap-2">
        {attachments.map((attachment) => {
          const preview = previewMap.get(attachment.id);
          const isImage = attachment.type.startsWith("image/");

          return (
            <div key={attachment.id} className={`group relative overflow-hidden rounded-[3px] border border-black/8 bg-white/28 p-1.5 ${isImage ? "pb-3" : ""}`}>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveAttachment(attachment.id);
                }}
                className="absolute right-1.5 top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-900/45 text-white opacity-0 transition group-hover:opacity-100"
                title="Remove attachment"
              >
                <XIcon className="h-3 w-3" />
              </button>

              {isImage && preview?.previewUrl ? (
                <>
                  <div className="overflow-hidden rounded-[2px] bg-white/35">
                    <img src={preview.previewUrl} alt={attachment.name} className="h-24 w-full object-cover pointer-events-none opacity-92" />
                  </div>
                  <div className="pt-1.5 text-center text-[9px] italic tracking-[0.02em] text-stone-500/80">{attachment.name}</div>
                </>
              ) : (
                <div className="flex h-24 flex-col items-center justify-center gap-2 px-2 text-center">
                  <FileIcon className="h-7 w-7 text-stone-500/70" />
                  <div className="line-clamp-2 text-[10px] leading-4.5 text-stone-600/80">{attachment.name}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `ScratchpadSyncBadge`**

Create `src/features/scratchpad/components/scratchpad-sync-badge.tsx`:

```tsx
"use client";

import { CheckIcon, LoaderIcon } from "lucide-react";
import type { ScratchpadSyncState } from "@/features/scratchpad/types";

interface ScratchpadSyncBadgeProps {
  sync: ScratchpadSyncState;
}

export function ScratchpadSyncBadge({ sync }: ScratchpadSyncBadgeProps) {
  if (sync.status === "saving") {
    return (
      <div className="pointer-events-none absolute right-0 bottom-0 inline-flex items-center gap-1 rounded-full bg-amber-100/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-700">
        <LoaderIcon className="h-3 w-3 animate-spin" />
        Saving
      </div>
    );
  }

  if (sync.status === "error" && sync.lastError) {
    return (
      <div className="pointer-events-none absolute right-0 bottom-0 max-w-[78%] rounded-full bg-red-50/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-red-600">
        {sync.lastError}
      </div>
    );
  }

  if (sync.status === "synced") {
    return (
      <div className="pointer-events-none absolute right-0 bottom-0 inline-flex items-center gap-1 rounded-full bg-emerald-50/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
        <CheckIcon className="h-3 w-3" />
        Saved
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 5: Refactor `CardItem` to consume grouped fields and subcomponents**

In `src/features/scratchpad/components/card-item.tsx`:

- remove direct `FileIcon`, `LoaderIcon`, and `XIcon` imports
- import `getCardToneClassNames`
- import the three new components
- replace flat reads with grouped reads:
  - `item.body` -> `item.content.body`
  - `item.attachments` -> `item.content.attachments`
  - `item.createdAt` -> `item.timestamps.createdAt`
  - `item.x` -> `item.layout.x`
  - `item.width` -> `item.layout.width`
- patch layout as:

```ts
onUpdateLayout(item.id, {
  layout: {
    x: dragOriginRef.current.x + deltaX,
    y: dragOriginRef.current.y + deltaY,
  },
});
```

- compute tone classes:

```ts
const toneClassNames = getCardToneClassNames(item);
```

- use tone classes on the frame:

```tsx
className={`absolute flex flex-col overflow-hidden rounded-[5px] border transition-shadow duration-150 focus:outline-none ${
  toneClassNames.frame
} ${isEditing ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"} ${getCardRingClass(item, isSelected)}`}
```

- render:

```tsx
<div className={`pointer-events-none absolute inset-0 ${toneClassNames.overlay}`} />
<ScratchpadAttachmentGrid
  attachments={item.content.attachments}
  previewMap={previewMap}
  onRemoveAttachment={(attachmentId) => void onRemoveAttachment(item.id, attachmentId)}
/>
<ScratchpadCardBody
  body={item.content.body}
  hasAttachments={item.content.attachments.length > 0}
  isEditing={isEditing}
  textClassName={`${toneClassNames.text} ${toneClassNames.placeholder}`}
  textareaRef={textareaRef}
  onBlur={() => setIsEditing(false)}
  onChange={handleBodyChange}
  onKeyDown={handleTextareaKeyDown}
  onPointerDown={handleTextareaPointerDown}
/>
<ScratchpadSyncBadge sync={item.sync} />
```

- [ ] **Step 6: Create workspace presentational components**

Create `src/features/scratchpad/components/scratchpad-canvas-background.tsx`:

```tsx
"use client";

import type { ScratchpadViewport } from "@/features/scratchpad/types";

interface ScratchpadCanvasBackgroundProps {
  viewport: ScratchpadViewport;
}

export function getScratchpadCanvasBackgroundStyle(viewport: ScratchpadViewport): React.CSSProperties {
  const gridOffsetX = `${viewport.x}px`;
  const gridOffsetY = `${viewport.y}px`;
  const minorGrid = `${32 * viewport.scale}px`;
  const majorGrid = `${160 * viewport.scale}px`;

  return {
    backgroundImage:
      "linear-gradient(to right, rgba(130,118,94,0.045) 1px, transparent 1px), " +
      "linear-gradient(to bottom, rgba(130,118,94,0.045) 1px, transparent 1px), " +
      "linear-gradient(to right, rgba(112,100,78,0.06) 1px, transparent 1px), " +
      "linear-gradient(to bottom, rgba(112,100,78,0.06) 1px, transparent 1px)",
    backgroundPosition: `${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}`,
    backgroundSize: `${minorGrid} ${minorGrid}, ${minorGrid} ${minorGrid}, ${majorGrid} ${majorGrid}, ${majorGrid} ${majorGrid}`,
  };
}

export function ScratchpadCanvasBackground({ viewport }: ScratchpadCanvasBackgroundProps) {
  return <div className="pointer-events-none absolute inset-0 bg-[#eee9dd] dark:bg-[#171411]" style={getScratchpadCanvasBackgroundStyle(viewport)} />;
}
```

Create `src/features/scratchpad/components/scratchpad-empty-state.tsx`:

```tsx
"use client";

export function ScratchpadEmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="rounded-xl border border-white/55 bg-white/72 px-6 py-5 text-center shadow-[0_18px_52px_rgba(107,91,65,0.1)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-900/72">
        <p className="text-lg font-medium text-stone-800 dark:text-stone-100">Double-click to create a note</p>
        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">Drag to pan. Ctrl or Cmd + wheel to zoom. Paste or drop files anywhere.</p>
      </div>
    </div>
  );
}
```

Create `src/features/scratchpad/components/scratchpad-drop-overlay.tsx`:

```tsx
"use client";

export function ScratchpadDropOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-teal-500/10">
      <div className="rounded-xl border border-teal-200 bg-white/92 px-5 py-3 text-center shadow-[0_20px_60px_rgba(79,108,101,0.14)] backdrop-blur dark:border-teal-900 dark:bg-stone-900/92">
        <p className="text-lg font-semibold text-teal-700 dark:text-teal-300">Drop files here</p>
        <p className="mt-1 text-sm text-teal-700/80 dark:text-teal-300/80">They can land on the canvas or attach to an existing card.</p>
      </div>
    </div>
  );
}
```

Create `src/features/scratchpad/components/scratchpad-zoom-controls.tsx`:

```tsx
"use client";

interface ScratchpadZoomControlsProps {
  zoomLabel: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ScratchpadZoomControls({ zoomLabel, onZoomIn, onZoomOut, onReset }: ScratchpadZoomControlsProps) {
  return (
    <div
      data-scratchpad-ui="true"
      className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/78 p-1.5 shadow-[0_12px_30px_rgba(109,92,68,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-900/78"
    >
      <button
        type="button"
        onClick={onZoomOut}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-medium text-stone-500 transition hover:bg-stone-100/80 dark:text-stone-300 dark:hover:bg-stone-800"
        title="Zoom out"
      >
        -
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500 transition hover:bg-stone-100/80 dark:text-stone-300 dark:hover:bg-stone-800"
        title="Reset view"
      >
        {zoomLabel}
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-medium text-stone-500 transition hover:bg-stone-100/80 dark:text-stone-300 dark:hover:bg-stone-800"
        title="Zoom in"
      >
        +
      </button>
    </div>
  );
}
```

- [ ] **Step 7: Refactor `Workspace` to use presentational components**

In `src/features/scratchpad/components/workspace.tsx`:

- import new workspace components
- remove inline background style calculations except `zoomLabel`
- add `<ScratchpadCanvasBackground viewport={viewport} />` as the first child inside the root workspace div
- update root class to:

```tsx
className={`relative h-full w-full overflow-hidden bg-[#eee9dd] dark:bg-[#171411] ${
  isPanning ? "cursor-grabbing" : "cursor-grab"
} ${isDraggingOver ? "ring-4 ring-teal-400 ring-inset" : ""}`}
```

- replace empty state JSX with `<ScratchpadEmptyState />`
- replace drop overlay JSX with `<ScratchpadDropOverlay />`
- replace zoom controls JSX with:

```tsx
<ScratchpadZoomControls
  zoomLabel={zoomLabel}
  onZoomOut={() => zoomFromViewportCenter(1 / 1.15)}
  onReset={() => updateViewport(DEFAULT_SCRATCHPAD_VIEWPORT)}
  onZoomIn={() => zoomFromViewportCenter(1.15)}
/>
```

- [ ] **Step 8: Run TypeScript and lint**

Run:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Expected: both commands exit 0. `pnpm lint` may still print the existing Biome schema-version info.

- [ ] **Step 9: Commit Task 4**

Run:

```bash
git add src/features/scratchpad/components/card-item.tsx src/features/scratchpad/components/scratchpad-card-body.tsx src/features/scratchpad/components/scratchpad-attachment-grid.tsx src/features/scratchpad/components/scratchpad-sync-badge.tsx src/features/scratchpad/components/workspace.tsx src/features/scratchpad/components/scratchpad-canvas-background.tsx src/features/scratchpad/components/scratchpad-empty-state.tsx src/features/scratchpad/components/scratchpad-drop-overlay.tsx src/features/scratchpad/components/scratchpad-zoom-controls.tsx
git commit -m "refactor(scratchpad): split sticky board UI"
```

## Task 5: Final Verification And Visual QA

**Files:**
- No required source edits unless verification finds a defect.

- [ ] **Step 1: Run focused tests**

Run:

```bash
node --test src/features/scratchpad/lib/instance-setting.test.mjs src/features/scratchpad/lib/item-model.test.mjs src/features/scratchpad/lib/editor.test.mjs
```

Expected: PASS for all focused scratchpad tests.

- [ ] **Step 2: Run TypeScript**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Run Biome**

Run:

```bash
pnpm lint
```

Expected: exits 0. The existing Biome schema-version info can remain if it is still present.

- [ ] **Step 4: Run production build**

Run:

```bash
pnpm build
```

Expected: exits 0. The existing Next.js middleware/proxy deprecation warning can remain if it is still present.

- [ ] **Step 5: Run local app for visual QA**

Run:

```bash
pnpm dev
```

Expected: dev server starts on `http://localhost:3000`.

Open `/scratchpad` and verify:

- empty state is centered and text does not overlap
- double-click creates a note
- note editing works
- note drag works
- note resize works
- file drop overlay appears and does not block card drops
- zoom controls work
- selected save/delete toolbar appears when cards are selected
- menu opens and instance settings still open existing instance data
- dark mode remains legible

- [ ] **Step 6: Commit verification fixes when verification produced source edits**

If visual or command verification required fixes, run:

```bash
git add src/features/scratchpad
git commit -m "fix(scratchpad): polish board refactor regressions"
```

If no fixes were needed, do not create an empty commit.

## Self-Review Notes

- Spec coverage: type structure is covered by Tasks 1-3; storage compatibility by Task 2; component boundaries and visual polish by Task 4; testing and verification by Task 5.
- Scope check: this is one scratchpad refactor/polish pass, not a new feature set. Non-goals from the spec are preserved.
- Type consistency: plan uses grouped `item.layout`, `item.content`, `item.sync`, and `item.timestamps` consistently after Task 1.
