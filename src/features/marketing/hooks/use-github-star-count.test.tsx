import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatGithubStarCount, useGithubStarCount } from "./use-github-star-count";

const CACHE_KEY = "memos:github-stars:v1";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

describe("formatGithubStarCount", () => {
  it.each([
    [999, "999"],
    [1_000, "1K"],
    [59_849, "59.8K"],
    [60_000, "60K"],
    [60_050, "60.1K"],
    [1_240_000, "1.2M"],
  ])("formats %i as %s", (count, expected) => {
    expect(formatGithubStarCount(count)).toBe(expected);
  });
});

describe("useGithubStarCount", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("uses a fresh one-day cache without requesting the star service", async () => {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ count: 59_849, fetchedAt: Date.now() }));

    const { result } = renderHook(() => useGithubStarCount());

    await waitFor(() => expect(result.current).toBe("59.8K"));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows stale cache while refreshing it from the star service", async () => {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ count: 59_849, fetchedAt: Date.now() - ONE_DAY_MS - 1 }));
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ value: "60.1k" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const { result } = renderHook(() => useGithubStarCount());

    await waitFor(() => expect(result.current).toBe("59.8K"));
    await act(async () => {
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current).toBe("60.1K"));
    expect(JSON.parse(String(window.localStorage.getItem(CACHE_KEY)))).toMatchObject({ count: 60_100 });
  });

  it("keeps the placeholder when the star service cannot be reached", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));

    const { result } = renderHook(() => useGithubStarCount());

    expect(result.current).toBe("60K+");
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    expect(result.current).toBe("60K+");
  });
});
