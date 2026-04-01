## Background & Context

The `scratchpad` feature is a browser-based note board for creating free-positioned cards, attaching files, and saving selected cards into a Memos instance. The current implementation grew from a simple local card board into an infinite-canvas-like surface with attachment previews, Memos connectivity, and viewport controls. The feature now spans UI rendering, editor interactions, local persistence, IndexedDB attachment storage, and remote save orchestration.

## Issue Statement

Scratchpad editor behavior is distributed across page, hook, and component layers without a single document state boundary, causing viewport state, selection state, item mutations, persistence timing, attachment handling, and remote-save transitions to be updated through overlapping ad hoc callbacks instead of a unified editor model.

## Current State

- [src/hooks/use-scratchpad.ts](/Users/steven/Projects/usememos/dotcom/src/hooks/use-scratchpad.ts#L62) owns local document data, selection state, instance storage, attachment persistence, save orchestration, keyboard shortcuts, and UI flags in one hook.
- [src/hooks/use-scratchpad.ts](/Users/steven/Projects/usememos/dotcom/src/hooks/use-scratchpad.ts#L161) creates items directly inside the orchestration hook, while [src/hooks/use-scratchpad.ts](/Users/steven/Projects/usememos/dotcom/src/hooks/use-scratchpad.ts#L171) handles file ingestion and decides whether files attach to an existing item or create a new item.
- [src/hooks/use-scratchpad.ts](/Users/steven/Projects/usememos/dotcom/src/hooks/use-scratchpad.ts#L245) updates remote sync state inline with local item mutations and instance refresh logic.
- [src/components/scratch/workspace.tsx](/Users/steven/Projects/usememos/dotcom/src/components/scratch/workspace.tsx#L44) owns viewport state, pan/zoom math, coordinate transforms, local viewport persistence, paste handling, drag-and-drop routing, and canvas HUD rendering.
- [src/components/scratch/card-item.tsx](/Users/steven/Projects/usememos/dotcom/src/components/scratch/card-item.tsx#L47) owns card drag/resize interaction, textarea sizing, attachment preview loading from IndexedDB, and sync-status display.
- [src/app/scratchpad/page.tsx](/Users/steven/Projects/usememos/dotcom/src/app/scratchpad/page.tsx#L13) wires a large callback surface directly into `Workspace` and mixes top-bar UI with feature orchestration.
- [src/lib/scratch/storage.ts](/Users/steven/Projects/usememos/dotcom/src/lib/scratch/storage.ts#L226) persists items, but viewport persistence is not modeled alongside the document. [src/lib/scratch/storage.ts](/Users/steven/Projects/usememos/dotcom/src/lib/scratch/storage.ts#L275) clears items using a payload shape that differs from the versioned envelope used elsewhere.
- [src/lib/scratch/types.ts](/Users/steven/Projects/usememos/dotcom/src/lib/scratch/types.ts#L59) models cards and sync state, but there is no explicit editor/document or viewport type for the scratchpad feature.

## Non-Goals

- Do not redesign the Memos API protocol in [src/lib/scratch/api.ts](/Users/steven/Projects/usememos/dotcom/src/lib/scratch/api.ts).
- Do not introduce collaborative sync, undo/redo history, connectors, or freehand drawing in this change.
- Do not replace card rendering with HTML `<canvas>` or WebGL rendering in this change.
- Do not change the existing persisted card schema in a way that invalidates stored user content.

## Open Questions

- Should viewport state persist with the document or remain transient UI state? (default: persist viewport locally with the document experience)
- Should scratchpad orchestration expose one public hook or multiple hooks at the page boundary? (default: keep one public feature hook composed from smaller internal hooks)
- Should attachment preview loading remain card-local or move to a shared cache layer? (default: keep previews card-local for now, but isolate them from editor state)

## Scope

L — the current state spans multiple files with cross-cutting editor behavior, no explicit editor/document model, and at least two viable architectural directions (continued callback accretion vs. reducer/editor refactor).
