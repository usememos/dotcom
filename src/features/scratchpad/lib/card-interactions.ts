/** Window after creation during which a blank card opens straight into edit mode. */
export const CARD_NEW_EDIT_WINDOW_MS = 5_000;

export function shouldStartEditingNewCard(input: { body: string; attachmentCount: number; createdAt: Date }, now: number): boolean {
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
