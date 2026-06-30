// Client-safe Memos instance URL parsing/normalization. Used by the connection
// form (validation + the "where's my token" link) and the connection hook
// (normalizing before save). No SSRF host guard: the browser makes instance
// requests directly, so localhost/LAN hosts are allowed.

export const MAX_INSTANCE_URL_LENGTH = 2048;

/** Parses an instance URL, returning null when it is not a valid http(s) URL. */
export function parseInstanceUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }
  return url;
}

/**
 * Normalizes a Memos instance URL to origin + pathname with trailing slashes
 * removed (an instance may be served under a subpath). Returns null when the
 * value is not a valid http(s) URL.
 */
export function normalizeInstanceUrl(raw: string): string | null {
  const url = parseInstanceUrl(raw);
  if (url === null) {
    return null;
  }
  const pathname = url.pathname.replace(/\/+$/, "");
  return `${url.origin}${pathname}`;
}
