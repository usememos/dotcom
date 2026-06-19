import { describe, expect, it } from "vitest";
import { createMemosCredentialsHandler } from "./memos-credentials-handler";

const authed = { isClerkConfigured: () => true, getUserId: async () => "user_1" };

describe("memos-credentials-handler", () => {
  it("returns the instanceUrl + accessToken for the owner", async () => {
    const handler = createMemosCredentialsHandler({
      ...authed,
      readMemosMetadata: async () => ({ instanceUrl: "https://memos.example.com", accessToken: "tok" }),
    });
    const res = await handler.GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(await res.json()).toEqual({ instanceUrl: "https://memos.example.com", accessToken: "tok" });
  });

  it("returns nulls when no connection is configured", async () => {
    const handler = createMemosCredentialsHandler({ ...authed, readMemosMetadata: async () => null });
    expect(await (await handler.GET()).json()).toEqual({ instanceUrl: null, accessToken: null });
  });

  it("401s when signed out (no-store)", async () => {
    const handler = createMemosCredentialsHandler({
      isClerkConfigured: () => true,
      getUserId: async () => null,
      readMemosMetadata: async () => null,
    });
    const res = await handler.GET();
    expect(res.status).toBe(401);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("502s when the metadata read throws", async () => {
    const handler = createMemosCredentialsHandler({
      ...authed,
      readMemosMetadata: async () => {
        throw new Error("clerk down");
      },
    });
    expect((await handler.GET()).status).toBe(502);
  });
});
