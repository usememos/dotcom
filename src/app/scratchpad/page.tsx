"use client";

import { InstanceSetupForm } from "@/components/scratch/instance-setup-form";
import { ScratchpadToolbar } from "@/components/scratch/scratchpad-toolbar";
import { Workspace } from "@/components/scratch/workspace";
import { useScratchpad } from "@/hooks/use-scratchpad";

export default function ScratchPage() {
  const {
    defaultInstance,
    defaultInstanceStatusLabel,
    defaultInstanceVersion,
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
    selectedSaveTitle,
    setShowInstanceForm,
    setViewport,
    showInstanceForm,
    viewport,
  } = useScratchpad();

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-900">
      <ScratchpadToolbar
        defaultInstance={defaultInstance}
        defaultInstanceStatusLabel={defaultInstanceStatusLabel}
        defaultInstanceVersion={defaultInstanceVersion}
        selectedCount={selectedItemIds.length}
        selectedSaveTitle={selectedSaveTitle}
        saveDisabled={Boolean(defaultInstance && selectedSaveBlockReason)}
        onDeleteSelected={handleDeleteSelected}
        onOpenInstanceSettings={() => setShowInstanceForm(true)}
        onSaveSelected={handleSaveSelected}
      />

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
          onSelectItem={handleSelectItem}
        />
      </div>

      <InstanceSetupForm open={showInstanceForm} onSave={handleInstanceSave} onCancel={() => setShowInstanceForm(false)} />
    </div>
  );
}
