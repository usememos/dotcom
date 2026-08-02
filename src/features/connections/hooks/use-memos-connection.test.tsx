import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: null as {
    unsafeMetadata: Record<string, unknown>;
    reload: () => Promise<unknown>;
    updateMetadata: () => Promise<unknown>;
  } | null,
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
    const user = {
      unsafeMetadata: { memos: { instanceUrl: "https://memos.example.com", accessToken: "tok" } },
      reload: vi.fn(),
      updateMetadata: vi.fn(),
    };
    user.reload.mockResolvedValue(user);
    mocks.user = user;
    const { result } = renderHook(() => useMemosConnection());
    expect(result.current.credentials).toEqual({ instanceUrl: "https://memos.example.com", accessToken: "tok" });
    expect(result.current.isConnected).toBe(true);
    expect(result.current.instanceUrl).toBe("https://memos.example.com");
  });

  it("is not connected when the memos metadata is absent or malformed", () => {
    const user = { unsafeMetadata: {}, reload: vi.fn(), updateMetadata: vi.fn() };
    user.reload.mockResolvedValue(user);
    mocks.user = user;
    expect(renderHook(() => useMemosConnection()).result.current.isConnected).toBe(false);

    mocks.user = { ...user, unsafeMetadata: { memos: { instanceUrl: "", accessToken: "" } } };
    expect(renderHook(() => useMemosConnection()).result.current.credentials).toBeNull();
  });

  it("reflects Clerk loaded/signed-in flags", () => {
    mocks.isSignedIn = false;
    const { result } = renderHook(() => useMemosConnection());
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.credentials).toBeNull();
  });

  it("writes and removes only the unsafe memos key through Clerk's metadata endpoint", async () => {
    const updateMetadata = vi.fn(async () => undefined);
    const user = { unsafeMetadata: {}, reload: vi.fn(), updateMetadata };
    user.reload.mockResolvedValue(user);
    mocks.user = user;
    const { result, rerender } = renderHook(() => useMemosConnection());

    await act(() => result.current.save({ instanceUrl: "https://memos.example.com", accessToken: "tok" }));
    expect(updateMetadata).toHaveBeenLastCalledWith({
      unsafeMetadata: { memos: { instanceUrl: "https://memos.example.com", accessToken: "tok" } },
    });

    user.unsafeMetadata = { memos: { instanceUrl: "https://memos.example.com", accessToken: "tok" } };
    rerender();
    await act(() => result.current.disconnect());
    expect(updateMetadata).toHaveBeenLastCalledWith({ unsafeMetadata: { memos: null } });
  });

  it("reloads and refuses to overwrite a connection changed in another page", async () => {
    const original = { instanceUrl: "https://old.example.com", accessToken: "old" };
    const latest = { instanceUrl: "https://new.example.com", accessToken: "new" };
    const user = { unsafeMetadata: { memos: original }, reload: vi.fn(), updateMetadata: vi.fn() };
    user.reload.mockImplementation(async () => {
      user.unsafeMetadata = { memos: latest };
      return user;
    });
    mocks.user = user;
    const { result } = renderHook(() => useMemosConnection());

    await expect(result.current.save({ instanceUrl: "https://mine.example.com", accessToken: "mine" })).rejects.toMatchObject({
      name: "MemosConnectionConflictError",
    });
    expect(user.updateMetadata).not.toHaveBeenCalled();
  });
});
