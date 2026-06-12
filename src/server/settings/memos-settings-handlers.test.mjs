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

const { createMemosSettingsHandlers } = await import("./memos-settings-handlers.ts");

const SETTINGS_URL = "http://localhost/api/settings/memos";

function createFakeDeps(overrides = {}) {
  const store = new Map();
  const deps = {
    isClerkConfigured: () => true,
    getUserId: async () => "user_123",
    readMemosMetadata: async (userId) => store.get(userId) ?? null,
    writeMemosMetadata: async (userId, memos) => {
      store.set(userId, memos);
    },
    ...overrides,
  };
  return { deps, store };
}

function putRequest(body) {
  return new Request(SETTINGS_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("all methods return 503 when Clerk is not configured", async () => {
  const { deps } = createFakeDeps({ isClerkConfigured: () => false });
  const handlers = createMemosSettingsHandlers(deps);

  assert.equal((await handlers.GET()).status, 503);
  assert.equal((await handlers.PUT(putRequest({}))).status, 503);
  assert.equal((await handlers.DELETE()).status, 503);
});

test("all methods return 401 when signed out", async () => {
  const { deps } = createFakeDeps({ getUserId: async () => null });
  const handlers = createMemosSettingsHandlers(deps);

  assert.equal((await handlers.GET()).status, 401);
  assert.equal((await handlers.PUT(putRequest({}))).status, 401);
  assert.equal((await handlers.DELETE()).status, 401);
});

test("GET returns the empty safe shape when nothing is saved", async () => {
  const { deps } = createFakeDeps();
  const handlers = createMemosSettingsHandlers(deps);

  const response = await handlers.GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { instanceUrl: null, hasAccessToken: false });
});

test("PUT returns 400 for a non-JSON body", async () => {
  const { deps } = createFakeDeps();
  const handlers = createMemosSettingsHandlers(deps);

  const response = await handlers.PUT(putRequest("not json"));
  assert.equal(response.status, 400);
});

test("PUT returns 400 with per-field errors for invalid input", async () => {
  const { deps, store } = createFakeDeps();
  const handlers = createMemosSettingsHandlers(deps);

  const response = await handlers.PUT(putRequest({ instanceUrl: "not a url", accessToken: "   " }));
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(Array.isArray(payload.fieldErrors.instanceUrl), true);
  assert.equal(Array.isArray(payload.fieldErrors.accessToken), true);
  assert.equal(store.size, 0);
});

test("PUT saves normalized settings and a GET round-trip returns the safe shape", async () => {
  const { deps, store } = createFakeDeps();
  const handlers = createMemosSettingsHandlers(deps);

  const putResponse = await handlers.PUT(putRequest({ instanceUrl: "https://memos.example.com/", accessToken: "  secret-token  " }));
  assert.equal(putResponse.status, 200);
  assert.deepEqual(await putResponse.json(), {
    instanceUrl: "https://memos.example.com",
    hasAccessToken: true,
  });

  assert.deepEqual(store.get("user_123"), {
    instanceUrl: "https://memos.example.com",
    accessToken: "secret-token",
  });

  const getResponse = await handlers.GET();
  assert.deepEqual(await getResponse.json(), {
    instanceUrl: "https://memos.example.com",
    hasAccessToken: true,
  });
});

test("the access token never appears in any response body", async () => {
  const { deps } = createFakeDeps();
  const handlers = createMemosSettingsHandlers(deps);

  const token = "super-secret-token";
  const responses = [
    await handlers.PUT(putRequest({ instanceUrl: "https://memos.example.com", accessToken: token })),
    await handlers.GET(),
    await handlers.DELETE(),
  ];
  for (const response of responses) {
    const body = await response.text();
    assert.equal(body.includes(token), false);
  }
});

test("DELETE clears the key with a 204 and an empty body", async () => {
  const { deps, store } = createFakeDeps();
  const handlers = createMemosSettingsHandlers(deps);

  await handlers.PUT(putRequest({ instanceUrl: "https://memos.example.com", accessToken: "token" }));
  const response = await handlers.DELETE();
  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
  assert.equal(store.get("user_123"), null);
});

test("Clerk backend failures surface as 502 without details", async () => {
  const boom = async () => {
    throw new Error("clerk exploded: secret detail");
  };
  const { deps } = createFakeDeps({ readMemosMetadata: boom, writeMemosMetadata: boom });
  const handlers = createMemosSettingsHandlers(deps);

  for (const response of [
    await handlers.GET(),
    await handlers.PUT(putRequest({ instanceUrl: "https://memos.example.com", accessToken: "token" })),
    await handlers.DELETE(),
  ]) {
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.equal(body.includes("secret detail"), false);
  }
});
