import { describe, expect, it, vi } from "vitest";
import {
  beginPointerInteraction,
  beginPointerSession,
  cancelPointerSession,
  createIdlePointerInteractionState,
  createPointerSession,
  finishPointerInteraction,
  finishPointerSession,
  getActivePointerInteraction,
  getActivePointerSession,
  getPointerSessionDelta,
  hasPointerSessionExceededThreshold,
  isPointerSessionActive,
  type PointerSession,
} from "./interactions";

function stubElement(captured = false) {
  return {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => captured),
  } as unknown as HTMLElement;
}

describe("pointer session primitives", () => {
  it("creates a session and detects activity by pointer id", () => {
    const session = createPointerSession(3, 10, 20);
    expect(session).toEqual({ pointerId: 3, startClientX: 10, startClientY: 20 });
    expect(isPointerSessionActive(session, 3)).toBe(true);
    expect(isPointerSessionActive(session, 4)).toBe(false);
    expect(isPointerSessionActive(null, 3)).toBe(false);
  });

  it("computes delta and threshold crossing", () => {
    const session = createPointerSession(1, 0, 0);
    expect(getPointerSessionDelta(session, 3, 4)).toEqual({ x: 3, y: 4 });
    expect(hasPointerSessionExceededThreshold(session, 3, 4, 5)).toBe(true);
    expect(hasPointerSessionExceededThreshold(session, 1, 1, 5)).toBe(false);
  });
});

describe("session store lifecycle", () => {
  it("begins, reads, and finishes a session, releasing capture", () => {
    const store: { current: PointerSession | null } = { current: null };
    const element = stubElement(true);
    const session = beginPointerSession(store, element, createPointerSession(2, 0, 0));

    expect(element.setPointerCapture).toHaveBeenCalledWith(2);
    expect(getActivePointerSession(store, 2)).toBe(session);
    expect(getActivePointerSession(store, 9)).toBeNull();

    const finished = finishPointerSession(store, element, 2);
    expect(finished).toBe(session);
    expect(element.releasePointerCapture).toHaveBeenCalledWith(2);
    expect(store.current).toBeNull();
  });

  it("cancel clears the session without releasing capture", () => {
    const store: { current: PointerSession | null } = { current: createPointerSession(5, 0, 0) };
    expect(cancelPointerSession(store, 5)?.pointerId).toBe(5);
    expect(store.current).toBeNull();
    expect(cancelPointerSession(store, 5)).toBeNull();
  });
});

describe("interaction store lifecycle", () => {
  type Modes = { pan: PointerSession };
  it("tracks a moded interaction and finishes it back to idle", () => {
    const store = { current: createIdlePointerInteractionState<Modes>() };
    const element = stubElement(true);
    beginPointerInteraction(store, element, "pan", createPointerSession(1, 0, 0));

    expect(getActivePointerInteraction(store, "pan", 1)?.pointerId).toBe(1);
    expect(getActivePointerInteraction(store, "pan", 2)).toBeNull();

    finishPointerInteraction(store, element, "pan", 1);
    expect(store.current.mode).toBe("idle");
  });
});
