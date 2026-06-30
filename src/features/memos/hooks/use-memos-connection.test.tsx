import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: null as { unsafeMetadata: Record<string, unknown>; update: () => Promise<unknown> } | null,
  isLoaded: true,
  isSignedIn: true,
}));

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({ user: mocks.user, isLoaded: mocks.isLoaded, isSignedIn: mocks.isSignedIn }),
}));

import { useMemosConnection } from "./use-memos-connection";

beforeEach(() => {
  mocks.user = null;
  mocks.isLoaded = true;
  mocks.isSignedIn = true;
});

describe("useMemosConnection", () => {
  it("derives credentials from unsafeMetadata.memos", () => {
    mocks.user = { unsafeMetadata: { memos: { instanceUrl: "https://memos.example.com", accessToken: "tok" } }, update: vi.fn() };
    const { result } = renderHook(() => useMemosConnection());
    expect(result.current.credentials).toEqual({ instanceUrl: "https://memos.example.com", accessToken: "tok" });
    expect(result.current.isConnected).toBe(true);
    expect(result.current.instanceUrl).toBe("https://memos.example.com");
  });

  it("is not connected when the memos metadata is absent or malformed", () => {
    mocks.user = { unsafeMetadata: {}, update: vi.fn() };
    expect(renderHook(() => useMemosConnection()).result.current.isConnected).toBe(false);

    mocks.user = { unsafeMetadata: { memos: { instanceUrl: "", accessToken: "" } }, update: vi.fn() };
    expect(renderHook(() => useMemosConnection()).result.current.credentials).toBeNull();
  });

  it("reflects Clerk loaded/signed-in flags", () => {
    mocks.isSignedIn = false;
    const { result } = renderHook(() => useMemosConnection());
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.credentials).toBeNull();
  });
});
