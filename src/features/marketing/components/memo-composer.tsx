import { ChevronDownIcon, LockIcon, PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";

/**
 * The product's memo composer. Empty, it shows the real "Any thoughts…" placeholder with a
 * blinking caret; with children, it shows what someone has typed before saving.
 */
export function MemoComposer({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`${styles.memoSurface} ${className}`}>
      {children ?? (
        <p className="min-h-7 text-[12px] leading-5 text-zinc-500 dark:text-zinc-300">
          Any thoughts…
          <span className={`${styles.caret} ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-[var(--mock-accent)]`} />
        </p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${styles.mockControl} size-6`}>
            <PlusIcon className="size-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--mock-muted)]">
            <LockIcon className="size-3" />
            Private
            <ChevronDownIcon className="size-3" />
          </span>
        </div>
        <span className="flex items-center gap-1 rounded-[6px] bg-[var(--mock-accent)] px-2 py-1 text-[10px] font-semibold text-white dark:text-zinc-950">
          Save
          <span className="rounded-sm bg-white/20 px-1 text-[8px]">Ctrl↵</span>
        </span>
      </div>
    </div>
  );
}
