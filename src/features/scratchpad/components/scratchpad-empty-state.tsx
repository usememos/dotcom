"use client";

export function ScratchpadEmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="rounded-2xl border border-white/55 bg-white/68 px-6 py-5 text-center shadow-[0_18px_52px_rgba(107,91,65,0.1)] backdrop-blur-sm">
        <p className="text-lg font-medium text-stone-800">Double-click to create a note</p>
        <p className="mt-2 text-sm leading-6 text-stone-500">Drag to pan. Ctrl or Cmd + wheel to zoom. Paste or drop files anywhere.</p>
      </div>
    </div>
  );
}
