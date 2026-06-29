"use client";

import { CheckIcon, ClipboardPasteIcon, EyeIcon, EyeOffIcon, GlobeIcon, KeyRoundIcon, Loader2Icon, LockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { InstanceErrorDetail } from "@/shared/memos/errors";
import { testInstanceConnection } from "@/shared/memos/instance-stats";
import type { SafeMemosSettings } from "@/shared/settings/memos-settings";
import { deleteMemosSettings, getMemosSettings, saveMemosSettings } from "@/shared/settings/memos-settings-client";
import { canSubmitConnectionForm, describeSaveError, type SaveErrorMessages } from "../lib/memos-connection";
import { InstanceErrorNotice } from "./instance-error-notice";

const fieldLabelClassName = "flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400";

const fieldInputClassName =
  "block w-full rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600";

const fieldErrorClassName = "mt-1 text-xs text-red-600 dark:text-red-400";

const fieldHintClassName = "mt-1 text-xs text-stone-500 dark:text-stone-400";

const primaryButtonClassName =
  "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-teal-600 px-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400";

type MemosConnectionFormProps = {
  /** Shared settings state owned by the host; null until first loaded. */
  settings: SafeMemosSettings | null;
  onSettingsChange: (settings: SafeMemosSettings) => void;
  /**
   * Fired when the user dismisses the success state (the host closes the dialog).
   * The saved settings are already delivered via onSettingsChange.
   */
  onSaved?: () => void;
};

type Phase = "idle" | "connecting" | "disconnecting" | "connected";

/** Returns the instance's access-token settings URL, or null if the URL isn't a usable http(s) origin yet. */
function instanceSettingsUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return `${url.origin}/setting`;
  } catch {
    return null;
  }
}

