import { describe, expect, it } from "vitest";
import { normalizeInstanceUrl, parseInstanceUrl } from "./instance-url";

describe("normalizeInstanceUrl", () => {
  it("strips trailing slashes and keeps a subpath", () => {
    expect(normalizeInstanceUrl("https://memos.example.com/")).toBe("https://memos.example.com");
    expect(normalizeInstanceUrl("https://example.com/memos/")).toBe("https://example.com/memos");
    expect(normalizeInstanceUrl("  https://memos.example.com  ")).toBe("https://memos.example.com");
  });

  it("allows localhost and private/LAN hosts (the browser makes the request)", () => {
    expect(normalizeInstanceUrl("http://localhost:5230")).toBe("http://localhost:5230");
    expect(normalizeInstanceUrl("http://192.168.1.50:5230")).toBe("http://192.168.1.50:5230");
  });

  it("rejects non-http(s) and unparseable URLs", () => {
    expect(normalizeInstanceUrl("ftp://memos.example.com")).toBeNull();
    expect(normalizeInstanceUrl("memos.example.com")).toBeNull();
    expect(normalizeInstanceUrl("not a url")).toBeNull();
    expect(normalizeInstanceUrl("")).toBeNull();
  });

  it("parseInstanceUrl returns a URL for valid input", () => {
    expect(parseInstanceUrl("https://memos.example.com/setting")?.origin).toBe("https://memos.example.com");
    expect(parseInstanceUrl("nope")).toBeNull();
  });
});
