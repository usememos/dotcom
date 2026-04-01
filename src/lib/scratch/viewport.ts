import type { ScratchpadViewport } from "./types";

export const DEFAULT_SCRATCHPAD_VIEWPORT: ScratchpadViewport = {
  x: 0,
  y: 0,
  scale: 1,
};

export const MIN_SCRATCHPAD_SCALE = 0.55;
export const MAX_SCRATCHPAD_SCALE = 1.8;
export const SCRATCHPAD_ZOOM_INTENSITY = 0.0015;

interface ViewportRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function clampScratchpadScale(scale: number): number {
  return Math.min(Math.max(scale, MIN_SCRATCHPAD_SCALE), MAX_SCRATCHPAD_SCALE);
}

export function screenPointToCanvasPoint(
  clientX: number,
  clientY: number,
  rect: Pick<ViewportRect, "left" | "top">,
  viewport: ScratchpadViewport,
) {
  return {
    x: (clientX - rect.left - viewport.x) / viewport.scale,
    y: (clientY - rect.top - viewport.y) / viewport.scale,
  };
}

export function panScratchpadViewport(viewport: ScratchpadViewport, deltaX: number, deltaY: number): ScratchpadViewport {
  return {
    ...viewport,
    x: viewport.x + deltaX,
    y: viewport.y + deltaY,
  };
}

export function zoomScratchpadViewportAtPoint(
  viewport: ScratchpadViewport,
  pointerX: number,
  pointerY: number,
  nextScale: number,
): ScratchpadViewport {
  const clampedScale = clampScratchpadScale(nextScale);
  const canvasX = (pointerX - viewport.x) / viewport.scale;
  const canvasY = (pointerY - viewport.y) / viewport.scale;

  return {
    x: pointerX - canvasX * clampedScale,
    y: pointerY - canvasY * clampedScale,
    scale: clampedScale,
  };
}

export function zoomScratchpadViewportFromCenter(viewport: ScratchpadViewport, rect: ViewportRect, factor: number): ScratchpadViewport {
  return zoomScratchpadViewportAtPoint(viewport, rect.width / 2, rect.height / 2, viewport.scale * factor);
}
