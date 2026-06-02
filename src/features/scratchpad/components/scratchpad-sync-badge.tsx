"use client";

import { CheckIcon, CircleIcon, LoaderIcon } from "lucide-react";
import type { ScratchpadSyncState } from "../types";

interface ScratchpadSyncBadgeProps {
  sync: ScratchpadSyncState;
  isRevealed?: boolean;
}

const QUIET_BADGE_CLASS_NAME =
  "pointer-events-none absolute right-0 bottom-0 inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-stone-600 shadow-sm transition-opacity";

export function ScratchpadSyncBadge({ sync, isRevealed }: ScratchpadSyncBadgeProps) {
  const quietVisibilityClassName = isRevealed
    ? "opacity-100"
    : "opacity-0 group-hover/card:opacity-100 group-focus-within/card:opacity-100";

  if (sync.status === "saving") {
    return (
      <div className="pointer-events-none absolute right-0 bottom-0 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-amber-700 shadow-sm">
        <LoaderIcon className="h-3 w-3 animate-spin" />
        Saving
      </div>
    );
  }

  if (sync.status === "error" && sync.lastError) {
    return (
      <div className="pointer-events-none absolute right-0 bottom-0 max-w-[78%] rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-red-700 shadow-sm">
        {sync.lastError}
      </div>
    );
  }

  if (sync.status === "synced") {
    return (
      <div className={`${QUIET_BADGE_CLASS_NAME} ${quietVisibilityClassName}`}>
        <CheckIcon className="h-3 w-3" />
        Saved
      </div>
    );
  }

  if (sync.status === "dirty") {
    return (
      <div className={`${QUIET_BADGE_CLASS_NAME} ${quietVisibilityClassName}`}>
        <CircleIcon className="h-2.5 w-2.5 fill-current" />
        Unsaved
      </div>
    );
  }

  if (sync.status === "local") {
    return (
      <div className={`${QUIET_BADGE_CLASS_NAME} ${quietVisibilityClassName}`}>
        <CircleIcon className="h-2.5 w-2.5" />
        Not saved
      </div>
    );
  }

  return null;
}
