import { DocsToc } from "@/features/docs/components/docs-toc";

/**
 * Shared TOC configuration for DocsPage components (docs index + docs pages).
 *
 * We swap fumadocs' default TOC for a custom one that keeps the desktop
 * sponsor/ads footer but hides the "On this page" title and the "No Headings"
 * placeholder on pages without headings. See {@link DocsToc}.
 */
export const tocConfig = {
  tableOfContent: {
    component: <DocsToc />,
  },
};
