"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  // Always initialize with false to avoid hydration mismatch
  // The correct value will be set after mount in useEffect
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Set initial value after mount
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
