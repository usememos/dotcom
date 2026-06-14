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
