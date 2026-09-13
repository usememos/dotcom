"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";

export function MemoHeroContent({ children }: { children: ReactNode }) {
  const [scrolling, setScrolling] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const handleScroll = () => {
    setScrolling(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setScrolling(false), 700);
  };

  return (
    <section
      className={styles.mockContent}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: This native scroll region must be keyboard-focusable.
      tabIndex={0}
      aria-label="Example memos — scroll to explore"
      data-testid="memo-content"
      data-scrolling={scrolling}
      onScroll={handleScroll}
    >
      <div className="px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="mx-auto w-full max-w-[512px]">{children}</div>
      </div>
    </section>
  );
}
