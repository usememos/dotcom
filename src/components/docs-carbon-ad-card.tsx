"use client";

import { useEffect, useRef, useState } from "react";

const CARBON_SCRIPT_URL = "https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=cover";

export function DocsCarbonAdCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Move existing ad if present, otherwise load script
    const existingAd = document.getElementById("carbonads");
    if (existingAd) {
      container.appendChild(existingAd);
      setAdLoaded(true);
      return;
    }

    // Skip if script already exists
    if (document.getElementById("_carbonads_js")) return;

    const script = document.createElement("script");
    script.src = CARBON_SCRIPT_URL;
    script.id = "_carbonads_js";
    script.async = true;
    container.appendChild(script);

    // Check for ad insertion
    const checkAd = setInterval(() => {
      if (container.querySelector("#carbonads")) {
        setAdLoaded(true);
        clearInterval(checkAd);
      }
    }, 100);

    return () => clearInterval(checkAd);
  }, []);

  return (
    <div
      ref={containerRef}
      role="complementary"
      aria-label="Sponsored content"
      className="w-full max-h-80 rounded-xl border bg-muted/30 dark:bg-muted/10 p-3 overflow-auto"
    >
      {!adLoaded && (
        <a
          href="https://github.com/sponsors/usememos"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center py-1 text-sm text-muted-foreground hover:opacity-80"
        >
          Become a Sponsor
        </a>
      )}
    </div>
  );
}
