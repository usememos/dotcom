'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  TrashIcon,
  CloudIcon,
  SettingsIcon,
  SaveIcon,
  HomeIcon,
} from 'lucide-react';
import { InstanceSetupForm } from '@/components/scratch/instance-setup-form';
import { Canvas } from '@/components/scratch/canvas';
import type { ScratchpadItem, MemoInstance } from '@/lib/scratch/types';
import { itemStorage, instanceStorage } from '@/lib/scratch/storage';
import { saveFile, createFileData, getFile, deleteFile } from '@/lib/scratch/indexeddb';
import { saveScratchpadItemToMemos } from '@/lib/scratch/api';

export default function ScratchPage() {
  const [isClient, setIsClient] = useState(false);
  const [items, setItems] = useState<ScratchpadItem[]>([]);
  const [instances, setInstances] = useState<MemoInstance[]>([]);
  const [showInstanceForm, setShowInstanceForm] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected items with Delete or Backspace key
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItemIds.length > 0) {
        // Don't delete if user is typing in an input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        // Delete all selected items
        selectedItemIds.forEach((id) => handleDeleteItem(id));
        setSelectedItemIds([]);
      }

      // Deselect all with ESC key
      if (e.key === 'Escape') {
        setSelectedItemIds([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemIds]);

  const loadData = async () => {
    const loadedItems = itemStorage.getAll();
    const loadedInstances = await instanceStorage.getAll();
    setItems(loadedItems);
    setInstances(loadedInstances);
  };

  const handleInstanceSave = async (instance: MemoInstance) => {
    await instanceStorage.add(instance);
    setShowInstanceForm(false);
    await loadData();
  };

  const handleCreateTextItem = (x: number, y: number) => {
    const newItem: ScratchpadItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      x,
      y,
      width: 280,
      height: 180,
      content: '',
      createdAt: new Date(),
    };
    itemStorage.add(newItem);
    setItems(itemStorage.getAll());
  };

  const handleFileUpload = async (files: FileList, x: number, y: number) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileData = createFileData(file);
      await saveFile(fileData);

      const newItem: ScratchpadItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'file',
        x: x + i * 20,
        y: y + i * 20,
        width: 250,
        height: 280,
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

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files, 100, 100);
      e.target.value = ''; // Reset input
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<ScratchpadItem>) => {
    itemStorage.update(id, updates);
    setItems(itemStorage.getAll());
  };

  const handleDeleteItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item && item.fileRef) {
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
      let content = '';
      const files: { blob: Blob; name: string }[] = [];

      if (item.type === 'text') {
        content = item.content || '';
      } else if (item.type === 'file' && item.fileRef) {
        const fileData = await getFile(item.fileRef.id);
        if (fileData) {
          content = `File: ${item.fileRef.name}`;
          files.push({ blob: fileData.blob, name: fileData.name });
        }
      }

      const memo = await saveScratchpadItemToMemos(defaultInstance, content, files, {
        instanceId: defaultInstance.id,
        visibility: 'PRIVATE',
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
        status: 'connected',
      });
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save to Memos. Please check your instance connection.');
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all items? This cannot be undone.')) {
      itemStorage.clear();
      setItems([]);
      setSelectedItemIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItemIds.length === 0) return;

    const count = selectedItemIds.length;
    if (confirm(`Delete ${count} selected ${count === 1 ? 'item' : 'items'}?`)) {
      selectedItemIds.forEach((id) => handleDeleteItem(id));
      setSelectedItemIds([]);
    }
  };

  const handleSaveSelected = async () => {
    if (selectedItemIds.length === 0) return;

    if (instances.length === 0) {
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
      // Deselect all
      setSelectedItemIds([]);
      return;
    }

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

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  const defaultInstance = instances.find((i) => i.isDefault) || instances[0];
  const hasInstances = instances.length > 0;

  return (
    <div className="relative h-screen bg-white dark:bg-gray-900">
      {/* Top Right Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        {/* Selection Actions - Show when items are selected */}
        {selectedItemIds.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {selectedItemIds.length} selected
            </span>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            <button
              onClick={handleSaveSelected}
              className="p-1.5 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded transition"
              title="Save selected to Memos"
            >
              <SaveIcon className="w-4 h-4" />
            </button>
            <button
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
              className="flex items-center justify-center w-9 h-9 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg border border-gray-200 dark:border-gray-700 transition shadow-sm font-bold text-lg"
              title="Memos menu"
            >
              M
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
                asChild
              >
                <Link href="/">
                  <HomeIcon className="w-4 h-4" />
                  <span>Back to Main Site</span>
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

              <DropdownMenu.Item
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                onSelect={() => setShowInstanceForm(true)}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Instance Settings</span>
              </DropdownMenu.Item>

              {items.length > 0 && (
                <>
                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  <DropdownMenu.Item
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer outline-none"
                    onSelect={handleClearAll}
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Clear All Items</span>
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Canvas - Full Screen */}
      <div className="h-screen">
        <Canvas
          items={items}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onSaveItem={handleSaveItem}
          onCreateTextItem={handleCreateTextItem}
          onFileUpload={handleFileUpload}
          selectedItemIds={selectedItemIds}
          onSelectItem={handleSelectItem}
        />
      </div>

      {/* Instance Setup Modal */}
      <InstanceSetupForm
        open={showInstanceForm}
        onSave={handleInstanceSave}
        onCancel={() => setShowInstanceForm(false)}
      />
    </div>
  );
}
