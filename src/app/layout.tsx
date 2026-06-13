import "@/app/global.css";
import { ClerkProvider } from "@clerk/nextjs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { ClerkConfigProvider } from "@/shared/auth/clerk-config";
import { buildSiteNavigationJsonLd, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@/shared/lib/seo";

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
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Capture first. Keep it yours.",
    description:
      "Open-source, self-hosted timeline for quick notes, daily logs, links, and snippets. Markdown-native, lightweight, and yours to run.",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/logo-rounded.png",
    shortcut: "/logo-rounded.png",
    apple: "/logo-rounded.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function Layout({ children }: { children: ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = Boolean(clerkPublishableKey);
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
    image: DEFAULT_OG_IMAGE,
    screenshot: DEFAULT_OG_IMAGE,
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
    alternateName: ["usememos", "usememos.com"],
    url: "https://usememos.com",
  };
  const siteNavigationJsonLd = buildSiteNavigationJsonLd();
  const app = <RootProvider theme={{ defaultTheme: "system", enableSystem: true }}>{children}</RootProvider>;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Script
          id="software-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <Script
          id="organization-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="website-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="site-navigation-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${displaySerif.variable} flex min-h-screen flex-col antialiased`}>
        <ClerkConfigProvider enabled={isClerkConfigured}>
          {clerkPublishableKey ? (
            <ClerkProvider
              publishableKey={clerkPublishableKey}
              signInFallbackRedirectUrl="/dashboard"
              signUpFallbackRedirectUrl="/dashboard"
            >
              {app}
            </ClerkProvider>
          ) : (
            app
          )}
        </ClerkConfigProvider>
      </body>
    </html>
  );
}
