// Client-safe types and mappers only. The settings schema and its SSRF host
// guard are server-only and live in src/server/settings/memos-settings-schema.ts.

export type SafeMemosSettings = {
  instanceUrl: string | null;
  hasAccessToken: boolean;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Maps whatever is stored on privateMetadata.memos to the response shape.
 * Never includes the access token. Tolerates missing or malformed data.
 */
export function toSafeMemosSettings(stored: unknown): SafeMemosSettings {
  if (!isRecord(stored)) {
    return { instanceUrl: null, hasAccessToken: false };
  }
  return {
    instanceUrl: typeof stored.instanceUrl === "string" && stored.instanceUrl.length > 0 ? stored.instanceUrl : null,
    hasAccessToken: typeof stored.accessToken === "string" && stored.accessToken.length > 0,
  };
}
