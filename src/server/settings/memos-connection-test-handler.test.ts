import { describe, expect, it } from "vitest";
import { createMemosConnectionTestHandler } from "./memos-connection-test-handler";

const TEST_URL = "http://localhost/api/settings/memos/test";

function postRequest(body: unknown) {
  return new Request(TEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function createDeps(fetchImpl: (url: string, init: RequestInit) => Promise<unknown>, overrides: Record<string, unknown> = {}) {
  const calls: { url: string; init: RequestInit }[] = [];
  const deps = {
    isClerkConfigured: () => true,
    getUserId: async () => "user_123",
    fetchImpl: async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return fetchImpl(url, init);
    },
    ...overrides,
  };
  return { deps, calls };
}

const VALID_BODY = { instanceUrl: "https://memos.example.com/", accessToken: "token-123" };

describe("memos-connection-test-handler", () => {
  it("POST returns 503 when Clerk is not configured and 401 when signed out", async () => {
    const blowUp = async () => {
      throw new Error("must not fetch");
    };

    const notConfigured = createMemosConnectionTestHandler(createDeps(blowUp, { isClerkConfigured: () => false }).deps);
    expect((await notConfigured.POST(postRequest(VALID_BODY))).status).toBe(503);

    const signedOut = createMemosConnectionTestHandler(createDeps(blowUp, { getUserId: async () => null }).deps);
    expect((await signedOut.POST(postRequest(VALID_BODY))).status).toBe(401);
  });

  it("POST returns 400 for non-JSON and invalid bodies without fetching", async () => {
    const { deps, calls } = createDeps(async () => Response.json({}));
    const handler = createMemosConnectionTestHandler(deps);

    expect((await handler.POST(postRequest("not json"))).status).toBe(400);

    const invalid = await handler.POST(postRequest({ instanceUrl: "not a url", accessToken: "  " }));
    expect(invalid.status).toBe(400);
    const payload = await invalid.json();
    expect(Array.isArray(payload.fieldErrors.instanceUrl)).toBe(true);
    expect(Array.isArray(payload.fieldErrors.accessToken)).toBe(true);

    expect(calls.length).toBe(0);
  });

  it("POST returns 400 for private instance hosts without fetching", async () => {
    const { deps, calls } = createDeps(async () => Response.json({}));
    const handler = createMemosConnectionTestHandler(deps);

    for (const instanceUrl of ["http://localhost:5230", "http://127.0.0.1:5230", "http://[::1]:5230", "https://10.1.2.3"]) {
      const response = await handler.POST(postRequest({ instanceUrl, accessToken: "token" }));
      expect(response.status).toBe(400);
    }
    expect(calls.length).toBe(0);
  });

  it("a reachable instance with a valid token yields ok with the display name", async () => {
    const { deps, calls } = createDeps(async () => Response.json({ user: { username: "steven", displayName: "Steven" } }));
    const handler = createMemosConnectionTestHandler(deps);

    const response = await handler.POST(postRequest(VALID_BODY));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, user: { name: "Steven" } });

    expect(calls.length).toBe(1);
    expect(calls[0].url).toBe("https://memos.example.com/api/v1/auth/me");
    expect((calls[0].init as RequestInit & { method: string }).method).toBe("GET");
    expect((calls[0].init as RequestInit & { headers: Record<string, string> }).headers.Authorization).toBe("Bearer token-123");
    expect((calls[0].init as RequestInit & { redirect: string }).redirect).toBe("manual");
    expect((calls[0].init as RequestInit & { signal: unknown }).signal instanceof AbortSignal).toBe(true);
  });

  it("falls back to nickname or username when displayName is absent, including flat payloads", async () => {
    const nested = createDeps(async () => Response.json({ user: { username: "steven" } }));
    const nestedResponse = await createMemosConnectionTestHandler(nested.deps).POST(postRequest(VALID_BODY));
    expect(await nestedResponse.json()).toEqual({ ok: true, user: { name: "steven" } });

    const flat = createDeps(async () => Response.json({ username: "steven", nickname: "Steve" }));
    const flatResponse = await createMemosConnectionTestHandler(flat.deps).POST(postRequest(VALID_BODY));
    expect(await flatResponse.json()).toEqual({ ok: true, user: { name: "Steve" } });
  });

  it("instance 401/403 map to the unauthorized reason", async () => {
    for (const status of [401, 403]) {
      const { deps } = createDeps(async () => Response.json({ message: "nope" }, { status }));
      const response = await createMemosConnectionTestHandler(deps).POST(postRequest(VALID_BODY));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: false, reason: "unauthorized" });
    }
  });

  it("network failures map to unreachable and timeouts map to timeout", async () => {
    const network = createDeps(async () => {
      throw new TypeError("fetch failed");
    });
    expect(await (await createMemosConnectionTestHandler(network.deps).POST(postRequest(VALID_BODY))).json()).toEqual({
      ok: false,
      reason: "unreachable",
    });

    const timedOut = createDeps(async () => {
      throw Object.assign(new Error("The operation timed out."), { name: "TimeoutError" });
    });
    expect(await (await createMemosConnectionTestHandler(timedOut.deps).POST(postRequest(VALID_BODY))).json()).toEqual({
      ok: false,
      reason: "timeout",
    });
  });

  it("redirect responses map to redirected (manual redirect surfaces the 3xx status)", async () => {
    for (const status of [301, 302, 307, 308]) {
      const { deps } = createDeps(async () => new Response(null, { status, headers: { Location: "https://www.memos.example.com/" } }));
      const response = await createMemosConnectionTestHandler(deps).POST(postRequest(VALID_BODY));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: false, reason: "redirected" });
    }
  });

  it("opaque-redirect responses (Cloudflare manual redirect) map to redirected", async () => {
    // The Workers runtime yields a filtered response with status 0 and type
    // "opaqueredirect" instead of a 3xx; the handler only reads .ok/.status/.type/.body/.json.
    const { deps } = createDeps(async () => ({ ok: false, status: 0, type: "opaqueredirect", body: null }));
    const response = await createMemosConnectionTestHandler(deps).POST(postRequest(VALID_BODY));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: false, reason: "redirected" });
  });

  it("non-Memos responses map to invalid-response", async () => {
    const cases = [
      async () => new Response("<html>not json</html>", { status: 200 }),
      async () => Response.json({ message: "not found" }, { status: 404 }),
      async () => Response.json({ unexpected: "shape" }),
    ];
    for (const fetchImpl of cases) {
      const { deps } = createDeps(fetchImpl);
      const response = await createMemosConnectionTestHandler(deps).POST(postRequest(VALID_BODY));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: false, reason: "invalid-response" });
    }
  });

  it("the access token never appears in any response body", async () => {
    const { deps } = createDeps(async () => Response.json({ user: { username: "steven" } }));
    const handler = createMemosConnectionTestHandler(deps);

    const responses = [
      await handler.POST(postRequest(VALID_BODY)),
      await handler.POST(postRequest({ instanceUrl: "not a url", accessToken: "token-123" })),
    ];
    for (const response of responses) {
      const body = await response.text();
      expect(body).not.toContain("token-123");
    }
  });
});
