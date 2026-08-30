"use client";

import { useEffect, useState } from "react";
import { DocsSponsorCard } from "@/features/docs/components/docs-sponsor-card";
import { useMediaQuery } from "@/features/docs/hooks/use-media-query";
import { cn } from "@/shared/lib/utils";
import { CarbonAdCard } from "@/shared/ui/carbon-ad-card";

const DEFAULT_ITEMS = ["sponsors", "carbon"] as const;

const BREAKPOINTS = {
  lg: {
    desktopClassName: "hidden lg:!flex",
    mediaQuery: "(min-width: 1024px)",
    mobileClassName: "lg:!hidden",
  },
  xl: {
    desktopClassName: "hidden xl:!flex",
    mediaQuery: "(min-width: 1280px)",
    mobileClassName: "xl:!hidden",
  },
} as const;

type AdsBreakpoint = keyof typeof BREAKPOINTS;
type AdsItem = (typeof DEFAULT_ITEMS)[number];

interface AdsSectionProps {
  breakpoint?: AdsBreakpoint;
  className?: string;
  items?: readonly AdsItem[];
}

function getSectionSpace(items: readonly AdsItem[]) {
  if (items.length > 1) return "min-h-[26rem]";
  if (items[0] === "carbon") return "min-h-[155px]";
  return "min-h-[12rem]";
}

function useIsDesktopReady(breakpoint: AdsBreakpoint) {
  const isDesktop = useMediaQuery(BREAKPOINTS[breakpoint].mediaQuery);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return { isDesktop, isReady };
}

function AdsSectionPlaceholder({ breakpoint, className, items, viewport }: Required<AdsSectionProps> & { viewport: "mobile" | "desktop" }) {
  const responsiveClassName = viewport === "mobile" ? BREAKPOINTS[breakpoint].mobileClassName : BREAKPOINTS[breakpoint].desktopClassName;

  return (
    <div
      aria-hidden="true"
      className={cn(responsiveClassName, viewport === "mobile" && "mt-8", "flex-col gap-4", getSectionSpace(items), className)}
    />
  );
}

function AdsSectionItems({ items }: { items: readonly AdsItem[] }) {
  return items.map((item) => (item === "carbon" ? <CarbonAdCard key={item} /> : <DocsSponsorCard key={item} />));
}

export function AdsSectionMobile({ breakpoint = "lg", className = "", items = DEFAULT_ITEMS }: AdsSectionProps = {}) {
  const { isDesktop, isReady } = useIsDesktopReady(breakpoint);

  if (!isReady) {
    return <AdsSectionPlaceholder breakpoint={breakpoint} className={className} items={items} viewport="mobile" />;
  }

  if (isDesktop) {
    return null;
  }

  return (
    <div
      className={cn(
        BREAKPOINTS[breakpoint].mobileClassName,
        "mt-8 flex flex-col gap-4",
        getSectionSpace(items),
        items.length === 1 && items[0] === "carbon" && "justify-center",
        className,
      )}
    >
      <AdsSectionItems items={items} />
    </div>
  );
}

export function AdsSectionDesktop({ breakpoint = "lg", className = "", items = DEFAULT_ITEMS }: AdsSectionProps = {}) {
  const { isDesktop, isReady } = useIsDesktopReady(breakpoint);

  if (!isReady) {
    return <AdsSectionPlaceholder breakpoint={breakpoint} className={className} items={items} viewport="desktop" />;
  }

  if (!isDesktop) {
    return null;
  }

  return (
    <div
      className={cn(
        BREAKPOINTS[breakpoint].desktopClassName,
        "flex-col gap-4",
        getSectionSpace(items),
        items.length === 1 && items[0] === "carbon" && "justify-center",
        className,
      )}
    >
      <AdsSectionItems items={items} />
    </div>
  );
}
