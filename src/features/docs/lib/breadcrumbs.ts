import { buildBreadcrumbItems, buildBreadcrumbJsonLd } from "@/shared/lib/seo";

/**
 * Breadcrumbs derived from a docs page URL, shared by the prose and API
 * reference routes so the segment-naming policy cannot drift between them.
 */
export function buildDocsBreadcrumbs(pageUrl: string, pageTitle: string, options: { apiVersionLabel?: string } = {}) {
  const parts = pageUrl.split("/").filter(Boolean);
  const items = buildBreadcrumbItems(
    parts.map((part, index) => {
      const name =
        index === parts.length - 1
          ? pageTitle
          : index === 0
            ? "Documentation"
            : options.apiVersionLabel && index === 1
              ? "API"
              : options.apiVersionLabel && index === 2
                ? options.apiVersionLabel
                : part.charAt(0).toUpperCase() + part.slice(1);

      return { href: `/${parts.slice(0, index + 1).join("/")}`, name };
    }),
  );

  return { items, jsonLd: buildBreadcrumbJsonLd(items) };
}
