import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://usememos.com"),
  title: {
    default: "Memos - Open Source, Self-Hosted Note Taking",
    template: "%s - Memos",
  },
  description:
    "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution. Free, open source, and self-hosted.",
  keywords: ["note taking", "self-hosted", "open source", "privacy", "markdown", "memos"],
  authors: [{ name: "Memos Team" }],
  creator: "Memos Team",
  publisher: "Memos",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usememos.com",
    siteName: "Memos",
    title: "Memos - Open Source, Self-Hosted Note Taking",
    description:
      "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution. Free, open source, and self-hosted.",
    images: [
      {
        url: "/demo.png",
        width: 1200,
        height: 630,
        alt: "Memos Dashboard Screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Open Source, Self-Hosted Note Taking",
    description:
      "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution. Free, open source, and self-hosted.",
    images: ["/demo.png"],
  },
  icons: {
    icon: "/logo-rounded.png",
    shortcut: "/logo-rounded.png",
    apple: "/logo-rounded.png",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
