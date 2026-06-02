"use client";

import type { CSSProperties } from "react";
import type { ScratchpadViewport } from "../types";

export function getScratchpadCanvasBackgroundStyle(viewport: ScratchpadViewport): CSSProperties {
  const gridOffsetX = `${viewport.x}px`;
  const gridOffsetY = `${viewport.y}px`;
  const minorGrid = `${32 * viewport.scale}px`;
  const majorGrid = `${160 * viewport.scale}px`;

  return {
    backgroundImage:
      "linear-gradient(to right, rgba(130,118,94,0.04) 1px, transparent 1px), " +
      "linear-gradient(to bottom, rgba(130,118,94,0.04) 1px, transparent 1px), " +
      "linear-gradient(to right, rgba(112,100,78,0.05) 1px, transparent 1px), " +
      "linear-gradient(to bottom, rgba(112,100,78,0.05) 1px, transparent 1px)",
    backgroundPosition: `${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}`,
    backgroundSize: `${minorGrid} ${minorGrid}, ${minorGrid} ${minorGrid}, ${majorGrid} ${majorGrid}, ${majorGrid} ${majorGrid}`,
  };
}

interface ScratchpadCanvasBackgroundProps {
  viewport: ScratchpadViewport;
}

export function ScratchpadCanvasBackground({ viewport }: ScratchpadCanvasBackgroundProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-[#ece8dc] dark:bg-[#171411]"
      style={getScratchpadCanvasBackgroundStyle(viewport)}
    />
  );
}
