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

const { createMemosStatsHandler } = await import("./stats-handler.ts");

const CONNECTED = { instanceUrl: "https://memos.example.com", accessToken: "tok" };

function router(routes) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    const key = Object.keys(routes).find((suffix) => url.endsWith(suffix));
    if (!key) {
      throw new Error(`unexpected fetch: ${url}`);
    }
    return routes[key](init);
  };
  return { fetchImpl, calls };
}

function makeDeps(routes, overrides = {}) {
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

test("returns 503 when Clerk not configured and 401 when signed out", async () => {
  const notConfigured = createMemosStatsHandler(makeDeps(OK_ROUTES, { isClerkConfigured: () => false }).deps);
  assert.equal((await notConfigured.GET()).status, 503);
  const signedOut = createMemosStatsHandler(makeDeps(OK_ROUTES, { getUserId: async () => null }).deps);
  assert.equal((await signedOut.GET()).status, 401);
});

test("returns not-connected (200) when no settings are stored, without fetching", async () => {
  const { deps, calls } = makeDeps(OK_ROUTES, { readMemosMetadata: async () => null });
  const response = await createMemosStatsHandler(deps).GET();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "not-connected" });
  assert.equal(calls.length, 0);
});

test("treats a stored object with an empty token as not-connected, without fetching", async () => {
  const partial = { instanceUrl: "https://memos.example.com", accessToken: "" };
  const { deps, calls } = makeDeps(OK_ROUTES, { readMemosMetadata: async () => partial });
  const response = await createMemosStatsHandler(deps).GET();
  assert.deepEqual(await response.json(), { status: "not-connected" });
  assert.equal(calls.length, 0);
});

test("happy path: normalizes stats, buckets days, includes version", async () => {
  const { deps } = makeDeps(OK_ROUTES);
  const body = await (await createMemosStatsHandler(deps).GET()).json();
  assert.equal(body.status, "ok");
  assert.equal(body.instanceVersion, "0.29.1");
  assert.deepEqual(body.user, { name: "users/7" });
  assert.equal(body.stats.totalMemoCount, 2);
  assert.equal(body.stats.tagCount, 1);
  assert.deepEqual(body.stats.days, [{ date: "2025-06-12", count: 2 }]);
});

test("profile and auth/me are fetched in parallel before getStats", async () => {
  const { deps, calls } = makeDeps(OK_ROUTES);
  await createMemosStatsHandler(deps).GET();
  const order = calls.map((c) => c.url.split("/api/v1/")[1]);
  assert.equal(order[order.length - 1], "users/7:getStats");
  assert.ok(order.includes("instance/profile"));
  assert.ok(order.includes("auth/me"));
});

test("missing version uses the fallback adapter and reports null version", async () => {
  const routes = { ...OK_ROUTES, "/api/v1/instance/profile": () => Response.json({}) };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.equal(body.status, "ok");
  assert.equal(body.instanceVersion, null);
});

test("instance 401 maps to unauthorized", async () => {
  const routes = { ...OK_ROUTES, "/api/v1/auth/me": () => new Response("nope", { status: 401 }) };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.deepEqual(body, { status: "error", reason: "unauthorized" });
});

test("network error on a required call maps to unreachable", async () => {
  const routes = {
    ...OK_ROUTES,
    "/api/v1/users/7:getStats": () => {
      throw new TypeError("fetch failed");
    },
  };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.deepEqual(body, { status: "error", reason: "unreachable" });
});

test("a profile fetch failure is non-fatal and falls back to the tolerant adapter", async () => {
  const routes = {
    ...OK_ROUTES,
    "/api/v1/instance/profile": () => {
      throw new TypeError("fetch failed");
    },
  };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.equal(body.status, "ok");
  assert.equal(body.instanceVersion, null);
  assert.equal(body.stats.totalMemoCount, 2);
  assert.deepEqual(body.stats.days, [{ date: "2025-06-12", count: 2 }]);
});

test("an opaque-redirect response (Cloudflare manual redirect) maps to redirected", async () => {
  const routes = {
    ...OK_ROUTES,
    "/api/v1/auth/me": () => ({ ok: false, status: 0, type: "opaqueredirect", body: null }),
  };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.deepEqual(body, { status: "error", reason: "redirected" });
});

