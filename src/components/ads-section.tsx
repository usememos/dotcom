import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";
import { DocsSponsorCard } from "@/components/docs-sponsor-card";

/**
 * Shared ads section component for mobile content area
 * Shows sponsor card and Carbon ads consistently across all pages
 */
export function AdsSectionMobile() {
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
  return (
    <div className="flex flex-col gap-2">
      <DocsSponsorCard />
      <DocsCarbonAdCard />
    </div>
  );
}
