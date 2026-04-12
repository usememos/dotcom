import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { buildSiteNavigationJsonLd } from "@/lib/seo";

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
    default: "Memos - Capture first. Keep it yours.",
    template: "%s - Memos",
  },
  description:
    "Open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Markdown-native, lightweight, and yours to run.",
  keywords: [
    "note taking app",
    "self-hosted notes",
    "open source note taking",
    "privacy-first notes",
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
    title: "Memos - Capture first. Keep it yours.",
    description:
      "Open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Markdown-native, lightweight, and yours to run.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Memos - Capture first. Keep it yours.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Capture first. Keep it yours.",
    description:
      "Open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Markdown-native, lightweight, and yours to run.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo-rounded.png",
    shortcut: "/logo-rounded.png",
    apple: "/logo-rounded.png",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Memos",
    description: "An open-source, self-hosted timeline for quick notes, daily logs, links, and snippets.",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: "https://usememos.com",
    downloadUrl: "https://github.com/usememos/memos",
    author: {
      "@type": "Organization",
      name: "Memos Team",
      url: "https://usememos.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Memos",
      url: "https://usememos.com",
      logo: {
        "@type": "ImageObject",
        url: "https://usememos.com/logo-rounded.png",
      },
    },
    screenshot: "https://usememos.com/demo.png",
    featureList: [
      "Instant thought capture",
      "Private timeline",
      "Markdown-native storage",
      "Self-hosted, zero telemetry",
      "MIT licensed, open source",
      "Deploys in under 5 minutes",
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Memos",
    url: "https://usememos.com",
    logo: "https://usememos.com/logo-rounded.png",
    sameAs: ["https://github.com/usememos/memos", "https://twitter.com/usaboringmemos", "https://discord.gg/tfPJa4UmAv"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://github.com/usememos/memos/issues",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Memos",
    url: "https://usememos.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://usememos.com/docs?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  const siteNavigationJsonLd = buildSiteNavigationJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
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
        <RootProvider theme={{ defaultTheme: "system", enableSystem: true }}>{children}</RootProvider>
      </body>
    </html>
  );
}
