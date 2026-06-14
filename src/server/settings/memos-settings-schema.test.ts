import { describe, expect, it } from "vitest";
import {
  isDisallowedInstanceHost,
  MAX_SETTINGS_FIELD_LENGTH,
  memosSettingsSchema,
  normalizeInstanceUrl,
  parseMemosSettingsBody,
} from "./memos-settings-schema";

describe("memos-settings-schema", () => {
  it("normalizeInstanceUrl strips trailing slashes and keeps subpaths", () => {
    expect(normalizeInstanceUrl("https://memos.example.com/")).toBe("https://memos.example.com");
    expect(normalizeInstanceUrl("https://memos.example.com")).toBe("https://memos.example.com");
    expect(normalizeInstanceUrl("https://host.example.com/memos/")).toBe("https://host.example.com/memos");
    expect(normalizeInstanceUrl("https://host.example.com/a/b///")).toBe("https://host.example.com/a/b");
  });

  it("normalizeInstanceUrl trims whitespace and keeps explicit ports", () => {
    expect(normalizeInstanceUrl("  http://memos.local:5230  ")).toBe("http://memos.local:5230");
  });

  it("normalizeInstanceUrl drops query and hash", () => {
    expect(normalizeInstanceUrl("https://memos.example.com/sub?x=1#y")).toBe("https://memos.example.com/sub");
  });

  it("normalizeInstanceUrl rejects non-http(s) protocols and garbage", () => {
    expect(normalizeInstanceUrl("ftp://memos.example.com")).toBeNull();
    expect(normalizeInstanceUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeInstanceUrl("not a url")).toBeNull();
    expect(normalizeInstanceUrl("")).toBeNull();
  });

  it("memosSettingsSchema normalizes the URL and trims the token", () => {
    const result = memosSettingsSchema.safeParse({
      instanceUrl: "https://memos.example.com/",
      accessToken: "  token-123  ",
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      instanceUrl: "https://memos.example.com",
      accessToken: "token-123",
    });
  });

  it("memosSettingsSchema rejects invalid URLs with an instanceUrl field error", () => {
    const result = memosSettingsSchema.safeParse({ instanceUrl: "not a url", accessToken: "token" });
    expect(result.success).toBe(false);
    const paths = (result as { success: false; error: { issues: { path: string[] }[] } }).error.issues.map((issue) => issue.path.join("."));
    expect(paths).toEqual(["instanceUrl"]);
  });

  it("memosSettingsSchema rejects empty or whitespace-only tokens", () => {
    for (const accessToken of ["", "   "]) {
      const result = memosSettingsSchema.safeParse({ instanceUrl: "https://memos.example.com", accessToken });
      expect(result.success).toBe(false);
      const paths = (result as { success: false; error: { issues: { path: string[] }[] } }).error.issues.map((issue) =>
        issue.path.join("."),
      );
      expect(paths).toEqual(["accessToken"]);
    }
  });

  it("memosSettingsSchema rejects missing fields with per-field errors", () => {
    const result = memosSettingsSchema.safeParse({});
    expect(result.success).toBe(false);
    const paths = (result as { success: false; error: { issues: { path: string[] }[] } }).error.issues
      .map((issue) => issue.path.join("."))
      .sort();
    expect(paths).toEqual(["accessToken", "instanceUrl"]);
  });

  it("memosSettingsSchema caps field lengths at 2048", () => {
    const long = `https://memos.example.com/${"a".repeat(MAX_SETTINGS_FIELD_LENGTH)}`;
    const urlResult = memosSettingsSchema.safeParse({ instanceUrl: long, accessToken: "token" });
    expect(urlResult.success).toBe(false);

    const tokenResult = memosSettingsSchema.safeParse({
      instanceUrl: "https://memos.example.com",
      accessToken: "a".repeat(MAX_SETTINGS_FIELD_LENGTH + 1),
    });
    expect(tokenResult.success).toBe(false);
  });

  it("isDisallowedInstanceHost flags localhost and private ranges", () => {
    const disallowed = [
      "localhost",
      "sub.localhost",
      "localhost.",
      "127.0.0.1",
      "0.0.0.0",
      "10.0.0.5",
      "172.16.0.1",
      "172.31.255.255",
      "192.168.1.1",
      "169.254.10.10",
      "::1",
      "::",
      "[::1]",
      "fc00::1",
      "fd12:3456::1",
      "fe80::1",
      "::ffff:127.0.0.1",
      "::ffff:7f00:1",
      "[::ffff:7f00:1]",
    ];
    for (const host of disallowed) {
      expect(isDisallowedInstanceHost(host)).toBe(true);
    }
  });

  it("isDisallowedInstanceHost allows public hosts", () => {
    const allowed = ["memos.example.com", "8.8.8.8", "172.15.0.1", "172.32.0.1", "192.169.0.1", "2606:4700::1111", "::ffff:808:808"];
    for (const host of allowed) {
      expect(isDisallowedInstanceHost(host)).toBe(false);
    }
  });

  it("memosSettingsSchema rejects private instance hosts with an instanceUrl field error", () => {
    for (const instanceUrl of [
      "http://localhost:5230",
      "http://127.0.0.1:5230",
      "https://192.168.1.20",
      "http://[::1]:5230",
      "http://[::ffff:127.0.0.1]:5230",
      "http://localhost.:5230",
    ]) {
      const result = memosSettingsSchema.safeParse({ instanceUrl, accessToken: "token" });
      expect(result.success).toBe(false);
      const paths = (result as { success: false; error: { issues: { path: string[] }[] } }).error.issues.map((issue) =>
        issue.path.join("."),
      );
      expect(paths).toEqual(["instanceUrl"]);
    }
  });

  function jsonRequest(body: unknown) {
    return new Request("http://localhost/api/settings/memos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  it("parseMemosSettingsBody returns the parsed settings for a valid body", async () => {
    const parsed = await parseMemosSettingsBody(jsonRequest({ instanceUrl: "https://memos.example.com/", accessToken: "  token  " }));
    expect(parsed).toEqual({ settings: { instanceUrl: "https://memos.example.com", accessToken: "token" } });
  });

  it("parseMemosSettingsBody returns a 400 response for non-JSON and invalid bodies", async () => {
    const nonJson = await parseMemosSettingsBody(jsonRequest("not json"));
    expect((nonJson as { response: Response }).response.status).toBe(400);

    const invalid = await parseMemosSettingsBody(jsonRequest({ instanceUrl: "not a url", accessToken: " " }));
    expect((invalid as { response: Response }).response.status).toBe(400);
    const payload = await (invalid as { response: Response }).response.json();
    expect(Array.isArray(payload.fieldErrors.instanceUrl)).toBe(true);
    expect(Array.isArray(payload.fieldErrors.accessToken)).toBe(true);
  });
});
