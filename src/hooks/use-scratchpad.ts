"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSaveBlockReason, refreshMemoInstanceProfile, saveScratchpadItemToMemos } from "@/lib/scratch/api";
import { getScratchpadItem, getSelectedScratchpadItems } from "@/lib/scratch/editor";
import { getFile } from "@/lib/scratch/indexeddb";
import { instanceStorage } from "@/lib/scratch/storage";
import type { MemoInstance } from "@/lib/scratch/types";
import { useScratchpadEditor } from "./use-scratchpad-editor";

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
  const editor = useScratchpadEditor();
  const [instances, setInstances] = useState<MemoInstance[]>([]);
  const [showInstanceForm, setShowInstanceForm] = useState(false);
  const instancesRef = useRef(instances);

  useEffect(() => {
    instancesRef.current = instances;
  }, [instances]);

  const loadInstances = async () => {
    const storedData = localStorage.getItem("memos-scratch-instances");
    const instanceCountBefore = storedData ? (JSON.parse(storedData) as MemoInstance[]).length : 0;
    const loadedInstances = await instanceStorage.getAll();
    const instanceCountAfter = loadedInstances.length;

    setInstances(loadedInstances);

    if (instanceCountBefore > instanceCountAfter) {
      const lostCount = instanceCountBefore - instanceCountAfter;
      alert(
        `⚠️ ${lostCount} Memos ${lostCount === 1 ? "instance" : "instances"} couldn't be loaded due to encryption issues.\n\n` +
          "This can happen after browser updates or window resizing. Please re-add your Memos instance(s).",
      );
    }
  };

  useEffect(() => {
    if (!editor.isClient) return;
    void loadInstances();
  }, [editor.isClient]);

  const updateInstances = async (nextInstances: MemoInstance[]) => {
    await instanceStorage.save(nextInstances);
    setInstances(nextInstances);
  };

  const replaceInstance = async (instance: MemoInstance) => {
    const nextInstances = instancesRef.current.map((current) => (current.id === instance.id ? instance : current));
    await updateInstances(nextInstances);
  };

  const defaultInstance = useMemo(() => instances.find((instance) => instance.isDefault) || instances[0] || null, [instances]);
  const selectedItems = useMemo(
    () =>
      getSelectedScratchpadItems({
        items: editor.items,
        selectedItemIds: editor.selectedItemIds,
      }),
    [editor.items, editor.selectedItemIds],
  );
  const selectedItemsRequireFiles = selectedItems.some((item) => item.attachments.length > 0);
  const selectedSaveBlockReason = getSaveBlockReason(defaultInstance, selectedItemsRequireFiles);

  const getPreferredInstanceForItem = (itemId: string): MemoInstance | null => {
    const item = getScratchpadItem(editor.items, itemId);
    if (!item) return defaultInstance;

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
    await loadInstances();
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

  const handleSaveItem = async (id: string, resolvedInstance?: MemoInstance) => {
    const item = getScratchpadItem(editor.items, id);
    if (!item) return;

    const targetInstance = resolvedInstance || getPreferredInstanceForItem(id);
    if (!targetInstance) {
      setShowInstanceForm(true);
      return;
    }

    if (!item.body.trim() && item.attachments.length === 0) {
      alert("Cannot save an empty card to Memos.");
      return;
    }

    editor.patchItem(
      id,
      {
        sync: {
          ...item.sync,
          status: "saving",
          lastError: undefined,
        },
      },
      "immediate",
      "item.sync-saving",
    );

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
        editor.patchItem(
          id,
          {
            sync: {
              ...item.sync,
              status: item.sync.memoRef ? "dirty" : "local",
            },
          },
          "immediate",
          "item.sync-revert",
        );
        return;
      }

      const memo = await saveScratchpadItemToMemos(readyInstance, item, files, {
        visibility: "PRIVATE",
      });

      const syncedAt = new Date();
      editor.patchItem(
        id,
        {
          updatedAt: syncedAt,
          sync: {
            instanceId: readyInstance.id,
            memoRef: memo.memoRef,
            status: "synced",
            lastSyncedAt: syncedAt,
          },
        },
        "immediate",
        "item.sync-success",
      );

      await replaceInstance({
        ...readyInstance,
        lastConnected: new Date(),
        status: "connected",
      });
    } catch (error) {
      console.error("Failed to save:", error);
      const message = error instanceof Error ? error.message : "Failed to save to Memos. Please check your instance connection.";
      editor.patchItem(
        id,
        {
          sync: {
            ...item.sync,
            status: "error",
            lastError: message,
          },
        },
        "immediate",
        "item.sync-error",
      );
      alert(message);
    }
  };

  const handleDeleteSelected = async () => {
    if (editor.selectedItemIds.length === 0) return;

    const count = editor.selectedItemIds.length;
    if (!confirm(`Delete ${count} selected ${count === 1 ? "item" : "items"}?`)) {
      return;
    }

    await editor.deleteItems(editor.selectedItemIds);
  };

  const handleSaveSelected = async () => {
    if (editor.selectedItemIds.length === 0) return;

    if (!defaultInstance && instances.length === 0) {
      setShowInstanceForm(true);
      return;
    }

    for (const id of editor.selectedItemIds) {
      await handleSaveItem(id);
    }

    editor.clearSelection();
  };

  return {
    defaultInstance,
    defaultInstanceStatusLabel: getInstanceStatusLabel(defaultInstance),
    defaultInstanceVersion: defaultInstance?.serverProfile?.rawVersion || "Unknown version",
    handleCreateTextItem: editor.createTextItem,
    handleDeleteItem: editor.deleteItem,
    handleDeleteSelected,
    handleFileUpload: editor.uploadFiles,
    handleInstanceSave,
    handleRemoveAttachment: editor.removeAttachment,
    handleSaveItem,
    handleSaveSelected,
    handleSelectItem: editor.selectItem,
    handleUpdateItemBody: editor.updateItemBody,
    handleUpdateItemLayout: editor.updateItemLayout,
    isClient: editor.isClient,
    items: editor.items,
    selectedItemIds: editor.selectedItemIds,
    selectedSaveBlockReason,
    selectedSaveTitle: !defaultInstance ? "Save selected to Memos" : selectedSaveBlockReason || "Save selected to Memos",
    setShowInstanceForm,
    showInstanceForm,
    viewport: editor.viewport,
    setViewport: editor.setViewport,
  };
}
