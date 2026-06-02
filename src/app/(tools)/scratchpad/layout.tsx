import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScratchpadViewportLock } from "@/features/scratchpad/components/scratchpad-viewport-lock";
import { ThemeProvider } from "@/features/scratchpad/components/theme-provider";
import { buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scratchpad - Memos",
  description: "A browser-local workspace for quick drafts, images, and loose ideas.",
  keywords: ["scratchpad", "brainstorming", "notes", "memos"],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Scratchpad - Memos",
    description: "A browser-local workspace for quick drafts, images, and loose ideas.",
    url: "https://usememos.com/scratchpad",
    images: buildDefaultOpenGraphImages("Scratchpad - Memos"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Scratchpad - Memos",
    description: "A browser-local workspace for quick drafts, images, and loose ideas.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ScratchLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ScratchpadViewportLock />
      {children}
    </ThemeProvider>
  );
}
