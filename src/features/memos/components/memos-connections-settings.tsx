"use client";

import { ArrowLeftIcon, CheckCircle2Icon, ExternalLinkIcon, PlugZapIcon, RefreshCwIcon, UnplugIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserIdentity } from "@/features/account/components/user-identity";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { useMemosConnection } from "@/features/memos/hooks/use-memos-connection";
import type { InstanceErrorDetail } from "@/shared/memos/errors";
import type { MemosCredentials } from "@/shared/memos/instance-client";
import { type ConnectionTestResult, testInstanceConnection } from "@/shared/memos/instance-stats";
import { parseInstanceUrl } from "@/shared/settings/instance-url";
import { describeConnectionWriteError, sameMemosCredentials } from "@/shared/settings/memos-settings";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/app-card";
import { Badge } from "@/shared/ui/badge";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { InstanceErrorNotice } from "./instance-error-notice";
import { MemosConnectionForm } from "./memos-connection-form";

type CheckState =
  | { status: "idle" | "checking" }
  | { status: "ok"; result: Extract<ConnectionTestResult, { ok: true }> }
  | { status: "error"; detail: InstanceErrorDetail };

type MemosConnectionsSettingsProps = {
  source: "web-clipper" | null;
};

export function MemosConnectionsSettings({ source }: MemosConnectionsSettingsProps) {
  const account = useAccountActions();
  const connection = useMemosConnection();
  const [editing, setEditing] = useState(false);
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);
  const [checkState, setCheckState] = useState<CheckState>({ status: "idle" });
  const checkRequestRef = useRef(0);
  // The credentials whose test produced the current checkState; lets the effect
  // below skip re-testing a connection the save form just verified.
  const checkedCredentialsRef = useRef<MemosCredentials | null>(null);

  const checkConnection = useCallback(async () => {
    const requestId = ++checkRequestRef.current;
    const credentialsAtStart = connection.credentials;
    if (!credentialsAtStart) {
      checkedCredentialsRef.current = null;
      setCheckState({ status: "idle" });
      return;
    }
    setCheckState({ status: "checking" });
    const result = await testInstanceConnection(credentialsAtStart);
    if (requestId !== checkRequestRef.current) {
      return;
    }
    checkedCredentialsRef.current = credentialsAtStart;
    if (result.ok) {
      setCheckState({ status: "ok", result });
    } else {
      setCheckState({ status: "error", detail: result.error });
    }
  }, [connection.credentials]);

  useEffect(() => {
    if (connection.credentials && sameMemosCredentials(connection.credentials, checkedCredentialsRef.current)) {
      return;
    }
    void checkConnection();
  }, [checkConnection, connection.credentials]);

  async function handleDisconnect() {
    if (!connection.credentials) {
      return;
    }
    setDisconnecting(true);
    setDisconnectError(null);
    try {
      await connection.disconnect();
      setConfirmingDisconnect(false);
      setEditing(false);
    } catch (error) {
      setDisconnectError(describeConnectionWriteError(error, "disconnect"));
    } finally {
      setDisconnecting(false);
    }
  }

  const { credentials } = connection;
  const connected = credentials !== null;
  const connectedVersion = checkState.status === "ok" ? checkState.result.version : null;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Settings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Connections</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Manage the account-level services used by Memos apps and tools.
          </p>
        </div>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon />
          Dashboard
        </Link>
      </header>

      {source === "web-clipper" ? (
        <Alert className="mt-6">
          <PlugZapIcon />
          <AlertTitle>Web Clipper setup</AlertTitle>
          <AlertDescription>Finish connecting your Memos instance, then return to Memos Web Clipper.</AlertDescription>
        </Alert>
      ) : null}

      <section className="py-8" aria-labelledby="memos-instance-heading">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="memos-instance-heading" className="text-base font-medium">
              Memos instance
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Connect usememos.com to your self-hosted Memos instance.</p>
          </div>
          {connection.isLoaded && connection.isSignedIn ? (
            <UserIdentity user={account.user ?? null} size="xs" secondary="Account connection" />
          ) : null}
        </div>

        {!connection.isLoaded ? (
          <Card size="sm">
            <CardContent className="flex min-h-48 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                <Spinner />
                Checking your account…
              </div>
            </CardContent>
          </Card>
        ) : !connection.isSignedIn ? (
          <Card size="sm">
            <CardHeader>
              <CardTitle>Sign in to manage this connection</CardTitle>
              <CardDescription>
                Your Memos instance belongs to your usememos.com account. After sign-in, you’ll return to this exact settings page.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button type="button" onClick={() => account.signIn()}>
                Sign in
              </Button>
            </CardFooter>
          </Card>
        ) : !connected || editing ? (
          <Card size="sm">
            {editing ? (
              <CardHeader>
                <CardTitle>Edit connection</CardTitle>
                <CardDescription>Your saved connection stays active until the new details are verified and saved.</CardDescription>
              </CardHeader>
            ) : null}
            <CardContent>
              <MemosConnectionForm
                instanceUrl={connection.instanceUrl}
                existingAccessToken={credentials?.accessToken}
                onSave={(next) => {
                  // The form verified these exact credentials right before saving;
                  // recording that stops the effect from immediately re-testing them.
                  checkedCredentialsRef.current = next;
                  return connection.save(next);
                }}
                onSaved={(result) => {
                  setCheckState({ status: "ok", result });
                  setEditing(false);
                  setDisconnectError(null);
                }}
                onCancel={connected ? () => setEditing(false) : undefined}
              />
            </CardContent>
          </Card>
        ) : (
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex min-w-0 items-center gap-2">
                <span className="truncate">{parseInstanceUrl(credentials.instanceUrl)?.host ?? credentials.instanceUrl}</span>
                <Badge>
                  <CheckCircle2Icon />
                  Connected
                </Badge>
              </CardTitle>
              <CardDescription>Account connection</CardDescription>
              <CardAction>
                <Button type="button" variant="outline" onClick={() => void checkConnection()} disabled={checkState.status === "checking"}>
                  <RefreshCwIcon className={checkState.status === "checking" ? "animate-spin motion-reduce:animate-none" : undefined} />
                  Check again
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-medium">{checkState.status === "checking" ? "Checking…" : (connectedVersion ?? "Unavailable")}</dd>
                <dt className="text-muted-foreground">Last checked</dt>
                <dd className="font-medium">
                  {checkState.status === "checking" ? "Now" : checkState.status === "idle" ? "Not yet" : "Just now"}
                </dd>
              </dl>

              {checkState.status === "error" ? (
                <div className="mt-6">
                  <InstanceErrorNotice detail={checkState.detail} />
                </div>
              ) : null}

              {disconnectError ? (
                <Alert className="mt-5" variant="destructive">
                  <AlertTitle>Couldn’t disconnect</AlertTitle>
                  <AlertDescription>{disconnectError}</AlertDescription>
                </Alert>
              ) : null}
            </CardContent>

            <CardFooter className="flex-wrap gap-2">
              {confirmingDisconnect ? (
                <>
                  <p className="mr-auto text-sm text-muted-foreground">Disconnect this instance from your account?</p>
                  <Button type="button" variant="ghost" disabled={disconnecting} onClick={() => setConfirmingDisconnect(false)}>
                    Keep connection
                  </Button>
                  <Button type="button" variant="destructive" disabled={disconnecting} onClick={() => void handleDisconnect()}>
                    {disconnecting ? <Spinner /> : <UnplugIcon />}
                    {disconnecting ? "Disconnecting…" : disconnectError ? "Retry disconnect" : "Disconnect"}
                  </Button>
                </>
              ) : (
                <>
                  <a href={credentials.instanceUrl} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline" })}>
                    Open Memos
                    <ExternalLinkIcon />
                  </a>
                  <Button type="button" variant="outline" onClick={() => setEditing(true)}>
                    Edit connection
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => setConfirmingDisconnect(true)}>
                    Disconnect
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        )}

        {source === "web-clipper" && connected && !editing ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Connection saved. Return to Memos Web Clipper; it will refresh this account automatically.
          </p>
        ) : null}
      </section>
    </main>
  );
}
