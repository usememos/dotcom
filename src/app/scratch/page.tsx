'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TrashIcon,
  SettingsIcon,
  CloudIcon,
} from 'lucide-react';
import { WelcomeScreen } from '@/components/scratch/welcome-screen';
import { InstanceSetupForm } from '@/components/scratch/instance-setup-form';
import { Canvas } from '@/components/scratch/canvas';
import { SaveDialog } from '@/components/scratch/save-dialog';
import { SettingsPanel } from '@/components/scratch/settings-panel';
import type { ScratchpadItem, MemoInstance, SaveToMemosOptions } from '@/lib/scratch/types';
import { itemStorage, instanceStorage, settingsStorage } from '@/lib/scratch/storage';
import { saveFile, createFileData, getFile, deleteFile } from '@/lib/scratch/indexeddb';
import { saveScratchpadItemToMemos } from '@/lib/scratch/api';

export default function ScratchPage() {
  const [isClient, setIsClient] = useState(false);
  const [items, setItems] = useState<ScratchpadItem[]>([]);
  const [instances, setInstances] = useState<MemoInstance[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showInstanceForm, setShowInstanceForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true);
    loadData();

    // Check first visit
    if (settingsStorage.isFirstVisit()) {
      setShowWelcome(true);
    }
  }, []);

  const loadData = async () => {
    const loadedItems = itemStorage.getAll();
    const loadedInstances = await instanceStorage.getAll();
    setItems(loadedItems);
    setInstances(loadedInstances);
  };

  const handleWelcomeConnect = () => {
    setShowWelcome(false);
    setShowInstanceForm(true);
    settingsStorage.setNotFirstVisit();
  };

  const handleWelcomeDemo = () => {
    setShowWelcome(false);
    setIsDemoMode(true);
    settingsStorage.setNotFirstVisit();
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
      width: 300,
      height: 200,
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

  const handleSaveItem = (id: string) => {
    if (instances.length === 0 && !isDemoMode) {
      setShowInstanceForm(true);
      return;
    }

    if (isDemoMode) {
      alert('Demo mode: Saving is disabled. Connect an instance to save items.');
      return;
    }

    setSavingItemId(id);
  };

  const handleSaveToMemos = async (instanceId: string, options: SaveToMemosOptions) => {
    if (!savingItemId) return;

    const item = items.find((i) => i.id === savingItemId);
    if (!item) return;

    const instance = instances.find((i) => i.id === instanceId);
    if (!instance) {
      throw new Error('Instance not found');
    }

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

      // Add tags to content if provided
      if (options.tags && options.tags.length > 0) {
        content += '\n\n' + options.tags.map((tag) => `#${tag}`).join(' ');
      }

      const memo = await saveScratchpadItemToMemos(instance, content, files, options);

      // Update item as saved
      itemStorage.update(savingItemId, {
        savedToInstance: instanceId,
        savedMemoId: memo.id,
      });

      setItems(itemStorage.getAll());
      setSavingItemId(null);

      // Update instance last connected
      await instanceStorage.update(instanceId, {
        lastConnected: new Date(),
        status: 'connected',
      });
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      throw error;
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all items? This cannot be undone.')) {
      itemStorage.clear();
      setItems([]);
    }
  };

  const handleInstancesChange = async () => {
    await loadData();
  };

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  const defaultInstance = instances.find((i) => i.isDefault) || instances[0];
  const hasInstances = instances.length > 0;

  return (
    <div className="relative h-screen bg-white dark:bg-gray-900">
      {/* Top Left Branding */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition shadow-sm group"
        >
          <span className="text-lg font-bold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300">
            Memos
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Scratch</span>
        </Link>
      </div>

      {/* Minimal Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        {isDemoMode && (
          <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm rounded-lg shadow-sm">
            Demo Mode
          </span>
        )}
        {!hasInstances && !isDemoMode && (
          <button
            onClick={() => setShowInstanceForm(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <CloudIcon className="w-4 h-4" />
            <span>Connect Instance</span>
          </button>
        )}
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition shadow-sm"
            title="Clear all items"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition shadow-sm"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
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
        />
      </div>

      {/* Bottom Status Bar */}
      {(items.length > 0 || hasInstances) && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex items-center space-x-3 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-sm">
            {items.length > 0 && (
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{items.length}</span> {items.length === 1 ? 'item' : 'items'}
              </div>
            )}
            {items.length > 0 && hasInstances && defaultInstance && (
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            )}
            {hasInstances && defaultInstance && (
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <CloudIcon className="w-3 h-3" />
                <span>{defaultInstance.name}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showWelcome && (
        <WelcomeScreen onConnect={handleWelcomeConnect} onDemo={handleWelcomeDemo} />
      )}

      {showInstanceForm && (
        <InstanceSetupForm
          onSave={handleInstanceSave}
          onCancel={() => setShowInstanceForm(false)}
        />
      )}

      {savingItemId && (
        <SaveDialog
          item={items.find((i) => i.id === savingItemId)!}
          onSave={handleSaveToMemos}
          onCancel={() => setSavingItemId(null)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          onInstancesChange={handleInstancesChange}
        />
      )}
    </div>
  );
}
