import { describe, expect, it } from "vitest";
import { fetchInstanceStats, testInstanceConnection } from "./instance-stats";

const CREDS = { instanceUrl: "https://memos.example.com", accessToken: "tok" };
const NOW = new Date("2025-01-10T00:00:00Z");

function router(routes: Record<string, () => Promise<Response>>) {
  return {
    pageProtocol: "https:",
    now: () => NOW,
    origin: "https://www.usememos.com",
    fetchImpl: async (url: RequestInfo | URL) => {
      const path = (url as string).replace("https://memos.example.com", "");
      const handler = Object.entries(routes).find(([key]) => path.startsWith(key))?.[1];
      // An unrouted path answers like a real instance would for an unknown API
      // path: a 404, not a network failure.
      return handler ? handler() : new Response("not found", { status: 404 });
    },
  };
}

const STATS_BODY = {
  totalMemoCount: 2,
  tagCount: { a: 1 },
  memoTypeStats: { linkCount: 1, codeCount: 0, todoCount: 0, undoCount: 0 },
  memoCreatedTimestamps: ["2025-01-09T10:00:00Z", "2025-01-09T12:00:00Z"],
};

/** 26.10 shape: `tagCounts` replaces `tagCount`. */
const STATS_BODY_26 = {
  name: "users/7",
  totalMemoCount: 2,
  tagCounts: { a: 1, b: 1 },
  memoTypeStats: { linkCount: 1, codeCount: 0, todoCount: 0, undoCount: 0 },
  memoCreatedTimestamps: ["2025-01-09T10:00:00Z", "2025-01-09T12:00:00Z"],
};

/** Memos 26.10 answers every `/api/v1` path with 410 Gone. */
const GONE = async () => Response.json({ code: 12, message: "UNIMPLEMENTED" }, { status: 410 });

describe("fetchInstanceStats", () => {
  it("discovers user + version, then returns ok stats bucketed by UTC day", async () => {
    const deps = router({
      "/api/v1/instance/profile": async () => Response.json({ version: "0.29.1" }),
      "/api/v1/auth/me": async () => Response.json({ user: { name: "users/7" } }),
      "/api/v1/users/7:getStats": async () => Response.json(STATS_BODY),
    });
    const result = await fetchInstanceStats(CREDS, undefined, deps);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.user.name).toBe("users/7");
    expect(result.instanceVersion).toBe("0.29.1");
    expect(result.stats.totalMemoCount).toBe(2);
    expect(result.stats.days).toEqual([{ date: "2025-01-09", count: 2 }]);
  });

  it("talks to a 26.10 instance under /api and never retries removed /api/v1 paths after the profile", async () => {
    const seen: string[] = [];
    const deps = router({
      "/api/v1/": GONE,
      "/api/instance/profile": async () => Response.json({ version: "26.10.0" }),
      "/api/auth/me": async () => Response.json({ user: { name: "users/7" } }),
      "/api/users/7:getStats": async () => Response.json(STATS_BODY_26),
    });
    const fetchImpl = deps.fetchImpl;
    deps.fetchImpl = async (url, init) => {
      seen.push((url as string).replace("https://memos.example.com", ""));
      return fetchImpl(url, init);
    };
    const result = await fetchInstanceStats(CREDS, undefined, deps);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.instanceVersion).toBe("26.10.0");
    expect(result.stats.tagCount).toBe(2);
    expect(result.stats.days).toEqual([{ date: "2025-01-09", count: 2 }]);
    expect(seen).toEqual(["/api/instance/profile", "/api/auth/me", "/api/users/7:getStats"]);
  });

  it("falls back to /api/v1 when a 0.x instance serves its SPA shell at /api/instance/profile", async () => {
    const deps = router({
      "/api/instance/profile": async () =>
        new Response("<!doctype html><title>Memos</title>", { status: 200, headers: { "content-type": "text/html" } }),
      "/api/v1/instance/profile": async () => Response.json({ version: "0.31.0" }),
      "/api/v1/auth/me": async () => Response.json({ user: { name: "users/7" } }),
      "/api/v1/users/7:getStats": async () => Response.json(STATS_BODY),
    });
    const result = await fetchInstanceStats(CREDS, undefined, deps);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.instanceVersion).toBe("0.31.0");
  });

  it("uses cached userId and version hints to skip discovery on a 26.10 instance", async () => {
    let profileCalls = 0;
    const deps = router({
      "/api/v1/": GONE,
      "/api/instance/profile": async () => {
        profileCalls++;
        return Response.json({ version: "26.10.0" });
      },
      "/api/users/7:getStats": async () => Response.json(STATS_BODY_26),
    });
    const result = await fetchInstanceStats(CREDS, { userId: "7", version: "26.10.0" }, deps);
    expect(result.status).toBe("ok");
    expect(profileCalls).toBe(0);
  });

  it("rediscovers through the profile when the hint has no version", async () => {
    const deps = router({
      "/api/v1/": GONE,
      "/api/instance/profile": async () => Response.json({ version: "26.10.0" }),
      "/api/auth/me": async () => Response.json({ user: { name: "users/7" } }),
      "/api/users/7:getStats": async () => Response.json(STATS_BODY_26),
    });
    const result = await fetchInstanceStats(CREDS, { userId: "7", version: null }, deps);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.instanceVersion).toBe("26.10.0");
  });

  it("uses a cached userId hint to skip discovery", async () => {
    let profileCalls = 0;
    const deps = router({
      "/api/v1/instance/profile": async () => {
        profileCalls++;
        return Response.json({ version: "0.29.1" });
      },
      "/api/v1/users/7:getStats": async () => Response.json(STATS_BODY),
    });
    const result = await fetchInstanceStats(CREDS, { userId: "7", version: "0.29.1" }, deps);
    expect(result.status).toBe("ok");
    expect(profileCalls).toBe(0);
  });

  it("returns a classified error detail when auth/me is unauthorized", async () => {
    const deps = router({
      "/api/v1/instance/profile": async () => Response.json({ version: "0.29.1" }),
      "/api/v1/auth/me": async () => new Response(null, { status: 401 }),
    });
    const result = await fetchInstanceStats(CREDS, undefined, deps);
    expect(result.status).toBe("error");
    if (result.status !== "error") return;
    expect(result.error.kind).toBe("unauthorized");
    expect(result.error.howToFix.length).toBeGreaterThan(0);
  });

  it("flags an unparseable stats shape on a too-new version as unsupported-version", async () => {
    const deps = router({
      "/api/instance/profile": async () => Response.json({ version: "27.1.0" }),
      "/api/auth/me": async () => Response.json({ user: { name: "users/7" } }),
      "/api/users/7:getStats": async () => Response.json("not-an-object"),
    });
    const result = await fetchInstanceStats(CREDS, undefined, deps);
    expect(result.status).toBe("error");
    if (result.status !== "error") return;
    expect(result.error.kind).toBe("unsupported-version");
    expect(result.error.why).toContain("27.1.0");
  });

  it("surfaces CORS detail with the page origin in remediation", async () => {
    const deps = {
      pageProtocol: "https:",
      now: () => NOW,
      origin: "https://www.usememos.com",
      fetchImpl: (async (_url: RequestInfo | URL, init: RequestInit = {}) => {
        if (init.mode === "no-cors") return new Response(null, { status: 200 }); // probe: reachable
        throw new TypeError("Failed to fetch");
      }) as typeof fetch,
    };
    const result = await fetchInstanceStats(CREDS, undefined, deps);
    expect(result.status).toBe("error");
    if (result.status !== "error") return;
    expect(result.error.kind).toBe("cors");
    expect(result.error.howToFix.join(" ")).toContain("https://www.usememos.com");
  });
});

