"use client";

import type { ReactNode } from "react";

type DashboardHeaderProps = {
  secondary: ReactNode;
};

/** Page title and current Memos connection status. */
export function DashboardHeader({ secondary }: DashboardHeaderProps) {
  return (
    <header>
      <h1 className="text-[26px] font-semibold leading-none tracking-[-0.04em] sm:text-[28px]">Overview</h1>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{secondary}</p>
    </header>
  );
}
