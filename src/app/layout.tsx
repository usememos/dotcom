import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://usememos.com"),
  title: {
    default: "Memos - Capture thoughts instantly. Own them completely.",
    template: "%s - Memos",
  },
  description: "Open-source, self-hosted note-taking tool built for instant capture. Markdown-native, privacy-first, and fully yours.",
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
    title: "Memos - Capture thoughts instantly. Own them completely.",
    description: "Open-source, self-hosted note-taking tool built for instant capture. Markdown-native, privacy-first, and fully yours.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Memos - Capture thoughts instantly. Own them completely.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Capture thoughts instantly. Own them completely.",
    description: "Open-source, self-hosted note-taking tool built for instant capture. Markdown-native, privacy-first, and fully yours.",
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
    description:
      "An open-source, self-hosted note-taking tool built for instant capture. Markdown-native, privacy-first, and ready in minutes.",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000",
    },
    url: "https://usememos.com",
    downloadUrl: "https://github.com/usememos/memos",
    softwareVersion: "latest",
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
      "Total data ownership",
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
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
