# Scratchpad Logic Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add comprehensive co-located Vitest tests for the scratchpad's pure libs, storage layer, and hooks, plus the shared test infrastructure (fake-indexeddb + jsdom polyfills) those tests and Plan 3 depend on.

**Architecture:** Pure libs are tested directly with deterministic inputs. The IndexedDB storage layer is tested against `fake-indexeddb` (a real in-memory IDB). localStorage-backed storage uses jsdom's localStorage. Hooks are tested with `@testing-library/react`'s `renderHook`.

**Tech Stack:** Vitest 3, jsdom, `fake-indexeddb`, `@testing-library/react` (`renderHook`, `act`, `waitFor`).

---

## Conventions (read before starting)

This is plan 2 of 3 (Dashboard → **Scratchpad logic** → Scratchpad UI). It targets `src/features/scratchpad/lib/**`, `src/features/scratchpad/hooks/**`, and the shared `vitest.setup.ts`.

**On "TDD" for already-written code:** the implementation exists and is believed correct, so a test for correct code passes on first run — expected and fine. Genuine red-green only happens when a test surfaces a real bug; in that case fix the implementation and note it in the commit. (Real refactor-driven TDD is concentrated in Plan 3.)

**Patterns:** Vitest globals are off — always `import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"`. Co-locate tests as `<name>.test.ts`. Use a fixed `now`/fake timers for any `Date.now()`/`new Date()`/`Math.random()` code — never the real clock.

**Run one file:** `pnpm exec vitest run <path>` — **Run all:** `pnpm test`

---

## File Structure

| File | Responsibility |
|------|----------------|
| `vitest.setup.ts` (modify) | Register fake-indexeddb, reset IDB + localStorage per test, polyfill matchMedia/ResizeObserver/createObjectURL/pointer-capture |
| `lib/item-positioning.test.ts` | `calculateScratchpadItemLayout` clamping/sizing |
| `lib/viewport.test.ts` | scale clamp, screen↔canvas, pan, zoom-at-point/center |
| `lib/zoom-visibility.test.ts` | `shouldShowZoomControls` |
| `lib/card-style.test.ts` | rotation/ring/tone class helpers |
| `lib/context-menu-position.test.ts` | `clampContextMenuPosition` |
| `lib/dom-targets.test.ts` | DOM ancestor walks |
| `lib/attachment-preview.test.ts` | preview-mode detection + size formatting |
| `lib/interactions.test.ts` | pointer session/interaction store |
| `lib/item-model.test.ts` | item creation, normalization (legacy + grouped), patching |
| `lib/editor.test.ts` | reducer + selectors |
| `lib/indexeddb.test.ts` | IDB CRUD, pruning, `createFileData` |
| `lib/storage.test.ts` | localStorage item/viewport/settings stores + migration |
| `hooks/use-attachment-previews.test.tsx` | preview URLs + revoke cleanup |
| `hooks/use-scratchpad-editor.test.tsx` | editor hook flows + persistence |
| `hooks/use-scratchpad.test.tsx` | confirm-gated delete + delegation |

---

## Task 1: Shared test infrastructure

**Files:**
- Modify: `vitest.setup.ts`
- Modify: `package.json` (add devDependency)

- [ ] **Step 1: Install fake-indexeddb**

Run: `pnpm add -D fake-indexeddb`
Expected: `fake-indexeddb` appears under `devDependencies`.

- [ ] **Step 2: Replace `vitest.setup.ts` with the extended setup**

```ts
import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

// RTL only auto-registers cleanup when Vitest globals are enabled; we keep
// globals off and use explicit imports, so unmount + reset state between tests.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// Fresh IndexedDB per test so storage suites are isolated.
beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

// --- jsdom gaps used by scratchpad code ---

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

// jsdom lacks object URLs; provide deterministic stubs (tests may spy on these).
let objectUrlCounter = 0;
URL.createObjectURL = () => `blob:mock/${objectUrlCounter++}`;
URL.revokeObjectURL = () => {};

// Pointer capture is unimplemented in jsdom; back it with a stateful WeakMap
// so hasPointerCapture reflects set/release calls.
const capturedPointers = new WeakMap<Element, Set<number>>();
Element.prototype.setPointerCapture = function setPointerCapture(pointerId: number) {
  const set = capturedPointers.get(this) ?? new Set<number>();
  set.add(pointerId);
  capturedPointers.set(this, set);
};
Element.prototype.releasePointerCapture = function releasePointerCapture(pointerId: number) {
  capturedPointers.get(this)?.delete(pointerId);
};
Element.prototype.hasPointerCapture = function hasPointerCapture(pointerId: number) {
  return capturedPointers.get(this)?.has(pointerId) ?? false;
};
```

- [ ] **Step 3: Verify existing tests still pass under the new setup**

Run: `pnpm test`
Expected: PASS — the three existing tests and any Plan 1 dashboard tests are unaffected (the new globals are additive). If a dashboard test relied on stale localStorage between tests, the new `afterEach` clear is the correct behavior; fix the test, not the setup.

- [ ] **Step 4: Commit**

```bash
git add vitest.setup.ts package.json pnpm-lock.yaml
git commit -m "test(scratchpad): add fake-indexeddb + jsdom polyfills to test setup"
```

---

## Task 2: `lib/item-positioning.ts`

