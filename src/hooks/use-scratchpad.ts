"use client";

import { useEffect, useState } from "react";
import { getSaveBlockReason, refreshMemoInstanceProfile, saveScratchpadItemToMemos } from "@/lib/scratch/api";
import { createFileData, deleteFile, getFile, saveFile } from "@/lib/scratch/indexeddb";
import { instanceStorage, itemStorage } from "@/lib/scratch/storage";
import type { MemoInstance, ScratchpadAttachmentRef, ScratchpadItem, ScratchpadSyncState } from "@/lib/scratch/types";

function getInstanceStatusLabel(instance: MemoInstance | null): string {
  if (!instance) {
    return "No instance connected";
  }

  if (instance.status === "connected") {
    return "Supported";
  }

  if (instance.status === "unsupported") {
    return "Unsupported";
  }

  if (instance.status === "error") {
    return "Error";
  }

  return "Untested";
}

function createSyncState(overrides: Partial<ScratchpadSyncState> = {}): ScratchpadSyncState {
  return {
    status: "local",
    ...overrides,
  };
}

function createScratchpadItem(x: number, y: number, zIndex: number, attachments: ScratchpadAttachmentRef[] = []): ScratchpadItem {
  const now = new Date();

  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    x,
    y,
    width: attachments.length > 0 ? 320 : 280,
    height: attachments.length > 0 ? 300 : 180,
    zIndex,
    body: "",
    attachments,
    createdAt: now,
    updatedAt: now,
    sync: createSyncState(),
  };
}

function markItemDirty(sync: ScratchpadSyncState): ScratchpadSyncState {
  return {
    ...sync,
    status: sync.memoRef ? "dirty" : "local",
    lastError: undefined,
  };
}

