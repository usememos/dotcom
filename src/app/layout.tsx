import "@/app/global.css";
import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { BRAND_ASSETS_PATH, BRAND_LOGO_URL } from "@/shared/lib/brand-assets";
import { BRAND_DESCRIPTION, BRAND_SEARCH_TITLE, BRAND_TITLE } from "@/shared/lib/branding";
import { buildSiteNavigationJsonLd, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, GITHUB_REPO_URL } from "@/shared/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const displaySerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://usememos.com"),
  title: {
    default: BRAND_SEARCH_TITLE,
    template: "%s - Memos",
  },
  description: BRAND_DESCRIPTION,
  keywords: [
    "note taking app",
    "self-hosted notes",
    "open source note taking",
    "private notes",
    "markdown notes",
    "memos app",
    "quick capture notes",
    "self-hosted memo",
    "private note taking",
    "docker note-taking tool",
  ],
  authors: [{ name: "Memos Team" }],
  creator: "Memos Team",
  publisher: "Memos",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://usememos.com",
    types: {
      "application/rss+xml": "https://usememos.com/blog/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usememos.com",
    siteName: "Memos",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    // The PNG comes first so browsers that read SVG still pick the SVG declared
    // after it. Search engines need a raster icon larger than 48px; Google does
    // not list SVG among its supported favicon formats.
    icon: [
      { url: `${BRAND_ASSETS_PATH}/favicon-192.png`, type: "image/png", sizes: "192x192" },
      { url: `${BRAND_ASSETS_PATH}/favicon.svg`, type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=bird-blue",
    apple: [{ url: `${BRAND_ASSETS_PATH}/apple-touch-icon.png?v=celadon`, sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// One Organization node, referenced by id from the software and website nodes so
// search engines read them as the same entity instead of three unrelated ones.
const ORGANIZATION_ID = "https://usememos.com/#organization";
const ORGANIZATION_REFERENCE = { "@id": ORGANIZATION_ID };

export default function Layout({ children }: { children: ReactNode }) {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://usememos.com/#software",
    name: "Memos",
    description: BRAND_DESCRIPTION,
    // Google accepts only its listed app types; there is no note-taking or productivity value.
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: "https://usememos.com",
    downloadUrl: GITHUB_REPO_URL,
    author: ORGANIZATION_REFERENCE,
    publisher: ORGANIZATION_REFERENCE,
    image: DEFAULT_OG_IMAGE,
    screenshot: DEFAULT_OG_IMAGE,
    featureList: [
      "Short memos written in Markdown",
      "Search, tags, and saved views",
      "Timeline and calendar browsing",
      "New memos private by default",
      "Self-hosted with Docker",
      "Zero telemetry in the Memos software",
      "MIT licensed, open source",
      "Personal export as a ZIP archive",
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Memos",
    description: BRAND_DESCRIPTION,
    url: "https://usememos.com",
    logo: BRAND_LOGO_URL,
    sameAs: [GITHUB_REPO_URL, "https://t.me/memosxtg", "https://twitter.com/usaboringmemos", "https://discord.gg/tfPJa4UmAv"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://github.com/usememos/memos/issues",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://usememos.com/#website",
    name: "Memos",
    alternateName: ["usememos", "usememos.com"],
    url: "https://usememos.com",
    publisher: ORGANIZATION_REFERENCE,
  };
  const siteNavigationJsonLd = buildSiteNavigationJsonLd();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets the browser paint the canvas and native UI in the system scheme
            before CSS or the next-themes bootstrap script run. */}
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }} />
      </head>
      <body className={`${inter.variable} ${displaySerif.variable} flex min-h-screen flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
