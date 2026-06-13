"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SafeMemosSettings } from "@/shared/settings/memos-settings";
import { deleteMemosSettings, getMemosSettings, saveMemosSettings, testMemosConnection } from "@/shared/settings/memos-settings-client";
import {
  canSubmitConnectionForm,
  describeSaveError,
  describeTestResult,
  type SaveErrorMessages,
  type TestMessage,
} from "../lib/memos-connection";

const fieldLabelClassName = "block text-xs font-medium text-stone-600 dark:text-stone-400";

const fieldInputClassName =
  "mt-1 block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-500 focus:outline-none disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600";

const fieldErrorClassName = "mt-1 text-xs text-red-600 dark:text-red-400";

const secondaryButtonClassName =
  "inline-flex h-8 items-center rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800";

const primaryButtonClassName =
  "inline-flex h-8 items-center rounded-md bg-teal-600 px-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400";

type MemosConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shared settings state owned by the toolbar; null until first loaded. */
  settings: SafeMemosSettings | null;
  onSettingsChange: (settings: SafeMemosSettings) => void;
};

type PendingAction = "test" | "save" | "disconnect" | null;

export function MemosConnectionDialog({ open, onOpenChange, settings, onSettingsChange }: MemosConnectionDialogProps) {
  const [loading, setLoading] = useState(false);
  // null = untouched; the field falls back to the saved instance URL.
  const [editedInstanceUrl, setEditedInstanceUrl] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [testMessage, setTestMessage] = useState<TestMessage | null>(null);
  const [saveErrors, setSaveErrors] = useState<SaveErrorMessages>({});
  // Bumped on every open so in-flight action handlers can detect that the dialog
  // was closed and reopened, and skip writing their now-stale results.
  const openEpochRef = useRef(0);

  const instanceUrl = editedInstanceUrl ?? settings?.instanceUrl ?? "";
  const hasSavedToken = settings?.hasAccessToken === true;

  useEffect(() => {
    if (!open) {
      return;
    }
    openEpochRef.current += 1;
    setEditedInstanceUrl(null);
    setAccessToken("");
    setPendingAction(null);
    setTestMessage(null);
    setSaveErrors({});
  }, [open]);

  // Loads the shared settings if the dialog opens before the account menu's
  // fetch has populated them; resolves to a no-op re-run once they arrive.
  useEffect(() => {
    if (!open || settings !== null) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    getMemosSettings()
      .then((fetched) => {
        if (!cancelled) {
          onSettingsChange(fetched);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSaveErrors({ form: "Couldn't load settings. Try again." });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, settings, onSettingsChange]);

  const formDisabled = loading || pendingAction !== null;
  const canSubmit = canSubmitConnectionForm({ instanceUrl, accessToken }, formDisabled);

  // Runs an action with the shared pending/reset/stale-result plumbing. The
  // callback returns the state update to apply, which is skipped when the
  // dialog was closed and reopened while the request was in flight.
  async function runAction(action: NonNullable<PendingAction>, errorFallback: string, perform: () => Promise<() => void>) {
    const epoch = openEpochRef.current;
    setPendingAction(action);
    setTestMessage(null);
    setSaveErrors({});
    try {
      const applyResult = await perform();
      if (openEpochRef.current !== epoch) {
        return;
      }
      applyResult();
    } catch (error) {
      if (openEpochRef.current !== epoch) {
        return;
      }
      setSaveErrors(describeSaveError(error, errorFallback));
    } finally {
      if (openEpochRef.current === epoch) {
        setPendingAction(null);
      }
    }
  }

  function handleTest() {
    return runAction("test", "Couldn't test the connection. Try again.", async () => {
      const result = await testMemosConnection({ instanceUrl, accessToken });
      return () => setTestMessage(describeTestResult(result));
    });
  }

  function handleSave() {
    if (!canSubmit) {
      return;
    }
    return runAction("save", "Couldn't save settings. Try again.", async () => {
      const saved = await saveMemosSettings({ instanceUrl, accessToken });
      return () => {
        onSettingsChange(saved);
        onOpenChange(false);
      };
    });
  }

  function handleDisconnect() {
    return runAction("disconnect", "Couldn't disconnect. Try again.", async () => {
      await deleteMemosSettings();
      return () => {
        setEditedInstanceUrl(null);
        setAccessToken("");
        onSettingsChange({ instanceUrl: null, hasAccessToken: false });
      };
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-950/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(calc(100vw-2rem),26rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-stone-200 bg-white p-5 shadow-lg shadow-stone-900/10 focus:outline-none dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-base font-semibold text-stone-900 dark:text-stone-100">Connect Memos instance</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs leading-5 text-stone-500 dark:text-stone-400">
                Link your self-hosted Memos instance. Your access token is stored server-side and never sent to the browser.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-stone-400 transition hover:text-stone-700 dark:hover:text-stone-200"
              aria-label="Close"
            >
              <XIcon className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            <div>
              <label className={fieldLabelClassName} htmlFor="memos-instance-url">
                Instance URL
              </label>
              <input
                id="memos-instance-url"
                type="text"
                inputMode="url"
                placeholder="https://memos.example.com"
                value={instanceUrl}
                onChange={(event) => setEditedInstanceUrl(event.target.value)}
                disabled={formDisabled}
                aria-invalid={saveErrors.instanceUrl ? true : undefined}
                aria-describedby={saveErrors.instanceUrl ? "memos-instance-url-error" : undefined}
                className={fieldInputClassName}
              />
              {saveErrors.instanceUrl ? (
                <p id="memos-instance-url-error" className={fieldErrorClassName}>
                  {saveErrors.instanceUrl}
                </p>
              ) : null}
            </div>

            <div>
              <label className={fieldLabelClassName} htmlFor="memos-access-token">
                Access token
              </label>
              <input
                id="memos-access-token"
                type="password"
                autoComplete="off"
                value={accessToken}
                onChange={(event) => setAccessToken(event.target.value)}
                disabled={formDisabled}
                aria-invalid={saveErrors.accessToken ? true : undefined}
                aria-describedby={
                  saveErrors.accessToken ? "memos-access-token-error" : hasSavedToken ? "memos-access-token-hint" : undefined
                }
                className={fieldInputClassName}
              />
              {saveErrors.accessToken ? (
                <p id="memos-access-token-error" className={fieldErrorClassName}>
                  {saveErrors.accessToken}
                </p>
              ) : null}
              {hasSavedToken && !saveErrors.accessToken ? (
                <p id="memos-access-token-hint" className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  A token is already saved. Enter it again (or a new one) to save changes.
                </p>
              ) : null}
            </div>

            {testMessage ? (
              <p
                role="status"
                aria-live="polite"
                className={
                  testMessage.tone === "success"
                    ? "text-xs font-medium text-teal-700 dark:text-teal-300"
                    : "text-xs font-medium text-red-600 dark:text-red-400"
                }
              >
                {testMessage.message}
              </p>
            ) : null}
            {saveErrors.form ? (
              <p role="alert" className={fieldErrorClassName}>
                {saveErrors.form}
              </p>
            ) : null}

            <div className="flex items-center gap-2 pt-2">
              {hasSavedToken ? (
                <button
                  type="button"
                  onClick={() => void handleDisconnect()}
                  disabled={formDisabled}
                  className="inline-flex h-8 items-center rounded-md px-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Disconnect
                </button>
              ) : null}
              <div className="ml-auto flex items-center gap-2">
                <button type="button" onClick={() => void handleTest()} disabled={!canSubmit} className={secondaryButtonClassName}>
                  {pendingAction === "test" ? "Testing…" : "Test connection"}
                </button>
                <button type="submit" disabled={!canSubmit} className={primaryButtonClassName}>
                  {pendingAction === "save" ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
