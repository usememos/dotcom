"use client";

import { useEffect, useState } from "react";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";
import { DocsSponsorCard } from "@/components/docs-sponsor-card";
import { useMediaQuery } from "@/hooks/use-media-query";

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
      <DocsCarbonAdCard />
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
      <DocsCarbonAdCard />
    </div>
  );
}
