"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

interface ScratchpadZoomControlsProps {
  zoomLabel: string;
  visible: boolean;
  onHoverChange: (hovered: boolean) => void;
  onFocusChange: (focused: boolean) => void;
  onZoomOut: () => void;
  onReset: () => void;
  onZoomIn: () => void;
}

export function ScratchpadZoomControls({
  zoomLabel,
  visible,
  onHoverChange,
  onFocusChange,
  onZoomOut,
  onReset,
  onZoomIn,
}: ScratchpadZoomControlsProps) {
  return (
    <div
      data-scratchpad-ui="true"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocusCapture={() => onFocusChange(true)}
      onBlurCapture={(event) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
          return;
        }

        onFocusChange(false);
      }}
      className={`absolute right-3 bottom-3 flex items-center gap-1 rounded-md border border-stone-200/80 bg-white/88 p-1 shadow-sm transition-all duration-200 dark:border-white/10 dark:bg-stone-900/88 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={onZoomOut}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="min-w-9 rounded-full px-2 py-1 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-stone-500 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
        title="Reset view"
      >
        {zoomLabel}
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
