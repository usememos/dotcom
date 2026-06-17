import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import type { SyncBackend } from "./backend";
import { createMockBackend } from "./backend-mock";
import { hashBlob } from "./blobs";
import type { Clock } from "./clock";
import type { Mutation } from "./types";

const clk = (ts: number, deviceId = "a", counter = 0): Clock => ({ ts, counter, deviceId });
const item = (id: string, body = ""): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});
const createMut = (id: string, c = clk(1)): Mutation => ({ seq: 1, cardId: id, field: "create", value: item(id), clock: c });
const bodyMut = (id: string, body: string, c: Clock, seq = 2): Mutation => ({ seq, cardId: id, field: "body", value: body, clock: c });

export function runBackendContract(makeBackend: () => SyncBackend): void {
  describe("SyncBackend contract", () => {
    it("returns pushed cards on a fresh pull and advances the cursor", async () => {
      const be = makeBackend();
      const pushed = await be.push({ mutations: [createMut("x")], cursor: null });
      expect(pushed.acked).toEqual([1]);
      const pulled = await be.pull({ cursor: null });
      expect(pulled.changes.map((c) => c.id)).toEqual(["x"]);
      expect(Number(pulled.cursor)).toBeGreaterThan(0);
    });

    it("only returns changes newer than the supplied cursor", async () => {
      const be = makeBackend();
      const first = await be.push({ mutations: [createMut("x")], cursor: null });
      const second = await be.pull({ cursor: first.cursor });
      expect(second.changes).toEqual([]);
    });

    it("applies LWW: an older body loses to a newer one regardless of push order", async () => {
      const be = makeBackend();
      await be.push({ mutations: [createMut("x", clk(1))], cursor: null });
      await be.push({ mutations: [bodyMut("x", "new", clk(50, "b"))], cursor: null });
      await be.push({ mutations: [bodyMut("x", "old", clk(10, "a"))], cursor: null });
      const pulled = await be.pull({ cursor: null });
      expect(pulled.changes.find((c) => c.id === "x")?.content.body).toBe("new");
    });

    it("stores and retrieves blobs by hash", async () => {
      const be = makeBackend();
      expect(await be.hasBlob("h1")).toBe(false);
      await be.putBlob("h1", new Blob(["x"]));
      expect(await be.hasBlob("h1")).toBe(true);
      expect(await hashBlob(await be.getBlob("h1"))).toBe(await hashBlob(new Blob(["x"])));
    });
  });
}

runBackendContract(() => createMockBackend());
