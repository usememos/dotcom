import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

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

// RTL only auto-registers cleanup when Vitest globals are enabled; we keep
// globals off and use explicit imports, so unmount + reset storage between tests.
afterEach(() => {
  cleanup();
  globalThis.localStorage.clear();
});

// jsdom does not implement matchMedia, which the docs navigation uses.
if (typeof window !== "undefined" && !window.matchMedia) {
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
