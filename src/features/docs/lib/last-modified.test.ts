import { describe, expect, it } from "vitest";
import { getDocLastModified } from "./last-modified";

describe("getDocLastModified", () => {
  it("returns the recorded date", () => {
    const date = new Date("2026-10-29T00:46:21.000Z");
    expect(getDocLastModified({ title: "Kubernetes", lastModified: date })).toBe(date);
  });

  it("returns undefined when the build recorded no date", () => {
    expect(getDocLastModified({ title: "Kubernetes" })).toBeUndefined();
    expect(getDocLastModified({ title: "Kubernetes", lastModified: "2026-10-29" })).toBeUndefined();
  });
});
