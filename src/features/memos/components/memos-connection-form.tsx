"use client";

import { ClipboardPasteIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { InstanceErrorDetail } from "@/shared/memos/errors";
import type { MemosCredentials } from "@/shared/memos/instance-client";
import { type ConnectionTestResult, testInstanceConnection } from "@/shared/memos/instance-stats";
import { MAX_INSTANCE_URL_LENGTH, normalizeInstanceUrl, parseInstanceUrl } from "@/shared/settings/instance-url";
import { describeConnectionWriteError } from "@/shared/settings/memos-settings";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";
import { InstanceErrorNotice } from "./instance-error-notice";

const DEMO_INSTANCE_URL = "https://demo.usememos.com";
const DEMO_TOKEN_SETTINGS_URL = `${DEMO_INSTANCE_URL}/setting`;

type SaveErrorMessages = { instanceUrl?: string; accessToken?: string; form?: string };

type MemosConnectionFormProps = {
  instanceUrl: string | null;
  existingAccessToken?: string | null;
  onSave: (credentials: MemosCredentials) => Promise<void>;
  onSaved?: (result: Extract<ConnectionTestResult, { ok: true }>) => void;
  onCancel?: () => void;
  showDemoOption?: boolean;
};

function instanceSettingsUrl(raw: string): string | null {
  const url = parseInstanceUrl(raw);
  return url === null ? null : `${url.origin}/setting`;
}

export function MemosConnectionForm({
  instanceUrl,
  existingAccessToken,
  onSave,
  onSaved,
  onCancel,
  showDemoOption = false,
}: MemosConnectionFormProps) {
  const [editedInstanceUrl, setEditedInstanceUrl] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [revealToken, setRevealToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<InstanceErrorDetail | null>(null);
  const [saveErrors, setSaveErrors] = useState<SaveErrorMessages>({});
  const mountedRef = useRef(true);
  const accessTokenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const urlValue = editedInstanceUrl ?? instanceUrl ?? "";
  const demoSelected = normalizeInstanceUrl(urlValue) === DEMO_INSTANCE_URL;
  const settingsUrl = instanceSettingsUrl(urlValue);
  const shouldRetry = Boolean(saveErrors.form);
  const hasConnectionError = errorNotice !== null || Boolean(saveErrors.form);

  function clearResult() {
    setErrorNotice(null);
    setSaveErrors({});
  }

  async function handleSave() {
    const validationErrors: SaveErrorMessages = {};
    if (urlValue.trim().length === 0) {
      validationErrors.instanceUrl = "Enter your Memos instance URL.";
    } else if (urlValue.trim().length > MAX_INSTANCE_URL_LENGTH) {
      validationErrors.instanceUrl = "This URL is too long. Enter the root address of your Memos instance.";
    }

    const normalized = normalizeInstanceUrl(urlValue);
    if (!validationErrors.instanceUrl && normalized === null) {
      validationErrors.instanceUrl = "Enter a complete URL starting with https:// (or http:// for local testing).";
    }

    const token = accessToken.trim() || existingAccessToken;
    if (!token) {
      validationErrors.accessToken = "Paste a personal access token from this Memos instance.";
    }

    if (Object.keys(validationErrors).length > 0 || normalized === null || !token) {
      setErrorNotice(null);
      setSaveErrors(validationErrors);
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
      <FieldGroup className="gap-0">
        <Field className="gap-2" data-invalid={Boolean(saveErrors.instanceUrl) || undefined}>
          <FieldLabel className="text-[13px]" htmlFor="memos-instance-url">
            Instance URL
          </FieldLabel>
          <Input
            id="memos-instance-url"
            type="text"
            inputMode="url"
            placeholder="https://memos.example.com"
            value={urlValue}
            maxLength={MAX_INSTANCE_URL_LENGTH}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(event) => {
              setEditedInstanceUrl(event.target.value);
              clearResult();
            }}
            disabled={testing}
            aria-invalid={saveErrors.instanceUrl ? true : undefined}
            aria-describedby={saveErrors.instanceUrl ? "memos-instance-url-error" : "memos-instance-url-hint"}
            className="h-10 bg-muted/25 shadow-none"
          />
          {saveErrors.instanceUrl ? (
            <FieldError id="memos-instance-url-error">{saveErrors.instanceUrl}</FieldError>
          ) : (
            <FieldDescription className="text-xs" id="memos-instance-url-hint">
              Enter the root address where Memos opens, including https://. Settings and API paths are removed when saved.
            </FieldDescription>
          )}
        </Field>

        {showDemoOption ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>Only evaluating?</span>
            <button
              type="button"
              className="rounded-sm font-medium underline underline-offset-4 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              aria-pressed={demoSelected}
              onClick={() => {
                setEditedInstanceUrl(DEMO_INSTANCE_URL);
                clearResult();
                accessTokenRef.current?.focus();
              }}
              disabled={testing}
            >
              {demoSelected ? "Using demo.usememos.com" : "Use demo.usememos.com"}
            </button>
            <span aria-hidden="true">·</span>
            <a
              href={DEMO_TOKEN_SETTINGS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm font-medium underline underline-offset-4 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              Create demo PAT
              <ExternalLinkIcon className="ml-1 inline size-3" />
            </a>
            <span aria-hidden="true">·</span>
            <span>Don’t use sensitive data.</span>
          </div>
        ) : null}

        <Field className="mt-8 gap-2" data-invalid={Boolean(saveErrors.accessToken) || undefined}>
          <FieldLabel className="text-[13px]" htmlFor="memos-access-token">
            Personal access token (PAT)
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              ref={accessTokenRef}
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
              aria-invalid={saveErrors.accessToken ? true : undefined}
              aria-describedby={
                saveErrors.accessToken
                  ? "memos-access-token-error memos-access-token-location"
                  : "memos-access-token-hint memos-access-token-location"
              }
              className="h-10 bg-muted/25 font-mono shadow-none"
            />
            {accessToken.length === 0 ? (
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
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
              size="icon-lg"
              onClick={() => setRevealToken((value) => !value)}
              aria-label={revealToken ? "Hide token" : "Reveal token"}
              title={revealToken ? "Hide token" : "Reveal token"}
            >
              {revealToken ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
          {saveErrors.accessToken ? (
            <FieldError id="memos-access-token-error">{saveErrors.accessToken}</FieldError>
          ) : (
            <FieldDescription className="text-xs" id="memos-access-token-hint">
              {existingAccessToken
                ? "Leave blank to keep the saved PAT, or paste a replacement."
                : "Use a PAT created by this instance—not your password or a token from another server."}
            </FieldDescription>
          )}
          {settingsUrl ? (
            <FieldDescription className="text-xs" id="memos-access-token-location">
              <a href={settingsUrl} target="_blank" rel="noreferrer">
                Open this instance’s access token settings <ExternalLinkIcon className="inline size-3" />
              </a>
            </FieldDescription>
          ) : (
            <FieldDescription className="text-xs" id="memos-access-token-location">
              Create one in Memos → Settings → Access Tokens.
            </FieldDescription>
          )}
        </Field>

        <div className="mt-8">
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

          <div className={`${hasConnectionError ? "mt-5 " : ""}flex flex-wrap items-center gap-1`}>
            <Button type="submit" size="lg" disabled={testing}>
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

          <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
            <LockIcon className="mt-0.5 size-3.5 shrink-0" />
            Stored with your account and used only to connect to your Memos instance.
          </p>
        </div>
      </FieldGroup>
    </form>
  );
}
