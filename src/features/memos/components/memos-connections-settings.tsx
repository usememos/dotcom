"use client";

import { CheckCircle2Icon, ExternalLinkIcon, PlugZapIcon, RefreshCwIcon, UnplugIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppPage } from "@/features/account/components/app-page";
import { useAccountActions } from "@/features/account/hooks/use-account-actions";
import { useMemosConnection } from "@/features/memos/hooks/use-memos-connection";
import type { InstanceErrorDetail } from "@/shared/memos/errors";
import type { MemosCredentials } from "@/shared/memos/instance-client";
import { type ConnectionTestResult, testInstanceConnection } from "@/shared/memos/instance-stats";
import { parseInstanceUrl } from "@/shared/settings/instance-url";
import { describeConnectionWriteError, sameMemosCredentials } from "@/shared/settings/memos-settings";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/app-card";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { BrowserExtensionPromotion } from "./browser-extension-promotion";
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
    <AppPage>
      <div className="max-w-3xl">
        <header>
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] sm:text-[32px]">Connect your Memos instance</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Enter the root URL and a PAT created by the same instance.
          </p>
        </header>

        {source === "web-clipper" ? (
          <Alert className="mt-6 border-primary/20 bg-accent/60">
            <PlugZapIcon />
            <AlertTitle>Web Clipper setup</AlertTitle>
            <AlertDescription>Finish connecting your Memos instance, then return to Memos Web Clipper.</AlertDescription>
          </Alert>
        ) : null}

        <section className="pb-8 pt-10" aria-label="Memos connection">
          {!connection.isLoaded ? (
            <div className="flex min-h-48 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                <Spinner />
                Checking your account…
              </div>
            </div>
          ) : !connection.isSignedIn ? (
            <div className="rounded-2xl border bg-muted/20 p-6">
              <h3 className="text-base font-semibold tracking-[-0.02em]">Sign in to manage this connection</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Your Memos instance belongs to your usememos.com account. After sign-in, you’ll return to this settings page.
              </p>
              <Button className="mt-5" type="button" onClick={() => account.signIn()}>
                Sign in
              </Button>
            </div>
          ) : !connected || editing ? (
            <div className="max-w-2xl">
              {editing ? (
                <div className="mb-7">
                  <h2 className="text-base font-semibold tracking-[-0.02em]">Edit URL and PAT</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    The saved connection stays active until these values pass the connection test.
                  </p>
                </div>
              ) : null}
              <MemosConnectionForm
                instanceUrl={connection.instanceUrl}
                existingAccessToken={credentials?.accessToken}
                showDemoOption={!connected}
                onSave={(next) => {
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
            </div>
          ) : (
            <Card className="rounded-2xl" size="sm">
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex min-w-0 items-center gap-2">
                  <CheckCircle2Icon className="size-4 shrink-0 text-primary" />
                  <span className="truncate">{parseInstanceUrl(credentials.instanceUrl)?.host ?? credentials.instanceUrl}</span>
                </CardTitle>
                <CardDescription>{credentials.instanceUrl}</CardDescription>
                <CardAction>
                  <Button type="button" variant="ghost" onClick={() => void checkConnection()} disabled={checkState.status === "checking"}>
                    <RefreshCwIcon className={checkState.status === "checking" ? "animate-spin motion-reduce:animate-none" : undefined} />
                    Check again
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="py-2">
                <dl className="grid grid-cols-2 divide-x rounded-xl bg-muted/45">
                  <div className="px-4 py-3 first:pl-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Version</dt>
                    <dd className="mt-1.5 text-sm font-medium tabular-nums">
                      {checkState.status === "checking" ? "Checking…" : (connectedVersion ?? "Unavailable")}
                    </dd>
                  </div>
                  <div className="px-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Last checked</dt>
                    <dd className="mt-1.5 text-sm font-medium">
                      {checkState.status === "checking" ? "Now" : checkState.status === "idle" ? "Not yet" : "Just now"}
                    </dd>
                  </div>
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

              <CardFooter className="flex-wrap gap-2 bg-transparent">
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
                    <Button className="ml-auto" type="button" variant="destructive" onClick={() => setConfirmingDisconnect(true)}>
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

          {source !== "web-clipper" && connected && !editing && checkState.status === "ok" ? (
            <div className="mt-10">
              <BrowserExtensionPromotion />
            </div>
          ) : null}
        </section>
      </div>
    </AppPage>
  );
}
