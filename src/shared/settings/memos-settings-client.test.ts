import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteMemosSettings,
  getMemosCredentials,
  getMemosSettings,
  MemosSettingsRequestError,
  saveMemosSettings,
} from "./memos-settings-client";

const calls: { url: string; init: RequestInit }[] = [];
let nextResponse: Response | undefined;

globalThis.fetch = async (url: RequestInfo | URL, init: RequestInit = {}) => {
  calls.push({ url: url as string, init });
  return nextResponse as Response;
};

beforeEach(() => {
  calls.length = 0;
  nextResponse = undefined;
});

describe("memos-settings-client", () => {
  it("getMemosSettings GETs the settings endpoint and returns the safe shape", async () => {
    nextResponse = Response.json({ instanceUrl: "https://memos.example.com", hasAccessToken: true });

    const settings = await getMemosSettings();

    expect(settings).toEqual({ instanceUrl: "https://memos.example.com", hasAccessToken: true });
    expect(calls.length).toBe(1);
    expect(calls[0].url).toBe("/api/settings/memos");
    expect(calls[0].init.method).toBe("GET");
  });

  it("saveMemosSettings PUTs a JSON body and returns the safe shape", async () => {
    nextResponse = Response.json({ instanceUrl: "https://memos.example.com", hasAccessToken: true });

    const settings = await saveMemosSettings({
      instanceUrl: "https://memos.example.com/",
      accessToken: "token-123",
    });

    expect(settings).toEqual({ instanceUrl: "https://memos.example.com", hasAccessToken: true });
    expect(calls[0].init.method).toBe("PUT");
    expect((calls[0].init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    expect(JSON.parse(calls[0].init.body as string)).toEqual({
      instanceUrl: "https://memos.example.com/",
      accessToken: "token-123",
    });
  });

  it("saveMemosSettings surfaces status and field errors on 400", async () => {
    nextResponse = Response.json(
      { error: "Invalid settings.", fieldErrors: { instanceUrl: ["Instance URL must be a valid http(s) URL."] } },
      { status: 400 },
    );

    await expect(saveMemosSettings({ instanceUrl: "nope", accessToken: "token" })).rejects.toSatisfy((error: unknown) => {
      expect(error instanceof MemosSettingsRequestError).toBe(true);
      const err = error as MemosSettingsRequestError;
      expect(err.status).toBe(400);
      expect(err.message).toBe("Invalid settings.");
      expect(err.fieldErrors).toEqual({ instanceUrl: ["Instance URL must be a valid http(s) URL."] });
      return true;
    });
  });

  it("getMemosSettings throws a generic error for non-JSON failures", async () => {
    nextResponse = new Response("upstream blew up", { status: 502 });

    await expect(getMemosSettings()).rejects.toSatisfy((error: unknown) => {
      expect(error instanceof MemosSettingsRequestError).toBe(true);
      expect((error as MemosSettingsRequestError).status).toBe(502);
      return true;
    });
  });

  it("deleteMemosSettings resolves on 204 and rejects otherwise", async () => {
    nextResponse = new Response(null, { status: 204 });
    await deleteMemosSettings();
    expect(calls[0].init.method).toBe("DELETE");

    nextResponse = Response.json({ error: "Sign in to manage Memos settings." }, { status: 401 });
    await expect(deleteMemosSettings()).rejects.toSatisfy((error: unknown) => {
      expect((error as MemosSettingsRequestError).status).toBe(401);
      return true;
    });
  });

  it("getMemosCredentials returns credentials when connected", async () => {
    nextResponse = Response.json({ instanceUrl: "https://memos.example.com", accessToken: "tok" });
    const creds = await getMemosCredentials();
    expect(creds).toEqual({ instanceUrl: "https://memos.example.com", accessToken: "tok" });
    expect(calls[0].url).toBe("/api/settings/memos/credentials");
    expect(calls[0].init.method).toBe("GET");
  });

  it("getMemosCredentials returns null when not connected", async () => {
    nextResponse = Response.json({ instanceUrl: null, accessToken: null });
    expect(await getMemosCredentials()).toBeNull();
  });

  it("getMemosCredentials throws on 401", async () => {
    nextResponse = Response.json({ error: "Sign in to manage Memos settings." }, { status: 401 });
    await expect(getMemosCredentials()).rejects.toMatchObject({ status: 401 });
  });

  it("getMemosCredentials surfaces field-less request errors with their status", async () => {
    nextResponse = Response.json({ error: "Failed to load settings." }, { status: 502 });
    await expect(getMemosCredentials()).rejects.toSatisfy((error: unknown) => {
      expect(error instanceof MemosSettingsRequestError).toBe(true);
      expect((error as MemosSettingsRequestError).status).toBe(502);
      return true;
    });
  });
});