**Files:**
- Test: `src/features/scratchpad/lib/item-positioning.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { calculateScratchpadItemLayout } from "./item-positioning";

const viewport = { x: 0, y: 0, scale: 1 };
const viewportSize = { width: 1000, height: 800 };

describe("calculateScratchpadItemLayout", () => {
  it("sizes and centers a text item within bounds", () => {
    const layout = calculateScratchpadItemLayout({ x: 500, y: 300, hasAttachments: false, viewport, viewportSize, zIndex: 5 });
    expect(layout).toEqual({ x: 360, y: 212, width: 280, height: 180, zIndex: 5 });
  });

  it("uses the larger attachment dimensions", () => {
    const layout = calculateScratchpadItemLayout({ x: 500, y: 300, hasAttachments: true, viewport, viewportSize, zIndex: 1 });
    expect(layout.width).toBe(320);
    expect(layout.height).toBe(300);
  });

  it("clamps within the screen gutter on a tiny viewport", () => {
    const layout = calculateScratchpadItemLayout({
      x: 0,
      y: 0,
      hasAttachments: false,
      viewport,
      viewportSize: { width: 300, height: 300 },
      zIndex: 1,
    });
    expect(layout.x).toBeGreaterThanOrEqual(24);
    expect(layout.y).toBeGreaterThanOrEqual(24);
    // Width is capped to the available width (min item width floor is 220).
    expect(layout.width).toBeLessThanOrEqual(280);
  });

  it("divides available width by the viewport scale", () => {
    const layout = calculateScratchpadItemLayout({
      x: 0,
      y: 0,
      hasAttachments: false,
      viewport: { x: 0, y: 0, scale: 2 },
      viewportSize: { width: 400, height: 400 },
      zIndex: 1,
    });
    // available = floor((400 - 48) / 2) = 176, floored to MIN width 220 → width min(280,220)=220
    expect(layout.width).toBe(220);
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/item-positioning.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover item positioning"`

---

## Task 3: `lib/viewport.ts`

**Files:**
- Test: `src/features/scratchpad/lib/viewport.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import {
  centerScratchpadViewportOnCanvasPoint,
  clampScratchpadScale,
  DEFAULT_SCRATCHPAD_VIEWPORT,
  MAX_SCRATCHPAD_SCALE,
  MIN_SCRATCHPAD_SCALE,
  panScratchpadViewport,
  screenPointToCanvasPoint,
  zoomScratchpadViewportAtPoint,
  zoomScratchpadViewportFromCenter,
} from "./viewport";

describe("clampScratchpadScale", () => {
  it("clamps to the min/max bounds", () => {
    expect(clampScratchpadScale(0.1)).toBe(MIN_SCRATCHPAD_SCALE);
    expect(clampScratchpadScale(99)).toBe(MAX_SCRATCHPAD_SCALE);
    expect(clampScratchpadScale(1)).toBe(1);
  });
});

describe("screenPointToCanvasPoint", () => {
  it("subtracts rect + pan then divides by scale", () => {
    const result = screenPointToCanvasPoint(120, 220, { left: 20, top: 20 }, { x: 0, y: 0, scale: 2 });
    expect(result).toEqual({ x: 50, y: 100 });
  });
});

describe("panScratchpadViewport", () => {
  it("adds the delta and preserves scale", () => {
    expect(panScratchpadViewport({ x: 10, y: 10, scale: 1.5 }, 5, -3)).toEqual({ x: 15, y: 7, scale: 1.5 });
  });
});

describe("zoomScratchpadViewportAtPoint", () => {
  it("keeps the canvas point under the pointer fixed", () => {
    const start = DEFAULT_SCRATCHPAD_VIEWPORT;
    // 1.5 is within [MIN, MAX] (MAX is 1.8) so clamping does not interfere.
    const next = zoomScratchpadViewportAtPoint(start, 100, 100, 1.5);
    expect(next).toEqual({ x: -50, y: -50, scale: 1.5 });
    // The canvas coordinate under (100,100) is unchanged after the zoom.
    expect(screenPointToCanvasPoint(100, 100, { left: 0, top: 0 }, next)).toEqual(
      screenPointToCanvasPoint(100, 100, { left: 0, top: 0 }, start),
    );
  });

  it("clamps the resulting scale", () => {
    expect(zoomScratchpadViewportAtPoint(DEFAULT_SCRATCHPAD_VIEWPORT, 0, 0, 99).scale).toBe(MAX_SCRATCHPAD_SCALE);
  });
});

describe("zoomScratchpadViewportFromCenter", () => {
  it("zooms about the rect center", () => {
    const rect = { left: 0, top: 0, width: 200, height: 100 };
    const next = zoomScratchpadViewportFromCenter({ x: 0, y: 0, scale: 1 }, rect, 1.5);
    expect(next.scale).toBe(1.5);
    expect(next).toEqual(zoomScratchpadViewportAtPoint({ x: 0, y: 0, scale: 1 }, 100, 50, 1.5));
  });
});

describe("centerScratchpadViewportOnCanvasPoint", () => {
  it("positions the canvas point at the rect center", () => {
    const rect = { left: 0, top: 0, width: 200, height: 100 };
    const next = centerScratchpadViewportOnCanvasPoint(rect, { x: 50, y: 25 }, 1.5);
    expect(next).toEqual({ x: 100 - 50 * 1.5, y: 50 - 25 * 1.5, scale: 1.5 });
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/viewport.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover viewport math"`

---

## Task 4: `lib/zoom-visibility.ts`

**Files:**
- Test: `src/features/scratchpad/lib/zoom-visibility.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { shouldShowZoomControls, ZOOM_CONTROLS_HIDE_DELAY_MS } from "./zoom-visibility";

describe("shouldShowZoomControls", () => {
  it("shows while hovered or focused", () => {
    expect(shouldShowZoomControls({ hovered: true, focused: false, lastInteractionAt: null, now: 0 })).toBe(true);
    expect(shouldShowZoomControls({ hovered: false, focused: true, lastInteractionAt: null, now: 0 })).toBe(true);
  });

  it("hides when idle and never interacted", () => {
    expect(shouldShowZoomControls({ hovered: false, focused: false, lastInteractionAt: null, now: 1000 })).toBe(false);
  });

  it("shows within the hide delay and hides after it", () => {
    expect(shouldShowZoomControls({ hovered: false, focused: false, lastInteractionAt: 0, now: ZOOM_CONTROLS_HIDE_DELAY_MS - 1 })).toBe(true);
    expect(shouldShowZoomControls({ hovered: false, focused: false, lastInteractionAt: 0, now: ZOOM_CONTROLS_HIDE_DELAY_MS })).toBe(false);
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/zoom-visibility.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover zoom-controls visibility"`

