import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the success state for the full interval after the latest copy", async () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard(2000));

    await act(() => result.current.copy("first"));
    act(() => vi.advanceTimersByTime(1500));
    await act(() => result.current.copy("second"));
    act(() => vi.advanceTimersByTime(500));

    expect(result.current.copied).toBe(true);

    act(() => vi.advanceTimersByTime(1500));
    expect(result.current.copied).toBe(false);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
