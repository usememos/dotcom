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
} from "@/lib/scratch/editor";
import { createFileData, deleteFile, saveFile } from "@/lib/scratch/indexeddb";
import { itemStorage, viewportStorage } from "@/lib/scratch/storage";
import type { ScratchpadAttachmentRef, ScratchpadItem, ScratchpadViewport } from "@/lib/scratch/types";
import { clampScratchpadScale } from "@/lib/scratch/viewport";

type ViewportUpdater = ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport);

export function useScratchpadEditor() {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(scratchpadEditorReducer, undefined, createScratchpadEditorState);
  const stateRef = useRef(state);
  const nextTransactionIdRef = useRef(1);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
      itemStorage.save(state.items);
      viewportStorage.save(state.viewport);
    };

    if (state.lastTransaction.persistence === "immediate") {
      persist();
      return;
    }

    const timeoutId = window.setTimeout(persist, 300);
    return () => window.clearTimeout(timeoutId);
  }, [isClient, state.items, state.lastTransaction, state.viewport]);

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
    patch: Partial<ScratchpadItem>,
    persistence: ScratchpadTransactionPersistence = "debounced",
    reason: string = "item.patch",
  ) => {
    runTransaction(reason, [{ type: "patch-item", id, patch }], persistence);
  };

  const createTextItem = (x: number, y: number) => {
    runTransaction(
      "item.create",
      [{ type: "add-item", item: createScratchpadItem(x, y, getNextScratchpadZIndex(stateRef.current.items)) }],
      "immediate",
    );
  };

  const updateItemLayout = (
    id: string,
    updates: Pick<ScratchpadItem, "x" | "y" | "width" | "height" | "zIndex"> | Partial<ScratchpadItem>,
  ) => {
    patchItem(id, updates, "immediate", "item.layout");
  };

  const updateItemBody = (id: string, body: string) => {
    const item = getScratchpadItem(stateRef.current.items, id);
    if (!item) return;

    patchItem(
      id,
      {
        body,
        updatedAt: new Date(),
        sync: markScratchpadItemDirty(item.sync),
      },
      "debounced",
      "item.body",
    );
  };

  const deleteItems = async (ids: string[]) => {
    const deleteSet = new Set(ids);
    const deletedAttachments = stateRef.current.items
      .filter((item) => deleteSet.has(item.id))
      .flatMap((item) => item.attachments.map((attachment) => attachment.id));

    await Promise.all(deletedAttachments.map((attachmentId) => deleteFile(attachmentId)));
    runTransaction("item.delete", [{ type: "delete-items", ids }], "immediate");
  };

  const deleteItem = async (id: string) => {
    await deleteItems([id]);
  };

  const removeAttachment = async (id: string, attachmentId: string) => {
    const item = getScratchpadItem(stateRef.current.items, id);
    if (!item) return;

    await deleteFile(attachmentId);
    patchItem(
      id,
      {
        attachments: item.attachments.filter((attachment) => attachment.id !== attachmentId),
        updatedAt: new Date(),
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
      const targetItem = getScratchpadItem(stateRef.current.items, targetItemId);
      if (targetItem) {
        patchItem(
          targetItemId,
          {
            attachments: [...targetItem.attachments, ...attachmentRefs],
            updatedAt: new Date(),
            sync: markScratchpadItemDirty(targetItem.sync),
          },
          "immediate",
          "item.attach-files",
        );
        return;
      }
    }

    runTransaction(
      "item.create-with-files",
      [{ type: "add-item", item: createScratchpadItem(x, y, getNextScratchpadZIndex(stateRef.current.items), attachmentRefs) }],
      "immediate",
    );
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
    items: state.items,
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
