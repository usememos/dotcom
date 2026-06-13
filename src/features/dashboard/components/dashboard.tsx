"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { PlugIcon, SettingsIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { AccountActionItems } from "@/features/account/components/account-action-items";
import { ThemeMenuItems } from "@/features/account/components/theme-menu-items";
import { UserIdentity } from "@/features/account/components/user-identity";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { menuItemClassName, menuSeparatorClassName } from "@/features/account/lib/menu-styles";
import { useMemosConnection } from "@/features/memos/hooks/use-memos-connection";
import { useIsClerkConfigured } from "@/shared/auth/clerk-config";
import type { SafeMemosSettings } from "@/shared/settings/memos-settings";
import { getMemosStats } from "@/shared/settings/memos-settings-client";
import type { MemosStatsFailureReason, MemosStatsResult } from "@/shared/settings/memos-stats";
import { classifyStatsFailure, connectedHeaderLabel, describeStatsError } from "../lib/stats";
import { clearDashboardStatsCache, readDashboardStatsCache, writeDashboardStatsCache } from "../lib/stats-cache";
import { ActivityHeatmap } from "./activity-heatmap";
import { StatTiles } from "./stat-tiles";

const primaryButtonClassName =
  "inline-flex h-9 items-center rounded-md bg-teal-600 px-4 text-sm font-medium text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400";
const secondaryButtonClassName =
  "inline-flex h-8 items-center rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800";
const iconButtonClassName =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-600 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800";
const menuContentClassName =
  "z-50 w-56 rounded-md border border-stone-200 bg-white p-1.5 shadow-md shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40";

type OkStats = Extract<MemosStatsResult, { status: "ok" }>;
type NonOk = { kind: "not-connected" } | { kind: "error"; reason: MemosStatsFailureReason } | { kind: "signed-out" } | { kind: "failed" };

/** "users/7" -> "7". */
function deriveUserId(name: string): string {
  return name.split("/").pop() || name;
}

function CenteredCard({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto mt-24 max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
      {children}
    </div>
  );
}

export function Dashboard() {
  const isClerkConfigured = useIsClerkConfigured();
  if (!isClerkConfigured) {
    notFound();
  }
  return <DashboardContent />;
}

function DashboardContent() {
  const { user, signIn } = useAccountActions({ signInForceRedirectUrl: "/dashboard" });
  const [data, setData] = useState<OkStats | null>(null);
  const [nonOk, setNonOk] = useState<NonOk | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  const handleSettingsChanged = useCallback(() => {
    clearDashboardStatsCache();
    setData(null);
    reload();
  }, [reload]);
  const connection = useMemosConnection({ onSettingsChange: handleSettingsChanged });

  useEffect(() => {
    const cached = readDashboardStatsCache();
    if (cached) {
      setData({
        status: "ok",
        instanceVersion: cached.version,
        user: { name: `users/${cached.userId}` },
        stats: cached.stats,
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cached = readDashboardStatsCache();
    const hints = cached ? { userId: cached.userId, version: cached.version } : undefined;
    getMemosStats(hints)
      .then((next) => {
        if (cancelled) {
          return;
        }
        if (next.status === "ok") {
          setData(next);
          setNonOk(null);
          writeDashboardStatsCache({
            userId: deriveUserId(next.user.name),
            version: next.instanceVersion,
            stats: next.stats,
            fetchedAt: Date.now(),
          });
        } else if (next.status === "not-connected") {
          setData(null);
          clearDashboardStatsCache();
          setNonOk({ kind: "not-connected" });
        } else {
          setNonOk({ kind: "error", reason: next.reason });
        }
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        const kind = classifyStatsFailure(error);
        if (kind === "signed-out" || kind === "not-configured") {
          setData(null);
          clearDashboardStatsCache();
          setNonOk({ kind: "signed-out" });
        } else {
          setNonOk({ kind: "failed" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (data) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-between gap-3">
          <UserIdentity user={user ?? null} size="md" secondary={headerLabel(connection.settings, data)} />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button" className={iconButtonClassName} aria-label="Account and connection">
                <SettingsIcon className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={menuContentClassName} sideOffset={8} align="end">
                <DropdownMenu.Item
                  className={menuItemClassName}
                  onSelect={() => {
                    // Defer so the dropdown layer unmounts before the dialog mounts.
                    setTimeout(connection.open, 0);
                  }}
                >
                  <PlugIcon className="h-4 w-4" />
                  <span>Manage connection</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={menuSeparatorClassName} />
                <AccountActionItems signOutRedirectUrl="/" />
                <DropdownMenu.Separator className={menuSeparatorClassName} />
                <ThemeMenuItems />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <StatTiles stats={data.stats} />
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <ActivityHeatmap days={data.stats.days} />
        </div>
        {connection.dialog}
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "signed-out") {
    return (
      <CenteredCard>
        <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">See your Memos activity</h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Sign in to connect your instance and view your stats.</p>
        <button type="button" className={`${primaryButtonClassName} mt-5`} onClick={() => signIn()}>
          Sign in
        </button>
      </CenteredCard>
    );
  }

  if (nonOk?.kind === "not-connected") {
    return (
      <DashboardShell>
        <CenteredCard>
          <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Connect your Memos instance</h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Link your self-hosted instance to see your activity heatmap and stats.
          </p>
          <button type="button" className={`${primaryButtonClassName} mt-5`} onClick={() => connection.open()}>
            Connect Memos instance
          </button>
        </CenteredCard>
        {connection.dialog}
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "error" || nonOk?.kind === "failed") {
    const message = nonOk.kind === "error" ? describeStatsError(nonOk.reason) : "Couldn't load your stats. Try again.";
    return (
      <DashboardShell>
        <InlineError message={message} onRetry={reload} onManage={() => connection.open()} />
        {connection.dialog}
      </DashboardShell>
    );
  }

  return <DashboardSkeleton />;
}

function headerLabel(settings: SafeMemosSettings | null, result: OkStats): string {
  if (!settings?.instanceUrl) {
    return result.instanceVersion ? `Connected · v${result.instanceVersion}` : "Connected";
  }
  return connectedHeaderLabel(settings.instanceUrl, result.instanceVersion);
}

function DashboardShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">{children}</div>;
}

function DashboardSkeleton() {
  return (
    <DashboardShell>
      <div className="h-5 w-32 animate-pulse rounded bg-stone-200/60 dark:bg-stone-800/50" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-16 rounded-2xl border border-stone-200/70 dark:border-stone-800/60" />
        ))}
      </div>
      <div className="h-32 animate-pulse rounded-2xl border border-stone-200/70 bg-stone-100/40 dark:border-stone-800/60 dark:bg-stone-800/20" />
    </DashboardShell>
  );
}

function InlineError({ message, onRetry, onManage }: { message: string; onRetry: () => void; onManage: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
      <div className="mt-4 flex gap-2">
        <button type="button" className={secondaryButtonClassName} onClick={onRetry}>
          Retry
        </button>
        <button type="button" className={secondaryButtonClassName} onClick={onManage}>
          Manage connection
        </button>
      </div>
    </div>
  );
}
