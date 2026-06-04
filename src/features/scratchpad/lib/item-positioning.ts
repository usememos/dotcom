import type { ScratchpadItemLayout, ScratchpadViewport } from "../types";

const SCRATCHPAD_MIN_ITEM_WIDTH = 220;
const SCRATCHPAD_ITEM_SCREEN_GUTTER = 24;
const SCRATCHPAD_TEXT_ITEM_WIDTH = 280;
const SCRATCHPAD_TEXT_ITEM_HEIGHT = 180;
const SCRATCHPAD_ATTACHMENT_ITEM_WIDTH = 320;
const SCRATCHPAD_ATTACHMENT_ITEM_HEIGHT = 300;
const SCRATCHPAD_ITEM_VERTICAL_OFFSET = 88;

interface ViewportSize {
  width: number;
  height: number;
}

interface CalculateScratchpadItemLayoutInput {
  x: number;
  y: number;
  hasAttachments: boolean;
  viewport: ScratchpadViewport;
  viewportSize: ViewportSize;
  zIndex: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateScratchpadItemLayout({
  x,
  y,
  hasAttachments,
  viewport,
  viewportSize,
  zIndex,
}: CalculateScratchpadItemLayoutInput): ScratchpadItemLayout {
  const preferredWidth = hasAttachments ? SCRATCHPAD_ATTACHMENT_ITEM_WIDTH : SCRATCHPAD_TEXT_ITEM_WIDTH;
  const preferredHeight = hasAttachments ? SCRATCHPAD_ATTACHMENT_ITEM_HEIGHT : SCRATCHPAD_TEXT_ITEM_HEIGHT;
  const availableWidth = Math.max(
    SCRATCHPAD_MIN_ITEM_WIDTH,
    Math.floor((viewportSize.width - SCRATCHPAD_ITEM_SCREEN_GUTTER * 2) / viewport.scale),
  );
  const width = Math.min(preferredWidth, availableWidth);
  const leftBound = (SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.x) / viewport.scale;
  const topBound = (SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.y) / viewport.scale;
  const rightBound = (viewportSize.width - SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.x) / viewport.scale;
  const bottomBound = (viewportSize.height - SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.y) / viewport.scale;
  const originX = x - width / 2;
  const originY = y - Math.min(preferredHeight / 2, SCRATCHPAD_ITEM_VERTICAL_OFFSET);
  const clampedX = clamp(originX, leftBound, Math.max(leftBound, rightBound - width));
  const clampedY = clamp(originY, topBound, Math.max(topBound, bottomBound - preferredHeight));

  return {
    x: clampedX,
    y: clampedY,
    width,
    height: preferredHeight,
    zIndex,
  };
}
