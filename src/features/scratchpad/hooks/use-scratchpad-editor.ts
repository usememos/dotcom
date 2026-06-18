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
import { viewportStorage } from "@/features/scratchpad/lib/storage";
import { clampScratchpadScale } from "@/features/scratchpad/lib/viewport";
import { hashBlob, putLocalBlob } from "@/features/scratchpad/persistence/blobs";
import { loadDocument, migrateScratchpadStorage, saveDocument } from "@/features/scratchpad/persistence/document";
import type { ScratchpadAttachmentRef, ScratchpadItemLayout, ScratchpadItemPatch, ScratchpadViewport } from "@/features/scratchpad/types";

type ViewportUpdater = ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport);

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

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    viewportRef.current = state.viewport;
  }, [state.viewport]);

  // Mount: migrate once, then hydrate the document and viewport from local storage.
  useEffect(() => {
    let active = true;
    const boot = async () => {
      await migrateScratchpadStorage();
      const document = loadDocument();
      const savedViewport = viewportStorage.get();
      if (!active) return;
      dispatch({
        type: "hydrate",
        items: document.items,
        viewport: { ...savedViewport, scale: clampScratchpadScale(savedViewport.scale) },
      });
      setIsClient(true);
    };
    void boot();

    return () => {
      active = false;
    };
  }, []);

  // Persist the document (debounced) whenever it changes.
  useEffect(() => {
    if (!isClient) return;
    const timeoutId = window.setTimeout(() => {
      saveDocument(stateRef.current.document);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [isClient, state.document]);

  // Device-local viewport persists to localStorage.
  useEffect(() => {
    if (!isClient) return;
    const timeoutId = window.setTimeout(() => {
      viewportStorage.save(stateRef.current.viewport);
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
  };

  const updateItemLayout = (id: string, updates: Partial<ScratchpadItemLayout>) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    patchItem(id, { layout: updates }, "immediate", "item.layout");
  };

  const updateItemBody = (id: string, body: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    patchItem(id, { content: { body }, timestamps: { updatedAt: new Date() } }, "debounced", "item.body");
  };

  const deleteItems = (ids: string[]) => {
    runTransaction("item.delete", [{ type: "delete-items", ids }], "immediate");
  };

  const deleteItem = (id: string) => {
    deleteItems([id]);
  };

  const removeAttachment = (id: string, attachmentId: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    const attachments = item.content.attachments.filter((a) => a.id !== attachmentId);
    patchItem(id, { content: { attachments }, timestamps: { updatedAt: new Date() } }, "immediate", "item.remove-attachment");
  };

  const uploadFiles = async (files: FileList, x: number, y: number, targetItemId?: string) => {
    const refs: ScratchpadAttachmentRef[] = [];
    for (const file of Array.from(files)) refs.push(await persistUploadedFile(file));

    if (targetItemId) {
      const target = getScratchpadItem(stateRef.current.document.items, targetItemId);
      if (target) {
        const attachments = [...target.content.attachments, ...refs];
        patchItem(targetItemId, { content: { attachments }, timestamps: { updatedAt: new Date() } }, "immediate", "item.attach-files");
        return;
      }
    }

    const item = createPositionedItem(x, y, refs);
    runTransaction("item.create-with-files", [{ type: "add-item", item }], "immediate");
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
        deleteItems(stateRef.current.selectedItemIds);
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
