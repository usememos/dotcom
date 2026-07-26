"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copy-to-clipboard with a self-resetting "copied" flag.
 *
 * Clipboard access can be denied (insecure origin, permissions policy), so a
 * rejection leaves the flag alone rather than claiming success or surfacing an
 * unhandled rejection.
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      if (resetTimerRef.current !== undefined) {
        clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  const copy = useCallback(
    async (text: string) => {
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }

      setCopied(true);
      if (resetTimerRef.current !== undefined) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = undefined;
      }, resetAfterMs);
    },
    [resetAfterMs],
  );

  return { copied, copy };
}
