# Scratchpad Card-First Usability Design

## Goal

Make Scratchpad feel like a focused, browser-local workspace where cards are the obvious primary object. Secondary controls such as the menu and zoom controls should remain available without competing visually with the cards.

## Scope

This is a usability and visual refinement pass for the existing local-only Scratchpad. It covers card interaction affordances, dark mode, the top-right menu, zoom control visibility, and canvas visual hierarchy.

This pass does not add Memos sync, rich text editing, collaboration, new persistence models, or a command menu.

## Current Problems

- Cards are usable, but their interaction model is not obvious enough for first-time use.
- The zoom control is always visible and reads as more important than it is.
- The top-right menu has a glossy, heavy visual style that does not match the intended minimal workspace.
- Dark mode is too heavy and brown-black, while cards keep light paper styling that can feel disconnected from the canvas.
- Resize and selection states need clearer affordances without becoming visually loud.

## Design Direction

Use a card-first hierarchy inspired by simple canvas tools and Notion-like restraint:

- Cards should be the brightest and clearest objects on the screen.
- Canvas, zoom, and menu chrome should be neutral and low-emphasis.
- Interaction states should be visible when needed and quiet otherwise.
- Dark mode should be calm, neutral, and readable rather than decorative.

## Card Behavior

Cards keep the existing basic model: select, edit, drag, resize, attach files, and delete. The implementation should improve discoverability without adding a new editor layer.

- Single click selects a card.
- Double click edits a card.
- New empty cards should focus immediately and show a concise placeholder.
- Selected cards should use a subtle border or ring and a modest shadow.
- Dragging should keep the existing pointer behavior, but the visual state should feel stable and not overly playful.
- Resize handle should be easier to hit while visually quieter until hover or selection.
- Card text should use a readable neutral color and stable line height in both light and dark modes.

## Card Visual Style

The sticky-note identity can remain, but it should be toned down:

- Reduce bright yellow dominance.
- Use muted paper tones in light mode.
- Use dark-mode-specific card tones instead of simply placing bright cards on a dark canvas.
- Keep card radius small.
- Avoid dramatic shadows, glossy gradients, and high-saturation borders.

## Canvas

The canvas should support orientation without drawing attention away from cards.

- Light mode canvas should be neutral and warm only subtly.
- Dark mode canvas should use neutral dark gray, not saturated brown or pure black.
- Grid lines should be faint in both modes.
- Empty state should be minimal and action-oriented.

## Zoom Controls

Zoom controls should be contextual.

- Default state: hidden or near-invisible.
- Show when the user zooms, pans, hovers the bottom-right area, focuses a zoom control, or changes zoom with buttons/gestures.
- Auto-hide after a short delay once interaction stops.
- Keep the reset and plus/minus controls available.
- Do not let the zoom indicator become a persistent status widget.

## Top-Right Menu

The menu should feel like a small utility control, not a product header.

- Keep the trigger compact and quiet.
- Use a flatter Notion-like menu: neutral colors, modest shadow, less rounded than the current glossy menu.
- Keep menu content minimal: account section when configured, theme controls, and back to main site.
- Avoid large decorative borders, saturated hover states, and heavy blur effects.

## Dark Mode

Dark mode must be designed directly rather than inherited from light mode.

- Canvas: neutral dark gray with faint grid.
- Cards: muted dark paper tones with readable text.
- Menu and zoom controls: neutral dark surfaces with clear contrast.
- Selection and hover states: subtle light borders or low-saturation accent rings.

## Error Handling

This pass should not introduce new data or network failure states. Existing local storage and attachment errors remain handled by the current storage paths.

## Testing And Verification

Verification should include:

- Existing scratchpad model/editor/storage tests.
- `pnpm lint`.
- `pnpm build`.
- Browser verification of `/scratchpad` in light and dark modes.
- Browser verification that zoom controls are hidden by default and appear after zoom/pan/control interaction.
- Browser verification that menu content remains minimal and readable.
- Browser verification that card creation, editing, selection, dragging, resizing, and deletion still work.

## Open Decisions

No open product decisions remain for this pass. Exact color values, timing values, and class names should be chosen during implementation to fit the existing Tailwind design system and verified visually in browser.
