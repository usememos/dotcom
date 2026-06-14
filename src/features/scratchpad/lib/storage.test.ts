import { afterEach, describe, expect, it, vi } from "vitest";
import type { ScratchpadItem } from "../types";
import { formatBytes, getStorageQuota, itemStorage, settingsStorage, viewportStorage } from "./storage";

const ITEMS_KEY = "memos-scratch-items";

const makeItem = (id: string, createdAt = new Date()): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: id, attachments: [] },
  timestamps: { createdAt, updatedAt: createdAt },
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("itemStorage", () => {
  it("round-trips items through the v3 envelope", () => {
    itemStorage.save([makeItem("a")]);
    const raw = JSON.parse(localStorage.getItem(ITEMS_KEY) as string);
    expect(raw.version).toBe(3);
    expect(itemStorage.getAll().map((i) => i.id)).toEqual(["a"]);
  });

  it("returns [] when nothing is stored", () => {
    expect(itemStorage.getAll()).toEqual([]);
  });

  it("migrates a legacy array payload and rewrites it as v3", () => {
    localStorage.setItem(
      ITEMS_KEY,
      JSON.stringify([{ id: "legacy", type: "text", x: 0, y: 0, width: 200, height: 150, content: "hi", createdAt: "2026-01-01" }]),
    );
    const items = itemStorage.getAll();
    expect(items[0].id).toBe("legacy");
    expect(JSON.parse(localStorage.getItem(ITEMS_KEY) as string).version).toBe(3);
  });

  it("add / update / remove mutate the stored list", () => {
    itemStorage.add(makeItem("a"));
    itemStorage.update("a", { content: { body: "updated" } });
    expect(itemStorage.getAll()[0].content.body).toBe("updated");
    itemStorage.remove("a");
    expect(itemStorage.getAll()).toEqual([]);
  });

  it("update throws when the item is missing", () => {
    expect(() => itemStorage.update("ghost", { content: { body: "x" } })).toThrow("Item not found");
  });

  it("clearOld drops items older than the cutoff", () => {
    itemStorage.save([makeItem("old", new Date("2020-01-01")), makeItem("new", new Date())]);
    itemStorage.clearOld(30);
    expect(itemStorage.getAll().map((i) => i.id)).toEqual(["new"]);
  });

  it("recovers from malformed JSON by returning []", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem(ITEMS_KEY, "{not json");
    expect(itemStorage.getAll()).toEqual([]);
  });
});

describe("viewportStorage", () => {
  it("returns the default viewport when absent", () => {
    expect(viewportStorage.get()).toEqual({ x: 0, y: 0, scale: 1 });
  });
  it("round-trips a saved viewport", () => {
    viewportStorage.save({ x: 10, y: 20, scale: 1.5 });
    expect(viewportStorage.get()).toEqual({ x: 10, y: 20, scale: 1.5 });
  });
  it("falls back to defaults on malformed data and clears the key", () => {
    localStorage.setItem("memos-scratch-viewport", "{bad");
    expect(viewportStorage.get()).toEqual({ x: 0, y: 0, scale: 1 });
    expect(localStorage.getItem("memos-scratch-viewport")).toBeNull();
  });
});

describe("settingsStorage", () => {
  it("tracks first visit", () => {
    expect(settingsStorage.isFirstVisit()).toBe(true);
    settingsStorage.setNotFirstVisit();
    expect(settingsStorage.isFirstVisit()).toBe(false);
  });
  it("stores and reads typed settings with a default", () => {
    expect(settingsStorage.getSetting("grid", true)).toBe(true);
    settingsStorage.setSetting("grid", false);
    expect(settingsStorage.getSetting("grid", true)).toBe(false);
  });
});

describe("formatBytes", () => {
  it("formats common magnitudes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
  });
});

describe("getStorageQuota", () => {
  it("returns zeros when navigator.storage is unavailable", async () => {
    const original = navigator.storage;
    Object.defineProperty(navigator, "storage", { value: undefined, configurable: true });
    expect(await getStorageQuota()).toEqual({ usage: 0, quota: 0, percentage: 0 });
    Object.defineProperty(navigator, "storage", { value: original, configurable: true });
  });

  it("computes a percentage from the storage estimate", async () => {
    const estimate = vi.fn().mockResolvedValue({ usage: 50, quota: 200 });
    Object.defineProperty(navigator, "storage", { value: { estimate }, configurable: true });
    expect(await getStorageQuota()).toEqual({ usage: 50, quota: 200, percentage: 25 });
  });
});