---

## Task 5: `lib/card-style.ts`

**Files:**
- Test: `src/features/scratchpad/lib/card-style.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import { getCardRingClass, getCardRotation, getCardToneClassNames, SCRATCHPAD_CARD_TONE_CLASS_NAMES } from "./card-style";

const item = (overrides: Partial<ScratchpadItem> = {}): ScratchpadItem => ({
  id: "item-1",
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
  ...overrides,
});

describe("getCardRotation", () => {
  it("is deterministic per id and within ±0.7°", () => {
    const rotation = getCardRotation(item({ id: "abc" }));
    expect(rotation).toBe(getCardRotation(item({ id: "abc" })));
    expect(Math.abs(rotation)).toBeLessThanOrEqual(0.7);
    expect(rotation % 0.35).toBeCloseTo(0, 10);
  });
});

describe("getCardToneClassNames", () => {
  it("defaults to the yellow tone", () => {
    expect(getCardToneClassNames(item())).toBe(SCRATCHPAD_CARD_TONE_CLASS_NAMES.yellow);
  });
  it("uses the item's tone when set", () => {
    expect(getCardToneClassNames(item({ tone: "blue" }))).toBe(SCRATCHPAD_CARD_TONE_CLASS_NAMES.blue);
  });
});

describe("getCardRingClass", () => {
  it("returns a ring class only when selected", () => {
    expect(getCardRingClass(true)).toContain("ring-1");
    expect(getCardRingClass(false)).toBe("");
    expect(getCardRingClass()).toBe("");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/card-style.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover card style helpers"`

---

## Task 6: `lib/context-menu-position.ts`

**Files:**
- Test: `src/features/scratchpad/lib/context-menu-position.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { clampContextMenuPosition } from "./context-menu-position";

const base = { menuWidth: 100, menuHeight: 80, gutter: 8, viewportWidth: 500, viewportHeight: 400 };

describe("clampContextMenuPosition", () => {
  it("returns the requested point when it fits", () => {
    expect(clampContextMenuPosition({ ...base, x: 50, y: 50 })).toEqual({ x: 50, y: 50 });
  });

  it("pulls the menu in when it would overflow the right/bottom edge", () => {
    expect(clampContextMenuPosition({ ...base, x: 480, y: 380 })).toEqual({
      x: 500 - 100 - 8,
      y: 400 - 80 - 8,
    });
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/context-menu-position.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover context-menu clamping"`

---

## Task 7: `lib/dom-targets.ts`

**Files:**
- Test: `src/features/scratchpad/lib/dom-targets.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { afterEach, describe, expect, it } from "vitest";
import { findScratchpadItemId, isWithinScratchpadItem, isWithinScratchpadUi } from "./dom-targets";

afterEach(() => {
  document.body.innerHTML = "";
});

function build() {
  const boundary = document.createElement("div");
  const card = document.createElement("div");
  card.dataset.scratchpadItemId = "item-7";
  card.dataset.scratchpadItem = "true";
  const child = document.createElement("span");
  card.appendChild(child);
  boundary.appendChild(card);
  document.body.appendChild(boundary);
  return { boundary, card, child };
}

describe("findScratchpadItemId", () => {
  it("walks up to the nearest item id", () => {
    const { boundary, child } = build();
    expect(findScratchpadItemId(child, boundary)).toBe("item-7");
  });
  it("returns undefined past the boundary", () => {
    const { boundary } = build();
    expect(findScratchpadItemId(boundary, boundary)).toBeUndefined();
    expect(findScratchpadItemId(null, boundary)).toBeUndefined();
  });
});

describe("isWithinScratchpadItem", () => {
  it("is true inside an item and false at/above the boundary", () => {
    const { boundary, child } = build();
    expect(isWithinScratchpadItem(child, boundary)).toBe(true);
    expect(isWithinScratchpadItem(boundary, boundary)).toBe(false);
  });
});

describe("isWithinScratchpadUi", () => {
  it("detects the data-scratchpad-ui marker", () => {
    const boundary = document.createElement("div");
    const ui = document.createElement("div");
    ui.dataset.scratchpadUi = "true";
    const inner = document.createElement("button");
    ui.appendChild(inner);
    boundary.appendChild(ui);
    expect(isWithinScratchpadUi(inner, boundary)).toBe(true);
    expect(isWithinScratchpadUi(boundary, boundary)).toBe(false);
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/dom-targets.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover dom target walks"`

---

## Task 8: `lib/attachment-preview.ts`

