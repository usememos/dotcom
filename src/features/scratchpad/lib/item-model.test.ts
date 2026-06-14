import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import {
  createScratchpadItem,
  getScratchpadCardTone,
  normalizeScratchpadItem,
  normalizeScratchpadItems,
  patchScratchpadItem,
} from "./item-model";

describe("getScratchpadCardTone", () => {
  it("defaults to yellow and honors an explicit tone", () => {
    expect(getScratchpadCardTone({ tone: undefined })).toBe("yellow");
    expect(getScratchpadCardTone({ tone: "green" })).toBe("green");
  });
});

describe("createScratchpadItem", () => {
  it("creates a text item with text dimensions and a unique id", () => {
    const item = createScratchpadItem(10, 20, 3);
    expect(item.layout).toMatchObject({ x: 10, y: 20, width: 280, height: 180, zIndex: 3 });
    expect(item.content).toEqual({ body: "", attachments: [] });
    expect(item.id).toMatch(/^item-/);
  });

  it("uses attachment dimensions when attachments are supplied", () => {
    const item = createScratchpadItem(0, 0, 1, [{ id: "f1", name: "a", type: "image/png", size: 1 }]);
    expect(item.layout.width).toBe(320);
    expect(item.layout.height).toBe(300);
    expect(item.content.attachments).toHaveLength(1);
  });
});

describe("normalizeScratchpadItem", () => {
  it("normalizes a grouped (current) item, defaulting zIndex from the index", () => {
    const grouped = {
      id: "item-x",
      layout: { x: 1, y: 2, width: 100, height: 100, zIndex: undefined as unknown as number },
      content: { body: "hi", attachments: [] },
      timestamps: { createdAt: "2026-01-01T00:00:00Z" },
    };
    const result = normalizeScratchpadItem(grouped, 4);
    expect(result.layout.zIndex).toBe(5);
    expect(result.content.body).toBe("hi");
    expect(result.timestamps.createdAt).toBeInstanceOf(Date);
    expect(result.timestamps.updatedAt).toEqual(result.timestamps.createdAt);
  });

  it("normalizes a legacy text item (flat fields, string content)", () => {
    const legacy = { id: "old-1", x: 5, y: 6, width: 200, height: 150, type: "text" as const, content: "legacy body" };
    const result = normalizeScratchpadItem(legacy, 0);
    expect(result.content.body).toBe("legacy body");
    expect(result.layout).toMatchObject({ x: 5, y: 6, zIndex: 1 });
  });

  it("derives an attachment from a legacy file item's fileRef", () => {
    const legacy = {
      id: "old-2",
      type: "file" as const,
      x: 0,
      y: 0,
      width: 320,
      height: 200,
      fileRef: { id: "blob-1", name: "pic.png", type: "image/png", size: 10 },
    };
    const result = normalizeScratchpadItem(legacy);
    expect(result.content.attachments).toEqual([{ id: "blob-1", name: "pic.png", type: "image/png", size: 10 }]);
  });
});

describe("normalizeScratchpadItems", () => {
  it("normalizes a list, assigning ascending default zIndexes", () => {
    const result = normalizeScratchpadItems([
      { id: "a", x: 0, y: 0, type: "text", content: "" },
      { id: "b", x: 0, y: 0, type: "text", content: "" },
    ]);
    expect(result.map((item) => item.layout.zIndex)).toEqual([1, 2]);
  });
});

describe("patchScratchpadItem", () => {
  const base: ScratchpadItem = {
    id: "item-1",
    layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
    content: { body: "a", attachments: [] },
    timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
  };

  it("merges layout/content/timestamps and sets tone", () => {
    const patched = patchScratchpadItem(base, { layout: { x: 99 }, content: { body: "b" }, tone: "pink" });
    expect(patched.layout).toEqual({ x: 99, y: 0, width: 280, height: 180, zIndex: 1 });
    expect(patched.content.body).toBe("b");
    expect(patched.tone).toBe("pink");
  });

  it("leaves untouched sections referentially equal", () => {
    const patched = patchScratchpadItem(base, { layout: { x: 1 } });
    expect(patched.content).toBe(base.content);
  });
});
