import type { ReactNode } from "react";
import { Footer } from "@/features/marketing/components/footer";
import { SiteHeader } from "@/features/marketing/components/site-header";

export function MarketingSiteLayout({ children }: { children: ReactNode }) {
  // No flex wrapper here: `<body>` is already `flex min-h-screen flex-col`, and
  // each page's `<main className="flex flex-1 …">` is what pins the footer down.
  return (
    <>
      <SiteHeader />
      {children}
      <Footer />
    </>
  );
}
