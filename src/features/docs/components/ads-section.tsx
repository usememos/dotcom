"use client";

import { useEffect, useState } from "react";
import { DocsSponsorCard } from "@/features/docs/components/docs-sponsor-card";
import { useMediaQuery } from "@/features/docs/hooks/use-media-query";
import { CarbonAdCard } from "@/shared/ui/carbon-ad-card";

function useIsDesktopReady() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return { isDesktop, isReady };
}

/**
 * Shared ads section component for mobile content area
 * Shows sponsor card and Carbon ads consistently across all pages
 */
export function AdsSectionMobile() {
  const { isDesktop, isReady } = useIsDesktopReady();

  if (!isReady || isDesktop) {
    return null;
  }

  return (
    <div className="lg:hidden mt-8 space-y-4">
      <DocsSponsorCard />
      <CarbonAdCard />
    </div>
  );
}

/**
 * Shared ads section component for desktop sidebar
 * Shows sponsor card and Carbon ads in sidebar TOC
 */
export function AdsSectionDesktop() {
  const { isDesktop, isReady } = useIsDesktopReady();

  if (!isReady || !isDesktop) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <DocsSponsorCard />
      <CarbonAdCard />
    </div>
  );
}
