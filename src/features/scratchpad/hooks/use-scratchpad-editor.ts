"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  createScratchpadEditorState,
  createScratchpadItem,
  getNextScratchpadZIndex,
  getScratchpadItem,
  type ScratchpadEditorOperation,
  type ScratchpadTransactionPersistence,
  scratchpadEditorReducer,
} from "@/features/scratchpad/lib/editor";
import { calculateScratchpadItemLayout } from "@/features/scratchpad/lib/item-positioning";
import { clampScratchpadScale, DEFAULT_SCRATCHPAD_VIEWPORT } from "@/features/scratchpad/lib/viewport";
import { createMockBackend } from "@/features/scratchpad/sync/backend-mock";
import { hashBlob, putLocalBlob } from "@/features/scratchpad/sync/blobs";
import { getOrCreateDeviceId } from "@/features/scratchpad/sync/device";
import { createSyncEngine, type SyncEngine } from "@/features/scratchpad/sync/engine";
import { runScratchpadMigration } from "@/features/scratchpad/sync/migration";
import { isCardDeleted } from "@/features/scratchpad/sync/reconcile";
import { getAllStoredCards, getMeta, setMeta } from "@/features/scratchpad/sync/store";
import type { StoredCard } from "@/features/scratchpad/sync/types";
import type {
  ScratchpadAttachmentRef,
  ScratchpadItem,
  ScratchpadItemLayout,
  ScratchpadItemPatch,
  ScratchpadViewport,
} from "@/features/scratchpad/types";

const BROADCAST_CHANNEL = "memos-scratch-sync";

type ViewportUpdater = ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport);

interface CardsBroadcast {
  upserts: ScratchpadItem[];
  removedIds: string[];
}

function toScratchpadItem(card: StoredCard): ScratchpadItem {
  return {
    id: card.id,
    layout: card.layout,
    content: card.content,
    timestamps: card.timestamps,
    ...(card.tone ? { tone: card.tone } : {}),
  };
}

async function persistUploadedFile(file: File | Blob): Promise<ScratchpadAttachmentRef> {
  const name = file instanceof File ? file.name : "untitled";
  const type = file.type || "application/octet-stream";
  const hash = await hashBlob(file);
  await putLocalBlob({ hash, name, type, size: file.size, blob: file });
  return { id: `att-${hash}`, name, type, size: file.size, hash };
}

