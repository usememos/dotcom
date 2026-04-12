import type { ReactNode } from "react";
import { HomeHeader } from "@/components/home-header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div id="nd-home-layout" className="flex flex-1 flex-col [--fd-layout-width:1400px]">
      <HomeHeader />
      {children}
    </div>
  );
}
