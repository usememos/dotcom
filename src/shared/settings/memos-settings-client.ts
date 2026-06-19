import type { MemosCredentials } from "../memos/instance-client";
import type { SafeMemosSettings } from "./memos-settings";

const SETTINGS_ENDPOINT = "/api/settings/memos";

export class MemosSettingsRequestError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "MemosSettingsRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function toRequestError(response: Response): Promise<MemosSettingsRequestError> {
  let message = "Settings request failed.";
  let fieldErrors: Record<string, string[]> | undefined;
  try {
    const payload = (await response.json()) as { error?: unknown; fieldErrors?: unknown };
    if (typeof payload.error === "string" && payload.error.length > 0) {
      message = payload.error;
    }
    if (payload.fieldErrors && typeof payload.fieldErrors === "object") {
      fieldErrors = payload.fieldErrors as Record<string, string[]>;
    }
  } catch {
    // Non-JSON error body; keep the generic message.
  }
  return new MemosSettingsRequestError(message, response.status, fieldErrors);
}

async function settingsRequest(path: string, init: RequestInit): Promise<Response> {
  const response = await fetch(`${SETTINGS_ENDPOINT}${path}`, init);
  if (!response.ok) {
    throw await toRequestError(response);
  }
  return response;
}

function jsonInit(method: "PUT", body: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export async function getMemosSettings(): Promise<SafeMemosSettings> {
  const response = await settingsRequest("", { method: "GET" });
  return (await response.json()) as SafeMemosSettings;
}

export async function saveMemosSettings(input: { instanceUrl: string; accessToken: string }): Promise<SafeMemosSettings> {
  const response = await settingsRequest("", jsonInit("PUT", input));
  return (await response.json()) as SafeMemosSettings;
}

export async function deleteMemosSettings(): Promise<void> {
  await settingsRequest("", { method: "DELETE" });
}

/**
 * Fetches the signed-in user's Memos credentials (instanceUrl + token) so the
 * browser can call the instance directly. Returns null when no connection is
 * configured. Throws MemosSettingsRequestError on 401/503/5xx.
 */
export async function getMemosCredentials(): Promise<MemosCredentials | null> {
  const response = await settingsRequest("/credentials", { method: "GET" });
  const data = (await response.json()) as { instanceUrl: string | null; accessToken: string | null };
  if (
    typeof data.instanceUrl === "string" &&
    data.instanceUrl.length > 0 &&
    typeof data.accessToken === "string" &&
    data.accessToken.length > 0
  ) {
    return { instanceUrl: data.instanceUrl, accessToken: data.accessToken };
  }
  return null;
}
