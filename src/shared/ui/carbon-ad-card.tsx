"use client";

import { HeartIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

const CARBON_SCRIPT_URL = "https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=cover";
const SPONSOR_URL = "https://github.com/sponsors/usememos";

const CONTAINER_STYLES = {
  default: "w-full overflow-hidden rounded-lg border bg-muted/30 px-3 py-2 dark:bg-muted/10",
  compact: "h-24 w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-white/10 dark:bg-white/5",
  sponsor: cn("h-full w-full min-h-[200px] overflow-auto", "bg-transparent p-0"),
} as const;

const FALLBACK_STYLES = {
  default:
    "flex w-full items-center justify-center text-sm font-medium leading-5 text-muted-foreground transition-colors hover:text-foreground",
  compact:
    "flex w-full items-center justify-center py-1 text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
  sponsor: "flex h-full flex-col gap-3 sm:gap-4",
} as const;

interface CarbonAdCardProps {
  variant?: keyof typeof CONTAINER_STYLES;
}

export function CarbonAdCard({ variant = "default" }: CarbonAdCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const markAdLoaded = () => {
      if (!container.querySelector("#carbonads, [id^='carbonads_']")) {
        return false;
      }

      setAdLoaded(true);
      return true;
    };

    const existingAd = document.getElementById("carbonads");
    if (existingAd) {
      container.appendChild(existingAd);
      markAdLoaded();
      return undefined;
    }

    const checkAd = setInterval(() => {
      if (markAdLoaded()) {
        clearInterval(checkAd);
      }
    }, 100);

    if (!document.getElementById("_carbonads_js")) {
      const script = document.createElement("script");
      script.src = CARBON_SCRIPT_URL;
      script.id = "_carbonads_js";
      script.async = true;
      container.appendChild(script);
    }

    return () => clearInterval(checkAd);
  }, []);

  return (
    <div ref={containerRef} role="complementary" aria-label="Sponsored content" className={CONTAINER_STYLES[variant]}>
      {!adLoaded && <FallbackContent variant={variant} />}
    </div>
  );
}

function FallbackContent({ variant }: { variant: keyof typeof CONTAINER_STYLES }) {
  if (variant === "compact") {
    return (
      <a href={SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={FALLBACK_STYLES.compact}>
        Support Memos
      </a>
    );
  }

  const isSponsor = variant === "sponsor";

  if (isSponsor) {
    return (
      <a
        href={SPONSOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${FALLBACK_STYLES.sponsor} text-left transition-colors duration-300 hover:text-stone-700 dark:hover:text-stone-200`}
      >
        <div className="flex h-10 items-center justify-start sm:h-12">
          <div className="flex items-center gap-2">
            <HeartIcon className="h-8 w-8 text-stone-700 sm:h-10 sm:w-10 dark:text-stone-200" />
            <span className="text-lg font-semibold text-stone-900 sm:text-xl dark:text-stone-100">Support Memos</span>
          </div>
        </div>
        <p className="max-w-3xl text-balance text-sm leading-relaxed text-stone-600 dark:text-stone-300 sm:text-base">
          Support the continued development of Memos. Become a sponsor and get your logo featured here.
        </p>
      </a>
    );
  }

  return (
    <a href={SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={FALLBACK_STYLES.default}>
      Support Memos
    </a>
  );
}
