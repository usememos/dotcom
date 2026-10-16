import { MemosMark } from "./memos-mark";

/** Website wordmark treatment; the official SVG paths remain unchanged. */
export function MemosLockup() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      {/* Trim only the transparent canvas so spacing follows the visible mark. */}
      <MemosMark size={28} viewBox="112 32 288 448" width={18} />
      <span
        className="text-xl leading-none font-normal tracking-[-0.025em]"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        Memos
      </span>
    </span>
  );
}
