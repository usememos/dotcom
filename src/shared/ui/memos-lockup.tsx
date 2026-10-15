import { MemosMark } from "./memos-mark";

/** Website wordmark treatment; the official SVG paths remain unchanged. */
export function MemosLockup() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      {/* Trim only the transparent canvas so spacing follows the visible mark. */}
      <MemosMark size={28} viewBox="112 32 288 448" width={18} />
      <span className="font-sans text-xl leading-none font-semibold tracking-[-0.04em]">Memos</span>
    </span>
  );
}
