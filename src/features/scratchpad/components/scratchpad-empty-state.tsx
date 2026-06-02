"use client";

export function ScratchpadEmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Double-click anywhere to write</p>
        <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">Paste or drop files to collect them here.</p>
      </div>
    </div>
  );
}
