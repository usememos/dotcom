import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/scratch/theme-provider";

export const metadata: Metadata = {
  title: "Scratchpad - Memos",
  description:
    "A browser-local workspace for quick drafts that can connect to your self-hosted Memos instance. Work locally, save when ready.",
  keywords: ["scratchpad", "brainstorming", "notes", "memos"],
  openGraph: {
    title: "Scratchpad - Memos",
    description: "A browser-local workspace for quick drafts that connects to your self-hosted Memos instance.",
    url: "https://usememos.com/scratchpad",
  },
};

export default function ScratchLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
