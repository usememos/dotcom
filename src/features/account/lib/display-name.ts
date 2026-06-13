export type NameSource = {
  username?: string | null;
  fullName?: string | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
} | null;

function firstNonEmpty(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return null;
}

/** Resolves a stable display name for a Clerk user, with a safe fallback. */
export function resolveUserDisplayName(user: NameSource, fallback = "Account"): string {
  if (!user) {
    return fallback;
  }
  return firstNonEmpty(user.username, user.fullName, user.primaryEmailAddress?.emailAddress) ?? fallback;
}
