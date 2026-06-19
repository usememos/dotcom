import type { InstanceErrorDetail } from "@/shared/memos/errors";
import type { ConnectionTestResult } from "@/shared/memos/instance-stats";
import { MemosSettingsRequestError } from "../../../shared/settings/memos-settings-client";

export type ConnectionFormValues = {
  instanceUrl: string;
  accessToken: string;
};

export type TestMessage = { tone: "success"; message: string } | { tone: "error"; detail: InstanceErrorDetail };

export type SaveErrorMessages = { instanceUrl?: string; accessToken?: string; form?: string };

export function canSubmitConnectionForm(values: ConnectionFormValues, busy: boolean): boolean {
  return !busy && values.instanceUrl.trim().length > 0 && values.accessToken.trim().length > 0;
}

export function describeTestResult(result: ConnectionTestResult): TestMessage {
  if (result.ok) {
    return { tone: "success", message: `Connected as ${result.name}` };
  }
  return { tone: "error", detail: result.error };
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