export function useScratchpadEditor() {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(scratchpadEditorReducer, undefined, createScratchpadEditorState);
  const stateRef = useRef(state);
  const viewportRef = useRef(state.viewport);
  const nextTransactionIdRef = useRef(1);
  const engineRef = useRef<SyncEngine | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    viewportRef.current = state.viewport;
  }, [state.viewport]);

  // Mount: migrate once, hydrate from IndexedDB, start the engine, listen cross-tab.
  useEffect(() => {
    let active = true;
    const deviceId = getOrCreateDeviceId();
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(BROADCAST_CHANNEL) : null;
    channelRef.current = channel;

    const applyBroadcast = (payload: CardsBroadcast) => {
      dispatch({ type: "merge-cards", upserts: payload.upserts, removedIds: payload.removedIds });
    };
    if (channel) channel.onmessage = (event: MessageEvent<CardsBroadcast>) => applyBroadcast(event.data);

    const engine = createSyncEngine({
      backend: createMockBackend(),
      deviceId,
      onCardsChanged: (cards) => {
        const removedIds = cards.filter(isCardDeleted).map((c) => c.id);
        const upserts = cards.filter((c) => !isCardDeleted(c)).map(toScratchpadItem);
        const payload: CardsBroadcast = { upserts, removedIds };
        applyBroadcast(payload);
        channel?.postMessage(payload);
      },
    });
    engineRef.current = engine;

    const boot = async () => {
      await runScratchpadMigration(deviceId);
      const cards = await getAllStoredCards();
      const items = cards.filter((c) => !isCardDeleted(c)).map(toScratchpadItem);
      const savedViewport = (await getMeta<ScratchpadViewport>("viewport")) ?? DEFAULT_SCRATCHPAD_VIEWPORT;
      if (!active) return;
      dispatch({
        type: "hydrate",
        items,
        viewport: { ...savedViewport, scale: clampScratchpadScale(savedViewport.scale) },
      });
      setIsClient(true);
      await engine.start();
      engine.requestSync(); // initial pull-on-load (debounced)
    };
    void boot();

    return () => {
      active = false;
      engine.stop();
      channel?.close();
      engineRef.current = null;
      channelRef.current = null;
    };
  }, []);

  // Device-local viewport persists to meta (never synced).
  useEffect(() => {
    if (!isClient) return;
    const timeoutId = window.setTimeout(() => {
      void setMeta("viewport", stateRef.current.viewport);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [isClient, state.viewport]);

  const runTransaction = (
    reason: string,
    operations: ScratchpadEditorOperation[],
    persistence: ScratchpadTransactionPersistence = "debounced",
  ) => {
    if (operations.length === 0) return;
    dispatch({ type: "run-transaction", id: nextTransactionIdRef.current, reason, persistence, operations });
    nextTransactionIdRef.current += 1;
  };

  const setViewport = (updater: ViewportUpdater) => {
    const nextViewport = typeof updater === "function" ? updater(stateRef.current.viewport) : updater;
    runTransaction(
      "viewport.set",
      [{ type: "set-viewport", viewport: { ...nextViewport, scale: clampScratchpadScale(nextViewport.scale) } }],
      "debounced",
    );
  };

  const patchItem = (
    id: string,
    patch: ScratchpadItemPatch,
    persistence: ScratchpadTransactionPersistence = "debounced",
    reason: string = "item.patch",
  ) => {
    runTransaction(reason, [{ type: "patch-item", id, patch }], persistence);
  };

  const createPositionedItem = (x: number, y: number, attachments: ScratchpadAttachmentRef[] = []) => {
    const zIndex = getNextScratchpadZIndex(stateRef.current.document.items);
    const item = createScratchpadItem(x, y, zIndex, attachments);
    return {
      ...item,
      layout: calculateScratchpadItemLayout({
        x,
        y,
        hasAttachments: attachments.length > 0,
        viewport: viewportRef.current,
        viewportSize: { width: window.innerWidth, height: window.innerHeight },
        zIndex,
      }),
    };
  };

  const createTextItem = (x: number, y: number) => {
    const item = createPositionedItem(x, y);
    runTransaction("item.create", [{ type: "add-item", item }], "immediate");
    void engineRef.current?.recordMutation({ cardId: item.id, field: "create", value: item });
  };

  const updateItemLayout = (id: string, updates: Partial<ScratchpadItemLayout>) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    const layout = { ...item.layout, ...updates };
    patchItem(id, { layout: updates }, "immediate", "item.layout");
    void engineRef.current?.recordMutation({ cardId: id, field: "layout", value: layout });
  };

  const updateItemBody = (id: string, body: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    patchItem(id, { content: { body }, timestamps: { updatedAt: new Date() } }, "debounced", "item.body");
    void engineRef.current?.recordMutation({ cardId: id, field: "body", value: body });
  };

  const deleteItems = async (ids: string[]) => {
    // Commit the tombstones before removing the cards from the in-memory view, so
    // a concurrent sync's mergeChanges never reads a still-live card and echoes it
    // back as an upsert (a transient "ghost" of a card the user just deleted).
    await Promise.all(ids.map((id) => engineRef.current?.recordMutation({ cardId: id, field: "delete", value: null })));
    runTransaction("item.delete", [{ type: "delete-items", ids }], "immediate");
  };

  const deleteItem = async (id: string) => {
    await deleteItems([id]);
  };

  const removeAttachment = async (id: string, attachmentId: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    const attachments = item.content.attachments.filter((a) => a.id !== attachmentId);
    patchItem(id, { content: { attachments }, timestamps: { updatedAt: new Date() } }, "immediate", "item.remove-attachment");
    await engineRef.current?.recordMutation({ cardId: id, field: "attachments", value: attachments });
  };

  const uploadFiles = async (files: FileList, x: number, y: number, targetItemId?: string) => {
    const refs: ScratchpadAttachmentRef[] = [];
    for (const file of Array.from(files)) refs.push(await persistUploadedFile(file));

    if (targetItemId) {
      const target = getScratchpadItem(stateRef.current.document.items, targetItemId);
      if (target) {
        const attachments = [...target.content.attachments, ...refs];
        patchItem(targetItemId, { content: { attachments }, timestamps: { updatedAt: new Date() } }, "immediate", "item.attach-files");
        await engineRef.current?.recordMutation({ cardId: targetItemId, field: "attachments", value: attachments });
        return;
      }
    }

    const item = createPositionedItem(x, y, refs);
    runTransaction("item.create-with-files", [{ type: "add-item", item }], "immediate");
    await engineRef.current?.recordMutation({ cardId: item.id, field: "create", value: item });
  };

  const selectItem = (id: string | null, additive: boolean = false) => {
    if (id === null) {
      runTransaction("selection.clear", [{ type: "clear-selection" }], "none");
      return;
    }
    runTransaction("selection.set", [{ type: "select-item", id, additive }], "none");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((e.key === "Delete" || e.key === "Backspace") && stateRef.current.selectedItemIds.length > 0 && !isTyping) {
        e.preventDefault();
        void deleteItems(stateRef.current.selectedItemIds);
      }

      if (e.key === "Escape") {
        runTransaction("selection.clear", [{ type: "clear-selection" }], "none");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isClient,
    items: state.document.items,
    selectedItemIds: state.selectedItemIds,
    lastActiveItemId: state.lastActiveItemId,
    viewport: state.viewport,
    setViewport,
    patchItem,
    createTextItem,
    updateItemBody,
    updateItemLayout,
    uploadFiles,
    removeAttachment,
    deleteItem,
    deleteItems,
    selectItem,
    clearSelection: () => runTransaction("selection.clear", [{ type: "clear-selection" }], "none"),
  };
}
