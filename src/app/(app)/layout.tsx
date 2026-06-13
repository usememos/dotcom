import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-stone-50 dark:bg-stone-950">{children}</div>;
}
