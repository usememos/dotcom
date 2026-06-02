# Scratchpad Polish Refactor Design

## Goal

Refactor the scratchpad toward clearer type boundaries and smaller UI components while applying restrained sticky-board visual polish inspired by common web sticky-note tools.

## Context

Scratchpad already has a reducer-backed editor hook, local item persistence, explicit viewport state, attachment storage, and a single Memos instance setting. The remaining maintenance pressure is concentrated in broad item types and large UI components:

- `src/features/scratchpad/types.ts` keeps item layout, content, sync, and timestamps flat in one interface.
- `src/features/scratchpad/components/card-item.tsx` owns card frame styling, editing, drag, resize, attachment previews, attachment removal, and sync badges.
- `src/features/scratchpad/components/workspace.tsx` owns canvas interaction, background styling, empty state, drop overlay, and zoom controls.
- `src/features/scratchpad/components/scratchpad-toolbar.tsx` repeats menu and control styling inline.

The refactor should improve maintainability without introducing an oversized design system or changing the core scratchpad workflow.

## Reference Baseline

Miro and FigJam both treat sticky notes as first-class board objects. Common patterns are toolbar creation, low-friction placement, constrained sticky color systems, selection controls, and simple canvas affordances. Scratchpad should borrow the familiar board feel, but remain lightweight and personal: local-first cards, double-click creation, drag, resize, paste/drop files, and save selected cards to Memos.

## Proposed Approach

Use a balanced refactor:

- Restructure type definitions around document, item layout, item content, item sync, editor state, and UI tokens.
- Extract focused presentational components from `CardItem` and `Workspace`.
- Polish the sticky-board visuals through shared style tokens and small presentational helpers.
- Keep current behavior and persisted content compatible.

This avoids a rewrite while removing the most obvious coupling.

## Type Structure

Introduce clearer type layers in `src/features/scratchpad/types.ts`:

- `ScratchpadDocument`: persisted board content. Initially contains `items`, and can later grow without mixing editor UI state into storage.
- `ScratchpadItem`: persisted card model with nested responsibility groups:
  - `layout`: `x`, `y`, `width`, `height`, `zIndex`
  - `content`: `body`, `attachments`
  - `sync`: existing Memos sync state
  - `timestamps`: `createdAt`, `updatedAt`
- `ScratchpadEditorState`: runtime editor state with `document`, `selectedItemIds`, `viewport`, and `lastTransaction`.
- `ScratchpadItemPatch`: explicit patch shape for reducer commands, instead of broad `Partial<ScratchpadItem>` in UI-facing APIs.
- `ScratchpadCardTone`: constrained visual token, such as `yellow`, `pink`, `blue`, `green`, or `purple`.

Keep `ScratchpadViewport`, attachment refs, Memos instance setting, and API response types focused and unchanged unless naming needs to follow the grouped item structure.

## Storage Compatibility

Storage must read existing flat item records and migrate them in memory to the grouped shape:

- `x`, `y`, `width`, `height`, `zIndex` map to `layout`.
- `body` and `attachments` map to `content`.
- `sync` remains `sync`.
- `createdAt` and `updatedAt` map to `timestamps`.

After migration, storage writes only the current versioned document envelope. Existing attachment refs and synced memo refs must remain valid.

If stored data is malformed, keep the current conservative behavior: return an empty document rather than writing a guessed structure over user data.

## Component Boundaries

Refactor `CardItem` into smaller pieces:

- `ScratchpadCardFrame`: absolute positioning, selection ring, drag affordance, and resize handle.
- `ScratchpadCardBody`: read/edit text rendering, textarea autosize, focus, and keyboard behavior.
- `ScratchpadAttachmentGrid`: attachment preview rendering and remove buttons.
- `ScratchpadSyncBadge`: saving, error, dirty, and synced indicators.

Refactor `Workspace` into smaller pieces:

- `ScratchpadCanvasBackground`: background and grid styling.
- `ScratchpadEmptyState`: empty board prompt.
- `ScratchpadDropOverlay`: drag/drop state.
- `ScratchpadZoomControls`: zoom in, zoom out, reset, and zoom label.

Keep `Workspace` responsible for viewport and pointer interaction. Keep `CardItem` or its frame responsible for drag and resize interaction. Do not move interaction logic into purely presentational components.

Toolbar/menu cleanup should stay small: extract repeated menu item classes or tiny menu helpers only where it reduces repetition.

## Visual Polish

Use a restrained sticky-board visual direction:

- Warm board background with subtle grid.
- Constrained sticky palette tokens, not ad hoc one-off colors.
- Small sticky-note radii so cards still read as paper.
- Clearer selected state and sync badges.
- Empty and drop overlays that look like board UI, not marketing sections.
- Dark mode must remain supported.

Do not add a color picker, connectors, lasso selection, comments, collaboration, or new board object types in this pass.

## Data Flow

The editor reducer owns document and viewport mutations:

- create item
- patch item layout
- patch item content
- patch item sync
- add and remove attachments
- select and delete items
- set viewport

`useScratchpadEditor` remains responsible for reducer state, hydration, debounced persistence, keyboard shortcuts, and local attachment commands.

`useScratchpad` remains responsible for Memos instance settings, Memos save orchestration, save-block reasons, and remote sync transitions.

Page and UI components should receive focused props and commands rather than broad item mutation callbacks when a narrower API is practical.

## Error Handling

- Existing local cards must load after migration.
- Existing attachment refs must continue resolving from IndexedDB.
- Existing `memoRef` and `instanceId` sync data must continue saving updates to the same memo.
- Connection and save errors keep the current alert plus item error state behavior.
- Migration errors should not delete user storage unless the existing storage layer already treats the payload as unrecoverable.

## Testing And Verification

Add focused tests for:

- flat-item to grouped-item migration
- grouped item hydration dates
- reducer operations for layout, content, sync, selection, and deletion

Verification commands:

- `node --test` for focused scratchpad tests
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`

Because this includes UI polish, implementation should also run the local app and inspect `/scratchpad` at desktop and mobile-ish widths. Screenshots are verification artifacts, not part of the brainstorming process.

## Non-Goals

- No new backend behavior.
- No Memos API protocol redesign.
- No collaborative editing.
- No undo/redo.
- No lasso selection.
- No custom color picker.
- No replacement of DOM cards with canvas, SVG, or WebGL rendering.
- No broad shared design system.
