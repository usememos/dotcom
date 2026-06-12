import { z } from "zod";

export const MAX_SETTINGS_FIELD_LENGTH = 2048;

/** Parses an instance URL, returning null when it is not a valid http(s) URL. */
function parseInstanceUrl(raw: string): URL | null {
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

/** Origin + pathname with trailing slashes removed (an instance may be served under a subpath). */
function toNormalizedInstanceUrl(url: URL): string {
  const pathname = url.pathname.replace(/\/+$/, "");
  return `${url.origin}${pathname}`;
}

/**
 * Normalizes a Memos instance URL to origin + pathname with trailing slashes
 * removed. Returns null when the value is not a valid http(s) URL.
 */
export function normalizeInstanceUrl(raw: string): string | null {
  const url = parseInstanceUrl(raw);
  return url === null ? null : toNormalizedInstanceUrl(url);
}

function isPrivateIpv4(a: number, b: number): boolean {
  return a === 0 || a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254);
}

/**
 * Flags hosts the server must never fetch: localhost and private/link-local
 * IP literals. DNS names resolving to private addresses are intentionally not
 * checked (accepted trade-off — only publicly reachable instances are
 * supported, and requests require a signed-in user).
 */
export function isDisallowedInstanceHost(hostname: string): boolean {
  let host = hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
  host = host.replace(/\.$/, "");
  if (host === "localhost" || host.endsWith(".localhost")) {
    return true;
  }
  if (host.startsWith("::ffff:")) {
    const remainder = host.slice("::ffff:".length);
    // dotted-quad form: ::ffff:127.0.0.1
    const dotted = remainder.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (dotted) {
      return isPrivateIpv4(Number(dotted[1]), Number(dotted[2]));
    }
    // hex form: ::ffff:7f00:1  (two 16-bit groups)
    const hex = remainder.match(/^([0-9a-f]+):([0-9a-f]+)$/);
    if (hex) {
      const hi = parseInt(hex[1], 16);
      return isPrivateIpv4((hi >> 8) & 0xff, hi & 0xff);
    }
  }
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    return isPrivateIpv4(Number(ipv4[1]), Number(ipv4[2]));
  }
  if (host.includes(":")) {
    return host === "::" || host === "::1" || host.startsWith("fc") || host.startsWith("fd") || /^fe[89ab]/.test(host);
  }
  return false;
}

export const memosSettingsSchema = z.object({
  instanceUrl: z
    .string()
    .max(MAX_SETTINGS_FIELD_LENGTH, "Instance URL is too long.")
    .transform((value, ctx) => {
      const url = parseInstanceUrl(value);
      if (url === null) {
        ctx.addIssue({ code: "custom", message: "Instance URL must be a valid http(s) URL." });
        return z.NEVER;
      }
      if (isDisallowedInstanceHost(url.hostname)) {
        ctx.addIssue({ code: "custom", message: "Instance URL must be a publicly reachable host." });
        return z.NEVER;
      }
      return toNormalizedInstanceUrl(url);
    }),
  accessToken: z.string().max(MAX_SETTINGS_FIELD_LENGTH, "Access token is too long.").trim().min(1, "Access token is required."),
});

export type MemosSettings = z.infer<typeof memosSettingsSchema>;

/**
 * Reads and validates a settings payload from a request body, returning either
 * the parsed settings or the 400 response to send back.
 */
export async function parseMemosSettingsBody(request: Request): Promise<{ settings: MemosSettings } | { response: Response }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: Response.json({ error: "Request body must be JSON." }, { status: 400 }) };
  }
  const result = memosSettingsSchema.safeParse(body);
  if (!result.success) {
    return {
      response: Response.json({ error: "Invalid settings.", fieldErrors: z.flattenError(result.error).fieldErrors }, { status: 400 }),
    };
  }
  return { settings: result.data };
}
