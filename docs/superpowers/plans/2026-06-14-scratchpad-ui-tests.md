# Scratchpad UI Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add comprehensive co-located Vitest tests for every scratchpad component and the scratchpad page/layout, extracting the imperative logic buried in `card-item.tsx` and `workspace.tsx` into tested pure functions first (red-green-refactor).

**Architecture:** The heavy interaction math in the two large components is extracted into two new pure lib modules (`card-interactions.ts`, `workspace-geometry.ts`) that are TDD'd, then the components are refactored to consume them and covered with React Testing Library for rendering/callback behavior. Smaller presentational components get focused RTL tests.

**Tech Stack:** Vitest 3, jsdom, `@testing-library/react`, `@testing-library/user-event`. Relies on the polyfills added to `vitest.setup.ts` in Plan 2 (pointer capture, object URLs, ResizeObserver, matchMedia).

---

## Conventions (read before starting)

This is plan 3 of 3 (Dashboard → Scratchpad logic → **Scratchpad UI**). It targets `src/features/scratchpad/components/**` and `src/app/(tools)/scratchpad/**`. **Plan 2 must be complete** — this plan depends on its `vitest.setup.ts` polyfills and on `fake-indexeddb`.

**Genuine TDD here.** Tasks 1-2 create *new* lib modules: write the failing test first (the module doesn't exist → real red), implement (green), then Tasks 3-4 refactor the components to call them. The refactor must preserve behavior; the component's own RTL test plus `pnpm build` guard against regressions. Other component tests are characterization tests over existing render behavior (pass on first run; fix the impl only if a real bug surfaces).

**Patterns:** Vitest globals off — always import from `"vitest"`. Co-locate tests. jsdom's `getBoundingClientRect` returns zeros (fine for these tests). Mock Clerk-dependent and IndexedDB-dependent modules with `vi.mock`.

**Run one file:** `pnpm exec vitest run <path>` — **Run all:** `pnpm test`

---

## File Structure

| File | Responsibility |
|------|----------------|
| `lib/card-interactions.ts` (create) | Pure card edit/drag/resize math extracted from card-item |
| `lib/card-interactions.test.ts` (create) | Tests for the above |
| `lib/workspace-geometry.ts` (create) | Pure item-center / zoom-label / wheel-factor / gesture-target logic from workspace |
| `lib/workspace-geometry.test.ts` (create) | Tests for the above |
| `components/card-item.tsx` (modify) | Consume card-interactions; thinner handlers |
| `components/card-item.test.tsx` (create) | RTL: render, edit, context-menu delete |
| `components/workspace.tsx` (modify) | Consume workspace-geometry |
| `components/workspace.test.tsx` (create) | RTL: cards, empty state, zoom label, create/clear callbacks |
| `components/scratchpad-empty-state.test.tsx` | RTL static |
| `components/scratchpad-drop-overlay.test.tsx` | RTL static |
| `components/scratchpad-canvas-background.test.tsx` | style function + render |
| `components/scratchpad-card-body.test.tsx` | editing vs display modes |
| `components/scratchpad-viewport-lock.test.tsx` | viewport meta set/restore |
| `components/scratchpad-zoom-controls.test.tsx` | buttons + visibility + callbacks |
| `components/scratchpad-toolbar.test.tsx` | trigger render (clerk-configured vs not) |
| `components/scratchpad-account-menu-section.test.tsx` | null when clerk unconfigured |
| `components/scratchpad-attachment-grid.test.tsx` | attachment tiles + open/remove |
| `components/scratchpad-attachment-viewer.test.tsx` | load states + close |
| `src/app/(tools)/scratchpad/page.test.tsx` | isClient gating + wiring |
| `src/app/(tools)/scratchpad/layout.test.tsx` | metadata + children render |

---

## Task 1: Extract `lib/card-interactions.ts` (TDD)

**Files:**
- Create: `src/features/scratchpad/lib/card-interactions.ts`
- Test: `src/features/scratchpad/lib/card-interactions.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { CARD_NEW_EDIT_WINDOW_MS, computeCardDragPosition, computeCardResizeSize, shouldStartEditingNewCard } from "./card-interactions";

describe("shouldStartEditingNewCard", () => {
  const now = 10_000;
  it("starts editing a brand-new empty card", () => {
    expect(shouldStartEditingNewCard({ body: "  ", attachmentCount: 0, createdAt: new Date(now - 1000) }, now)).toBe(true);
  });
  it("does not start editing when the card has a body", () => {
    expect(shouldStartEditingNewCard({ body: "hi", attachmentCount: 0, createdAt: new Date(now) }, now)).toBe(false);
  });
  it("does not start editing when the card has attachments", () => {
    expect(shouldStartEditingNewCard({ body: "", attachmentCount: 1, createdAt: new Date(now) }, now)).toBe(false);
  });
  it("does not start editing an old card", () => {
    expect(shouldStartEditingNewCard({ body: "", attachmentCount: 0, createdAt: new Date(now - CARD_NEW_EDIT_WINDOW_MS) }, now)).toBe(false);
  });
});

describe("computeCardDragPosition", () => {
  it("adds the scaled pointer delta to the drag origin", () => {
    const pos = computeCardDragPosition({ x: 100, y: 50 }, { startClientX: 10, startClientY: 10 }, 30, 50, 2);
    expect(pos).toEqual({ x: 100 + (30 - 10) / 2, y: 50 + (50 - 10) / 2 });
  });
});

describe("computeCardResizeSize", () => {
  const session = { startWidth: 300, startHeight: 200, startClientX: 0, startClientY: 0 };
  it("grows by the scaled pointer delta", () => {
    expect(computeCardResizeSize(session, 40, 20, 2, 220, 170)).toEqual({ width: 320, height: 210 });
  });
  it("clamps to the minimums", () => {
    expect(computeCardResizeSize(session, -1000, -1000, 1, 220, 170)).toEqual({ width: 220, height: 170 });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/lib/card-interactions.test.ts`
Expected: FAIL — `Cannot find module './card-interactions'`.

- [ ] **Step 3: Create the module**

```ts
// src/features/scratchpad/lib/card-interactions.ts

/** Window after creation during which a blank card opens straight into edit mode. */
export const CARD_NEW_EDIT_WINDOW_MS = 5_000;

export function shouldStartEditingNewCard(
  input: { body: string; attachmentCount: number; createdAt: Date },
  now: number,
): boolean {
  return input.body.trim().length === 0 && input.attachmentCount === 0 && now - input.createdAt.getTime() < CARD_NEW_EDIT_WINDOW_MS;
}

export function computeCardDragPosition(
  origin: { x: number; y: number },
  session: { startClientX: number; startClientY: number },
  clientX: number,
  clientY: number,
  canvasScale: number,
): { x: number; y: number } {
  return {
    x: origin.x + (clientX - session.startClientX) / canvasScale,
    y: origin.y + (clientY - session.startClientY) / canvasScale,
  };
}

export function computeCardResizeSize(
  session: { startWidth: number; startHeight: number; startClientX: number; startClientY: number },
  clientX: number,
  clientY: number,
  canvasScale: number,
  minWidth: number,
  minHeight: number,
): { width: number; height: number } {
  return {
    width: Math.max(minWidth, session.startWidth + (clientX - session.startClientX) / canvasScale),
    height: Math.max(minHeight, session.startHeight + (clientY - session.startClientY) / canvasScale),
  };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/lib/card-interactions.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/scratchpad/lib/card-interactions.ts src/features/scratchpad/lib/card-interactions.test.ts
git commit -m "feat(scratchpad): extract card interaction math into a tested lib"
```

---

## Task 2: Extract `lib/workspace-geometry.ts` (TDD)

**Files:**
- Create: `src/features/scratchpad/lib/workspace-geometry.ts`
- Test: `src/features/scratchpad/lib/workspace-geometry.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import { formatScratchpadZoomLabel, getScratchpadItemCenter, getScratchpadWheelZoomFactor, isZoomGestureTargetAllowed } from "./workspace-geometry";

const item: ScratchpadItem = {
  id: "a",
  layout: { x: 100, y: 200, width: 280, height: 180, zIndex: 1 },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
};

describe("getScratchpadItemCenter", () => {
  it("returns the layout center", () => {
    expect(getScratchpadItemCenter(item)).toEqual({ x: 100 + 140, y: 200 + 90 });
  });
});

describe("formatScratchpadZoomLabel", () => {
  it("renders a rounded percent", () => {
    expect(formatScratchpadZoomLabel(1)).toBe("100%");
    expect(formatScratchpadZoomLabel(1.234)).toBe("123%");
  });
});

describe("getScratchpadWheelZoomFactor", () => {
  it("is >1 when scrolling up (negative deltaY) and <1 scrolling down", () => {
    expect(getScratchpadWheelZoomFactor(-100, 0.0015)).toBeGreaterThan(1);
    expect(getScratchpadWheelZoomFactor(100, 0.0015)).toBeLessThan(1);
    expect(getScratchpadWheelZoomFactor(0, 0.0015)).toBe(1);
  });
});

describe("isZoomGestureTargetAllowed", () => {
  function el(tag: string, attrs: Record<string, string> = {}) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  }
  it("allows a plain canvas path", () => {
    expect(isZoomGestureTargetAllowed([el("div"), el("section")])).toBe(true);
  });
  it("blocks UI-marked, form, and role-dialog targets", () => {
    expect(isZoomGestureTargetAllowed([el("div", { "data-scratchpad-ui": "true" })])).toBe(false);
    expect(isZoomGestureTargetAllowed([el("button")])).toBe(false);
    expect(isZoomGestureTargetAllowed([el("textarea")])).toBe(false);
    expect(isZoomGestureTargetAllowed([el("div", { role: "menu" })])).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/lib/workspace-geometry.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create the module**

```ts
// src/features/scratchpad/lib/workspace-geometry.ts
import type { ScratchpadItem } from "../types";

export function getScratchpadItemCenter(item: ScratchpadItem): { x: number; y: number } {
  return {
    x: item.layout.x + item.layout.width / 2,
    y: item.layout.y + item.layout.height / 2,
  };
}

export function formatScratchpadZoomLabel(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

export function getScratchpadWheelZoomFactor(deltaY: number, intensity: number): number {
  return Math.exp(-deltaY * intensity);
}

/** Whether a wheel/gesture composedPath is allowed to drive canvas zoom (vs. a UI/form element). */
export function isZoomGestureTargetAllowed(path: EventTarget[]): boolean {
  for (const candidate of path) {
    if (!(candidate instanceof HTMLElement)) {
      continue;
    }
    if (candidate.dataset.scratchpadUi === "true") {
      return false;
    }
    if (
      candidate.tagName === "BUTTON" ||
      candidate.tagName === "INPUT" ||
      candidate.tagName === "SELECT" ||
      candidate.tagName === "TEXTAREA" ||
      candidate.isContentEditable
    ) {
      return false;
    }
    const role = candidate.getAttribute("role");
    if (role === "dialog" || role === "menu" || role === "listbox") {
      return false;
    }
  }
  return true;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/lib/workspace-geometry.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/scratchpad/lib/workspace-geometry.ts src/features/scratchpad/lib/workspace-geometry.test.ts
git commit -m "feat(scratchpad): extract workspace geometry helpers into a tested lib"
```

---

## Task 3: Refactor `card-item.tsx` onto `card-interactions` + RTL test

**Files:**
- Modify: `src/features/scratchpad/components/card-item.tsx`
- Test: `src/features/scratchpad/components/card-item.test.tsx`

- [ ] **Step 1: Refactor card-item to use the extracted helpers**

In `card-item.tsx`, add the import:

```ts
import { computeCardDragPosition, computeCardResizeSize, shouldStartEditingNewCard } from "../lib/card-interactions";
```

Replace the `isEditing` initializer:

```ts
  const [isEditing, setIsEditing] = useState(() =>
    shouldStartEditingNewCard({ body, attachmentCount: attachments.length, createdAt: timestamps.createdAt }, Date.now()),
  );
```

Replace the body of `finishDrag` so the moved branch uses the helper:

```ts
  const finishDrag = (session: DragSession, clientX: number, clientY: number) => {
    if (session.moved) {
      onUpdateLayout(item.id, computeCardDragPosition(dragOriginRef.current, session, clientX, clientY, canvasScale));
    }

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };
```

Replace the size math in `handleResizePointerMove`:

```ts
    const next = computeCardResizeSize(session, e.clientX, e.clientY, canvasScale, MIN_WIDTH, MIN_HEIGHT);
    session.latestWidth = next.width;
    session.latestHeight = next.height;
    setLiveSize({ width: next.width, height: next.height });
```

(Delete the now-unused local `delta`/`nextWidth`/`nextHeight` lines in that handler.)

- [ ] **Step 2: Write the RTL test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("../hooks/use-attachment-previews", () => ({ useAttachmentPreviews: () => new Map() }));

import type { ScratchpadItem } from "../types";
import { CardItem } from "./card-item";

const oldDate = new Date("2020-01-01T00:00:00Z");
const makeItem = (overrides: Partial<ScratchpadItem> = {}): ScratchpadItem => ({
  id: "card-1",
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: "Hello world", attachments: [] },
  timestamps: { createdAt: oldDate, updatedAt: oldDate },
  ...overrides,
});

function renderCard(props: Partial<Parameters<typeof CardItem>[0]> = {}) {
  const handlers = {
    onUpdateBody: vi.fn(),
    onUpdateLayout: vi.fn(),
    onDelete: vi.fn(),
    onRemoveAttachment: vi.fn(),
    onOpenAttachment: vi.fn(),
    onSelect: vi.fn(),
  };
  render(<CardItem item={makeItem()} canvasScale={1} {...handlers} {...props} />);
  return handlers;
}

describe("CardItem", () => {
  it("renders the card body in display mode", () => {
    renderCard();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("enters edit mode on double-click and selects the card", async () => {
    const user = userEvent.setup();
    const handlers = renderCard();
    await user.dblClick(screen.getByText("Hello world"));

    expect(handlers.onSelect).toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue("Hello world");
  });

  it("opens a context menu and deletes via it", async () => {
    const user = userEvent.setup();
    const handlers = renderCard();

    const card = document.querySelector('[data-scratchpad-item-id="card-1"]') as HTMLElement;
    card.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, clientX: 10, clientY: 10 }));

    const deleteItem = await screen.findByRole("menuitem", { name: "Delete" });
    await user.click(deleteItem);
    expect(handlers.onDelete).toHaveBeenCalledWith("card-1");
  });
});
```

- [ ] **Step 3: Run the test**

Run: `pnpm exec vitest run src/features/scratchpad/components/card-item.test.tsx`
Expected: PASS. If the contextmenu menu does not appear via a raw `MouseEvent`, use `fireEvent.contextMenu(card, { clientX: 10, clientY: 10 })` from `@testing-library/react` instead.

- [ ] **Step 4: Confirm nothing regressed**

Run: `pnpm exec vitest run src/features/scratchpad/lib/card-interactions.test.ts src/features/scratchpad/components/card-item.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/scratchpad/components/card-item.tsx src/features/scratchpad/components/card-item.test.tsx
git commit -m "refactor(scratchpad): card-item consumes extracted interaction lib + tests"
```

---

## Task 4: Refactor `workspace.tsx` onto `workspace-geometry` + RTL test

**Files:**
- Modify: `src/features/scratchpad/components/workspace.tsx`
- Test: `src/features/scratchpad/components/workspace.test.tsx`

- [ ] **Step 1: Refactor workspace to use the extracted helpers**

Add the import:

```ts
import {
  formatScratchpadZoomLabel,
  getScratchpadItemCenter,
  getScratchpadWheelZoomFactor,
  isZoomGestureTargetAllowed,
} from "@/features/scratchpad/lib/workspace-geometry";
```

Delete the local `getScratchpadItemCenter` function (now imported). In `shouldHandleBrowserZoomGesture`, replace the manual `for...of path` loop with:

```ts
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    return isZoomGestureTargetAllowed(path);
```

In `handleWheel`, replace the zoom-factor line:

```ts
      const zoomFactor = getScratchpadWheelZoomFactor(event.deltaY, SCRATCHPAD_ZOOM_INTENSITY);
```

Replace the `zoomLabel` line:

```ts
  const zoomLabel = formatScratchpadZoomLabel(viewport.scale);
```

- [ ] **Step 2: Write the RTL test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./card-item", () => ({ CardItem: ({ item }: { item: { id: string } }) => <div data-testid="card" data-id={item.id} /> }));
vi.mock("./scratchpad-attachment-viewer", () => ({ ScratchpadAttachmentViewer: () => null }));

import type { ScratchpadItem, ScratchpadViewport } from "../types";
import { Workspace } from "./workspace";

const viewport: ScratchpadViewport = { x: 0, y: 0, scale: 1 };
const makeItem = (id: string): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: id, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

function renderWorkspace(items: ScratchpadItem[]) {
  const props = {
    items,
    viewport,
    onViewportChange: vi.fn(),
    onUpdateItemBody: vi.fn(),
    onUpdateItemLayout: vi.fn(),
    onDeleteItem: vi.fn(),
    onRemoveAttachment: vi.fn(),
    onCreateTextItem: vi.fn(),
    onFileUpload: vi.fn(),
    selectedItemIds: [] as string[],
    lastActiveItemId: null,
    onSelectItem: vi.fn(),
  };
  const { container } = render(<Workspace {...props} />);
  return { props, container };
}

describe("Workspace", () => {
  it("renders one card per item", () => {
    renderWorkspace([makeItem("a"), makeItem("b")]);
    expect(screen.getAllByTestId("card")).toHaveLength(2);
  });

  it("shows the empty state and the zoom label when there are no items", () => {
    renderWorkspace([]);
    expect(screen.getByText("Double-click anywhere to add a card")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("creates a text item on background double-click", () => {
    const { props, container } = renderWorkspace([]);
    fireEvent.dblClick(container.firstChild as HTMLElement, { clientX: 120, clientY: 90 });
    expect(props.onCreateTextItem).toHaveBeenCalledWith(120, 90);
  });

  it("clears the selection on a background click", () => {
    const { props, container } = renderWorkspace([makeItem("a")]);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(props.onSelectItem).toHaveBeenCalledWith(null);
  });

  it("flags drag-over on drag enter", () => {
    const { container } = renderWorkspace([]);
    fireEvent.dragOver(container.firstChild as HTMLElement);
    expect(screen.getByText("Drop files here")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test**

Run: `pnpm exec vitest run src/features/scratchpad/components/workspace.test.tsx`
Expected: PASS. Note: jsdom `getBoundingClientRect` returns zeros, so `getCanvasPoint` maps client (120,90) to canvas (120,90) at scale 1 — matching the assertion.

- [ ] **Step 4: Commit**

```bash
git add src/features/scratchpad/components/workspace.tsx src/features/scratchpad/components/workspace.test.tsx
git commit -m "refactor(scratchpad): workspace consumes geometry lib + RTL tests"
```

---

## Task 5: `scratchpad-empty-state.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-empty-state.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScratchpadEmptyState } from "./scratchpad-empty-state";

describe("ScratchpadEmptyState", () => {
  it("renders the prompt copy", () => {
    render(<ScratchpadEmptyState />);
    expect(screen.getByText("Double-click anywhere to add a card")).toBeInTheDocument();
    expect(screen.getByText("Paste or drop files to collect them here.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-empty-state.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover empty state"`

---

## Task 6: `scratchpad-drop-overlay.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-drop-overlay.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScratchpadDropOverlay } from "./scratchpad-drop-overlay";

describe("ScratchpadDropOverlay", () => {
  it("renders the drop affordance", () => {
    render(<ScratchpadDropOverlay />);
    expect(screen.getByText("Drop files here")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-drop-overlay.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover drop overlay"`

---

## Task 7: `scratchpad-canvas-background.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-canvas-background.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getScratchpadCanvasBackgroundStyle, ScratchpadCanvasBackground } from "./scratchpad-canvas-background";

describe("getScratchpadCanvasBackgroundStyle", () => {
  it("encodes the pan offset and scale-derived grid sizes", () => {
    const style = getScratchpadCanvasBackgroundStyle({ x: 12, y: 34, scale: 2 });
    expect(style.backgroundPosition).toContain("12px 34px");
    expect(style.backgroundSize).toContain("64px 64px"); // 32 * scale
    expect(style.backgroundSize).toContain("320px 320px"); // 160 * scale
  });
});

describe("ScratchpadCanvasBackground", () => {
  it("renders a styled background layer", () => {
    const { container } = render(<ScratchpadCanvasBackground viewport={{ x: 0, y: 0, scale: 1 }} />);
    const layer = container.firstChild as HTMLElement;
    expect(layer).toHaveStyle({ backgroundPosition: "0px 0px, 0px 0px, 0px 0px, 0px 0px" });
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-canvas-background.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover canvas background style"`

---

## Task 8: `scratchpad-card-body.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-card-body.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ScratchpadCardBody } from "./scratchpad-card-body";

const baseProps = {
  textClassName: "",
  placeholderClassName: "text-stone-500",
  textareaRef: createRef<HTMLTextAreaElement>(),
  onBlur: vi.fn(),
  onChange: vi.fn(),
  onKeyDown: vi.fn(),
  onPointerDown: vi.fn(),
};

describe("ScratchpadCardBody", () => {
  it("renders the body text in display mode", () => {
    render(<ScratchpadCardBody {...baseProps} body="Some note" isEditing={false} />);
    expect(screen.getByText("Some note")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows the placeholder text when the body is empty", () => {
    render(<ScratchpadCardBody {...baseProps} body="   " isEditing={false} />);
    expect(screen.getByText("Any thoughts...")).toBeInTheDocument();
  });

  it("renders a textarea in editing mode and forwards change events", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ScratchpadCardBody {...baseProps} onChange={onChange} body="" isEditing />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("placeholder", "Any thoughts...");
    await user.type(textarea, "x");
    expect(onChange).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-card-body.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover card body modes"`

---

## Task 9: `scratchpad-viewport-lock.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-viewport-lock.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScratchpadViewportLock } from "./scratchpad-viewport-lock";

afterEach(() => {
  document.head.querySelectorAll('meta[name="viewport"]').forEach((node) => node.remove());
});

describe("ScratchpadViewportLock", () => {
  it("sets the locked viewport meta while mounted and removes it on unmount when none existed", () => {
    const { unmount } = render(<ScratchpadViewportLock />);
    const meta = document.head.querySelector('meta[name="viewport"]');
    expect(meta?.getAttribute("content")).toContain("maximum-scale=1.0");
    expect(meta?.getAttribute("content")).toContain("user-scalable=no");

    unmount();
    expect(document.head.querySelector('meta[name="viewport"]')).toBeNull();
  });

  it("restores a pre-existing viewport meta on unmount", () => {
    const existing = document.createElement("meta");
    existing.setAttribute("name", "viewport");
    existing.setAttribute("content", "width=device-width, initial-scale=1");
    document.head.appendChild(existing);

    const { unmount } = render(<ScratchpadViewportLock />);
    expect(existing.getAttribute("content")).toContain("user-scalable=no");
    unmount();
    expect(existing.getAttribute("content")).toBe("width=device-width, initial-scale=1");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-viewport-lock.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover viewport lock meta handling"`

---

## Task 10: `scratchpad-zoom-controls.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-zoom-controls.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScratchpadZoomControls } from "./scratchpad-zoom-controls";

function setup(overrides = {}) {
  const props = {
    zoomLabel: "100%",
    visible: true,
    onHoverChange: vi.fn(),
    onFocusChange: vi.fn(),
    onZoomOut: vi.fn(),
    onReset: vi.fn(),
    onZoomIn: vi.fn(),
    ...overrides,
  };
  render(<ScratchpadZoomControls {...props} />);
  return props;
}

describe("ScratchpadZoomControls", () => {
  it("renders the zoom label and three controls", () => {
    setup();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
  });

  it("fires the zoom callbacks", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    await user.click(screen.getByRole("button", { name: "Zoom out" }));
    await user.click(screen.getByText("100%"));
    expect(props.onZoomIn).toHaveBeenCalledTimes(1);
    expect(props.onZoomOut).toHaveBeenCalledTimes(1);
    expect(props.onReset).toHaveBeenCalledTimes(1);
  });

  it("reports hover changes", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.hover(screen.getByText("100%"));
    expect(props.onHoverChange).toHaveBeenCalledWith(true);
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-zoom-controls.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover zoom controls"`

---

## Task 11: `scratchpad-account-menu-section.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-account-menu-section.test.tsx`

Note: the component returns `null` when Clerk is unconfigured. Test that branch directly (no Clerk needed); the signed-in branch is exercised indirectly by the toolbar test.

- [ ] **Step 1: Write the test**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// vi.mock factories are hoisted above module-level consts; use vi.hoisted.
const { useIsClerkConfigured } = vi.hoisted(() => ({ useIsClerkConfigured: vi.fn() }));
vi.mock("@/shared/auth/clerk-config", () => ({ useIsClerkConfigured }));

import { ScratchpadAccountMenuSection } from "./scratchpad-account-menu-section";

describe("ScratchpadAccountMenuSection", () => {
  it("renders nothing when Clerk is not configured", () => {
    useIsClerkConfigured.mockReturnValue(false);
    const { container } = render(<ScratchpadAccountMenuSection />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-account-menu-section.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover account menu unconfigured branch"`

---

## Task 12: `scratchpad-toolbar.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-toolbar.test.tsx`

Note: when Clerk is unconfigured, the trigger shows the logo and the account section is empty — no Clerk provider needed.

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// vi.mock factories are hoisted above module-level consts; use vi.hoisted.
const { useIsClerkConfigured } = vi.hoisted(() => ({ useIsClerkConfigured: vi.fn(() => false) }));
vi.mock("@/shared/auth/clerk-config", () => ({ useIsClerkConfigured }));
vi.mock("@/features/account/components/theme-menu-items", () => ({ ThemeMenuItems: () => null }));

import { ScratchpadToolbar } from "./scratchpad-toolbar";

describe("ScratchpadToolbar", () => {
  it("renders the menu trigger with the Memos logo when Clerk is unconfigured", () => {
    render(<ScratchpadToolbar />);
    const trigger = screen.getByRole("button", { name: "Memos menu" });
    expect(trigger).toBeInTheDocument();
    expect(screen.getByAltText("Memos")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-toolbar.test.tsx` — Expected: PASS. The trigger uses `title="Memos menu"`; if `getByRole("button", { name: ... })` does not match the title, fall back to `screen.getByTitle("Memos menu")`.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover toolbar trigger"`

---

## Task 13: `scratchpad-attachment-grid.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-attachment-grid.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ScratchpadAttachmentRef } from "../types";
import { ScratchpadAttachmentGrid } from "./scratchpad-attachment-grid";

const imageRef: ScratchpadAttachmentRef = { id: "img-1", name: "photo.png", type: "image/png", size: 10 };
const docRef: ScratchpadAttachmentRef = { id: "doc-1", name: "notes.txt", type: "text/plain", size: 5 };

function setup(attachments: ScratchpadAttachmentRef[], previewMap = new Map<string, { previewUrl: string | null }>()) {
  const props = {
    itemId: "card-1",
    attachments,
    previewMap,
    onOpenAttachment: vi.fn(),
    onRemoveAttachment: vi.fn(),
  };
  render(<ScratchpadAttachmentGrid {...props} />);
  return props;
}

describe("ScratchpadAttachmentGrid", () => {
  it("renders nothing when there are no attachments", () => {
    const { container } = render(
      <ScratchpadAttachmentGrid itemId="c" attachments={[]} previewMap={new Map()} onOpenAttachment={vi.fn()} onRemoveAttachment={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an image preview when a preview URL is available", () => {
    setup([imageRef], new Map([["img-1", { previewUrl: "blob:mock/1" }]]));
    expect(screen.getByRole("img", { name: "photo.png" })).toHaveAttribute("src", "blob:mock/1");
  });

  it("falls back to a file tile for non-images", () => {
    setup([docRef]);
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
  });

  it("fires open and remove callbacks", async () => {
    const user = userEvent.setup();
    const props = setup([docRef]);
    await user.click(screen.getByRole("button", { name: "Open attachment notes.txt" }));
    await user.click(screen.getByRole("button", { name: "Remove attachment" }));
    expect(props.onOpenAttachment).toHaveBeenCalledWith(docRef);
    expect(props.onRemoveAttachment).toHaveBeenCalledWith("card-1", "doc-1");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-attachment-grid.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover attachment grid"`

---

## Task 14: `scratchpad-attachment-viewer.tsx`

**Files:**
- Test: `src/features/scratchpad/components/scratchpad-attachment-viewer.test.tsx`

Note: mock `getFile` from `../lib/indexeddb`. The component object-URLs the blob and reads text via `blob.text()`.

- [ ] **Step 1: Write the test**

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/indexeddb", () => ({ getFile: vi.fn() }));

import { getFile } from "../lib/indexeddb";
import type { FileData, ScratchpadAttachmentRef } from "../types";
import { ScratchpadAttachmentViewer } from "./scratchpad-attachment-viewer";

const ref: ScratchpadAttachmentRef = { id: "a", name: "photo.png", type: "image/png", size: 10 };
const imageFile: FileData = { id: "a", name: "photo.png", type: "image/png", size: 10, blob: new Blob(["x"]), uploadedAt: new Date() };

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

describe("ScratchpadAttachmentViewer", () => {
  it("renders nothing without an attachment", () => {
    const { container } = render(<ScratchpadAttachmentViewer attachment={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("loads and shows an image preview", async () => {
    vi.mocked(getFile).mockResolvedValue(imageFile);
    render(<ScratchpadAttachmentViewer attachment={ref} onClose={vi.fn()} />);
    expect(await screen.findByRole("img", { name: "photo.png" })).toBeInTheDocument();
  });

  it("shows an error when the file is gone", async () => {
    vi.mocked(getFile).mockResolvedValue(null);
    render(<ScratchpadAttachmentViewer attachment={ref} onClose={vi.fn()} />);
    expect(await screen.findByText(/no longer available/)).toBeInTheDocument();
  });

  it("closes on the Escape key and the close button", async () => {
    vi.mocked(getFile).mockResolvedValue(imageFile);
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ScratchpadAttachmentViewer attachment={ref} onClose={onClose} />);

    await screen.findByRole("img", { name: "photo.png" });
    await user.click(screen.getByRole("button", { name: "Close attachment preview" }));
    expect(onClose).toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run src/features/scratchpad/components/scratchpad-attachment-viewer.test.tsx` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover attachment viewer"`

---

## Task 15: `scratchpad/page.tsx`

**Files:**
- Test: `src/app/(tools)/scratchpad/page.test.tsx`

Note: mock `useScratchpad` and the two heavy children so the test isolates the `isClient` gate and prop wiring.

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// vi.mock factories are hoisted above module-level consts; use vi.hoisted.
const { useScratchpad } = vi.hoisted(() => ({ useScratchpad: vi.fn() }));
vi.mock("@/features/scratchpad/hooks/use-scratchpad", () => ({ useScratchpad }));
vi.mock("@/features/scratchpad/components/scratchpad-toolbar", () => ({ ScratchpadToolbar: () => <div data-testid="toolbar" /> }));
vi.mock("@/features/scratchpad/components/workspace", () => ({
  Workspace: ({ items }: { items: Array<{ id: string }> }) => <div data-testid="workspace">{items.length}</div>,
}));

import ScratchPage from "./page";

const baseHook = {
  handleCreateTextItem: vi.fn(),
  handleDeleteItem: vi.fn(),
  handleFileUpload: vi.fn(),
  handleRemoveAttachment: vi.fn(),
  handleSelectItem: vi.fn(),
  handleUpdateItemBody: vi.fn(),
  handleUpdateItemLayout: vi.fn(),
  items: [{ id: "a" }],
  lastActiveItemId: null,
  selectedItemIds: [],
  setViewport: vi.fn(),
  viewport: { x: 0, y: 0, scale: 1 },
};

describe("ScratchPage", () => {
  it("renders nothing until the client is ready", () => {
    useScratchpad.mockReturnValue({ ...baseHook, isClient: false });
    const { container } = render(<ScratchPage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the toolbar and workspace once client-ready", () => {
    useScratchpad.mockReturnValue({ ...baseHook, isClient: true });
    render(<ScratchPage />);
    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("workspace")).toHaveTextContent("1");
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run "src/app/(tools)/scratchpad/page.test.tsx"` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover page client gating"`

---

## Task 16: `scratchpad/layout.tsx`

**Files:**
- Test: `src/app/(tools)/scratchpad/layout.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/scratchpad/components/scratchpad-viewport-lock", () => ({ ScratchpadViewportLock: () => <div data-testid="viewport-lock" /> }));

import ScratchLayout, { dynamic, metadata } from "./layout";

describe("ScratchLayout", () => {
  it("renders the viewport lock and its children", () => {
    render(
      <ScratchLayout>
        <main data-testid="content">hi</main>
      </ScratchLayout>,
    );
    expect(screen.getByTestId("viewport-lock")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("exports static rendering and no-index metadata", () => {
    expect(dynamic).toBe("force-static");
    expect(metadata.title).toBe("Scratchpad");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run "src/app/(tools)/scratchpad/layout.test.tsx"` — Expected: PASS.
- [ ] **Step 3: Commit** `git add -A && git commit -m "test(scratchpad): cover layout metadata + render"`

---

## Final verification

- [ ] Run the whole suite: `pnpm test` — expect all green (Plans 1 + 2 + the 16 Plan 3 files).
- [ ] Run `pnpm lint` — expect pass (commit any Biome formatting).
- [ ] Run `pnpm build` — expect success. This is the safety net for the `card-item.tsx` and `workspace.tsx` refactors (Tasks 3-4); a type error or broken import surfaces here.

---

## Self-review notes

- **Spec coverage:** extractions/refactors — `card-interactions` + `card-item` (Tasks 1, 3), `workspace-geometry` + `workspace` (Tasks 2, 4); presentational components — empty-state, drop-overlay, canvas-background, card-body, viewport-lock, zoom-controls, account-menu-section, toolbar, attachment-grid, attachment-viewer (Tasks 5-14); pages — page, layout (Tasks 15-16). Every component listed in the spec's scratchpad UI section has a task.
- **Refactor discipline:** Tasks 1-2 are genuine red-green (new modules tested before they exist); Tasks 3-4 refactor the components to consume them with behavior preserved, guarded by the component RTL tests and `pnpm build`.
- **Determinism:** the only nondeterministic card path (`Date.now()` in the new-card edit window) is tested via the pure `shouldStartEditingNewCard(input, now)` with an explicit `now`; the component test uses an old `createdAt` so it deterministically starts in display mode.
- **Type consistency:** `ScratchpadItem`, `ScratchpadViewport`, `ScratchpadAttachmentRef`, `FileData`, and the new helpers' signatures match the source read while writing this plan. The `Workspace`/`CardItem` prop shapes match their component definitions.