export function useScratchpad() {
  const [isClient, setIsClient] = useState(false);
  const [items, setItems] = useState<ScratchpadItem[]>([]);
  const [instances, setInstances] = useState<MemoInstance[]>([]);
  const [showInstanceForm, setShowInstanceForm] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const loadData = async () => {
    const loadedItems = itemStorage.getAll();
    const storedData = localStorage.getItem("memos-scratch-instances");
    const instanceCountBefore = storedData ? (JSON.parse(storedData) as MemoInstance[]).length : 0;
    const loadedInstances = await instanceStorage.getAll();
    const instanceCountAfter = loadedInstances.length;

    const migratedItems = loadedItems.map((item, index) => ({
      ...item,
      zIndex: item.zIndex ?? index + 1,
    }));

    setItems(migratedItems);
    setInstances(loadedInstances);

    if (migratedItems.some((item, index) => item.zIndex !== loadedItems[index]?.zIndex)) {
      itemStorage.save(migratedItems);
    }

    if (instanceCountBefore > instanceCountAfter) {
      const lostCount = instanceCountBefore - instanceCountAfter;
      alert(
        `⚠️ ${lostCount} Memos ${lostCount === 1 ? "instance" : "instances"} couldn't be loaded due to encryption issues.\n\n` +
          "This can happen after browser updates or window resizing. Please re-add your Memos instance(s).",
      );
    }
  };

  const updateInstances = async (nextInstances: MemoInstance[]) => {
    await instanceStorage.save(nextInstances);
    setInstances(nextInstances);
  };

  const replaceInstance = async (instance: MemoInstance) => {
    const nextInstances = instances.map((current) => (current.id === instance.id ? instance : current));
    await updateInstances(nextInstances);
  };

  const defaultInstance = instances.find((instance) => instance.isDefault) || instances[0] || null;
  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
  const selectedItemsRequireFiles = selectedItems.some((item) => item.attachments.length > 0);
  const selectedSaveBlockReason = getSaveBlockReason(defaultInstance, selectedItemsRequireFiles);

  const getNextZIndex = (): number => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((item) => item.zIndex || 0)) + 1;
  };

  const bringToFront = (id: string) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;

    const maxZ = Math.max(...items.map((candidate) => candidate.zIndex || 0));
    if (item.zIndex >= maxZ) return;

    handleUpdateItemLayout(id, { zIndex: maxZ + 1 });
  };

  const getPreferredInstanceForItem = (item: ScratchpadItem): MemoInstance | null => {
    if (item.sync.instanceId) {
      const savedInstance = instances.find((instance) => instance.id === item.sync.instanceId);
      if (savedInstance) {
        return savedInstance;
      }
    }

    return defaultInstance;
  };

  const handleInstanceSave = async (instance: MemoInstance) => {
    await instanceStorage.add(instance);
    setShowInstanceForm(false);
    await loadData();
  };

  const ensureInstanceReadyForSave = async (instance: MemoInstance, requiresFiles: boolean): Promise<MemoInstance | null> => {
    const preparedInstance =
      !instance.serverProfile || instance.status === "untested" ? await refreshMemoInstanceProfile(instance) : instance;

    if (preparedInstance !== instance) {
      await replaceInstance(preparedInstance);
    }

    const saveBlockReason = getSaveBlockReason(preparedInstance, requiresFiles);
    if (saveBlockReason) {
      alert(saveBlockReason);
      return null;
    }

    return preparedInstance;
  };

  const handleCreateTextItem = (x: number, y: number) => {
    const newItem = createScratchpadItem(x, y, getNextZIndex());
    itemStorage.add(newItem);
    setItems(itemStorage.getAll());
  };

  const updateItem = (id: string, updater: (item: ScratchpadItem) => ScratchpadItem) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? updater(item) : item)));
  };

  const handleFileUpload = async (files: FileList, x: number, y: number, targetItemId?: string) => {
    const attachmentRefs: ScratchpadAttachmentRef[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
      updateItem(targetItemId, (item) => ({
        ...item,
        attachments: [...item.attachments, ...attachmentRefs],
        updatedAt: new Date(),
        sync: markItemDirty(item.sync),
      }));
      return;
    }

    const newItem = createScratchpadItem(x, y, getNextZIndex(), attachmentRefs);
    itemStorage.add(newItem);
    setItems(itemStorage.getAll());
  };

  const handleUpdateItemLayout = (
    id: string,
    updates: Pick<ScratchpadItem, "x" | "y" | "width" | "height" | "zIndex"> | Partial<ScratchpadItem>,
  ) => {
    updateItem(id, (item) => ({
      ...item,
      ...updates,
    }));
  };

  const handleUpdateItemBody = (id: string, body: string) => {
    updateItem(id, (item) => ({
      ...item,
      body,
      updatedAt: new Date(),
      sync: markItemDirty(item.sync),
    }));
  };

  const handleRemoveAttachment = async (id: string, attachmentId: string) => {
    await deleteFile(attachmentId);
    updateItem(id, (item) => ({
      ...item,
      attachments: item.attachments.filter((attachment) => attachment.id !== attachmentId),
      updatedAt: new Date(),
      sync: markItemDirty(item.sync),
    }));
  };

  const saveItemsToStorage = () => {
    itemStorage.save(items);
  };

  const handleDeleteItem = async (id: string) => {
    const item = items.find((candidate) => candidate.id === id);
    if (item) {
      await Promise.all(item.attachments.map((attachment) => deleteFile(attachment.id)));
    }

    itemStorage.remove(id);
    setItems(itemStorage.getAll());
  };

  const handleSaveItem = async (id: string, resolvedInstance?: MemoInstance) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;

    const targetInstance = resolvedInstance || getPreferredInstanceForItem(item);
    if (!targetInstance) {
      setShowInstanceForm(true);
      return;
    }

    if (!item.body.trim() && item.attachments.length === 0) {
      alert("Cannot save an empty card to Memos.");
      return;
    }

    updateItem(id, (current) => ({
      ...current,
      sync: {
        ...current.sync,
        status: "saving",
        lastError: undefined,
      },
    }));

    try {
      const files = (
        await Promise.all(
          item.attachments.map(async (attachment) => {
            const fileData = await getFile(attachment.id);
            return fileData ? { blob: fileData.blob, name: fileData.name } : null;
          }),
        )
      ).filter((file): file is { blob: Blob; name: string } => file !== null);

      const readyInstance = resolvedInstance || (await ensureInstanceReadyForSave(targetInstance, item.attachments.length > 0));
      if (!readyInstance) {
        updateItem(id, (current) => ({
          ...current,
          sync: {
            ...current.sync,
            status: current.sync.memoRef ? "dirty" : "local",
          },
        }));
        return;
      }

      const memo = await saveScratchpadItemToMemos(readyInstance, item, files, {
        visibility: "PRIVATE",
      });

      const syncedAt = new Date();
      updateItem(id, (current) => ({
        ...current,
        updatedAt: syncedAt,
        sync: {
          instanceId: readyInstance.id,
          memoRef: memo.memoRef,
          status: "synced",
          lastSyncedAt: syncedAt,
        },
      }));

      await replaceInstance({
        ...readyInstance,
        lastConnected: new Date(),
        status: "connected",
      });
    } catch (error) {
      console.error("Failed to save:", error);
      const message = error instanceof Error ? error.message : "Failed to save to Memos. Please check your instance connection.";
      updateItem(id, (current) => ({
        ...current,
        sync: {
          ...current.sync,
          status: "error",
          lastError: message,
        },
      }));
      alert(message);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItemIds.length === 0) return;

    const count = selectedItemIds.length;
    if (!confirm(`Delete ${count} selected ${count === 1 ? "item" : "items"}?`)) {
      return;
    }

    await Promise.all(selectedItemIds.map((id) => handleDeleteItem(id)));
    setSelectedItemIds([]);
  };

  const handleSaveSelected = async () => {
    if (selectedItemIds.length === 0) return;

    if (!defaultInstance && instances.length === 0) {
      setShowInstanceForm(true);
      return;
    }

    for (const id of selectedItemIds) {
      await handleSaveItem(id);
    }

    setSelectedItemIds([]);
  };

  const handleSelectItem = (id: string | null, ctrlKey: boolean = false) => {
    if (id === null) {
      setSelectedItemIds([]);
      return;
    }

    bringToFront(id);

    if (ctrlKey) {
      setSelectedItemIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
      return;
    }

    setSelectedItemIds([id]);
  };

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const timeoutId = setTimeout(() => {
      itemStorage.save(items);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [items, isClient]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((e.key === "Delete" || e.key === "Backspace") && selectedItemIds.length > 0 && !isTyping) {
        e.preventDefault();
        selectedItemIds.forEach((id) => void handleDeleteItem(id));
        setSelectedItemIds([]);
      }

      if (e.key === "Escape") {
        setSelectedItemIds([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIds, items]);

  return {
    defaultInstance,
    defaultInstanceStatusLabel: getInstanceStatusLabel(defaultInstance),
    defaultInstanceVersion: defaultInstance?.serverProfile?.rawVersion || "Unknown version",
    handleCreateTextItem,
    handleDeleteItem,
    handleDeleteSelected,
    handleFileUpload,
    handleInstanceSave,
    handleRemoveAttachment,
    handleSaveSelected,
    handleSelectItem,
    handleUpdateItemBody,
    handleUpdateItemLayout,
    isClient,
    items,
    selectedItemIds,
    selectedSaveBlockReason,
    selectedSaveTitle: !defaultInstance ? "Save selected to Memos" : selectedSaveBlockReason || "Save selected to Memos",
    saveItemsToStorage,
    setShowInstanceForm,
    showInstanceForm,
  };
}