test("extracts the version from a nested { profile: { version } } shape", async () => {
  const routes = { ...OK_ROUTES, "/api/v1/instance/profile": () => Response.json({ profile: { version: "0.27.1" } }) };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.equal(body.status, "ok");
  assert.equal(body.instanceVersion, "0.27.1");
});

test("a hung Clerk metadata read times out and returns 502 without fetching", async () => {
  const { deps, calls } = makeDeps(OK_ROUTES, {
    readMemosMetadata: () => new Promise(() => {}),
    metadataReadTimeoutMs: 5,
  });
  const response = await createMemosStatsHandler(deps).GET();
  assert.equal(response.status, 502);
  assert.equal(calls.length, 0);
});

test("timeout maps to timeout", async () => {
  const routes = {
    ...OK_ROUTES,
    "/api/v1/auth/me": () => {
      const err = new Error("timed out");
      err.name = "TimeoutError";
      throw err;
    },
  };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.deepEqual(body, { status: "error", reason: "timeout" });
});

test("non-JSON stats body maps to invalid-response", async () => {
  const routes = { ...OK_ROUTES, "/api/v1/users/7:getStats": () => new Response("<html>", { status: 200 }) };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.deepEqual(body, { status: "error", reason: "invalid-response" });
});

test("auth/me without a resource name maps to invalid-response", async () => {
  const routes = { ...OK_ROUTES, "/api/v1/auth/me": () => Response.json({ user: {} }) };
  const body = await (await createMemosStatsHandler(makeDeps(routes).deps).GET()).json();
  assert.deepEqual(body, { status: "error", reason: "invalid-response" });
});

test("fast path: a valid userId hint calls only :getStats (skips profile + auth/me)", async () => {
  const { deps, calls } = makeDeps(OK_ROUTES);
  const request = new Request("http://localhost/api/memos/stats?userId=7&version=0.29.1");
  const body = await (await createMemosStatsHandler(deps).GET(request)).json();
  assert.equal(body.status, "ok");
  assert.equal(body.instanceVersion, "0.29.1");
  assert.deepEqual(body.stats.days, [{ date: "2025-06-12", count: 2 }]);
  const paths = calls.map((c) => c.url.split("/api/v1/")[1]);
  assert.deepEqual(paths, ["users/7:getStats"]);
});

test("an invalid userId hint is ignored and falls back to discovery", async () => {
  const { deps, calls } = makeDeps(OK_ROUTES);
  const request = new Request("http://localhost/api/memos/stats?userId=7%2F..%2Fadmin&version=0.29.1");
  const body = await (await createMemosStatsHandler(deps).GET(request)).json();
  assert.equal(body.status, "ok");
  const paths = calls.map((c) => c.url.split("/api/v1/")[1]).sort();
  assert.deepEqual(paths, ["auth/me", "instance/profile", "users/7:getStats"]);
});

test("fast-path :getStats failure self-heals via discovery", async () => {
  const routes = {
    ...OK_ROUTES,
    "/api/v1/users/99:getStats": () => new Response("nope", { status: 404 }),
  };
  const { deps, calls } = makeDeps(routes);
  const request = new Request("http://localhost/api/memos/stats?userId=99&version=0.29.1");
  const body = await (await createMemosStatsHandler(deps).GET(request)).json();
  assert.equal(body.status, "ok");
  assert.deepEqual(body.user, { name: "users/7" });
  const paths = calls.map((c) => c.url.split("/api/v1/")[1]);
  assert.ok(paths.includes("users/99:getStats"), "tried the hinted id first");
  assert.ok(paths.includes("auth/me"), "fell back to discovery");
  assert.equal(paths[paths.length - 1], "users/7:getStats");
});

test("ok responses set a private cache-control; non-ok responses are no-store", async () => {
  const okResponse = await createMemosStatsHandler(makeDeps(OK_ROUTES).deps).GET();
  assert.equal(okResponse.headers.get("Cache-Control"), "private, max-age=30, stale-while-revalidate=300");

  const { deps } = makeDeps(OK_ROUTES, { readMemosMetadata: async () => null });
  const notConnected = await createMemosStatsHandler(deps).GET();
  assert.equal(notConnected.headers.get("Cache-Control"), "no-store");

  const signedOut = await createMemosStatsHandler(makeDeps(OK_ROUTES, { getUserId: async () => null }).deps).GET();
  assert.equal(signedOut.headers.get("Cache-Control"), "no-store");
});
