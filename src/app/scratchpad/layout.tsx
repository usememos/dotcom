import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/scratch/theme-provider";

export const metadata: Metadata = {
  title: "Scratchpad - Memos",
  description:
    "A browser-local workspace for temporary brainstorming that connects to your self-hosted Memos instance. Work locally, save remotely when ready.",
  keywords: ["scratchpad", "brainstorming", "notes", "memos", "local-first"],
  openGraph: {
    title: "Scratchpad - Memos",
    description: "A browser-local workspace for temporary brainstorming that connects to your self-hosted Memos instance.",
    url: "https://usememos.com/scratchpad",
  },
};

export default function ScratchLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
