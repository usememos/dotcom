## References

- [tldraw README](https://github.com/tldraw/tldraw)
- [tldraw Store docs](https://tldraw.dev/reference/store/Store)
- [React Flow: Panning and Zooming](https://reactflow.dev/learn/concepts/the-viewport)
- [Excalidraw API: excalidrawAPI](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api)

## Industry Baseline

tldraw positions an infinite-canvas app around a central engine and explicitly separates extensible canvas behavior from UI surface concerns; its README describes a “feature-complete infinite canvas engine” and “DOM canvas” support, while its Store docs define a central reactive container with history, schema validation, side effects, and scoped persistence. React Flow documents viewport as a first-class concept independent from nodes and recommends explicit pan/zoom/select control schemes rather than scroll-container behavior. Excalidraw exposes scene and app state separately through `updateScene`, `getSceneElements`, `getAppState`, and history access, which reflects a clear editor API boundary between document content and editor state.

## Research Summary

Across these projects, the recurring pattern is not “use `<canvas>` everywhere,” but “define a central editor model.” Document content, viewport, and editor UI state are modeled explicitly; rendering technology is a downstream choice. The common baseline is a state container or editor API that owns mutations, while components consume selectors and dispatch commands. Viewport is handled as camera math rather than scroll offsets, and controls are treated as external UI around that camera. This fits the current scratchpad codebase because the main maintenance problem is architectural diffusion of state and commands, not raw rendering performance.

## Design Goals

- Scratchpad document mutations must flow through pure editor helpers or reducer actions so item creation, selection, z-index changes, and viewport updates are testable and inspectable without DOM access.
- Viewport state must be modeled explicitly and persisted through one storage abstraction rather than local component keys.
- `useScratchpad` must stop owning low-level item mutation rules directly; it should orchestrate persistence, attachment IO, and remote save flows on top of editor commands.
- Page-level components must consume a narrower surface than the current callback fan-out in [src/app/scratchpad/page.tsx](/Users/steven/Projects/usememos/dotcom/src/app/scratchpad/page.tsx).
- Existing persisted cards and instance configuration must continue loading without migration loss.

## Non-Goals

- Do not replace DOM card rendering with a vector or bitmap renderer.
- Do not add collaborative transport, operational transforms, or multiplayer presence.
- Do not add undo/redo history, lasso selection, or connectors in this refactor.
- Do not redesign Memos save semantics or attachment upload endpoints.

## Proposed Design

Introduce an editor layer under `src/lib/scratch/` that defines scratchpad document state, viewport state, reducer actions, selectors, and coordinate helpers. This layer will own item factories, dirty-state transitions, z-index sequencing, selection logic, and viewport math. The design follows the central-store pattern shown in tldraw’s Store docs and the scene/app-state split surfaced by Excalidraw’s API.

Move viewport persistence into [src/lib/scratch/storage.ts](/Users/steven/Projects/usememos/dotcom/src/lib/scratch/storage.ts) so document-adjacent state is saved through one abstraction instead of ad hoc `localStorage` keys inside rendering components. Keep item persistence backward-compatible by preserving the existing item envelope and extending storage with a dedicated viewport API.

Refactor [src/hooks/use-scratchpad.ts](/Users/steven/Projects/usememos/dotcom/src/hooks/use-scratchpad.ts) into a composition root over a smaller editor hook. The internal editor hook will manage reducer state, hydration, debounced persistence, and keyboard behavior. `useScratchpad` will remain the public feature hook and will compose editor commands with IndexedDB attachment IO and Memos instance/save orchestration.

Thin [src/components/scratch/workspace.tsx](/Users/steven/Projects/usememos/dotcom/src/components/scratch/workspace.tsx) into a viewport interaction component that receives `viewport`, `setViewport`, item data, and editor commands via props. It will keep transient pointer-session state only. This matches React Flow’s viewport-first model and keeps camera logic reusable.

Extract page-level chrome into a dedicated toolbar component so [src/app/scratchpad/page.tsx](/Users/steven/Projects/usememos/dotcom/src/app/scratchpad/page.tsx) becomes a composition shell instead of a feature controller. Keep attachment preview loading card-local for now, but isolate it from editor/document state because it is presentational asset hydration rather than core editor state.
