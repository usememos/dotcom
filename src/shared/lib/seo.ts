import type { Metadata } from "next";

export const BASE_URL = "https://usememos.com";
export const SITE_NAME = "Memos";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_ALT = "Memos - Open-source self-hosted notes";

export const SITE_NAV_ITEMS = [
  { name: "Features", href: "/features" },
  { name: "Docs", href: "/docs" },
  { name: "Scratchpad", href: "/scratchpad" },
  { name: "Changelog", href: "/changelog" },
] as const;

export interface BreadcrumbItem {
  href: string;
  name: string;
}

export const HOME_BREADCRUMB_ITEM = {
  href: "/",
  name: "Home",
} as const satisfies BreadcrumbItem;

export function buildBreadcrumbItems(items: readonly BreadcrumbItem[]): BreadcrumbItem[] {
  return [HOME_BREADCRUMB_ITEM, ...items];
}

export function absoluteUrl(path: string): string {
  return path.startsWith("http://") || path.startsWith("https://") ? path : `${BASE_URL}${path}`;
}

export function buildDefaultOpenGraphImages(alt = DEFAULT_OG_IMAGE_ALT) {
  return [
    {
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      alt,
    },
  ];
}

export function buildMarketingMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: buildDefaultOpenGraphImages(`${title} - ${SITE_NAME}`),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function buildSiteNavigationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SITE_NAV_ITEMS.map((item) => ({
      "@type": "SiteNavigationElement",
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  };
}
