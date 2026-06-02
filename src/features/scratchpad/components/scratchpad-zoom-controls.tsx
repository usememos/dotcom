"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

interface ScratchpadZoomControlsProps {
  zoomLabel: string;
  onZoomOut: () => void;
  onReset: () => void;
  onZoomIn: () => void;
}

export function ScratchpadZoomControls({ zoomLabel, onZoomOut, onReset, onZoomIn }: ScratchpadZoomControlsProps) {
  return (
    <div
      data-scratchpad-ui="true"
      className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm"
    >
      <button
        type="button"
        onClick={onZoomOut}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="min-w-9 rounded-full px-2 py-1 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-stone-500 transition hover:bg-stone-100"
        title="Reset view"
      >
        {zoomLabel}
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
