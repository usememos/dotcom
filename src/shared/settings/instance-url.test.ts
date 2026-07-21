import { describe, expect, it } from "vitest";
import { MAX_INSTANCE_URL_LENGTH, normalizeInstanceUrl, parseInstanceUrl } from "./instance-url";

describe("normalizeInstanceUrl", () => {
  it("normalizes valid input to the instance origin", () => {
    expect(normalizeInstanceUrl("https://memos.example.com/")).toBe("https://memos.example.com");
    expect(normalizeInstanceUrl("https://example.com/setting?tab=access-token")).toBe("https://example.com");
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

  it("rejects URLs beyond the stored length limit", () => {
    expect(normalizeInstanceUrl(`https://example.com/${"a".repeat(MAX_INSTANCE_URL_LENGTH)}`)).toBeNull();
  });

  it("parseInstanceUrl returns a URL for valid input", () => {
    expect(parseInstanceUrl("https://memos.example.com/setting")?.origin).toBe("https://memos.example.com");
    expect(parseInstanceUrl("nope")).toBeNull();
  });
});
