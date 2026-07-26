import type { ReactNode } from "react";
import { MarketingSiteLayout } from "@/features/marketing/components/marketing-site-layout";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <MarketingSiteLayout>{children}</MarketingSiteLayout>;
}
