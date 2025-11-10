'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  UploadIcon,
  TrashIcon,
  SettingsIcon,
  AlertCircleIcon,
  UserIcon,
  CloudIcon,
} from 'lucide-react';
import { WelcomeScreen } from '@/components/scratch/welcome-screen';
import { InstanceSetupForm } from '@/components/scratch/instance-setup-form';
import { Canvas } from '@/components/scratch/canvas';
import { SaveDialog } from '@/components/scratch/save-dialog';
import { SettingsPanel } from '@/components/scratch/settings-panel';
import type { ScratchpadItem, MemoInstance, SaveToMemosOptions } from '@/lib/scratch/types';
import { itemStorage, instanceStorage, settingsStorage, getStorageQuota, formatBytes } from '@/lib/scratch/storage';
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
  const [storageQuota, setStorageQuota] = useState({ usage: 0, quota: 0, percentage: 0 });
  const [isDemoMode, setIsDemoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true);
    loadData();
    updateStorageQuota();

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

  const updateStorageQuota = async () => {
    const quota = await getStorageQuota();
    setStorageQuota(quota);
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
    // Check storage quota
    if (storageQuota.percentage > 95) {
      alert('Storage quota exceeded! Please clear some items.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size limits
      const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Max size: ${formatBytes(maxSize)}`);
        continue;
      }

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
    await updateStorageQuota();
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
      await updateStorageQuota();
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
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
            Memos
          </Link>
          <div className="flex items-center space-x-4">
            {hasInstances && defaultInstance && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <CloudIcon className="w-4 h-4" />
                <span>{defaultInstance.name}</span>
              </div>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Scratch</h1>
            {isDemoMode && (
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm rounded-full">
                Demo Mode
              </span>
            )}
            {!hasInstances && !isDemoMode && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm rounded-full">
                <AlertCircleIcon className="w-4 h-4" />
                <span>Not connected</span>
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCreateTextItem(100, 100)}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Text</span>
            </button>
            <button
              onClick={handleFileButtonClick}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition"
            >
              <UploadIcon className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <button
              onClick={handleClearAll}
              disabled={items.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Clear</span>
            </button>
            {!hasInstances && !isDemoMode && (
              <button
                onClick={() => setShowInstanceForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                <CloudIcon className="w-4 h-4" />
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <Canvas
          items={items}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onSaveItem={handleSaveItem}
          onCreateTextItem={handleCreateTextItem}
          onFileUpload={handleFileUpload}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold">{items.length}</span> items
          </div>
          <div>
            Storage: {formatBytes(storageQuota.usage)}
            {storageQuota.quota > 0 && ` / ${formatBytes(storageQuota.quota)}`}
            {storageQuota.percentage > 0 && ` (${storageQuota.percentage.toFixed(1)}%)`}
            {storageQuota.percentage > 80 && (
              <span className="ml-2 text-amber-600 dark:text-amber-400">
                <AlertCircleIcon className="w-4 h-4 inline" />
              </span>
            )}
          </div>
        </div>
      </footer>

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
