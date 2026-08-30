"use client";

import { HeartIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { type CarbonAdRenderStatus, carbonAdRuntime } from "@/shared/ui/carbon-ad-runtime";

const SPONSOR_URL = "https://github.com/sponsors/usememos";

const CONTAINER_STYLES = {
  default: "flex min-h-[155px] w-full flex-col rounded-lg border border-border bg-muted/30 px-3 py-2 dark:bg-muted/10",
  compact: "flex min-h-[155px] w-full flex-col rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-white/10 dark:bg-white/5",
  sponsor: cn("flex min-h-[155px] w-full flex-col", "bg-transparent p-0"),
} as const;

const FALLBACK_STYLES = {
  default:
    "flex w-full flex-1 items-center justify-center text-sm font-medium leading-5 text-muted-foreground transition-colors hover:text-foreground",
  compact:
    "flex w-full flex-1 items-center justify-center text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
  sponsor: "flex flex-1 flex-col justify-center gap-2",
} as const;

interface CarbonAdCardProps {
  variant?: keyof typeof CONTAINER_STYLES;
}

export function CarbonAdCard({ variant = "default" }: CarbonAdCardProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [status, setStatus] = useState<CarbonAdRenderStatus>("inactive");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    return carbonAdRuntime.register(mount, pathname, setStatus);
  }, [pathname]);

  return (
    <div role="complementary" aria-label="Sponsored content" className={CONTAINER_STYLES[variant]} data-carbon-status={status}>
      <div ref={mountRef} className="w-full" data-carbon-ad-mount="" />
      {status !== "loaded" && <FallbackContent variant={variant} />}
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
        className={cn(FALLBACK_STYLES.sponsor, "text-left transition-colors duration-300 hover:text-stone-700 dark:hover:text-stone-200")}
      >
        <div className="flex items-center gap-2">
          <HeartIcon className="h-5 w-5 text-stone-700 sm:h-6 sm:w-6 dark:text-stone-200" />
          <span className="text-base font-semibold text-stone-900 sm:text-lg dark:text-stone-100">Sponsor Memos</span>
        </div>
        <p className="text-xs leading-5 text-stone-600 dark:text-stone-300 sm:text-sm">Support the project and feature your logo here.</p>
      </a>
    );
  }

  return (
    <a href={SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={FALLBACK_STYLES.default}>
      Support Memos
    </a>
  );
}
