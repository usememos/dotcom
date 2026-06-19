import { describe, expect, it } from "vitest";
import { InstanceError } from "./errors";
import { instanceFetchJson, type MemosCredentials } from "./instance-client";

const CREDS: MemosCredentials = { instanceUrl: "https://memos.example.com", accessToken: "tok" };

/** Builds deps with a queue of fetch behaviors (real request first, then probe). */
function deps(handlers: Array<(url: string, init: RequestInit) => Promise<Response>>) {
  let i = 0;
  return {
    pageProtocol: "https:",
    fetchImpl: (url: RequestInfo | URL, init: RequestInit = {}) => handlers[i++](url as string, init),
  };
}

describe("instanceFetchJson", () => {
  it("sends a Bearer token and returns parsed JSON on 200", async () => {
    let seen: RequestInit | undefined;
    const d = deps([
      async (_url, init) => {
        seen = init;
        return Response.json({ hello: "world" });
      },
    ]);
    const data = await instanceFetchJson(CREDS, "/api/v1/auth/me", d);
    expect(data).toEqual({ hello: "world" });
    expect((seen?.headers as Record<string, string>).Authorization).toBe("Bearer tok");
  });

  it("throws mixed-content before any request when page is https and url is http", async () => {
    let called = false;
    const d = {
      pageProtocol: "https:",
      fetchImpl: async () => {
        called = true;
        return Response.json({});
      },
    };
    await expect(instanceFetchJson({ instanceUrl: "http://memos.example.com", accessToken: "t" }, "/x", d)).rejects.toMatchObject({
      kind: "mixed-content",
    });
    expect(called).toBe(false);
  });

  it("maps 401/403 to unauthorized", async () => {
    const d = deps([async () => new Response(null, { status: 401 })]);
    await expect(instanceFetchJson(CREDS, "/x", d)).rejects.toMatchObject({ kind: "unauthorized" });
  });

  it("maps a timeout/abort to timeout", async () => {
    const d = deps([
      async () => {
        throw new DOMException("aborted", "TimeoutError");
      },
    ]);
    await expect(instanceFetchJson(CREDS, "/x", d)).rejects.toMatchObject({ kind: "timeout" });
  });

  it("on a TypeError, probes: reachable -> cors", async () => {
    const d = deps([
      async () => {
        throw new TypeError("Failed to fetch");
      },
      // The real no-cors probe resolves with an opaque response; any resolved
      // Response means "reachable". (Response can't be constructed with status 0.)
      async () => new Response(null, { status: 200 }),
    ]);
    await expect(instanceFetchJson(CREDS, "/x", d)).rejects.toMatchObject({ kind: "cors" });
  });

  it("on a TypeError, probes: unreachable -> unreachable", async () => {
    const d = deps([
      async () => {
        throw new TypeError("Failed to fetch");
      },
      async () => {
        throw new TypeError("Failed to fetch");
      },
    ]);
    await expect(instanceFetchJson(CREDS, "/x", d)).rejects.toMatchObject({ kind: "unreachable" });
  });

  it("maps non-JSON and redirects to bad-response", async () => {
    const dJson = deps([async () => new Response("<html>login</html>", { status: 200, headers: { "Content-Type": "text/html" } })]);
    await expect(instanceFetchJson(CREDS, "/x", dJson)).rejects.toMatchObject({ kind: "bad-response" });

    const dRedirect = deps([async () => new Response(null, { status: 302 })]);
    await expect(instanceFetchJson(CREDS, "/x", dRedirect)).rejects.toMatchObject({ kind: "bad-response" });
  });

  it("normalizes the base URL (strips trailing slash) when composing paths", async () => {
    let seenUrl = "";
    const d = deps([
      async (url) => {
        seenUrl = url;
        return Response.json({});
      },
    ]);
    await instanceFetchJson({ instanceUrl: "https://memos.example.com/", accessToken: "t" }, "/api/v1/auth/me", d);
    expect(seenUrl).toBe("https://memos.example.com/api/v1/auth/me");
  });
});

describe("InstanceError", () => {
  it("is thrown for failures", async () => {
    const d = deps([async () => new Response(null, { status: 401 })]);
    await expect(instanceFetchJson(CREDS, "/x", d)).rejects.toBeInstanceOf(InstanceError);
  });
});
