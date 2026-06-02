"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  createScratchpadEditorState,
  createScratchpadItem,
  getNextScratchpadZIndex,
  getScratchpadItem,
  markScratchpadItemDirty,
  type ScratchpadEditorOperation,
  type ScratchpadTransactionPersistence,
  scratchpadEditorReducer,
} from "@/features/scratchpad/lib/editor";
import { createFileData, deleteFile, saveFile } from "@/features/scratchpad/lib/indexeddb";
import { itemStorage, viewportStorage } from "@/features/scratchpad/lib/storage";
import { clampScratchpadScale } from "@/features/scratchpad/lib/viewport";
import type { ScratchpadAttachmentRef, ScratchpadItemLayout, ScratchpadItemPatch, ScratchpadViewport } from "@/features/scratchpad/types";

type ViewportUpdater = ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport);

const SCRATCHPAD_MIN_ITEM_WIDTH = 220;
const SCRATCHPAD_ITEM_SCREEN_GUTTER = 24;
const SCRATCHPAD_TEXT_ITEM_WIDTH = 280;
const SCRATCHPAD_TEXT_ITEM_HEIGHT = 180;
const SCRATCHPAD_ATTACHMENT_ITEM_WIDTH = 320;
const SCRATCHPAD_ATTACHMENT_ITEM_HEIGHT = 300;
const SCRATCHPAD_ITEM_VERTICAL_OFFSET = 88;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useScratchpadEditor() {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(scratchpadEditorReducer, undefined, createScratchpadEditorState);
  const stateRef = useRef(state);
  const viewportRef = useRef(state.viewport);
  const nextTransactionIdRef = useRef(1);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    viewportRef.current = state.viewport;
  }, [state.viewport]);

  useEffect(() => {
    const savedViewport = viewportStorage.get();

    dispatch({
      type: "hydrate",
      items: itemStorage.getAll(),
      viewport: {
        ...savedViewport,
        scale: clampScratchpadScale(savedViewport.scale),
      },
    });

    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !state.lastTransaction) return;
    if (state.lastTransaction.persistence === "none") return;
    if (!state.lastTransaction.changes.items && !state.lastTransaction.changes.viewport) return;

    const persist = () => {
      itemStorage.save(state.document.items);
      viewportStorage.save(state.viewport);
    };

    if (state.lastTransaction.persistence === "immediate") {
      persist();
      return;
    }

    const timeoutId = window.setTimeout(persist, 300);
    return () => window.clearTimeout(timeoutId);
  }, [isClient, state.document.items, state.lastTransaction, state.viewport]);

  const runTransaction = (
    reason: string,
    operations: ScratchpadEditorOperation[],
    persistence: ScratchpadTransactionPersistence = "debounced",
  ) => {
    if (operations.length === 0) {
      return;
    }

    dispatch({
      type: "run-transaction",
      id: nextTransactionIdRef.current,
      reason,
      persistence,
      operations,
    });
    nextTransactionIdRef.current += 1;
  };

  const setViewport = (updater: ViewportUpdater) => {
    const nextViewport = typeof updater === "function" ? updater(stateRef.current.viewport) : updater;
    runTransaction(
      "viewport.set",
      [
        {
          type: "set-viewport",
          viewport: {
            ...nextViewport,
            scale: clampScratchpadScale(nextViewport.scale),
          },
        },
      ],
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
    const preferredWidth = attachments.length > 0 ? SCRATCHPAD_ATTACHMENT_ITEM_WIDTH : SCRATCHPAD_TEXT_ITEM_WIDTH;
    const preferredHeight = attachments.length > 0 ? SCRATCHPAD_ATTACHMENT_ITEM_HEIGHT : SCRATCHPAD_TEXT_ITEM_HEIGHT;
    const viewport = viewportRef.current;
    const availableWidth = Math.max(
      SCRATCHPAD_MIN_ITEM_WIDTH,
      Math.floor((window.innerWidth - SCRATCHPAD_ITEM_SCREEN_GUTTER * 2) / viewport.scale),
    );
    const width = Math.min(preferredWidth, availableWidth);
    const leftBound = (SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.x) / viewport.scale;
    const topBound = (SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.y) / viewport.scale;
    const rightBound = (window.innerWidth - SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.x) / viewport.scale;
    const bottomBound = (window.innerHeight - SCRATCHPAD_ITEM_SCREEN_GUTTER - viewport.y) / viewport.scale;
    const originX = x - width / 2;
    const originY = y - Math.min(preferredHeight / 2, SCRATCHPAD_ITEM_VERTICAL_OFFSET);
    const clampedX = clamp(originX, leftBound, Math.max(leftBound, rightBound - width));
    const clampedY = clamp(originY, topBound, Math.max(topBound, bottomBound - preferredHeight));
    const item = createScratchpadItem(clampedX, clampedY, getNextScratchpadZIndex(stateRef.current.document.items), attachments);

    return {
      ...item,
      layout: {
        ...item.layout,
        width,
        height: preferredHeight,
      },
    };
  };

  const createTextItem = (x: number, y: number) => {
    runTransaction("item.create", [{ type: "add-item", item: createPositionedItem(x, y) }], "immediate");
  };

  const updateItemLayout = (id: string, updates: Partial<ScratchpadItemLayout>) => {
    patchItem(id, { layout: updates }, "immediate", "item.layout");
  };

  const updateItemBody = (id: string, body: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;

    patchItem(
      id,
      {
        content: { body },
        timestamps: { updatedAt: new Date() },
        sync: markScratchpadItemDirty(item.sync),
      },
      "debounced",
      "item.body",
    );
  };

  const deleteItems = async (ids: string[]) => {
    const deleteSet = new Set(ids);
    const deletedAttachments = stateRef.current.document.items
      .filter((item) => deleteSet.has(item.id))
      .flatMap((item) => item.content.attachments.map((attachment) => attachment.id));

    await Promise.all(deletedAttachments.map((attachmentId) => deleteFile(attachmentId)));
    runTransaction("item.delete", [{ type: "delete-items", ids }], "immediate");
  };

  const deleteItem = async (id: string) => {
    await deleteItems([id]);
  };

  const removeAttachment = async (id: string, attachmentId: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;

    await deleteFile(attachmentId);
    patchItem(
      id,
      {
        content: {
          attachments: item.content.attachments.filter((attachment) => attachment.id !== attachmentId),
        },
        timestamps: { updatedAt: new Date() },
        sync: markScratchpadItemDirty(item.sync),
      },
      "immediate",
      "item.remove-attachment",
    );
  };

  const uploadFiles = async (files: FileList, x: number, y: number, targetItemId?: string) => {
    const attachmentRefs: ScratchpadAttachmentRef[] = [];

    for (const file of Array.from(files)) {
      const fileData = createFileData(file);
      await saveFile(fileData);

      attachmentRefs.push({
        id: fileData.id,
        name: fileData.name,
        type: fileData.type,
        size: fileData.size,
      });
    }

    if (targetItemId) {
      const targetItem = getScratchpadItem(stateRef.current.document.items, targetItemId);
      if (targetItem) {
        patchItem(
          targetItemId,
          {
            content: {
              attachments: [...targetItem.content.attachments, ...attachmentRefs],
            },
            timestamps: { updatedAt: new Date() },
            sync: markScratchpadItemDirty(targetItem.sync),
          },
          "immediate",
          "item.attach-files",
        );
        return;
      }
    }

    runTransaction("item.create-with-files", [{ type: "add-item", item: createPositionedItem(x, y, attachmentRefs) }], "immediate");
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
