import type { MemosConnectionTestResult, SafeMemosSettings } from "./memos-settings";
import type { MemosStatsResult } from "./memos-stats";

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

function jsonInit(method: "PUT" | "POST", body: unknown): RequestInit {
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

export async function testMemosConnection(input: { instanceUrl: string; accessToken: string }): Promise<MemosConnectionTestResult> {
  const response = await settingsRequest("/test", jsonInit("POST", input));
  return (await response.json()) as MemosConnectionTestResult;
}

const STATS_ENDPOINT = "/api/memos/stats";

/**
 * Fetches the signed-in user's Memos activity stats from the server-side proxy.
 * Optional `hints` (resolved userId + version, cached in the browser) let the
 * proxy skip its discovery calls and fetch stats directly. Throws
 * MemosSettingsRequestError on 401/503/5xx; a 200 always carries a MemosStatsResult
 * (including not-connected and instance-error states).
 */
export async function getMemosStats(hints?: { userId: string; version: string | null }): Promise<MemosStatsResult> {
  const params = new URLSearchParams();
  if (hints?.userId) {
    params.set("userId", hints.userId);
  }
  if (hints?.version) {
    params.set("version", hints.version);
  }
  const query = params.toString();
  const response = await fetch(query ? `${STATS_ENDPOINT}?${query}` : STATS_ENDPOINT, { method: "GET" });
  if (!response.ok) {
    throw await toRequestError(response);
  }
  return (await response.json()) as MemosStatsResult;
}