**Files:**
- Test: `src/features/scratchpad/lib/attachment-preview.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import { formatAttachmentSize, getAttachmentPreviewMode } from "./attachment-preview";

describe("getAttachmentPreviewMode", () => {
  it("classifies by MIME type", () => {
    expect(getAttachmentPreviewMode("image/png", "a.png")).toBe("image");
    expect(getAttachmentPreviewMode("application/pdf", "a.pdf")).toBe("pdf");
    expect(getAttachmentPreviewMode("video/mp4", "a.mp4")).toBe("video");
    expect(getAttachmentPreviewMode("audio/mpeg", "a.mp3")).toBe("audio");
    expect(getAttachmentPreviewMode("text/plain", "a.txt")).toBe("text");
  });

  it("treats SVG as text, not image", () => {
    expect(getAttachmentPreviewMode("image/svg+xml", "a.svg")).toBe("text");
  });

  it("falls back to the file extension when the MIME type is unknown", () => {
    expect(getAttachmentPreviewMode("", "notes.md")).toBe("text");
    expect(getAttachmentPreviewMode(undefined, "data.json")).toBe("text");
  });

  it("defaults to download for unrecognized files", () => {
    expect(getAttachmentPreviewMode("application/zip", "a.zip")).toBe("download");
    expect(getAttachmentPreviewMode("", "binary")).toBe("download");
  });
});

describe("formatAttachmentSize", () => {
  it("formats bytes, KB, MB with sensible precision", () => {
    expect(formatAttachmentSize(512)).toBe("512 B");
    expect(formatAttachmentSize(1536)).toBe("1.5 KB");
    expect(formatAttachmentSize(20 * 1024)).toBe("20 KB");
    expect(formatAttachmentSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/attachment-preview.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover attachment preview helpers"`

---

## Task 9: `lib/interactions.ts`

**Files:**
- Test: `src/features/scratchpad/lib/interactions.test.ts`

Note: the store functions call `element.setPointerCapture` / `hasPointerCapture` / `releasePointerCapture`. Use a stub element with `vi.fn()`s so the test controls capture state directly (no real DOM needed).

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it, vi } from "vitest";
import {
  beginPointerInteraction,
  beginPointerSession,
  cancelPointerSession,
  createIdlePointerInteractionState,
  createPointerSession,
  finishPointerInteraction,
  finishPointerSession,
  getActivePointerInteraction,
  getActivePointerSession,
  getPointerSessionDelta,
  hasPointerSessionExceededThreshold,
  isPointerSessionActive,
  type PointerSession,
} from "./interactions";

function stubElement(captured = false) {
  return {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => captured),
  } as unknown as HTMLElement;
}

describe("pointer session primitives", () => {
  it("creates a session and detects activity by pointer id", () => {
    const session = createPointerSession(3, 10, 20);
    expect(session).toEqual({ pointerId: 3, startClientX: 10, startClientY: 20 });
    expect(isPointerSessionActive(session, 3)).toBe(true);
    expect(isPointerSessionActive(session, 4)).toBe(false);
    expect(isPointerSessionActive(null, 3)).toBe(false);
  });

  it("computes delta and threshold crossing", () => {
    const session = createPointerSession(1, 0, 0);
    expect(getPointerSessionDelta(session, 3, 4)).toEqual({ x: 3, y: 4 });
    expect(hasPointerSessionExceededThreshold(session, 3, 4, 5)).toBe(true);
    expect(hasPointerSessionExceededThreshold(session, 1, 1, 5)).toBe(false);
  });
});

describe("session store lifecycle", () => {
  it("begins, reads, and finishes a session, releasing capture", () => {
    const store: { current: PointerSession | null } = { current: null };
    const element = stubElement(true);
    const session = beginPointerSession(store, element, createPointerSession(2, 0, 0));

    expect(element.setPointerCapture).toHaveBeenCalledWith(2);
    expect(getActivePointerSession(store, 2)).toBe(session);
    expect(getActivePointerSession(store, 9)).toBeNull();

    const finished = finishPointerSession(store, element, 2);
    expect(finished).toBe(session);
    expect(element.releasePointerCapture).toHaveBeenCalledWith(2);
    expect(store.current).toBeNull();
  });

  it("cancel clears the session without releasing capture", () => {
    const store: { current: PointerSession | null } = { current: createPointerSession(5, 0, 0) };
    expect(cancelPointerSession(store, 5)?.pointerId).toBe(5);
    expect(store.current).toBeNull();
    expect(cancelPointerSession(store, 5)).toBeNull();
  });
});

