import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScratchpadViewportLock } from "@/features/scratchpad/components/scratchpad-viewport-lock";
import { ThemeProvider } from "@/features/scratchpad/components/theme-provider";
import { buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";

export const dynamic = "force-dynamic";

const scratchpadTitle = "Scratchpad";
const scratchpadSocialTitle = "Scratchpad - Memos";
const scratchpadDescription =
  "A local-first visual canvas for quick cards, files, and loose ideas. Your cards stay on this device and are not uploaded to the cloud.";

export const metadata: Metadata = {
  title: scratchpadTitle,
  description: scratchpadDescription,
  keywords: ["scratchpad", "brainstorming", "cards", "visual cards", "canvas cards", "local-first", "memos"],
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
