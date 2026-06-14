import { describe, expect, it } from "vitest";
import { createMemosStatsHandler } from "./stats-handler";

describe("stats-handler", () => {
  const CONNECTED = { instanceUrl: "https://memos.example.com", accessToken: "tok" };

  function router(routes: Record<string, (init?: RequestInit) => unknown>) {
    const calls: { url: string; init?: RequestInit }[] = [];
    const fetchImpl = async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      const key = Object.keys(routes).find((suffix) => url.endsWith(suffix));
      if (!key) {
        throw new Error(`unexpected fetch: ${url}`);
      }
      return routes[key](init);
    };
    return { fetchImpl, calls };
  }

  function makeDeps(routes: Record<string, (init?: RequestInit) => unknown>, overrides: Record<string, unknown> = {}) {
    const { fetchImpl, calls } = router(routes);
    return {
      calls,
      deps: {
        isClerkConfigured: () => true,
        getUserId: async () => "user_123",
        readMemosMetadata: async () => CONNECTED,
        fetchImpl,
        now: () => new Date("2025-06-13T12:00:00Z"),
        ...overrides,
      },
    };
  }

  const OK_ROUTES = {
    "/api/v1/instance/profile": () => Response.json({ version: "0.29.1" }),
    "/api/v1/auth/me": () => Response.json({ user: { name: "users/7" } }),
    "/api/v1/users/7:getStats": () =>
      Response.json({
        totalMemoCount: 2,
        tagCount: { a: 1 },
        memoTypeStats: { linkCount: 1, codeCount: 0, todoCount: 0, undoCount: 0 },
        memoCreatedTimestamps: ["2025-06-12T00:00:00Z", "2025-06-12T10:00:00Z"],
      }),
  };

  it("returns 503 when Clerk not configured and 401 when signed out", async () => {
    const notConfigured = createMemosStatsHandler(makeDeps(OK_ROUTES, { isClerkConfigured: () => false }).deps);
    expect((await notConfigured.GET()).status).toBe(503);
    const signedOut = createMemosStatsHandler(makeDeps(OK_ROUTES, { getUserId: async () => null }).deps);
    expect((await signedOut.GET()).status).toBe(401);
  });

  it("returns not-connected (200) when no settings are stored, without fetching", async () => {
    const { deps, calls } = makeDeps(OK_ROUTES, { readMemosMetadata: async () => null });
    const response = await createMemosStatsHandler(deps).GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "not-connected" });
    expect(calls.length).toBe(0);
  });

  it("treats a stored object with an empty token as not-connected, without fetching", async () => {
    const partial = { instanceUrl: "https://memos.example.com", accessToken: "" };
    const { deps, calls } = makeDeps(OK_ROUTES, { readMemosMetadata: async () => partial });
    const response = await createMemosStatsHandler(deps).GET();
    expect(await response.json()).toEqual({ status: "not-connected" });
    expect(calls.length).toBe(0);
  });

  it("happy path: normalizes stats, buckets days, includes version", async () => {
    const { deps } = makeDeps(OK_ROUTES);
    const body = await (await createMemosStatsHandler(deps).GET()).json();
    expect(body.status).toBe("ok");
    expect(body.instanceVersion).toBe("0.29.1");
    expect(body.user).toEqual({ name: "users/7" });
    expect(body.stats.totalMemoCount).toBe(2);
    expect(body.stats.tagCount).toBe(1);
    expect(body.stats.days).toEqual([{ date: "2025-06-12", count: 2 }]);
  });

  it("profile and auth/me are fetched in parallel before getStats", async () => {
    const { deps, calls } = makeDeps(OK_ROUTES);
    await createMemosStatsHandler(deps).GET();
    const order = calls.map((c) => c.url.split("/api/v1/")[1]);
    expect(order[order.length - 1]).toBe("users/7:getStats");
    expect(order.includes("instance/profile")).toBeTruthy();
    expect(order.includes("auth/me")).toBeTruthy();
  });

  it("missing version uses the fallback adapter and reports null version", async () => {
    const routes = { ...OK_ROUTES, "/api/v1/instance/profile": () => Response.json({}) };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body.status).toBe("ok");
    expect(body.instanceVersion).toBeNull();
  });

  it("instance 401 maps to unauthorized", async () => {
    const routes = { ...OK_ROUTES, "/api/v1/auth/me": () => new Response("nope", { status: 401 }) };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body).toEqual({ status: "error", reason: "unauthorized" });
  });

  it("network error on a required call maps to unreachable", async () => {
    const routes = {
      ...OK_ROUTES,
      "/api/v1/users/7:getStats": () => {
        throw new TypeError("fetch failed");
      },
    };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body).toEqual({ status: "error", reason: "unreachable" });
  });

  it("a profile fetch failure is non-fatal and falls back to the tolerant adapter", async () => {
    const routes = {
      ...OK_ROUTES,
      "/api/v1/instance/profile": () => {
        throw new TypeError("fetch failed");
      },
    };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body.status).toBe("ok");
    expect(body.instanceVersion).toBeNull();
    expect(body.stats.totalMemoCount).toBe(2);
    expect(body.stats.days).toEqual([{ date: "2025-06-12", count: 2 }]);
  });

  it("an opaque-redirect response (Cloudflare manual redirect) maps to redirected", async () => {
    const routes = {
      ...OK_ROUTES,
      "/api/v1/auth/me": () => ({ ok: false, status: 0, type: "opaqueredirect", body: null }),
    };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body).toEqual({ status: "error", reason: "redirected" });
  });

  it("extracts the version from a nested { profile: { version } } shape", async () => {
    const routes = { ...OK_ROUTES, "/api/v1/instance/profile": () => Response.json({ profile: { version: "0.27.1" } }) };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body.status).toBe("ok");
    expect(body.instanceVersion).toBe("0.27.1");
  });

  it("a hung Clerk metadata read times out and returns 502 without fetching", async () => {
    const { deps, calls } = makeDeps(OK_ROUTES, {
      readMemosMetadata: () => new Promise(() => {}),
      metadataReadTimeoutMs: 5,
    });
    const response = await createMemosStatsHandler(deps).GET();
    expect(response.status).toBe(502);
    expect(calls.length).toBe(0);
  });

  it("timeout maps to timeout", async () => {
    const routes = {
      ...OK_ROUTES,
      "/api/v1/auth/me": () => {
        const err = new Error("timed out");
        err.name = "TimeoutError";
        throw err;
      },
    };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body).toEqual({ status: "error", reason: "timeout" });
  });

  it("non-JSON stats body maps to invalid-response", async () => {
    const routes = { ...OK_ROUTES, "/api/v1/users/7:getStats": () => new Response("<html>", { status: 200 }) };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body).toEqual({ status: "error", reason: "invalid-response" });
  });

  it("auth/me without a resource name maps to invalid-response", async () => {
    const routes = { ...OK_ROUTES, "/api/v1/auth/me": () => Response.json({ user: {} }) };
    const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
    expect(body).toEqual({ status: "error", reason: "invalid-response" });
  });

  it("fast path: a valid userId hint calls only :getStats (skips profile + auth/me)", async () => {
    const { deps, calls } = makeDeps(OK_ROUTES);
    const request = new Request("http://localhost/api/memos/stats?userId=7&version=0.29.1");
    const body = await (await createMemosStatsHandler(deps).GET(request)).json();
    expect(body.status).toBe("ok");
    expect(body.instanceVersion).toBe("0.29.1");
    expect(body.stats.days).toEqual([{ date: "2025-06-12", count: 2 }]);
    const paths = calls.map((c) => c.url.split("/api/v1/")[1]);
    expect(paths).toEqual(["users/7:getStats"]);
  });

  it("an invalid userId hint is ignored and falls back to discovery", async () => {
    const { deps, calls } = makeDeps(OK_ROUTES);
    const request = new Request("http://localhost/api/memos/stats?userId=7%2F..%2Fadmin&version=0.29.1");
    const body = await (await createMemosStatsHandler(deps).GET(request)).json();
    expect(body.status).toBe("ok");
    const paths = calls.map((c) => c.url.split("/api/v1/")[1]).sort();
    expect(paths).toEqual(["auth/me", "instance/profile", "users/7:getStats"]);
  });

  it("fast-path :getStats failure self-heals via discovery", async () => {
    const routes = {
      ...OK_ROUTES,
      "/api/v1/users/99:getStats": () => new Response("nope", { status: 404 }),
    };
    const { deps, calls } = makeDeps(routes);
    const request = new Request("http://localhost/api/memos/stats?userId=99&version=0.29.1");
    const body = await (await createMemosStatsHandler(deps).GET(request)).json();
    expect(body.status).toBe("ok");
    expect(body.user).toEqual({ name: "users/7" });
    const paths = calls.map((c) => c.url.split("/api/v1/")[1]);
    expect(paths.includes("users/99:getStats")).toBeTruthy();
    expect(paths.includes("auth/me")).toBeTruthy();
    expect(paths[paths.length - 1]).toBe("users/7:getStats");
  });

  it("ok responses set a private cache-control; non-ok responses are no-store", async () => {
    const okResponse = await createMemosStatsHandler(makeDeps(OK_ROUTES).deps).GET();
    expect(okResponse.headers.get("Cache-Control")).toBe("private, max-age=30, stale-while-revalidate=300");

    const { deps } = makeDeps(OK_ROUTES, { readMemosMetadata: async () => null });
    const notConnected = await createMemosStatsHandler(deps).GET();
    expect(notConnected.headers.get("Cache-Control")).toBe("no-store");

    const signedOut = await createMemosStatsHandler(makeDeps(OK_ROUTES, { getUserId: async () => null }).deps).GET();
    expect(signedOut.headers.get("Cache-Control")).toBe("no-store");
  });
});
