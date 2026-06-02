"use client";

import { useScratchpadEditor } from "./use-scratchpad-editor";

export function useScratchpad() {
  const editor = useScratchpadEditor();

  const handleDeleteSelected = async () => {
    if (editor.selectedItemIds.length === 0) return;

    const count = editor.selectedItemIds.length;
    if (!confirm(`Delete ${count} selected ${count === 1 ? "item" : "items"}?`)) {
      return;
    }

    await editor.deleteItems(editor.selectedItemIds);
  };

  return {
    handleCreateTextItem: editor.createTextItem,
    handleDeleteItem: editor.deleteItem,
    handleDeleteSelected,
    handleFileUpload: editor.uploadFiles,
    handleRemoveAttachment: editor.removeAttachment,
    handleSelectItem: editor.selectItem,
    handleUpdateItemBody: editor.updateItemBody,
    handleUpdateItemLayout: editor.updateItemLayout,
    isClient: editor.isClient,
    items: editor.items,
    lastActiveItemId: editor.lastActiveItemId,
    selectedItemIds: editor.selectedItemIds,
    setViewport: editor.setViewport,
    viewport: editor.viewport,
  };
}
