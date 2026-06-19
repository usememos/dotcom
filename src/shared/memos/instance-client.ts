import { InstanceError } from "./errors";

export type MemosCredentials = { instanceUrl: string; accessToken: string };

export const INSTANCE_REQUEST_TIMEOUT_MS = 8000;

export type InstanceFetchDeps = {
  /** Overridable for tests; defaults to the global fetch. */
  fetchImpl?: (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  /** The current page protocol ("https:"/"http:"); defaults to window's, else "https:". */
  pageProtocol?: string;
  /** Overridable for tests; defaults to INSTANCE_REQUEST_TIMEOUT_MS. */
  timeoutMs?: number;
};

/** origin + path with the base URL's trailing slashes removed. */
function buildUrl(instanceUrl: string, path: string): string {
  return `${instanceUrl.replace(/\/+$/, "")}${path}`;
}

function currentProtocol(deps: InstanceFetchDeps): string {
  if (deps.pageProtocol) {
    return deps.pageProtocol;
  }
  return typeof window !== "undefined" ? window.location.protocol : "https:";
}

/**
 * A no-cors GET to the instance. It carries no custom headers (so it is a
 * "simple" request that triggers no preflight) and returns an opaque response.
 * Resolves when the server is reachable at all; rejects only on a true network
 * failure. This is how we tell "CORS misconfigured" apart from "server down" —
 * the browser reports both as an opaque TypeError on the real request.
 */
async function isReachable(instanceUrl: string, deps: InstanceFetchDeps): Promise<boolean> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  try {
    await fetchImpl(buildUrl(instanceUrl, "/api/v1/instance/profile"), {
      method: "GET",
      mode: "no-cors",
      signal: AbortSignal.timeout(deps.timeoutMs ?? INSTANCE_REQUEST_TIMEOUT_MS),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetches `path` from the instance with a Bearer token and returns parsed JSON.
 * Throws an InstanceError classified into one of the InstanceErrorKind values.
 */
export async function instanceFetchJson(creds: MemosCredentials, path: string, deps: InstanceFetchDeps = {}): Promise<unknown> {
  if (currentProtocol(deps) === "https:" && creds.instanceUrl.startsWith("http:")) {
    throw new InstanceError("mixed-content");
  }

  const fetchImpl = deps.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(buildUrl(creds.instanceUrl, path), {
      method: "GET",
      headers: { Authorization: `Bearer ${creds.accessToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(deps.timeoutMs ?? INSTANCE_REQUEST_TIMEOUT_MS),
      redirect: "manual",
    });
  } catch (error) {
    // AbortSignal.timeout throws a DOMException, which is not an `instanceof
    // Error` in Node/browsers — read `name` defensively rather than narrowing.
    const name = typeof error === "object" && error !== null && "name" in error ? (error as { name?: unknown }).name : undefined;
    if (name === "TimeoutError" || name === "AbortError") {
      throw new InstanceError("timeout");
    }
    // Opaque network failure (TypeError "Failed to fetch"): could be CORS or down.
    throw new InstanceError((await isReachable(creds.instanceUrl, deps)) ? "cors" : "unreachable");
  }

  if (!response.ok || response.type === "opaqueredirect" || response.status === 0) {
    void response.body?.cancel();
    if (response.status === 401 || response.status === 403) {
      throw new InstanceError("unauthorized");
    }
    throw new InstanceError("bad-response");
  }

  try {
    return await response.json();
  } catch {
    throw new InstanceError("bad-response");
  }
}

export function getProfile(creds: MemosCredentials, deps?: InstanceFetchDeps): Promise<unknown> {
  return instanceFetchJson(creds, "/api/v1/instance/profile", deps);
}

export function getAuthMe(creds: MemosCredentials, deps?: InstanceFetchDeps): Promise<unknown> {
  return instanceFetchJson(creds, "/api/v1/auth/me", deps);
}

export function getStats(creds: MemosCredentials, statsPath: string, deps?: InstanceFetchDeps): Promise<unknown> {
  return instanceFetchJson(creds, statsPath, deps);
}
