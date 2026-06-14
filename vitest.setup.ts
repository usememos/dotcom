import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { cleanup } from "@testing-library/react";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach } from "vitest";

// Node 25 ships a global Web Storage that is misconfigured here (no backing
// file) and shadows jsdom's Storage, leaving window.localStorage as a method-less
// object. Install a real in-memory Storage so localStorage-backed code is testable.
class MemoryStorage implements Storage {
  #store = new Map<string, string>();
  get length(): number {
    return this.#store.size;
  }
  clear(): void {
    this.#store.clear();
  }
  getItem(key: string): string | null {
    return this.#store.has(key) ? (this.#store.get(key) as string) : null;
  }
  key(index: number): string | null {
    return Array.from(this.#store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.#store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.#store.set(String(key), String(value));
  }
}

Object.defineProperty(globalThis, "localStorage", { value: new MemoryStorage(), configurable: true, writable: true });
Object.defineProperty(globalThis, "sessionStorage", { value: new MemoryStorage(), configurable: true, writable: true });

// Fresh IndexedDB per test so storage suites are isolated.
beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

// RTL only auto-registers cleanup when Vitest globals are enabled; we keep
// globals off and use explicit imports, so unmount + reset storage between tests.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

// --- jsdom gaps used by scratchpad code ---

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

// jsdom lacks object URLs; provide deterministic stubs (tests may spy on these).
let objectUrlCounter = 0;
URL.createObjectURL = () => `blob:mock/${objectUrlCounter++}`;
URL.revokeObjectURL = () => {};

// Pointer capture is unimplemented in jsdom; back it with a stateful WeakMap
// so hasPointerCapture reflects set/release calls.
const capturedPointers = new WeakMap<Element, Set<number>>();
Element.prototype.setPointerCapture = function setPointerCapture(pointerId: number) {
  const set = capturedPointers.get(this) ?? new Set<number>();
  set.add(pointerId);
  capturedPointers.set(this, set);
};
Element.prototype.releasePointerCapture = function releasePointerCapture(pointerId: number) {
  capturedPointers.get(this)?.delete(pointerId);
};
Element.prototype.hasPointerCapture = function hasPointerCapture(pointerId: number) {
  return capturedPointers.get(this)?.has(pointerId) ?? false;
};
