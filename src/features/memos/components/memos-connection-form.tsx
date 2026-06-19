"use client";

import { useEffect, useRef, useState } from "react";
import { testInstanceConnection } from "@/shared/memos/instance-stats";
import type { SafeMemosSettings } from "@/shared/settings/memos-settings";
import { deleteMemosSettings, getMemosSettings, saveMemosSettings } from "@/shared/settings/memos-settings-client";
import {
  canSubmitConnectionForm,
  describeSaveError,
  describeTestResult,
  type SaveErrorMessages,
  type TestMessage,
} from "../lib/memos-connection";
import { InstanceErrorNotice } from "./instance-error-notice";

const fieldLabelClassName = "block text-xs font-medium text-stone-600 dark:text-stone-400";

const fieldInputClassName =
  "mt-1 block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-500 focus:outline-none disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600";

const fieldErrorClassName = "mt-1 text-xs text-red-600 dark:text-red-400";

const fieldHintClassName = "mt-1 text-xs text-stone-500 dark:text-stone-400";

const secondaryButtonClassName =
  "inline-flex h-8 items-center rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800";

const primaryButtonClassName =
  "inline-flex h-8 items-center rounded-md bg-teal-600 px-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400";

type MemosConnectionFormProps = {
  /** Shared settings state owned by the host; null until first loaded. */
  settings: SafeMemosSettings | null;
  onSettingsChange: (settings: SafeMemosSettings) => void;
  /** Fired after a successful save, with the saved settings. */
  onSaved?: (settings: SafeMemosSettings) => void;
};

type PendingAction = "test" | "save" | "disconnect" | null;

export function MemosConnectionForm({ settings, onSettingsChange, onSaved }: MemosConnectionFormProps) {
  const [loading, setLoading] = useState(false);
  // null = untouched; the field falls back to the saved instance URL.
  const [editedInstanceUrl, setEditedInstanceUrl] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [testMessage, setTestMessage] = useState<TestMessage | null>(null);
  const [saveErrors, setSaveErrors] = useState<SaveErrorMessages>({});
  // Guards against state updates after the form unmounts (host closed the dialog
  // or advanced the onboarding step while a request was in flight).
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const instanceUrl = editedInstanceUrl ?? settings?.instanceUrl ?? "";
  const hasSavedToken = settings?.hasAccessToken === true;

  // Loads the shared settings if the form mounts before the host populated them.
  useEffect(() => {
    if (settings !== null) {
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
  }, [settings, onSettingsChange]);

  const formDisabled = loading || pendingAction !== null;
  const canSubmit = canSubmitConnectionForm({ instanceUrl, accessToken }, formDisabled);

  // Runs an action with shared pending/reset/unmount plumbing. The callback
  // returns the state update to apply, which is skipped if the form unmounted.
  async function runAction(action: NonNullable<PendingAction>, errorFallback: string, perform: () => Promise<() => void>) {
    setPendingAction(action);
    setTestMessage(null);
    setSaveErrors({});
    try {
      const applyResult = await perform();
      if (mountedRef.current) {
        applyResult();
      }
    } catch (error) {
      if (mountedRef.current) {
        setSaveErrors(describeSaveError(error, errorFallback));
      }
    } finally {
      if (mountedRef.current) {
        setPendingAction(null);
      }
    }
  }

  function handleTest() {
    return runAction("test", "Couldn't test the connection. Try again.", async () => {
      const result = await testInstanceConnection({ instanceUrl, accessToken });
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
        onSaved?.(saved);
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
    <form
      className="space-y-3"
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
            saveErrors.accessToken ? "memos-access-token-error" : hasSavedToken ? "memos-access-token-hint" : "memos-access-token-help"
          }
          className={fieldInputClassName}
        />
        {saveErrors.accessToken ? (
          <p id="memos-access-token-error" className={fieldErrorClassName}>
            {saveErrors.accessToken}
          </p>
        ) : hasSavedToken ? (
          <p id="memos-access-token-hint" className={fieldHintClassName}>
            A token is already saved. Enter it again (or a new one) to save changes.
          </p>
        ) : (
          <p id="memos-access-token-help" className={fieldHintClassName}>
            Create one in Memos under Settings → Access Tokens.
          </p>
        )}
      </div>

      {testMessage ? (
        testMessage.tone === "success" ? (
          <p role="status" aria-live="polite" className="text-xs font-medium text-teal-700 dark:text-teal-300">
            {testMessage.message}
          </p>
        ) : (
          <div role="status" aria-live="polite">
            <InstanceErrorNotice detail={testMessage.detail} />
          </div>
        )
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
  );
}
