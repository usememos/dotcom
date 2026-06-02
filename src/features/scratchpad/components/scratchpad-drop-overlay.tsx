"use client";

export function ScratchpadDropOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#79a89d]/10">
      <div className="rounded-2xl border border-[#98bdb4] bg-white/92 px-5 py-3 text-center shadow-[0_20px_60px_rgba(79,108,101,0.14)] backdrop-blur">
        <p className="text-lg font-semibold text-[#5a8a83]">Drop files here</p>
        <p className="mt-1 text-sm text-[#6d9a93]/90">They can land on the canvas or attach to an existing card.</p>
      </div>
    </div>
  );
}
