import { describe, expect, it } from "vitest";
import { describeInstanceError, InstanceError } from "./errors";

describe("errors", () => {
  it("InstanceError carries its kind", () => {
    const err = new InstanceError("cors");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("InstanceError");
    expect(err.kind).toBe("cors");
  });

  it("cors detail embeds the page origin and a reverse-proxy hint", () => {
    const detail = describeInstanceError("cors", { origin: "https://www.usememos.com" });
    expect(detail.kind).toBe("cors");
    expect(detail.title.length).toBeGreaterThan(0);
    expect(detail.howToFix.some((step) => step.includes("https://www.usememos.com"))).toBe(true);
    expect(detail.howToFix.some((step) => step.includes("Access-Control-Allow-Origin"))).toBe(true);
  });

  it("mixed-content explains the https→http block", () => {
    const detail = describeInstanceError("mixed-content");
    expect(detail.why.toLowerCase()).toContain("https");
  });

  it("unsupported-version names the version and the latest supported one", () => {
    const detail = describeInstanceError("unsupported-version", { instanceVersion: "0.40.0", latestSupportedVersion: "0.29.1" });
    expect(detail.why).toContain("0.40.0");
    expect(detail.howToFix.join(" ")).toContain("0.29.1");
  });

  it("every kind produces non-empty title/why/howToFix", () => {
    const kinds = ["mixed-content", "cors", "unreachable", "unauthorized", "timeout", "bad-response", "unsupported-version"] as const;
    for (const kind of kinds) {
      const d = describeInstanceError(kind);
      expect(d.title).toBeTruthy();
      expect(d.why).toBeTruthy();
      expect(d.howToFix.length).toBeGreaterThan(0);
    }
  });
});
