import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScratchpadViewportLock } from "@/components/scratch/scratchpad-viewport-lock";
import { ThemeProvider } from "@/components/scratch/theme-provider";
import { buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Scratchpad - Memos",
  description:
    "A browser-local workspace for quick drafts that can connect to your self-hosted Memos instance. Work locally, save when ready.",
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
    description: "A browser-local workspace for quick drafts that connects to your self-hosted Memos instance.",
    url: "https://usememos.com/scratchpad",
    images: buildDefaultOpenGraphImages("Scratchpad - Memos"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Scratchpad - Memos",
    description: "A browser-local workspace for quick drafts that connects to your self-hosted Memos instance.",
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
