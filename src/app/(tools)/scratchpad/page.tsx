"use client";

import { ScratchpadToolbar } from "@/features/scratchpad/components/scratchpad-toolbar";
import { Workspace } from "@/features/scratchpad/components/workspace";
import { useScratchpad } from "@/features/scratchpad/hooks/use-scratchpad";

export default function ScratchPage() {
  const {
    handleCreateTextItem,
    handleDeleteItem,
    handleFileUpload,
    handleRemoveAttachment,
    handleSelectItem,
    handleUpdateItemBody,
    handleUpdateItemLayout,
    isClient,
    items,
    lastActiveItemId,
    selectedItemIds,
    setViewport,
    viewport,
  } = useScratchpad();

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-900">
      <ScratchpadToolbar />

      <div className="h-screen">
        <Workspace
          items={items}
          viewport={viewport}
          onViewportChange={setViewport}
          onUpdateItemBody={handleUpdateItemBody}
          onUpdateItemLayout={handleUpdateItemLayout}
          onDeleteItem={handleDeleteItem}
          onRemoveAttachment={handleRemoveAttachment}
          onCreateTextItem={handleCreateTextItem}
          onFileUpload={handleFileUpload}
          selectedItemIds={selectedItemIds}
          lastActiveItemId={lastActiveItemId}
          onSelectItem={handleSelectItem}
        />
      </div>
    </div>
  );
}
