"use client";

import { HeartIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CARBON_SCRIPT_URL = "https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=cover";
const SPONSOR_URL = "https://github.com/sponsors/usememos";

// Style variants for different contexts
const CONTAINER_STYLES = {
  default: "w-full max-h-80 rounded-xl border bg-muted/30 dark:bg-muted/10 p-3 overflow-auto",
  sponsor: cn(
    "w-full min-h-[200px] rounded-2xl overflow-auto",
    "border border-gray-200 dark:border-gray-700",
    "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50",
    "p-5 sm:p-8 shadow-sm",
    "hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-600",
    "hover:-translate-y-1 transition-all duration-300",
  ),
} as const;

const FALLBACK_STYLES = {
  default: "flex w-full items-center justify-center py-1 text-sm text-muted-foreground hover:opacity-80",
  sponsor: "flex flex-col gap-2 sm:gap-4 h-full",
} as const;

interface DocsCarbonAdCardProps {
  variant?: keyof typeof CONTAINER_STYLES;
}

export function DocsCarbonAdCard({ variant = "default" }: DocsCarbonAdCardProps) {
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
    <div ref={containerRef} role="complementary" aria-label="Sponsored content" className={CONTAINER_STYLES[variant]}>
      {!adLoaded && <FallbackContent variant={variant} />}
    </div>
  );
}

/**
 * Fallback content shown when carbon ad is loading or failed to load
 */
function FallbackContent({ variant }: { variant: keyof typeof CONTAINER_STYLES }) {
  if (variant === "sponsor") {
    return (
      <a href={SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={FALLBACK_STYLES.sponsor}>
        <div className="h-10 sm:h-12 flex items-center justify-start">
          <div className="flex items-center gap-2">
            <HeartIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 fill-current" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Support Memos</span>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          Help us build the future of open-source note-taking. Become a sponsor and get your logo featured here.
        </p>
      </a>
    );
  }

  return (
    <a href={SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={FALLBACK_STYLES.default}>
      Become a Sponsor
    </a>
  );
}
