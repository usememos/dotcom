import type { MemosConnectionTestResult } from "../../../shared/settings/memos-settings";
import { MemosSettingsRequestError } from "../../../shared/settings/memos-settings-client";

export type ConnectionFormValues = {
  instanceUrl: string;
  accessToken: string;
};

export type TestMessage = { tone: "success" | "error"; message: string };

export type SaveErrorMessages = { instanceUrl?: string; accessToken?: string; form?: string };

export function canSubmitConnectionForm(values: ConnectionFormValues, busy: boolean): boolean {
  return !busy && values.instanceUrl.trim().length > 0 && values.accessToken.trim().length > 0;
}

export function describeTestResult(result: MemosConnectionTestResult): TestMessage {
  if (result.ok) {
    return { tone: "success", message: `Connected as ${result.user.name}` };
  }
  switch (result.reason) {
    case "unauthorized":
      return { tone: "error", message: "Token was rejected by the instance." };
    case "timeout":
      return { tone: "error", message: "Connection timed out." };
    case "redirected":
      return { tone: "error", message: "The instance redirected — use the URL it redirects to." };
    case "invalid-response":
      return { tone: "error", message: "The URL doesn't look like a Memos instance." };
    default:
      return { tone: "error", message: "Instance couldn't be reached." };
  }
}

export function describeSaveError(error: unknown, fallbackMessage = "Couldn't save settings. Try again."): SaveErrorMessages {
  if (error instanceof MemosSettingsRequestError && error.status === 400 && error.fieldErrors) {
    const messages: SaveErrorMessages = {};
    const instanceUrl = error.fieldErrors.instanceUrl?.[0];
    const accessToken = error.fieldErrors.accessToken?.[0];
    if (instanceUrl) {
      messages.instanceUrl = instanceUrl;
    }
    if (accessToken) {
      messages.accessToken = accessToken;
    }
    if (instanceUrl || accessToken) {
      return messages;
    }
  }
  return { form: fallbackMessage };
}
