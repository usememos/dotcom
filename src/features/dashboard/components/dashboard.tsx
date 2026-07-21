"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { AppPage } from "@/features/account/components/app-page";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { InstanceErrorNotice } from "@/features/memos/components/instance-error-notice";
import { useMemosConnection } from "@/features/memos/hooks/use-memos-connection";
import type { InstanceErrorDetail } from "@/shared/memos/errors";
import { fetchInstanceStats, type InstanceStatsResult } from "@/shared/memos/instance-stats";
import { CONNECTIONS_SETTINGS_PATH } from "@/shared/routes";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { connectedHeaderLabel } from "../lib/stats";
import { clearDashboardStatsCache, readDashboardStatsCache, writeDashboardStatsCache } from "../lib/stats-cache";
import { ActivityHeatmap } from "./activity-heatmap";
import { ConnectPrompt } from "./connect-prompt";
import { DashboardHeader } from "./dashboard-header";

type OkStats = Extract<InstanceStatsResult, { status: "ok" }>;
type NonOk = { kind: "not-connected" } | { kind: "error"; detail: InstanceErrorDetail } | { kind: "signed-out" } | { kind: "failed" };

/** "users/7" -> "7". */
function deriveUserId(name: string): string {
  return name.split("/").pop() || name;
}

function CenteredPanel({ children }: { children: ReactNode }) {
  return <div className="mx-4 mt-16 max-w-md rounded-2xl border bg-muted/20 p-8 text-center sm:mx-auto sm:mt-24">{children}</div>;
}

export function Dashboard() {
  const { signIn } = useAccountActions({ signInForceRedirectUrl: "/dashboard" });
  const connection = useMemosConnection();
  const { credentials, isConnected, isLoaded, isSignedIn, instanceUrl } = connection;
  const [data, setData] = useState<OkStats | null>(null);
  const [nonOk, setNonOk] = useState<NonOk | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  // Instant paint from the last-known stats while the live fetch runs.
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
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn) {
      setData(null);
      clearDashboardStatsCache();
      setNonOk({ kind: "signed-out" });
      return;
    }
    if (!credentials) {
      setData(null);
      clearDashboardStatsCache();
      setNonOk({ kind: "not-connected" });
      return;
    }
    let cancelled = false;
    const cached = readDashboardStatsCache();
    const hints = cached ? { userId: cached.userId, version: cached.version } : undefined;
    fetchInstanceStats(credentials, hints)
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
        } else {
          setNonOk({ kind: "error", detail: next.error });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNonOk({ kind: "failed" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, credentials, reloadKey]);

  if (data) {
    return (
      <DashboardShell>
        <DashboardHeader secondary={headerLabel(instanceUrl, data)} />
        <section aria-labelledby="activity-heading" className="pt-2">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-primary">Writing rhythm</p>
              <h2 id="activity-heading" className="mt-1.5 text-lg font-semibold tracking-[-0.025em]">
                Activity
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-xs leading-5 text-muted-foreground sm:block">
              A year of notes, links, and ideas from your connected instance.
            </p>
          </div>
          <ActivityHeatmap days={data.stats.days} />
        </section>
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "signed-out") {
    return (
      <CenteredPanel>
        <h1 className="text-xl font-semibold tracking-[-0.03em]">Your Memos workspace</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to manage connections, activity, and tools from one place.</p>
        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={() => signIn()}>
            Sign in
          </Button>
        </div>
      </CenteredPanel>
    );
  }

  if (nonOk?.kind === "not-connected") {
    return (
      <DashboardShell>
        <DashboardHeader secondary="No connections yet" />
        <ConnectPrompt />
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "error") {
    return (
      <DashboardShell>
        <DashboardHeader secondary={nonOkHeaderLabel(instanceUrl, isConnected)} />
        <div className="max-w-2xl">
          <InstanceErrorNotice detail={nonOk.detail} />
          <RecoveryActions onRetry={reload} />
        </div>
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "failed") {
    return (
      <DashboardShell>
        <DashboardHeader secondary={nonOkHeaderLabel(instanceUrl, isConnected)} />
        <InlineError message="Couldn't load your dashboard. Try again." onRetry={reload} />
      </DashboardShell>
    );
  }

  return <DashboardSkeleton />;
}

function headerLabel(instanceUrl: string | null, result: OkStats): string {
  if (!instanceUrl) {
    return result.instanceVersion ? `Connected · v${result.instanceVersion}` : "Connected";
  }
  return connectedHeaderLabel(instanceUrl, result.instanceVersion);
}

/** Header label for authenticated states without live dashboard data. */
function nonOkHeaderLabel(instanceUrl: string | null, isConnected: boolean): string {
  if (!isConnected) {
    return "No connections yet";
  }
  return instanceUrl ? connectedHeaderLabel(instanceUrl, null) : "Connected";
}

function DashboardShell({ children }: { children: ReactNode }) {
  return <AppPage className="flex flex-col gap-9">{children}</AppPage>;
}

function DashboardSkeleton() {
  return (
    <DashboardShell>
      <Skeleton className="h-5 w-32" />
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="hidden h-8 w-64 sm:block" />
      </div>
      <Skeleton className="h-52 w-full" />
    </DashboardShell>
  );
}

function InlineError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Couldn’t load dashboard</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <RecoveryActions onRetry={onRetry} />
    </Alert>
  );
}

/** Retry + Connections escape hatch shown under any dashboard load error. */
function RecoveryActions({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-4 flex gap-2">
      <Button type="button" variant="outline" onClick={onRetry}>
        Retry
      </Button>
      <Link href={CONNECTIONS_SETTINGS_PATH} className={buttonVariants({ variant: "outline" })}>
        Connections
      </Link>
    </div>
  );
}
