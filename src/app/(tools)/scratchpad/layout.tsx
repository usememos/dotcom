import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScratchpadViewportLock } from "@/features/scratchpad/components/scratchpad-viewport-lock";
import { ThemeProvider } from "@/features/scratchpad/components/theme-provider";
import { buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";

const scratchpadTitle = "Scratchpad";
const scratchpadSocialTitle = "Scratchpad - Memos";
const scratchpadDescription =
  "A local-first visual canvas for quick notes, cards, files, and loose ideas. Sign-in only verifies your account; Scratchpad does not access or store your cards.";

export const metadata: Metadata = {
  title: scratchpadTitle,
  description: scratchpadDescription,
  keywords: ["scratchpad", "brainstorming", "notes", "visual notes", "canvas notes", "local-first", "cards", "memos"],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: scratchpadSocialTitle,
    description: scratchpadDescription,
    url: "https://usememos.com/scratchpad",
    images: buildDefaultOpenGraphImages(scratchpadSocialTitle),
  },
  twitter: {
    card: "summary_large_image",
    title: scratchpadSocialTitle,
    description: scratchpadDescription,
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
