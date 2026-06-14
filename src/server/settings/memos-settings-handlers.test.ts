import { describe, expect, it } from "vitest";
import { createMemosSettingsHandlers } from "./memos-settings-handlers";

const SETTINGS_URL = "http://localhost/api/settings/memos";

function createFakeDeps(overrides: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>();
  const deps = {
    isClerkConfigured: () => true,
    getUserId: async () => "user_123",
    readMemosMetadata: async (userId: string) => store.get(userId) ?? null,
    writeMemosMetadata: async (userId: string, memos: unknown) => {
      store.set(userId, memos);
    },
    ...overrides,
  };
  return { deps, store };
}

function putRequest(body: unknown) {
  return new Request(SETTINGS_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("memos-settings-handlers", () => {
  it("all methods return 503 when Clerk is not configured", async () => {
    const { deps } = createFakeDeps({ isClerkConfigured: () => false });
    const handlers = createMemosSettingsHandlers(deps);

    expect((await handlers.GET()).status).toBe(503);
    expect((await handlers.PUT(putRequest({}))).status).toBe(503);
    expect((await handlers.DELETE()).status).toBe(503);
  });

  it("all methods return 401 when signed out", async () => {
    const { deps } = createFakeDeps({ getUserId: async () => null });
    const handlers = createMemosSettingsHandlers(deps);

    expect((await handlers.GET()).status).toBe(401);
    expect((await handlers.PUT(putRequest({}))).status).toBe(401);
    expect((await handlers.DELETE()).status).toBe(401);
  });

  it("GET returns the empty safe shape when nothing is saved", async () => {
    const { deps } = createFakeDeps();
    const handlers = createMemosSettingsHandlers(deps);

    const response = await handlers.GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ instanceUrl: null, hasAccessToken: false });
  });

  it("PUT returns 400 for a non-JSON body", async () => {
    const { deps } = createFakeDeps();
    const handlers = createMemosSettingsHandlers(deps);

    const response = await handlers.PUT(putRequest("not json"));
    expect(response.status).toBe(400);
  });

  it("PUT returns 400 with per-field errors for invalid input", async () => {
    const { deps, store } = createFakeDeps();
    const handlers = createMemosSettingsHandlers(deps);

    const response = await handlers.PUT(putRequest({ instanceUrl: "not a url", accessToken: "   " }));
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(Array.isArray(payload.fieldErrors.instanceUrl)).toBe(true);
    expect(Array.isArray(payload.fieldErrors.accessToken)).toBe(true);
    expect(store.size).toBe(0);
  });

  it("PUT saves normalized settings and a GET round-trip returns the safe shape", async () => {
    const { deps, store } = createFakeDeps();
    const handlers = createMemosSettingsHandlers(deps);

    const putResponse = await handlers.PUT(putRequest({ instanceUrl: "https://memos.example.com/", accessToken: "  secret-token  " }));
    expect(putResponse.status).toBe(200);
    expect(await putResponse.json()).toEqual({
      instanceUrl: "https://memos.example.com",
      hasAccessToken: true,
    });

    expect(store.get("user_123")).toEqual({
      instanceUrl: "https://memos.example.com",
      accessToken: "secret-token",
    });

    const getResponse = await handlers.GET();
    expect(await getResponse.json()).toEqual({
      instanceUrl: "https://memos.example.com",
      hasAccessToken: true,
    });
  });

  it("the access token never appears in any response body", async () => {
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
      expect(body).not.toContain(token);
    }
  });

  it("DELETE clears the key with a 204 and an empty body", async () => {
    const { deps, store } = createFakeDeps();
    const handlers = createMemosSettingsHandlers(deps);

    await handlers.PUT(putRequest({ instanceUrl: "https://memos.example.com", accessToken: "token" }));
    const response = await handlers.DELETE();
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(store.get("user_123")).toBeNull();
  });

  it("Clerk backend failures surface as 502 without details", async () => {
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
      expect(response.status).toBe(502);
      const body = await response.text();
      expect(body).not.toContain("secret detail");
    }
  });
});
