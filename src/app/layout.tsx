import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://usememos.com"),
  title: {
    default: "Memos - Open Source, Self-hosted Note Taking",
    template: "%s - Memos",
  },
  description: "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution. Free, open source, and self-hosted.",
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
    title: "Memos - Open Source, Self-hosted Note Taking",
    description: "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution. Free, open source, and self-hosted.",
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
    title: "Memos - Open Source, Self-hosted Note Taking",
    description: "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution. Free, open source, and self-hosted.",
    images: ["/demo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
