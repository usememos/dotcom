"use client";

import { useEffect, useState } from "react";
import { getSaveBlockReason, refreshMemoInstanceProfile, saveScratchpadItemToMemos } from "@/lib/scratch/api";
import { createFileData, deleteFile, getFile, saveFile } from "@/lib/scratch/indexeddb";
import { instanceStorage, itemStorage } from "@/lib/scratch/storage";
import type { MemoInstance, ScratchpadItem } from "@/lib/scratch/types";

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

    if (migratedItems.some((item, index) => item.zIndex !== loadedItems[index].zIndex)) {
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
  const selectedItemsRequireFiles = selectedItems.some((item) => item.type === "file");
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

    handleUpdateItem(id, { zIndex: maxZ + 1 });
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
    const newItem: ScratchpadItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "text",
      x,
      y,
      width: 280,
      height: 180,
      zIndex: getNextZIndex(),
      content: "",
      createdAt: new Date(),
    };

    itemStorage.add(newItem);
    setItems(itemStorage.getAll());
  };

  const handleFileUpload = async (files: FileList, x: number, y: number) => {
    const baseZIndex = getNextZIndex();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileData = createFileData(file);
      await saveFile(fileData);

      itemStorage.add({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "file",
        x: x + i * 20,
        y: y + i * 20,
        width: 250,
        height: 280,
        zIndex: baseZIndex + i,
        fileRef: {
          id: fileData.id,
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
        },
        createdAt: new Date(),
      });
    }

    setItems(itemStorage.getAll());
  };

  const handleUpdateItem = (id: string, updates: Partial<ScratchpadItem>) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const saveItemsToStorage = () => {
    itemStorage.save(items);
  };

  const handleDeleteItem = async (id: string) => {
    const item = items.find((candidate) => candidate.id === id);
    if (item?.fileRef) {
      await deleteFile(item.fileRef.id);
    }

    itemStorage.remove(id);
    setItems(itemStorage.getAll());
  };

  const handleSaveItem = async (id: string, resolvedInstance?: MemoInstance) => {
    if (!resolvedInstance && instances.length === 0) {
      setShowInstanceForm(true);
      return;
    }

    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;

    const targetInstance = resolvedInstance || defaultInstance;
    if (!targetInstance) return;

    try {
      let content = "";
      const files: { blob: Blob; name: string }[] = [];

      if (item.type === "text") {
        content = item.content || "";
      } else if (item.type === "file" && item.fileRef) {
        const fileData = await getFile(item.fileRef.id);
        if (fileData) {
          content = `File: ${item.fileRef.name}`;
          files.push({ blob: fileData.blob, name: fileData.name });
        }
      }

      const readyInstance = resolvedInstance || (await ensureInstanceReadyForSave(targetInstance, files.length > 0));
      if (!readyInstance) return;

      const memo = await saveScratchpadItemToMemos(readyInstance, content, files, {
        visibility: "PRIVATE",
      });

      itemStorage.update(id, {
        savedToInstance: readyInstance.id,
        savedMemoRef: memo.memoRef,
        savedMemoId: undefined,
      });
      setItems(itemStorage.getAll());

      await replaceInstance({
        ...readyInstance,
        lastConnected: new Date(),
        status: "connected",
      });
    } catch (error) {
      console.error("Failed to save:", error);
      alert(error instanceof Error ? error.message : "Failed to save to Memos. Please check your instance connection.");
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

    if (!defaultInstance) {
      setShowInstanceForm(true);
      return;
    }

    const readyInstance = await ensureInstanceReadyForSave(defaultInstance, selectedItemsRequireFiles);
    if (!readyInstance) return;

    for (const id of selectedItemIds) {
      await handleSaveItem(id, readyInstance);
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
        selectedItemIds.forEach((id) => handleDeleteItem(id));
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
    handleSaveSelected,
    handleSelectItem,
    handleUpdateItem,
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
