import assert from "node:assert/strict";
import test from "node:test";
import { createScratchpadItem, normalizeScratchpadItem } from "./item-model.ts";

test("legacy flat item normalizes to grouped item fields", () => {
  const createdAt = "2026-01-01T00:00:00.000Z";
  const updatedAt = "2026-01-02T00:00:00.000Z";
  const item = normalizeScratchpadItem(
    {
      id: "legacy-item",
      x: 12,
      y: 24,
      width: 320,
      height: 180,
      body: "Legacy content",
      attachments: [{ id: "file-1", name: "note.txt", type: "text/plain", size: 128 }],
      createdAt,
      updatedAt,
      sync: {
        status: "synced",
        lastSyncedAt: "2026-01-03T00:00:00.000Z",
      },
    },
    4,
  );

  assert.deepEqual(item.layout, {
    x: 12,
    y: 24,
    width: 320,
    height: 180,
    zIndex: 5,
  });
  assert.deepEqual(item.content, {
    body: "Legacy content",
    attachments: [{ id: "file-1", name: "note.txt", type: "text/plain", size: 128 }],
  });
  assert.equal(item.sync.status, "synced");
  assert.ok(item.sync.lastSyncedAt instanceof Date);
  assert.ok(item.timestamps.createdAt instanceof Date);
  assert.ok(item.timestamps.updatedAt instanceof Date);
  assert.equal(item.timestamps.createdAt.toISOString(), createdAt);
  assert.equal(item.timestamps.updatedAt.toISOString(), updatedAt);
});

test("grouped item normalizes without data changes", () => {
  const item = {
    id: "grouped-item",
    layout: {
      x: 4,
      y: 8,
      width: 260,
      height: 140,
      zIndex: 7,
    },
    content: {
      body: "Grouped content",
      attachments: [{ id: "file-2", name: "image.png", type: "image/png", size: 256 }],
    },
    sync: {
      instanceId: "instance-1",
      memoRef: { resourceName: "memos/1" },
      status: "dirty",
      lastSyncedAt: new Date("2026-02-01T00:00:00.000Z"),
      lastError: "Retry later",
    },
    timestamps: {
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    },
    tone: "blue",
  };

  assert.deepEqual(normalizeScratchpadItem(item), item);
});

test("createScratchpadItem returns grouped default content/timestamps", () => {
  const item = createScratchpadItem(32, 64, 3);
  const attachmentItem = createScratchpadItem(48, 96, 4, [{ id: "file-3", name: "photo.jpg", type: "image/jpeg", size: 512 }]);

  assert.equal(item.id.length > 0, true);
  assert.deepEqual(item.layout, {
    x: 32,
    y: 64,
    width: 280,
    height: 180,
    zIndex: 3,
  });
  assert.deepEqual(attachmentItem.layout, {
    x: 48,
    y: 96,
    width: 320,
    height: 300,
    zIndex: 4,
  });
  assert.deepEqual(item.content, {
    body: "",
    attachments: [],
  });
  assert.deepEqual(attachmentItem.content, {
    body: "",
    attachments: [{ id: "file-3", name: "photo.jpg", type: "image/jpeg", size: 512 }],
  });
  assert.deepEqual(item.sync, {
    status: "local",
  });
  assert.ok(item.timestamps.createdAt instanceof Date);
  assert.ok(item.timestamps.updatedAt instanceof Date);
  assert.equal(item.timestamps.createdAt.toISOString(), item.timestamps.updatedAt.toISOString());
});

test("invalid date strings normalize to fallback dates", () => {
  const item = normalizeScratchpadItem({
    id: "invalid-dates",
    x: 0,
    y: 0,
    width: 280,
    height: 180,
    zIndex: 1,
    createdAt: "not a date",
    updatedAt: "also not a date",
    sync: {
      status: "synced",
      lastSyncedAt: "still not a date",
    },
  });

  assert.notEqual(item.timestamps.createdAt.toString(), "Invalid Date");
  assert.equal(item.timestamps.updatedAt.toISOString(), item.timestamps.createdAt.toISOString());
  assert.ok(item.sync.lastSyncedAt instanceof Date);
  assert.notEqual(item.sync.lastSyncedAt.toString(), "Invalid Date");
});
