'use client';

import { useState, useEffect } from 'react';
import { LoaderIcon, XIcon } from 'lucide-react';
import type { MemoInstance, ScratchpadItem, SaveToMemosOptions } from '@/lib/scratch/types';
import { instanceStorage } from '@/lib/scratch/storage';

interface SaveDialogProps {
  item: ScratchpadItem;
  onSave: (instanceId: string, options: SaveToMemosOptions) => Promise<void>;
  onCancel: () => void;
}

export function SaveDialog({ item, onSave, onCancel }: SaveDialogProps) {
  const [instances, setInstances] = useState<MemoInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC' | 'PROTECTED'>('PRIVATE');
  const [tags, setTags] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    instanceStorage.getAll().then((loaded) => {
      setInstances(loaded);
      const defaultInstance = loaded.find((i) => i.isDefault) || loaded[0];
      if (defaultInstance) {
        setSelectedInstanceId(defaultInstance.id);
      }
    });
  }, []);

  const handleSave = async () => {
    if (!selectedInstanceId) {
      setError('Please select an instance');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave(selectedInstanceId, {
        instanceId: selectedInstanceId,
        tags: tagsArray,
        visibility,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  };

  const getPreviewContent = () => {
    if (item.type === 'text') {
      return item.content || 'Empty note';
    } else if (item.fileRef) {
      return `File: ${item.fileRef.name} (${(item.fileRef.size / 1024).toFixed(2)} KB)`;
    }
    return 'Unknown item';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Save to Memos</h3>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instance Selection */}
          {instances.length > 1 && (
            <div>
              <label htmlFor="instance" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Instance
              </label>
              <select
                id="instance"
                value={selectedInstanceId}
                onChange={(e) => setSelectedInstanceId(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
              >
                {instances.map((instance) => (
                  <option key={instance.id} value={instance.id}>
                    {instance.name} {instance.isDefault && '(Default)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {instances.length === 1 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Saving to: <strong>{instances[0].name}</strong>
              </p>
            </div>
          )}

          {/* Content Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Content Preview
            </label>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{getPreviewContent()}</p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags <span className="text-gray-500">(optional, comma-separated)</span>
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., brainstorm, ideas, todo"
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Visibility */}
          <div>
            <label htmlFor="visibility" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Visibility
            </label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'PRIVATE' | 'PUBLIC' | 'PROTECTED')}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
            >
              <option value="PRIVATE">Private</option>
              <option value="PROTECTED">Protected</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedInstanceId}
            className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? (
              <>
                <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
