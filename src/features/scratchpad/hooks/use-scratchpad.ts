"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSaveBlockReason, refreshMemoInstanceProfile, saveScratchpadItemToMemos } from "@/features/scratchpad/lib/api";
import { getScratchpadItem, getSelectedScratchpadItems } from "@/features/scratchpad/lib/editor";
import { getFile } from "@/features/scratchpad/lib/indexeddb";
import { instanceStorage } from "@/features/scratchpad/lib/storage";
import type { MemoInstance } from "@/features/scratchpad/types";
import { useScratchpadEditor } from "./use-scratchpad-editor";

function getInstanceStatusLabel(instance: MemoInstance | null): string {
  if (!instance) {
    return "No instance connected";
  }

  if (instance.connectionStatus === "connected") {
    return "Supported";
  }

  if (instance.connectionStatus === "unsupported") {
    return "Unsupported";
  }

  if (instance.connectionStatus === "error") {
    return "Error";
  }

  return "Untested";
}

export function useScratchpad() {
  const editor = useScratchpadEditor();
  const [instance, setInstance] = useState<MemoInstance | null>(null);
  const [showInstanceForm, setShowInstanceForm] = useState(false);
  const instanceRef = useRef(instance);

  useEffect(() => {
    instanceRef.current = instance;
  }, [instance]);

  const loadInstance = async () => {
    setInstance(await instanceStorage.get());
  };

  useEffect(() => {
    if (!editor.isClient) return;
    void loadInstance();
  }, [editor.isClient]);

  const replaceInstance = async (instance: MemoInstance) => {
    await instanceStorage.save(instance);
    setInstance(instance);
  };

  const selectedItems = useMemo(
    () =>
      getSelectedScratchpadItems({
        document: { items: editor.items },
        selectedItemIds: editor.selectedItemIds,
      }),
    [editor.items, editor.selectedItemIds],
  );
  const selectedItemsRequireFiles = selectedItems.some((item) => item.content.attachments.length > 0);
  const selectedSaveBlockReason = getSaveBlockReason(instance, selectedItemsRequireFiles);

  const handleInstanceSave = async (instance: MemoInstance) => {
    await instanceStorage.save(instance);
    setInstance(instance);
    setShowInstanceForm(false);
  };

  const ensureInstanceReadyForSave = async (instance: MemoInstance, requiresFiles: boolean): Promise<MemoInstance | null> => {
    const preparedInstance =
      !instance.serverProfile || instance.connectionStatus === "untested" ? await refreshMemoInstanceProfile(instance) : instance;

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

    const targetInstance = resolvedInstance || instanceRef.current;
    if (!targetInstance) {
      setShowInstanceForm(true);
      return;
    }

    if (!item.content.body.trim() && item.content.attachments.length === 0) {
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
          item.content.attachments.map(async (attachment) => {
            const fileData = await getFile(attachment.id);
            return fileData ? { blob: fileData.blob, name: fileData.name } : null;
          }),
        )
      ).filter((file): file is { blob: Blob; name: string } => file !== null);

      const readyInstance = resolvedInstance || (await ensureInstanceReadyForSave(targetInstance, item.content.attachments.length > 0));
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
          timestamps: { updatedAt: syncedAt },
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
        lastConnectedAt: new Date(),
        connectionStatus: "connected",
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

    if (!instance) {
      setShowInstanceForm(true);
      return;
    }

    for (const id of editor.selectedItemIds) {
      await handleSaveItem(id);
    }

    editor.clearSelection();
  };

  return {
    defaultInstance: instance,
    defaultInstanceStatusLabel: getInstanceStatusLabel(instance),
    defaultInstanceVersion: instance?.serverProfile?.rawVersion || "Unknown version",
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
    selectedSaveTitle: !instance ? "Save selected to Memos" : selectedSaveBlockReason || "Save selected to Memos",
    setShowInstanceForm,
    showInstanceForm,
    viewport: editor.viewport,
    setViewport: editor.setViewport,
  };
}