describe("interaction store lifecycle", () => {
  type Modes = { pan: PointerSession };
  it("tracks a moded interaction and finishes it back to idle", () => {
    const store = { current: createIdlePointerInteractionState<Modes>() };
    const element = stubElement(true);
    beginPointerInteraction(store, element, "pan", createPointerSession(1, 0, 0));

    expect(getActivePointerInteraction(store, "pan", 1)?.pointerId).toBe(1);
    expect(getActivePointerInteraction(store, "pan", 2)).toBeNull();

    finishPointerInteraction(store, element, "pan", 1);
    expect(store.current.mode).toBe("idle");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/interactions.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover pointer interaction store"`

---

## Task 10: `lib/item-model.ts`

**Files:**
- Test: `src/features/scratchpad/lib/item-model.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import {
  createScratchpadItem,
  getScratchpadCardTone,
  normalizeScratchpadItem,
  normalizeScratchpadItems,
  patchScratchpadItem,
} from "./item-model";

describe("getScratchpadCardTone", () => {
  it("defaults to yellow and honors an explicit tone", () => {
    expect(getScratchpadCardTone({ tone: undefined })).toBe("yellow");
    expect(getScratchpadCardTone({ tone: "green" })).toBe("green");
  });
});

describe("createScratchpadItem", () => {
  it("creates a text item with text dimensions and a unique id", () => {
    const item = createScratchpadItem(10, 20, 3);
    expect(item.layout).toMatchObject({ x: 10, y: 20, width: 280, height: 180, zIndex: 3 });
    expect(item.content).toEqual({ body: "", attachments: [] });
    expect(item.id).toMatch(/^item-/);
  });

  it("uses attachment dimensions when attachments are supplied", () => {
    const item = createScratchpadItem(0, 0, 1, [{ id: "f1", name: "a", type: "image/png", size: 1 }]);
    expect(item.layout.width).toBe(320);
    expect(item.layout.height).toBe(300);
    expect(item.content.attachments).toHaveLength(1);
  });
});

describe("normalizeScratchpadItem", () => {
  it("normalizes a grouped (current) item, defaulting zIndex from the index", () => {
    const grouped = {
      id: "item-x",
      layout: { x: 1, y: 2, width: 100, height: 100, zIndex: undefined as unknown as number },
      content: { body: "hi", attachments: [] },
      timestamps: { createdAt: "2026-01-01T00:00:00Z" },
    };
    const result = normalizeScratchpadItem(grouped, 4);
    expect(result.layout.zIndex).toBe(5);
    expect(result.content.body).toBe("hi");
    expect(result.timestamps.createdAt).toBeInstanceOf(Date);
    // updatedAt falls back to createdAt when absent.
    expect(result.timestamps.updatedAt).toEqual(result.timestamps.createdAt);
  });

  it("normalizes a legacy text item (flat fields, string content)", () => {
    const legacy = { id: "old-1", x: 5, y: 6, width: 200, height: 150, type: "text" as const, content: "legacy body" };
    const result = normalizeScratchpadItem(legacy, 0);
    expect(result.content.body).toBe("legacy body");
    expect(result.layout).toMatchObject({ x: 5, y: 6, zIndex: 1 });
  });

  it("derives an attachment from a legacy file item's fileRef", () => {
    const legacy = {
      id: "old-2",
      type: "file" as const,
      x: 0,
      y: 0,
      width: 320,
      height: 200,
      fileRef: { id: "blob-1", name: "pic.png", type: "image/png", size: 10 },
    };
    const result = normalizeScratchpadItem(legacy);
    expect(result.content.attachments).toEqual([{ id: "blob-1", name: "pic.png", type: "image/png", size: 10 }]);
  });
});

describe("normalizeScratchpadItems", () => {
  it("normalizes a list, assigning ascending default zIndexes", () => {
    const result = normalizeScratchpadItems([
      { id: "a", x: 0, y: 0, type: "text", content: "" },
      { id: "b", x: 0, y: 0, type: "text", content: "" },
    ]);
    expect(result.map((item) => item.layout.zIndex)).toEqual([1, 2]);
  });
});

describe("patchScratchpadItem", () => {
  const base: ScratchpadItem = {
    id: "item-1",
    layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
    content: { body: "a", attachments: [] },
    timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
  };

  it("merges layout/content/timestamps and sets tone", () => {
    const patched = patchScratchpadItem(base, { layout: { x: 99 }, content: { body: "b" }, tone: "pink" });
    expect(patched.layout).toEqual({ x: 99, y: 0, width: 280, height: 180, zIndex: 1 });
    expect(patched.content.body).toBe("b");
    expect(patched.tone).toBe("pink");
  });

  it("leaves untouched sections referentially equal", () => {
    const patched = patchScratchpadItem(base, { layout: { x: 1 } });
    expect(patched.content).toBe(base.content);
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/item-model.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover item model normalization + patching"`

---

## Task 11: `lib/editor.ts`

**Files:**
- Test: `src/features/scratchpad/lib/editor.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import {
  createScratchpadEditorState,
  getNextScratchpadZIndex,
  getScratchpadItem,
  getSelectedScratchpadItems,
  type ScratchpadEditorOperation,
  scratchpadEditorReducer,
} from "./editor";

const makeItem = (id: string, zIndex = 1): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

function run(state = createScratchpadEditorState(), operations: ScratchpadEditorOperation[], persistence: "immediate" | "debounced" | "none" = "immediate") {
  return scratchpadEditorReducer(state, { type: "run-transaction", id: 1, reason: "test", persistence, operations });
}

describe("selectors", () => {
  it("getNextScratchpadZIndex returns 1 for empty and max+1 otherwise", () => {
    expect(getNextScratchpadZIndex([])).toBe(1);
    expect(getNextScratchpadZIndex([makeItem("a", 2), makeItem("b", 5)])).toBe(6);
  });

  it("getScratchpadItem / getSelectedScratchpadItems filter by id", () => {
    const items = [makeItem("a"), makeItem("b")];
    expect(getScratchpadItem(items, "b")?.id).toBe("b");
    expect(getSelectedScratchpadItems({ document: { items }, selectedItemIds: ["b"] }).map((i) => i.id)).toEqual(["b"]);
  });
});

describe("scratchpadEditorReducer", () => {
  it("hydrates and normalizes items", () => {
    const state = scratchpadEditorReducer(createScratchpadEditorState(), {
      type: "hydrate",
      items: [makeItem("a")],
      viewport: { x: 1, y: 2, scale: 1 },
    });
    expect(state.document.items).toHaveLength(1);
    expect(state.viewport).toEqual({ x: 1, y: 2, scale: 1 });
  });

  it("adds an item and records lastActiveItemId + transaction", () => {
    const next = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    expect(next.document.items.map((i) => i.id)).toEqual(["a"]);
    expect(next.lastActiveItemId).toBe("a");
    expect(next.lastTransaction).toMatchObject({ persistence: "immediate", changes: { items: true } });
  });

  it("patches an item", () => {
    const start = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    const next = run(start, [{ type: "patch-item", id: "a", patch: { content: { body: "hello" } } }]);
    expect(getScratchpadItem(next.document.items, "a")?.content.body).toBe("hello");
  });

  it("deletes items and prunes selection + lastActive", () => {
    let s = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    s = run(s, [{ type: "select-item", id: "a", additive: false }]);
    s = run(s, [{ type: "delete-items", ids: ["a"] }]);
    expect(s.document.items).toHaveLength(0);
    expect(s.selectedItemIds).toEqual([]);
    expect(s.lastActiveItemId).toBeNull();
  });

  it("selects (toggle additive) and brings the item to front", () => {
    let s = run(undefined, [{ type: "add-item", item: makeItem("a", 1) }]);
    s = run(s, [{ type: "add-item", item: makeItem("b", 2) }]);
    s = run(s, [{ type: "select-item", id: "a", additive: false }]);
    expect(getScratchpadItem(s.document.items, "a")?.layout.zIndex).toBe(3); // brought to front
    s = run(s, [{ type: "select-item", id: "b", additive: true }]);
    expect(s.selectedItemIds).toEqual(["a", "b"]);
    s = run(s, [{ type: "select-item", id: "b", additive: true }]); // toggles off
    expect(s.selectedItemIds).toEqual(["a"]);
  });

  it("clear-selection empties the selection", () => {
    let s = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    s = run(s, [{ type: "select-item", id: "a", additive: false }]);
    s = run(s, [{ type: "clear-selection" }], "none");
    expect(s.selectedItemIds).toEqual([]);
  });

  it("returns the same state reference for an empty (no-op) transaction", () => {
    // clear-selection always allocates a fresh [], so it is not referentially a
    // no-op; only an empty operations list leaves every slice unchanged.
    const start = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    const next = scratchpadEditorReducer(start, {
      type: "run-transaction",
      id: 2,
      reason: "noop",
      persistence: "none",
      operations: [],
    });
    expect(next).toBe(start);
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/editor.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover editor reducer + selectors"`

---

## Task 12: `lib/indexeddb.ts`

**Files:**
- Test: `src/features/scratchpad/lib/indexeddb.test.ts`

Note: runs against the fake-indexeddb registered in `vitest.setup.ts` (fresh DB per test via the global `beforeEach`).

- [ ] **Step 1: Write the test**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FileData } from "../types";
import {
  clearAllFiles,
  createFileData,
  deleteFile,
  deleteOldFiles,
  getAllFiles,
  getFile,
  getTotalFileSize,
  saveFile,
} from "./indexeddb";

const makeFile = (id: string, size = 4, uploadedAt = new Date("2026-06-14T00:00:00Z")): FileData => ({
  id,
  name: `${id}.txt`,
  type: "text/plain",
  size,
  blob: new Blob(["data"]),
  uploadedAt,
});

describe("indexeddb CRUD", () => {
  it("saves and reads a file back, rehydrating uploadedAt as a Date", async () => {
    await saveFile(makeFile("a"));
    const loaded = await getFile("a");
    expect(loaded?.id).toBe("a");
    expect(loaded?.uploadedAt).toBeInstanceOf(Date);
  });

  it("returns null for a missing file", async () => {
    expect(await getFile("nope")).toBeNull();
  });

  it("lists all files and totals their sizes", async () => {
    await saveFile(makeFile("a", 10));
    await saveFile(makeFile("b", 25));
    expect((await getAllFiles()).map((f) => f.id).sort()).toEqual(["a", "b"]);
    expect(await getTotalFileSize()).toBe(35);
  });

  it("deletes a single file and clears all", async () => {
    await saveFile(makeFile("a"));
    await saveFile(makeFile("b"));
    await deleteFile("a");
    expect(await getFile("a")).toBeNull();
    await clearAllFiles();
    expect(await getAllFiles()).toEqual([]);
  });
});

describe("deleteOldFiles", () => {
  it("removes files older than the cutoff and returns the count", async () => {
    await saveFile(makeFile("old", 1, new Date("2020-01-01T00:00:00Z")));
    await saveFile(makeFile("new", 1, new Date()));
    const deleted = await deleteOldFiles(30);
    expect(deleted).toBe(1);
    expect(await getFile("old")).toBeNull();
    expect(await getFile("new")).not.toBeNull();
  });
});

describe("createFileData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-14T00:00:00Z"));
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("builds a FileData with a deterministic id and copied metadata", () => {
    const file = new File(["hello"], "greeting.txt", { type: "text/plain" });
    const data = createFileData(file);
    expect(data.name).toBe("greeting.txt");
    expect(data.type).toBe("text/plain");
    expect(data.size).toBe(file.size);
    expect(data.uploadedAt).toBeInstanceOf(Date);
    expect(data.id).toMatch(/^file-\d+-[a-z0-9]+$/);
  });

  it("falls back to a default name for a nameless Blob", () => {
    const data = createFileData(new Blob(["x"], { type: "" }));
    expect(data.name).toBe("untitled");
    expect(data.type).toBe("application/octet-stream");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/indexeddb.test.ts` — Expected: PASS. If `getFile` rehydration of `uploadedAt` fails because fake-indexeddb structured-clones the Date already, keep the `instanceof Date` assertion (still true) and move on.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover indexeddb storage layer"`

---

## Task 13: `lib/storage.ts`

**Files:**
- Test: `src/features/scratchpad/lib/storage.test.ts`

Note: localStorage is cleared between tests by the global `afterEach`.

- [ ] **Step 1: Write the test**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ScratchpadItem } from "../types";
import { formatBytes, getStorageQuota, itemStorage, settingsStorage, viewportStorage } from "./storage";

const ITEMS_KEY = "memos-scratch-items";

const makeItem = (id: string, createdAt = new Date()): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: id, attachments: [] },
  timestamps: { createdAt, updatedAt: createdAt },
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("itemStorage", () => {
  it("round-trips items through the v3 envelope", () => {
    itemStorage.save([makeItem("a")]);
    const raw = JSON.parse(localStorage.getItem(ITEMS_KEY) as string);
    expect(raw.version).toBe(3);
    expect(itemStorage.getAll().map((i) => i.id)).toEqual(["a"]);
  });

  it("returns [] when nothing is stored", () => {
    expect(itemStorage.getAll()).toEqual([]);
  });

  it("migrates a legacy array payload and rewrites it as v3", () => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify([{ id: "legacy", type: "text", x: 0, y: 0, width: 200, height: 150, content: "hi", createdAt: "2026-01-01" }]));
    const items = itemStorage.getAll();
    expect(items[0].id).toBe("legacy");
    expect(JSON.parse(localStorage.getItem(ITEMS_KEY) as string).version).toBe(3);
  });

  it("add / update / remove mutate the stored list", () => {
    itemStorage.add(makeItem("a"));
    itemStorage.update("a", { content: { body: "updated" } });
    expect(itemStorage.getAll()[0].content.body).toBe("updated");
    itemStorage.remove("a");
    expect(itemStorage.getAll()).toEqual([]);
  });

  it("update throws when the item is missing", () => {
    expect(() => itemStorage.update("ghost", { content: { body: "x" } })).toThrow("Item not found");
  });

  it("clearOld drops items older than the cutoff", () => {
    itemStorage.save([makeItem("old", new Date("2020-01-01")), makeItem("new", new Date())]);
    itemStorage.clearOld(30);
    expect(itemStorage.getAll().map((i) => i.id)).toEqual(["new"]);
  });

  it("recovers from malformed JSON by returning []", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem(ITEMS_KEY, "{not json");
    expect(itemStorage.getAll()).toEqual([]);
  });
});

