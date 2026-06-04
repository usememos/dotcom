interface ClampContextMenuPositionInput {
  x: number;
  y: number;
  menuWidth: number;
  menuHeight: number;
  gutter: number;
  viewportWidth: number;
  viewportHeight: number;
}

export function clampContextMenuPosition({
  x,
  y,
  menuWidth,
  menuHeight,
  gutter,
  viewportWidth,
  viewportHeight,
}: ClampContextMenuPositionInput) {
  return {
    x: Math.min(x, viewportWidth - menuWidth - gutter),
    y: Math.min(y, viewportHeight - menuHeight - gutter),
  };
}
