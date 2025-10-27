/**
 * Shared TOC configuration for DocsPage components
 * Used by both docs and changelog pages
 *
 * Note: Footer components are not included here to avoid excessive RSC requests.
 * They should be rendered directly in the page components instead.
 */
export const tocConfig = {
  // tableOfContent and tableOfContentPopover footer removed to prevent
  // excessive React Server Component fetch requests on navigation
};
