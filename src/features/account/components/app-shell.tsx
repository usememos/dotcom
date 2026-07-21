"use client";

import { GaugeIcon, PlugIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { CONNECTIONS_SETTINGS_PATH } from "@/shared/routes";
import { AppAccountMenu } from "./app-account-menu";

const navigation = [
  { href: "/dashboard", label: "Overview", Icon: GaugeIcon },
  { href: CONNECTIONS_SETTINGS_PATH, label: "Connections", Icon: PlugIcon },
] as const;

function WorkspaceMark() {
  return (
    <Link
      href="/dashboard"
      className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-7 place-items-center overflow-hidden rounded-lg bg-foreground shadow-sm transition-transform duration-200 group-hover:-rotate-2">
        <img src="/logo-rounded.png" alt="" className="size-7 object-cover" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em]">Memos</span>
    </Link>
  );
}

function WorkspaceNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace" className={cn("flex", mobile ? "items-center gap-1" : "flex-col gap-1")}>
      {navigation.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-2 rounded-lg text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              mobile ? "px-2.5 py-1.5" : "px-2.5 py-2",
              active
                ? "bg-foreground/[0.07] text-foreground dark:bg-white/[0.08]"
                : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground dark:hover:bg-white/[0.05]",
            )}
          >
            <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
            <span className={mobile ? "max-[399px]:sr-only" : undefined}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-surface h-svh overflow-hidden bg-muted lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
      <aside className="hidden h-svh min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] px-3 py-4 lg:grid">
        <div className="px-2 pb-8 pt-1">
          <WorkspaceMark />
        </div>
        <p className="px-2.5 pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">Workspace</p>
        <div className="min-h-0 overflow-y-auto px-2">
          <WorkspaceNavigation />
        </div>
        <div className="h-11 px-2">
          <AppAccountMenu />
        </div>
      </aside>

      <div className="h-svh min-w-0 overflow-hidden lg:p-2 lg:pl-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-xl lg:hidden">
          <WorkspaceMark />
          <div className="flex items-center gap-1">
            <WorkspaceNavigation mobile />
            <AppAccountMenu compact />
          </div>
        </header>
        <main className="h-[calc(100svh-3.5rem)] min-w-0 overflow-y-auto overscroll-none bg-background bg-clip-border lg:h-[calc(100svh-1rem)] lg:rounded-xl lg:border lg:border-border lg:shadow-[0_1px_2px_rgba(20,28,24,0.04),0_12px_32px_rgba(20,28,24,0.04)]">
          {children}
        </main>
      </div>
    </div>
  );
}
