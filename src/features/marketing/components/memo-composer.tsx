import { ChevronDownIcon, LockIcon, PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";

/**
 * The Hero's decorative editor, with the official preview's empty Save state.
 */
export function MemoComposer({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`${styles.memoSurface} ${className}`}>
      {children ?? <p className="min-h-7 text-[12px] leading-5 text-[var(--mock-action)]">Any thoughts…</p>}
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
        <button type="button" disabled={!children} className={styles.composerSave}>
          Save
        </button>
      </div>
    </div>
  );
}
