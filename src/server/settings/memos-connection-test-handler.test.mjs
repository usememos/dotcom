import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const { createMemosConnectionTestHandler } = await import("./memos-connection-test-handler.ts");

const TEST_URL = "http://localhost/api/settings/memos/test";

function postRequest(body) {
  return new Request(TEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function createDeps(fetchImpl, overrides = {}) {
  const calls = [];
  const deps = {
    isClerkConfigured: () => true,
    getUserId: async () => "user_123",
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return fetchImpl(url, init);
    },
    ...overrides,
  };
  return { deps, calls };
}

const VALID_BODY = { instanceUrl: "https://memos.example.com/", accessToken: "token-123" };

test("POST returns 503 when Clerk is not configured and 401 when signed out", async () => {
  const blowUp = async () => {
    throw new Error("must not fetch");
  };

  const notConfigured = createMemosConnectionTestHandler(createDeps(blowUp, { isClerkConfigured: () => false }).deps);
  assert.equal((await notConfigured.POST(postRequest(VALID_BODY))).status, 503);

  const signedOut = createMemosConnectionTestHandler(createDeps(blowUp, { getUserId: async () => null }).deps);
  assert.equal((await signedOut.POST(postRequest(VALID_BODY))).status, 401);
});

test("POST returns 400 for non-JSON and invalid bodies without fetching", async () => {
  const { deps, calls } = createDeps(async () => Response.json({}));
  const handler = createMemosConnectionTestHandler(deps);

  assert.equal((await handler.POST(postRequest("not json"))).status, 400);

  const invalid = await handler.POST(postRequest({ instanceUrl: "not a url", accessToken: "  " }));
  assert.equal(invalid.status, 400);
  const payload = await invalid.json();
  assert.equal(Array.isArray(payload.fieldErrors.instanceUrl), true);
  assert.equal(Array.isArray(payload.fieldErrors.accessToken), true);

  assert.equal(calls.length, 0);
});

test("POST returns 400 for private instance hosts without fetching", async () => {
  const { deps, calls } = createDeps(async () => Response.json({}));
  const handler = createMemosConnectionTestHandler(deps);

  for (const instanceUrl of ["http://localhost:5230", "http://127.0.0.1:5230", "http://[::1]:5230", "https://10.1.2.3"]) {
    const response = await handler.POST(postRequest({ instanceUrl, accessToken: "token" }));
    assert.equal(response.status, 400, instanceUrl);
  }
  assert.equal(calls.length, 0);
});

test("a reachable instance with a valid token yields ok with the display name", async () => {
  const { deps, calls } = createDeps(async () => Response.json({ user: { username: "steven", displayName: "Steven" } }));
  const handler = createMemosConnectionTestHandler(deps);

  const response = await handler.POST(postRequest(VALID_BODY));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, user: { name: "Steven" } });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://memos.example.com/api/v1/auth/me");
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.headers.Authorization, "Bearer token-123");
  assert.equal(calls[0].init.redirect, "manual");
  assert.equal(calls[0].init.signal instanceof AbortSignal, true);
});

test("falls back to nickname or username when displayName is absent, including flat payloads", async () => {
  const nested = createDeps(async () => Response.json({ user: { username: "steven" } }));
  const nestedResponse = await createMemosConnectionTestHandler(nested.deps).POST(postRequest(VALID_BODY));
  assert.deepEqual(await nestedResponse.json(), { ok: true, user: { name: "steven" } });

  const flat = createDeps(async () => Response.json({ username: "steven", nickname: "Steve" }));
  const flatResponse = await createMemosConnectionTestHandler(flat.deps).POST(postRequest(VALID_BODY));
  assert.deepEqual(await flatResponse.json(), { ok: true, user: { name: "Steve" } });
});

test("instance 401/403 map to the unauthorized reason", async () => {
  for (const status of [401, 403]) {
    const { deps } = createDeps(async () => Response.json({ message: "nope" }, { status }));
    const response = await createMemosConnectionTestHandler(deps).POST(postRequest(VALID_BODY));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: false, reason: "unauthorized" });
  }
});

test("network failures map to unreachable and timeouts map to timeout", async () => {
  const network = createDeps(async () => {
    throw new TypeError("fetch failed");
  });
  assert.deepEqual(await (await createMemosConnectionTestHandler(network.deps).POST(postRequest(VALID_BODY))).json(), {
    ok: false,
    reason: "unreachable",
  });

  const timedOut = createDeps(async () => {
    throw new DOMException("The operation timed out.", "TimeoutError");
  });
  assert.deepEqual(await (await createMemosConnectionTestHandler(timedOut.deps).POST(postRequest(VALID_BODY))).json(), {
    ok: false,
    reason: "timeout",
  });
});

test("redirect responses map to redirected (manual redirect surfaces the 3xx status)", async () => {
  for (const status of [301, 302, 307, 308]) {
    const { deps } = createDeps(async () => new Response(null, { status, headers: { Location: "https://www.memos.example.com/" } }));
    const response = await createMemosConnectionTestHandler(deps).POST(postRequest(VALID_BODY));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: false, reason: "redirected" }, `status ${status}`);
  }
});

test("non-Memos responses map to invalid-response", async () => {
  const cases = [
    async () => new Response("<html>not json</html>", { status: 200 }),
    async () => Response.json({ message: "not found" }, { status: 404 }),
    async () => Response.json({ unexpected: "shape" }),
  ];
  for (const fetchImpl of cases) {
    const { deps } = createDeps(fetchImpl);
    const response = await createMemosConnectionTestHandler(deps).POST(postRequest(VALID_BODY));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: false, reason: "invalid-response" });
  }
});

test("the access token never appears in any response body", async () => {
  const { deps } = createDeps(async () => Response.json({ user: { username: "steven" } }));
  const handler = createMemosConnectionTestHandler(deps);

  const responses = [
    await handler.POST(postRequest(VALID_BODY)),
    await handler.POST(postRequest({ instanceUrl: "not a url", accessToken: "token-123" })),
  ];
  for (const response of responses) {
    const body = await response.text();
    assert.equal(body.includes("token-123"), false);
  }
});