export function MemosConnectionForm({ settings, onSettingsChange, onSaved }: MemosConnectionFormProps) {
  const [loading, setLoading] = useState(false);
  // null = untouched; the field falls back to the saved instance URL.
  const [editedInstanceUrl, setEditedInstanceUrl] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [revealToken, setRevealToken] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [connectedName, setConnectedName] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<InstanceErrorDetail | null>(null);
  const [saveErrors, setSaveErrors] = useState<SaveErrorMessages>({});
  // Guards against state updates after the form unmounts (host closed the dialog
  // while a request was in flight).
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

  const busy = loading || phase === "connecting" || phase === "disconnecting";
  const canSubmit = canSubmitConnectionForm({ instanceUrl, accessToken }, busy);
  const settingsUrl = instanceSettingsUrl(instanceUrl);

  // Clears any stale result when the user edits a field, so success/error notices
  // never linger over changed inputs.
  function clearResult() {
    if (errorNotice) {
      setErrorNotice(null);
    }
    if (saveErrors.form || saveErrors.instanceUrl || saveErrors.accessToken) {
      setSaveErrors({});
    }
  }

  // A single action: test the connection against the instance, then persist it.
  // Saving only happens once the live test succeeds, so a bad token never gets stored.
  async function handleConnect() {
    if (!canSubmit) {
      return;
    }
    setPhase("connecting");
    setErrorNotice(null);
    setSaveErrors({});
    setConnectedName(null);
    try {
      const result = await testInstanceConnection({ instanceUrl, accessToken });
      if (!mountedRef.current) {
        return;
      }
      if (!result.ok) {
        setErrorNotice(result.error);
        setPhase("idle");
        return;
      }
      const saved = await saveMemosSettings({ instanceUrl, accessToken });
      if (!mountedRef.current) {
        return;
      }
      setConnectedName(result.name);
      setPhase("connected");
      onSettingsChange(saved);
    } catch (error) {
      if (mountedRef.current) {
        setSaveErrors(describeSaveError(error, "Couldn't connect. Try again."));
        setPhase("idle");
      }
    }
  }

  async function handleDisconnect() {
    setPhase("disconnecting");
    setErrorNotice(null);
    setSaveErrors({});
    try {
      await deleteMemosSettings();
      if (!mountedRef.current) {
        return;
      }
      setEditedInstanceUrl(null);
      setAccessToken("");
      onSettingsChange({ instanceUrl: null, hasAccessToken: false });
      setPhase("idle");
    } catch (error) {
      if (mountedRef.current) {
        setSaveErrors(describeSaveError(error, "Couldn't disconnect. Try again."));
        setPhase("idle");
      }
    }
  }

  async function handlePasteToken() {
    try {
      const text = await navigator.clipboard.readText();
      if (mountedRef.current && text) {
        setAccessToken(text.trim());
        clearResult();
      }
    } catch {
      // Clipboard read can be blocked; the user can still paste manually.
    }
  }

  // Success state: the connection saved. The user acknowledges to leave the dialog.
  if (phase === "connected") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-md border border-teal-200 bg-teal-50 px-3 py-2.5 dark:border-teal-900/60 dark:bg-teal-950/40">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white dark:bg-teal-500 dark:text-stone-950">
            <CheckIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
              {connectedName ? `Connected as ${connectedName}` : "Connected"}
            </p>
            <p className="truncate text-xs text-teal-700/70 dark:text-teal-300/70">{instanceUrl}</p>
          </div>
        </div>
        <button type="button" className={primaryButtonClassName} onClick={() => onSaved?.()}>
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        void handleConnect();
      }}
    >
      <div>
        <label className={fieldLabelClassName} htmlFor="memos-instance-url">
          <GlobeIcon className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          Instance URL
        </label>
        <input
          id="memos-instance-url"
          type="text"
          inputMode="url"
          placeholder="https://memos.example.com"
          value={instanceUrl}
          onChange={(event) => {
            setEditedInstanceUrl(event.target.value);
            clearResult();
          }}
          disabled={busy}
          aria-invalid={saveErrors.instanceUrl ? true : undefined}
          aria-describedby={saveErrors.instanceUrl ? "memos-instance-url-error" : undefined}
          className={`mt-1 ${fieldInputClassName}`}
        />
        {saveErrors.instanceUrl ? (
          <p id="memos-instance-url-error" className={fieldErrorClassName}>
            {saveErrors.instanceUrl}
          </p>
        ) : null}
      </div>

      <div>
        <label className={fieldLabelClassName} htmlFor="memos-access-token">
          <KeyRoundIcon className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          Access token
        </label>
        <div className="relative mt-1">
          <input
            id="memos-access-token"
            type={revealToken ? "text" : "password"}
            autoComplete="off"
            placeholder="••••••••••••"
            value={accessToken}
            onChange={(event) => {
              setAccessToken(event.target.value);
              clearResult();
            }}
            disabled={busy}
            aria-invalid={saveErrors.accessToken ? true : undefined}
            aria-describedby={saveErrors.accessToken ? "memos-access-token-error" : "memos-access-token-hint"}
            className={`${fieldInputClassName} pr-16 font-mono`}
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {accessToken.length === 0 ? (
              <button
                type="button"
                onClick={() => void handlePasteToken()}
                disabled={busy}
                aria-label="Paste token"
                title="Paste from clipboard"
                className="flex h-7 w-7 items-center justify-center rounded text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-stone-800 dark:hover:text-stone-300"
              >
                <ClipboardPasteIcon className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setRevealToken((value) => !value)}
              aria-label={revealToken ? "Hide token" : "Reveal token"}
              title={revealToken ? "Hide token" : "Reveal token"}
              className="flex h-7 w-7 items-center justify-center rounded text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
            >
              {revealToken ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {saveErrors.accessToken ? (
          <p id="memos-access-token-error" className={fieldErrorClassName}>
            {saveErrors.accessToken}
          </p>
        ) : (
          <p id="memos-access-token-hint" className={fieldHintClassName}>
            {settingsUrl ? (
              <>
                Find this in{" "}
                <a
                  href={settingsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
                >
                  {settingsUrl.replace(/^https?:\/\//, "")}
                </a>{" "}
                → Access Tokens
              </>
            ) : (
              <>Find this in Memos → Settings → Access Tokens</>
            )}
            {hasSavedToken ? (
              <span className="mt-1 block text-stone-400 dark:text-stone-500">
                A token is already saved. Enter it again (or a new one) to save changes.
              </span>
            ) : null}
          </p>
        )}
      </div>

      {errorNotice ? (
        <div role="status" aria-live="polite">
          <InstanceErrorNotice detail={errorNotice} />
        </div>
      ) : null}
      {saveErrors.form ? (
        <p role="alert" className={fieldErrorClassName}>
          {saveErrors.form}
        </p>
      ) : null}

      <div className="pt-1">
        <button type="submit" disabled={!canSubmit} className={primaryButtonClassName}>
          {phase === "connecting" ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Connecting…
            </>
          ) : (
            "Connect"
          )}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
          <LockIcon className="h-3 w-3" />
          Your token is stored privately with your account and only used to reach your own instance.
        </p>
        {hasSavedToken ? (
          <button
            type="button"
            onClick={() => void handleDisconnect()}
            disabled={busy}
            className="shrink-0 text-xs font-medium text-red-600 transition hover:underline disabled:pointer-events-none disabled:opacity-50 dark:text-red-400"
          >
            {phase === "disconnecting" ? "Disconnecting…" : "Disconnect"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