describe("viewportStorage", () => {
  it("returns the default viewport when absent", () => {
    expect(viewportStorage.get()).toEqual({ x: 0, y: 0, scale: 1 });
  });
  it("round-trips a saved viewport", () => {
    viewportStorage.save({ x: 10, y: 20, scale: 1.5 });
    expect(viewportStorage.get()).toEqual({ x: 10, y: 20, scale: 1.5 });
  });
  it("falls back to defaults on malformed data and clears the key", () => {
    localStorage.setItem("memos-scratch-viewport", "{bad");
    expect(viewportStorage.get()).toEqual({ x: 0, y: 0, scale: 1 });
    expect(localStorage.getItem("memos-scratch-viewport")).toBeNull();
  });
});

describe("settingsStorage", () => {
  it("tracks first visit", () => {
    expect(settingsStorage.isFirstVisit()).toBe(true);
    settingsStorage.setNotFirstVisit();
    expect(settingsStorage.isFirstVisit()).toBe(false);
  });
  it("stores and reads typed settings with a default", () => {
    expect(settingsStorage.getSetting("grid", true)).toBe(true);
    settingsStorage.setSetting("grid", false);
    expect(settingsStorage.getSetting("grid", true)).toBe(false);
  });
});

describe("formatBytes", () => {
  it("formats common magnitudes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
  });
});

