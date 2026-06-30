// Shared helpers for the Memos connection stored in Clerk `unsafeMetadata.memos`.

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
