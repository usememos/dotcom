import type { Metadata } from "next";

export const BASE_URL = "https://usememos.com";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export const SITE_NAV_ITEMS = [
  { name: "Documentation", href: "/docs" },
  { name: "Blog", href: "/blog" },
  { name: "Changelog", href: "/changelog" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
] as const;

export interface BreadcrumbItem {
  href: string;
  name: string;
}

export function absoluteUrl(path: string): string {
  return path.startsWith("http://") || path.startsWith("https://") ? path : `${BASE_URL}${path}`;
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
      title: `${title} - Memos`,
      description,
      url,
      siteName: "Memos",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - Memos`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Memos`,
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
