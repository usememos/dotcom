import type { MemosCredentials } from "../memos/instance-client";

// Shared helpers for the Memos connection stored in Clerk `unsafeMetadata.memos`.

/** Thrown when a write finds the stored connection changed since it was last read. */
export class MemosConnectionConflictError extends Error {
  constructor() {
    super("The Memos connection changed in another page.");
    this.name = "MemosConnectionConflictError";
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads a complete connection from Clerk metadata; partial values are never treated as connected. */
export function readMemosCredentials(metadata: unknown): MemosCredentials | null {
  const memos = isRecord(metadata) ? metadata.memos : null;
  if (!isRecord(memos)) {
    return null;
  }
  const { instanceUrl, accessToken } = memos;
  if (typeof instanceUrl !== "string" || instanceUrl.length === 0 || typeof accessToken !== "string" || accessToken.length === 0) {
    return null;
  }
  return { instanceUrl, accessToken };
}

export function sameMemosCredentials(left: MemosCredentials | null, right: MemosCredentials | null): boolean {
  return left?.instanceUrl === right?.instanceUrl && left?.accessToken === right?.accessToken;
}

/** User-facing copy for a failed connection write, kept beside the error it explains. */
export function describeConnectionWriteError(error: unknown, action: "save" | "disconnect"): string {
  if (error instanceof MemosConnectionConflictError) {
    return action === "save"
      ? "This connection changed in another page. We loaded the latest account state; review your entries and retry."
      : "This connection changed in another page. We loaded the latest state; review it before disconnecting.";
  }
  return action === "save"
    ? "Couldn't save the connection. Your existing connection is unchanged."
    : "Couldn't disconnect the instance. The connection is still saved.";
}
