import { AdsSectionDesktop } from "@/components/ads-section";

/**
 * TOC footer component with sponsor card and carbon ads for desktop sidebar
 * Uses shared AdsSectionDesktop component for consistency
 */
export function TocFooter() {
  return (
    <div className="mt-2 mb-2">
      <AdsSectionDesktop />
    </div>
  );
}
