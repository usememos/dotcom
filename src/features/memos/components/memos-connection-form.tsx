"use client";

import { ClipboardPasteIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, GlobeIcon, KeyRoundIcon, LockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { InstanceErrorDetail } from "@/shared/memos/errors";
import type { MemosCredentials } from "@/shared/memos/instance-client";
import { type ConnectionTestResult, testInstanceConnection } from "@/shared/memos/instance-stats";
import { normalizeInstanceUrl, parseInstanceUrl } from "@/shared/settings/instance-url";
import { describeConnectionWriteError } from "@/shared/settings/memos-settings";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { Spinner } from "@/shared/ui/spinner";
import { InstanceErrorNotice } from "./instance-error-notice";

type SaveErrorMessages = { instanceUrl?: string; form?: string };

type MemosConnectionFormProps = {
  instanceUrl: string | null;
  existingAccessToken?: string | null;
  onSave: (credentials: MemosCredentials) => Promise<void>;
  onSaved?: (result: Extract<ConnectionTestResult, { ok: true }>) => void;
  onCancel?: () => void;
};

function instanceSettingsUrl(raw: string): string | null {
  const url = parseInstanceUrl(raw);
  return url === null ? null : `${url.origin}/setting`;
}

export function MemosConnectionForm({ instanceUrl, existingAccessToken, onSave, onSaved, onCancel }: MemosConnectionFormProps) {
  const [editedInstanceUrl, setEditedInstanceUrl] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [revealToken, setRevealToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<InstanceErrorDetail | null>(null);
  const [saveErrors, setSaveErrors] = useState<SaveErrorMessages>({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const urlValue = editedInstanceUrl ?? instanceUrl ?? "";
  const canSubmit = !testing && urlValue.trim().length > 0 && (accessToken.trim().length > 0 || Boolean(existingAccessToken));
  const settingsUrl = instanceSettingsUrl(urlValue);
  const shouldRetry = Boolean(saveErrors.form);

  function clearResult() {
    setErrorNotice(null);
    setSaveErrors({});
  }

  async function handleSave() {
    if (!canSubmit) {
      return;
    }
    const normalized = normalizeInstanceUrl(urlValue);
    if (normalized === null) {
      setSaveErrors({ instanceUrl: "Enter the root URL of your Memos instance." });
      return;
    }

    const token = accessToken.trim() || existingAccessToken;
    if (!token) {
      return;
    }

    const credentials = { instanceUrl: normalized, accessToken: token };
    setTesting(true);
    setErrorNotice(null);
    setSaveErrors({});
    try {
      const result = await testInstanceConnection(credentials);
      if (!mountedRef.current) {
        return;
      }
      if (!result.ok) {
        setErrorNotice(result.error);
        return;
      }
      await onSave(credentials);
      if (!mountedRef.current) {
        return;
      }
      setAccessToken("");
      onSaved?.(result);
    } catch (error) {
      if (!mountedRef.current) {
        return;
      }
      setSaveErrors({ form: describeConnectionWriteError(error, "save") });
    } finally {
      if (mountedRef.current) {
        setTesting(false);
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
      // Clipboard read can be blocked; manual paste remains available.
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSave();
      }}
    >
      <FieldGroup className="gap-4">
        <Field className="gap-1.5" data-invalid={Boolean(saveErrors.instanceUrl) || undefined}>
          <FieldLabel className="gap-1.5 text-[13px]" htmlFor="memos-instance-url">
            <GlobeIcon className="size-3.5 text-muted-foreground" />
            Instance URL
          </FieldLabel>
          <Input
            id="memos-instance-url"
            type="text"
            inputMode="url"
            placeholder="https://memos.example.com"
            value={urlValue}
            onChange={(event) => {
              setEditedInstanceUrl(event.target.value);
              clearResult();
            }}
            disabled={testing}
            aria-invalid={saveErrors.instanceUrl ? true : undefined}
            aria-describedby={saveErrors.instanceUrl ? "memos-instance-url-error" : "memos-instance-url-hint"}
          />
          {saveErrors.instanceUrl ? (
            <FieldError id="memos-instance-url-error">{saveErrors.instanceUrl}</FieldError>
          ) : (
            <FieldDescription className="text-xs" id="memos-instance-url-hint">
              Use the root address where you open Memos. Any path is removed.
            </FieldDescription>
          )}
        </Field>

        <Field className="gap-1.5">
          <FieldLabel className="gap-1.5 text-[13px]" htmlFor="memos-access-token">
            <KeyRoundIcon className="size-3.5 text-muted-foreground" />
            Access token
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              id="memos-access-token"
              type={revealToken ? "text" : "password"}
              autoComplete="off"
              placeholder="••••••••••••"
              value={accessToken}
              onChange={(event) => {
                setAccessToken(event.target.value);
                clearResult();
              }}
              disabled={testing}
              aria-describedby="memos-access-token-hint memos-access-token-location"
              className="font-mono"
            />
            {accessToken.length === 0 ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => void handlePasteToken()}
                disabled={testing}
                aria-label="Paste token"
                title="Paste from clipboard"
              >
                <ClipboardPasteIcon />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setRevealToken((value) => !value)}
              aria-label={revealToken ? "Hide token" : "Reveal token"}
              title={revealToken ? "Hide token" : "Reveal token"}
            >
              {revealToken ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
          <FieldDescription className="text-xs" id="memos-access-token-hint">
            {existingAccessToken
              ? "Leave blank to keep the saved token, or enter a new one."
              : "Use an access token created by your Memos instance."}
          </FieldDescription>
          {settingsUrl ? (
            <FieldDescription className="text-xs" id="memos-access-token-location">
              <a href={settingsUrl} target="_blank" rel="noreferrer">
                Where to create an access token <ExternalLinkIcon className="inline size-3" />
              </a>
            </FieldDescription>
          ) : (
            <FieldDescription className="text-xs" id="memos-access-token-location">
              Create one in Memos → Settings → Access Tokens.
            </FieldDescription>
          )}
        </Field>

        {errorNotice ? (
          <div role="status" aria-live="polite" className="space-y-2">
            <InstanceErrorNotice detail={errorNotice} />
            {errorNotice.kind === "unauthorized" && settingsUrl ? (
              <a href={settingsUrl} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "link" })}>
                Open access token settings
                <ExternalLinkIcon />
              </a>
            ) : null}
          </div>
        ) : null}
        {saveErrors.form ? <FieldError>{saveErrors.form}</FieldError> : null}

        <Separator />

        <div className="flex flex-wrap items-center gap-1">
          <Button type="submit" disabled={!canSubmit}>
            {testing ? (
              <>
                <Spinner />
                Testing…
              </>
            ) : shouldRetry ? (
              "Retry"
            ) : (
              "Test and save"
            )}
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={testing}>
              Cancel
            </Button>
          ) : null}
        </div>

        <FieldDescription className="flex items-start gap-1.5 text-xs leading-5">
          <LockIcon className="mt-0.5 size-3.5 shrink-0" />
          Stored with your account and used only to connect to your Memos instance.
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