describe("testInstanceConnection", () => {
  it("returns the display name and supported version on success", async () => {
    const deps = router({
      "/api/v1/instance/profile": async () => Response.json({ version: "0.30.0" }),
      "/api/v1/auth/me": async () => Response.json({ user: { displayName: "Steven" } }),
    });
    expect(await testInstanceConnection(CREDS, deps)).toEqual({ ok: true, name: "Steven", version: "0.30.0" });
  });

  it("authenticates a 26.10 instance under /api", async () => {
    const deps = router({
      "/api/v1/": GONE,
      "/api/instance/profile": async () => Response.json({ version: "26.10.0" }),
      "/api/auth/me": async () => Response.json({ user: { displayName: "Steven" } }),
    });
    expect(await testInstanceConnection(CREDS, deps)).toEqual({ ok: true, name: "Steven", version: "26.10.0" });
  });

  it("reports unauthorized from the first profile attempt instead of probing the other prefix", async () => {
    let v1Calls = 0;
    const deps = router({
      "/api/v1/": async () => {
        v1Calls++;
        return GONE();
      },
      "/api/instance/profile": async () => new Response(null, { status: 401 }),
    });
    const result = await testInstanceConnection(CREDS, deps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("unauthorized");
    expect(v1Calls).toBe(0);
  });

  it("returns a classified error detail on failure", async () => {
    const deps = router({
      "/api/v1/instance/profile": async () => Response.json({ version: "0.30.0" }),
      "/api/v1/auth/me": async () => new Response(null, { status: 401 }),
    });
    const result = await testInstanceConnection(CREDS, deps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.kind).toBe("unauthorized");
  });

  it("rejects an instance older than the minimum supported version before auth", async () => {
    let authCalls = 0;
    const deps = router({
      "/api/v1/instance/profile": async () => Response.json({ version: "0.25.0" }),
      "/api/v1/auth/me": async () => {
        authCalls++;
        return Response.json({ user: { displayName: "Steven" } });
      },
    });
    const result = await testInstanceConnection(CREDS, deps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.why).toContain("0.25.0");
    expect(result.error.howToFix.join(" ")).toContain("0.26.0");
    expect(authCalls).toBe(0);
  });
});
