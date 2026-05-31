"use client";

import { useEffect, useState } from "react";
import { DocsSponsorCard } from "@/features/docs/components/docs-sponsor-card";
import { useMediaQuery } from "@/features/docs/hooks/use-media-query";
import { CarbonAdCard } from "@/shared/ui/carbon-ad-card";

const ADS_SECTION_SPACE = "min-h-[26rem]";

function useIsDesktopReady() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return { isDesktop, isReady };
}

function AdsSectionPlaceholder({ viewport }: { viewport: "mobile" | "desktop" }) {
  const className = viewport === "mobile" ? `lg:hidden mt-8 ${ADS_SECTION_SPACE}` : `hidden lg:flex flex-col gap-2 ${ADS_SECTION_SPACE}`;

  return <div aria-hidden="true" className={className} />;
}

/**
 * Shared ads section component for mobile content area
 * Shows sponsor card and Carbon ads consistently across all pages
 */
export function AdsSectionMobile() {
  const { isDesktop, isReady } = useIsDesktopReady();

  if (!isReady) {
    return <AdsSectionPlaceholder viewport="mobile" />;
  }

  if (isDesktop) {
    return null;
  }

  return (
    <div className={`lg:hidden mt-8 space-y-4 ${ADS_SECTION_SPACE}`}>
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

  if (!isReady) {
    return <AdsSectionPlaceholder viewport="desktop" />;
  }

  if (!isDesktop) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${ADS_SECTION_SPACE}`}>
      <DocsSponsorCard />
      <CarbonAdCard />
    </div>
  );
}
