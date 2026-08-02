import type { Metadata } from "next";

export const BASE_URL = "https://usememos.com";
export const SITE_NAME = "Memos";
export const GITHUB_REPO_URL = "https://github.com/usememos/memos";
export const GITHUB_STAR_COUNT_PLACEHOLDER = "60K+";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_ALT = "Memos - Open-source self-hosted notes";

export interface SiteNavLink {
  name: string;
  href: string;
  description: string;
  external?: boolean;
  indexable?: boolean;
}

export interface SiteNavGroup {
  name: string;
  items: readonly SiteNavLink[];
}

export const SITE_NAV_ITEMS = [
  {
    name: "Product",
    items: [
      { name: "Features", href: "/features", description: "Explore self-hosted note-taking features" },
      { name: "Use Cases", href: "/use-cases", description: "Discover workflows for personal notes" },
      { name: "Compare", href: "/compare", description: "Compare Memos with note-taking alternatives" },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Web Clipper", href: "/web-clipper", description: "Save web pages and selections to Memos" },
      {
        name: "Live Demo",
        href: "https://demo.usememos.com/",
        description: "Try Memos in a public demo workspace",
        external: true,
      },
    ],
  },
  { name: "Docs", href: "/docs", description: "Install, configure, and self-host Memos" },
  {
    name: "Resources",
    items: [
      { name: "API Reference", href: "/docs/api", description: "Build integrations with the Memos API" },
      { name: "Blog", href: "/blog", description: "Read Memos guides and project updates" },
      { name: "Changelog", href: "/changelog", description: "Follow new Memos releases and improvements" },
    ],
  },
] as const satisfies readonly (SiteNavGroup | SiteNavLink)[];

export const SITE_NAV_LINKS = SITE_NAV_ITEMS.flatMap<SiteNavLink>((item) => ("items" in item ? [...item.items] : [item]));

export const SITE_NAV_CTA = {
  name: "Get Started",
  href: "/docs/getting-started",
  description: "Start with the Memos documentation",
} as const;

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
  const links = [...SITE_NAV_LINKS, SITE_NAV_CTA].filter(
    (item) => item.href.startsWith("/") && (!("indexable" in item) || item.indexable !== false),
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} site navigation`,
    numberOfItems: links.length,
    itemListElement: links.map((item) => ({
      "@type": "SiteNavigationElement",
      name: item.name,
      description: item.description,
      url: absoluteUrl(item.href),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
