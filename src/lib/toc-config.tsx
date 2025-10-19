import { TocFooter, TocFooterMobile } from "@/components/toc-footer";

/**
 * Shared TOC configuration for DocsPage components
 * Used by both docs and changelog pages
 */
export const tocConfig = {
  tableOfContent: {
    footer: <TocFooter />,
  },
  tableOfContentPopover: {
    footer: <TocFooterMobile />,
  },
};
