"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { InstanceErrorNotice } from "@/features/memos/components/instance-error-notice";
import { useMemosConnection } from "@/features/memos/hooks/use-memos-connection";
import type { InstanceErrorDetail } from "@/shared/memos/errors";
import { fetchInstanceStats, type InstanceStatsResult } from "@/shared/memos/instance-stats";
import { CONNECTIONS_SETTINGS_PATH } from "@/shared/routes";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/app-card";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { connectedHeaderLabel } from "../lib/stats";
import { clearDashboardStatsCache, readDashboardStatsCache, writeDashboardStatsCache } from "../lib/stats-cache";
import { ActivityHeatmap } from "./activity-heatmap";
import { BrowserExtensionPreview } from "./browser-extension-preview";
import { ConnectPrompt } from "./connect-prompt";
import { DashboardHeader } from "./dashboard-header";
import { StatTiles } from "./stat-tiles";

type OkStats = Extract<InstanceStatsResult, { status: "ok" }>;
type NonOk = { kind: "not-connected" } | { kind: "error"; detail: InstanceErrorDetail } | { kind: "signed-out" } | { kind: "failed" };

/** "users/7" -> "7". */
function deriveUserId(name: string): string {
  return name.split("/").pop() || name;
}

function CenteredCard({ children }: { children: ReactNode }) {
  return <Card className="mx-auto mt-24 max-w-md text-center">{children}</Card>;
}

export function Dashboard() {
  const { user, signIn } = useAccountActions({ signInForceRedirectUrl: "/dashboard" });
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
        <DashboardHeader user={user ?? null} secondary={headerLabel(instanceUrl, data)} />
        <StatTiles stats={data.stats} />
        <div className="space-y-3">
          <Card>
            <CardContent>
              <ActivityHeatmap days={data.stats.days} />
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent>
              <BrowserExtensionPreview />
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "signed-out") {
    return (
      <CenteredCard>
        <CardHeader>
          <CardTitle>Your Memos workspace</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">Sign in to manage connections, activity, and tools from one place.</CardContent>
        <CardFooter className="justify-center">
          <Button type="button" onClick={() => signIn()}>
            Sign in
          </Button>
        </CardFooter>
      </CenteredCard>
    );
  }

  if (nonOk?.kind === "not-connected") {
    return (
      <DashboardShell>
        <DashboardHeader user={user ?? null} secondary="No connections yet" />
        <ConnectPrompt />
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "error") {
    return (
      <DashboardShell>
        <DashboardHeader user={user ?? null} secondary={nonOkHeaderLabel(instanceUrl, isConnected)} />
        <Card>
          <CardContent>
            <InstanceErrorNotice detail={nonOk.detail} />
            <RecoveryActions onRetry={reload} />
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  if (nonOk?.kind === "failed") {
    return (
      <DashboardShell>
        <DashboardHeader user={user ?? null} secondary={nonOkHeaderLabel(instanceUrl, isConnected)} />
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
  return <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10">{children}</div>;
}

function DashboardSkeleton() {
  return (
    <DashboardShell>
      <Skeleton className="h-5 w-32" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-16" />
        ))}
      </div>
      <Skeleton className="h-32" />
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