describe("getStorageQuota", () => {
  it("returns zeros when navigator.storage is unavailable", async () => {
    const original = navigator.storage;
    Object.defineProperty(navigator, "storage", { value: undefined, configurable: true });
    expect(await getStorageQuota()).toEqual({ usage: 0, quota: 0, percentage: 0 });
    Object.defineProperty(navigator, "storage", { value: original, configurable: true });
  });

  it("computes a percentage from the storage estimate", async () => {
    const estimate = vi.fn().mockResolvedValue({ usage: 50, quota: 200 });
    Object.defineProperty(navigator, "storage", { value: { estimate }, configurable: true });
    expect(await getStorageQuota()).toEqual({ usage: 50, quota: 200, percentage: 25 });
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/lib/storage.test.ts` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover localStorage stores + migration"`

---

## Task 14: `hooks/use-attachment-previews.ts`

**Files:**
- Test: `src/features/scratchpad/hooks/use-attachment-previews.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/indexeddb", () => ({ getFile: vi.fn() }));

import { getFile } from "../lib/indexeddb";
import type { FileData, ScratchpadAttachmentRef } from "../types";
import { useAttachmentPreviews } from "./use-attachment-previews";

const ref = (id: string, type: string): ScratchpadAttachmentRef => ({ id, name: `${id}`, type, size: 1 });
const fileData = (id: string, type: string): FileData => ({ id, name: id, type, size: 1, blob: new Blob(["x"]), uploadedAt: new Date() });

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("useAttachmentPreviews", () => {
  it("creates object URLs for image attachments and indexes them by id", async () => {
    vi.mocked(getFile).mockResolvedValue(fileData("img", "image/png"));
    const { result } = renderHook(() => useAttachmentPreviews([ref("img", "image/png")]));

    await waitFor(() => expect(result.current.get("img")?.previewUrl).toMatch(/^blob:/));
    expect(result.current.get("img")?.fileData?.type).toBe("image/png");
  });

  it("leaves previewUrl null for non-image attachments", async () => {
    vi.mocked(getFile).mockResolvedValue(fileData("doc", "application/pdf"));
    const { result } = renderHook(() => useAttachmentPreviews([ref("doc", "application/pdf")]));

    await waitFor(() => expect(result.current.get("doc")).toBeDefined());
    expect(result.current.get("doc")?.previewUrl).toBeNull();
  });

  it("revokes created object URLs on unmount", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    vi.mocked(getFile).mockResolvedValue(fileData("img", "image/png"));
    const { result, unmount } = renderHook(() => useAttachmentPreviews([ref("img", "image/png")]));

    await waitFor(() => expect(result.current.get("img")?.previewUrl).toMatch(/^blob:/));
    unmount();
    expect(revoke).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/hooks/use-attachment-previews.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover attachment previews hook"`

---

## Task 15: `hooks/use-scratchpad-editor.ts`

**Files:**
- Test: `src/features/scratchpad/hooks/use-scratchpad-editor.test.tsx`

Note: this hook composes the editor reducer, localStorage (`itemStorage`/`viewportStorage`), and IndexedDB (`createFileData`/`saveFile`/`deleteFile`). Let localStorage and fake-indexeddb run for real; drive timers with fake timers so the 300ms debounce is controllable. It reads `window.innerWidth/innerHeight` — jsdom defaults (1024×768) are fine.

- [ ] **Step 1: Write the test**

```tsx
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { itemStorage } from "../lib/storage";
import { useScratchpadEditor } from "./use-scratchpad-editor";

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  vi.useRealTimers();
});

async function mountReady() {
  const hook = renderHook(() => useScratchpadEditor());
  await waitFor(() => expect(hook.result.current.isClient).toBe(true));
  return hook;
}

describe("useScratchpadEditor", () => {
  it("becomes client-ready and starts empty", async () => {
    const { result } = await mountReady();
    expect(result.current.items).toEqual([]);
    expect(result.current.viewport).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it("creates a text item and persists it immediately", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(100, 100));

    expect(result.current.items).toHaveLength(1);
    expect(itemStorage.getAll()).toHaveLength(1); // immediate persistence
  });

  it("updates an item body", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;

    act(() => result.current.updateItemBody(id, "typed text"));
    expect(result.current.items[0].content.body).toBe("typed text");
  });

  it("selects and clears selection", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;

    act(() => result.current.selectItem(id));
    expect(result.current.selectedItemIds).toEqual([id]);
    act(() => result.current.selectItem(null));
    expect(result.current.selectedItemIds).toEqual([]);
  });

  it("deletes an item", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;

    await act(async () => {
      await result.current.deleteItem(id);
    });
    expect(result.current.items).toEqual([]);
  });

  it("uploads a file into a new item with an attachment", async () => {
    const { result } = await mountReady();
    const files = {
      length: 1,
      0: new File(["data"], "pic.png", { type: "image/png" }),
      item(i: number) {
        return this[i as 0];
      },
      [Symbol.iterator]() {
        return [this[0]][Symbol.iterator]();
      },
    } as unknown as FileList;

    await act(async () => {
      await result.current.uploadFiles(files, 50, 50);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].content.attachments).toHaveLength(1);
    expect(result.current.items[0].content.attachments[0].name).toBe("pic.png");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/hooks/use-scratchpad-editor.test.tsx` — Expected: PASS. If `act` warnings appear from the async persistence effect, wrap the triggering call in `await act(async () => { ... })`. If a test is flaky on the debounce timer, it is only asserting state (not persistence timing) and should be stable; only the create/upload/delete cases assert persistence, and those use `immediate`.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover editor hook flows"`

---

## Task 16: `hooks/use-scratchpad.ts`

**Files:**
- Test: `src/features/scratchpad/hooks/use-scratchpad.test.tsx`

Note: mock the underlying `useScratchpadEditor` so this test isolates `use-scratchpad`'s delegation and the `confirm`-gated bulk delete.

- [ ] **Step 1: Write the test**

```tsx
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const editor = {
  createTextItem: vi.fn(),
  deleteItem: vi.fn(),
  deleteItems: vi.fn().mockResolvedValue(undefined),
  uploadFiles: vi.fn(),
  removeAttachment: vi.fn(),
  selectItem: vi.fn(),
  updateItemBody: vi.fn(),
  updateItemLayout: vi.fn(),
  setViewport: vi.fn(),
  isClient: true,
  items: [],
  lastActiveItemId: null,
  selectedItemIds: [] as string[],
  viewport: { x: 0, y: 0, scale: 1 },
};
vi.mock("./use-scratchpad-editor", () => ({ useScratchpadEditor: () => editor }));

import { useScratchpad } from "./use-scratchpad";

beforeEach(() => {
  vi.clearAllMocks();
  editor.selectedItemIds = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("useScratchpad", () => {
  it("maps editor methods onto the handler surface", () => {
    const { result } = renderHook(() => useScratchpad());
    result.current.handleCreateTextItem(1, 2);
    expect(editor.createTextItem).toHaveBeenCalledWith(1, 2);
    expect(result.current.viewport).toBe(editor.viewport);
  });

  it("does nothing on delete-selected when nothing is selected", async () => {
    const { result } = renderHook(() => useScratchpad());
    await result.current.handleDeleteSelected();
    expect(editor.deleteItems).not.toHaveBeenCalled();
  });

  it("confirms before deleting the selection", async () => {
    editor.selectedItemIds = ["a", "b"];
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const { result } = renderHook(() => useScratchpad());

    await result.current.handleDeleteSelected();
    expect(confirmSpy).toHaveBeenCalledWith("Delete 2 selected items?");
    expect(editor.deleteItems).toHaveBeenCalledWith(["a", "b"]);
  });

  it("aborts the delete when the user cancels the confirm", async () => {
    editor.selectedItemIds = ["a"];
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => useScratchpad());

    await result.current.handleDeleteSelected();
    expect(editor.deleteItems).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/hooks/use-scratchpad.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover use-scratchpad delegation + confirm"`

---

## Final verification

- [ ] Run the whole suite: `pnpm test` — expect all green (Plan 1 + the 15 new scratchpad-logic files).
- [ ] Run `pnpm lint` — expect pass (commit any Biome formatting of new files).

---

## Self-review notes

- **Spec coverage:** Test infra (Task 1); pure libs — item-positioning, viewport, zoom-visibility, card-style, context-menu-position, dom-targets, attachment-preview, interactions, item-model, editor (Tasks 2-11); storage — indexeddb, storage (Tasks 12-13); hooks — use-attachment-previews, use-scratchpad-editor, use-scratchpad (Tasks 14-16). `types.ts` carries only type declarations (no runtime helpers) and needs no test. Components/pages are Plan 3.
- **Determinism:** every `Date.now()`/`Math.random()` path (`createFileData`) is pinned with fake timers + a `Math.random` spy. Date-keyed code uses fixed dates.
- **Type consistency:** `ScratchpadItem`, `ScratchpadItemLayout`, `ScratchpadViewport`, `ScratchpadAttachmentRef`, `FileData`, `ScratchpadEditorOperation`, and the `itemStorage`/`viewportStorage`/`settingsStorage` method names match the source signatures verified while writing this plan.
