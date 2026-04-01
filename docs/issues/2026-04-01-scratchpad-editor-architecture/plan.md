## Task List

T1: Add scratchpad editor primitives [L] — T2: Move feature state into an editor hook [M] — T3: Thin page/workspace UI around editor state [L]

### T1: Add scratchpad editor primitives [L]

**Objective**: Introduce a central scratchpad editor model for items, selection, and viewport.
**Size**: L
**Files**:
- Create: `src/lib/scratch/editor.ts`
- Create: `src/lib/scratch/viewport.ts`
- Modify: `src/lib/scratch/types.ts`
- Modify: `src/lib/scratch/storage.ts`
**Implementation**:
1. In `src/lib/scratch/types.ts`, add explicit viewport typing used by document/editor state.
2. In `src/lib/scratch/editor.ts`, add editor state, reducer actions, selectors, item factory helpers, dirty-state helpers, and z-index/selection logic.
3. In `src/lib/scratch/viewport.ts`, add pure pan/zoom and screen-to-canvas math helpers.
4. In `src/lib/scratch/storage.ts`, add viewport storage and align item clearing with the versioned item envelope.
**Boundaries**: Do not change Memos API behavior or card rendering markup here.
**Dependencies**: None
**Expected Outcome**: Scratchpad has reusable editor/document and viewport logic outside of React components.
**Validation**: `pnpm exec tsc --noEmit` — exits 0

### T2: Move feature state into an editor hook [M]

**Objective**: Isolate scratchpad document state, hydration, persistence, and local editing commands behind a dedicated hook.
**Size**: M
**Files**:
- Create: `src/hooks/use-scratchpad-editor.ts`
- Modify: `src/hooks/use-scratchpad.ts`
**Implementation**:
1. In `src/hooks/use-scratchpad-editor.ts`, use the new reducer/state helpers to hydrate items and viewport, persist them, and expose item/viewport commands plus local keyboard/delete behavior.
2. In `src/hooks/use-scratchpad.ts`, compose the editor hook with instance storage and remote-save orchestration while shrinking direct document-mutation logic.
**Boundaries**: Do not redesign connection testing or remote save semantics.
**Dependencies**: T1
**Expected Outcome**: `useScratchpad` becomes a composition root over a narrower editor command surface.
**Validation**: `pnpm exec tsc --noEmit` — exits 0

### T3: Thin page/workspace UI around editor state [L]

**Objective**: Make scratchpad components consume explicit editor state instead of owning editor logic ad hoc.
**Size**: L
**Files**:
- Create: `src/components/scratch/scratchpad-toolbar.tsx`
- Modify: `src/components/scratch/workspace.tsx`
- Modify: `src/app/scratchpad/page.tsx`
- Modify: `src/components/scratch/card-item.tsx`
**Implementation**:
1. In `src/components/scratch/workspace.tsx`, consume external viewport state and pure viewport helpers while keeping only transient pointer-session state locally.
2. In `src/components/scratch/scratchpad-toolbar.tsx`, extract top-bar UI and menu chrome from the page component.
3. In `src/app/scratchpad/page.tsx`, reduce the page to feature composition.
4. In `src/components/scratch/card-item.tsx`, keep drag/resize behavior compatible with externally managed viewport scale.
**Boundaries**: Do not add new editor capabilities such as connectors, drawing tools, or collaboration.
**Dependencies**: T1, T2
**Expected Outcome**: Page-level code is thinner and editor state flow is explicit at the component boundary.
**Validation**: `pnpm exec biome check src/app/scratchpad/page.tsx src/components/scratch/workspace.tsx src/components/scratch/card-item.tsx src/components/scratch/scratchpad-toolbar.tsx src/hooks/use-scratchpad.ts src/hooks/use-scratchpad-editor.ts src/lib/scratch/editor.ts src/lib/scratch/viewport.ts src/lib/scratch/storage.ts src/lib/scratch/types.ts && pnpm exec tsc --noEmit` — exits 0

## Out-of-Scope Tasks

- Add undo/redo history
- Add lasso or marquee multi-select
- Replace DOM card rendering with `<canvas>` or WebGL
- Add multiplayer or collaborative syncing
