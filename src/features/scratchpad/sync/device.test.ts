import { describe, expect, it } from "vitest";
import { getOrCreateDeviceId } from "./device";

describe("getOrCreateDeviceId", () => {
  it("creates a stable id and reuses it on subsequent calls", () => {
    const first = getOrCreateDeviceId();
    expect(first).toMatch(/^[0-9a-f-]{36}$/);
    expect(getOrCreateDeviceId()).toBe(first);
  });
});
