"use client";

import { DocsSponsorCard } from "@/features/docs/components/docs-sponsor-card";
import { useMediaQuery } from "@/features/docs/hooks/use-media-query";
import { cn } from "@/shared/lib/utils";
import { CarbonAdCard } from "@/shared/ui/carbon-ad-card";

const BREAKPOINTS = {
  lg: {
    mainContentClassName: "lg:!hidden",
    mediaQuery: "(min-width: 1024px)",
    sidebarClassName: "hidden lg:!flex",
  },
  xl: {
    mainContentClassName: "xl:!hidden",
    mediaQuery: "(min-width: 1280px)",
    sidebarClassName: "hidden xl:!flex",
  },
} as const;

type AdsBreakpoint = keyof typeof BREAKPOINTS;
type AdsPlacement = "main-content" | "sidebar";

interface AdsSectionProps {
  breakpoint?: AdsBreakpoint;
}

function AdsSection({ breakpoint = "lg", placement }: AdsSectionProps & { placement: AdsPlacement }) {
  const isDesktop = useMediaQuery(BREAKPOINTS[breakpoint].mediaQuery);
  const isMainContent = placement === "main-content";
  const responsiveClassName = isMainContent ? BREAKPOINTS[breakpoint].mainContentClassName : BREAKPOINTS[breakpoint].sidebarClassName;

  if (isDesktop === undefined) {
    return null;
  }

  const shouldRender = isMainContent ? !isDesktop : isDesktop;

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={cn(responsiveClassName, "flex flex-col gap-4", isMainContent && "mt-8")} data-ads-placement={placement}>
      <DocsSponsorCard />
      <CarbonAdCard />
    </div>
  );
}

export function MainContentAds(props: AdsSectionProps = {}) {
  return <AdsSection {...props} placement="main-content" />;
}

export function SidebarAds(props: AdsSectionProps = {}) {
  return <AdsSection {...props} placement="sidebar" />;
}
