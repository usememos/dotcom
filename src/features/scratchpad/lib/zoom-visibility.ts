export const ZOOM_CONTROLS_HIDE_DELAY_MS = 1400;

interface ZoomControlsVisibilityInput {
  hovered: boolean;
  focused: boolean;
  lastInteractionAt: number | null;
  now: number;
}

export function shouldShowZoomControls({ hovered, focused, lastInteractionAt, now }: ZoomControlsVisibilityInput): boolean {
  if (hovered || focused) return true;
  if (lastInteractionAt === null) return false;

  return now - lastInteractionAt < ZOOM_CONTROLS_HIDE_DELAY_MS;
}
