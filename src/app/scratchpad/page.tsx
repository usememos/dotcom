"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HomeIcon, MonitorIcon, MoonIcon, SaveIcon, SettingsIcon, SunIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { InstanceSetupForm } from "@/components/scratch/instance-setup-form";
import { Workspace } from "@/components/scratch/workspace";
import { saveScratchpadItemToMemos } from "@/lib/scratch/api";
import { createFileData, deleteFile, getFile, saveFile } from "@/lib/scratch/indexeddb";
import { instanceStorage, itemStorage } from "@/lib/scratch/storage";
import type { MemoInstance, ScratchpadItem } from "@/lib/scratch/types";

export default function ScratchPage() {
  // State management
  const [isClient, setIsClient] = useState(false);
  const [items, setItems] = useState<ScratchpadItem[]>([]);
  const [instances, setInstances] = useState<MemoInstance[]>([]);
  const [showInstanceForm, setShowInstanceForm] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Data loading
  const loadData = async () => {
    const loadedItems = itemStorage.getAll();
    const loadedInstances = await instanceStorage.getAll();

    // Migrate items to have zIndex if they don't have one
    const migratedItems = loadedItems.map((item, index) => ({
      ...item,
      zIndex: item.zIndex ?? index + 1,
    }));

    setItems(migratedItems);
    setInstances(loadedInstances);

    // Save migrated items if any were updated
    if (migratedItems.some((item, index) => item.zIndex !== loadedItems[index].zIndex)) {
      itemStorage.save(migratedItems);
    }
  };

  // Get next z-index for new items (max + 1)
  const getNextZIndex = (): number => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((item) => item.zIndex || 0)) + 1;
  };

  // Bring item to front by giving it highest z-index
  const bringToFront = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const maxZ = Math.max(...items.map((i) => i.zIndex || 0));
    if (item.zIndex >= maxZ) return; // Already on top

    handleUpdateItem(id, { zIndex: maxZ + 1 });
  };

  // Instance management
  const handleInstanceSave = async (instance: MemoInstance) => {
    await instanceStorage.add(instance);
    setShowInstanceForm(false);
    await loadData();
  };

  // Item creation
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

      const newItem: ScratchpadItem = {
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
      };
      itemStorage.add(newItem);
    }

    setItems(itemStorage.getAll());
  };

  const _handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files, 100, 100);
      e.target.value = ""; // Reset input
    }
  };

  // Item operations
  const handleUpdateItem = (id: string, updates: Partial<ScratchpadItem>) => {
    // Update state immediately for smooth UI
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const saveItemsToStorage = () => {
    // Persist current state to localStorage
    itemStorage.save(items);
  };

  const handleDeleteItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.fileRef) {
      await deleteFile(item.fileRef.id);
    }
    itemStorage.remove(id);
    setItems(itemStorage.getAll());
  };

  const handleSaveItem = async (id: string) => {
    if (instances.length === 0) {
      setShowInstanceForm(true);
      return;
    }

    const item = items.find((i) => i.id === id);
    if (!item) return;

    const defaultInstance = instances.find((i) => i.isDefault) || instances[0];
    if (!defaultInstance) return;

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

      const memo = await saveScratchpadItemToMemos(defaultInstance, content, files, {
        instanceId: defaultInstance.id,
        visibility: "PRIVATE",
      });

      // Update item as saved
      itemStorage.update(id, {
        savedToInstance: defaultInstance.id,
        savedMemoId: memo.id,
      });

      setItems(itemStorage.getAll());

      // Update instance last connected
      await instanceStorage.update(defaultInstance.id, {
        lastConnected: new Date(),
        status: "connected",
      });
      await loadData();
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save to Memos. Please check your instance connection.");
    }
  };

  // Bulk operations
  const _handleClearAll = () => {
    if (confirm("Clear all items? This cannot be undone.")) {
      itemStorage.clear();
      setItems([]);
      setSelectedItemIds([]);
    }
  };

  // Batch delete selected items
  const handleDeleteSelected = async () => {
    if (selectedItemIds.length === 0) return;

    const count = selectedItemIds.length;
    if (confirm(`Delete ${count} selected ${count === 1 ? "item" : "items"}?`)) {
      // Delete all selected items
      await Promise.all(selectedItemIds.map((id) => handleDeleteItem(id)));
      setSelectedItemIds([]);
    }
  };

  // Batch save selected items to Memos
  const handleSaveSelected = async () => {
    if (selectedItemIds.length === 0) return;

    if (instances.length === 0) {
      setShowInstanceForm(true);
      return;
    }

    // Save all selected items sequentially
    for (const id of selectedItemIds) {
      await handleSaveItem(id);
    }
    setSelectedItemIds([]);
  };

  // Selection management
  const handleSelectItem = (id: string | null, ctrlKey: boolean = false) => {
    if (id === null) {
      // Deselect all
      setSelectedItemIds([]);
      return;
    }

    // Bring item to front when interacted with
    bringToFront(id);

    if (ctrlKey) {
      // Ctrl+click: toggle selection
      setSelectedItemIds((prev) => {
        if (prev.includes(id)) {
          // Remove from selection
          return prev.filter((itemId) => itemId !== id);
        } else {
          // Add to selection
          return [...prev, id];
        }
      });
    } else {
      // Regular click: select only this item
      setSelectedItemIds([id]);
    }
  };

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
    loadData();
  }, []);

  // Debounced save to storage when items change
  useEffect(() => {
    if (!isClient) return;

    const timeoutId = setTimeout(() => {
      itemStorage.save(items);
    }, 500); // Save 500ms after last change

    return () => clearTimeout(timeoutId);
  }, [items, isClient]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // Delete selected items with Delete or Backspace key
      if ((e.key === "Delete" || e.key === "Backspace") && selectedItemIds.length > 0 && !isTyping) {
        e.preventDefault();
        selectedItemIds.forEach((id) => handleDeleteItem(id));
        setSelectedItemIds([]);
      }

      // Deselect all with ESC key
      if (e.key === "Escape") {
        setSelectedItemIds([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIds]);

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  const _defaultInstance = instances.find((i) => i.isDefault) || instances[0];
  const _hasInstances = instances.length > 0;

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Right Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        {/* Selection Actions - Show when items are selected */}
        {selectedItemIds.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{selectedItemIds.length} selected</span>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <button
              type="button"
              onClick={handleSaveSelected}
              className="p-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition"
              title="Save selected to Memos"
            >
              <SaveIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
              title="Delete selected"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Memos Dropdown Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg border border-gray-200 contain-content dark:border-gray-700 transition shadow-sm"
              title="Memos menu"
            >
              <Image src="/logo.png" alt="Memos" width={32} height={32} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-1 z-50"
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                onSelect={() => setShowInstanceForm(true)}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Instance Settings</span>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none">
                  {mounted && theme === "light" && <SunIcon className="w-4 h-4" />}
                  {mounted && theme === "dark" && <MoonIcon className="w-4 h-4" />}
                  {mounted && theme === "system" && <MonitorIcon className="w-4 h-4" />}
                  {!mounted && <MonitorIcon className="w-4 h-4" />}
                  <span>Theme</span>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-1 z-50">
                    <DropdownMenu.Item
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                      onSelect={() => setTheme("light")}
                    >
                      <SunIcon className="w-4 h-4" />
                      <span>Light</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                      onSelect={() => setTheme("dark")}
                    >
                      <MoonIcon className="w-4 h-4" />
                      <span>Dark</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                      onSelect={() => setTheme("system")}
                    >
                      <MonitorIcon className="w-4 h-4" />
                      <span>System</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>

              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <DropdownMenu.Item
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                asChild
              >
                <Link href="/">
                  <HomeIcon className="w-4 h-4" />
                  <span>Back to Main Site</span>
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <input ref={fileInputRef} type="file" multiple onChange={handleFileInputChange} className="hidden" />

      {/* Workspace - Full Screen */}
      <div className="h-screen">
        <Workspace
          items={items}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onCreateTextItem={handleCreateTextItem}
          onFileUpload={handleFileUpload}
          selectedItemIds={selectedItemIds}
          onSelectItem={handleSelectItem}
          onDragComplete={saveItemsToStorage}
        />
      </div>

      {/* Instance Setup Modal */}
      <InstanceSetupForm open={showInstanceForm} onSave={handleInstanceSave} onCancel={() => setShowInstanceForm(false)} />
    </div>
  );
}
