'use client';

import { useState, useEffect } from 'react';
import { XIcon, PlusIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, LoaderIcon } from 'lucide-react';
import type { MemoInstance } from '@/lib/scratch/types';
import { instanceStorage } from '@/lib/scratch/storage';
import { testConnection } from '@/lib/scratch/api';
import { InstanceSetupForm } from './instance-setup-form';

interface SettingsPanelProps {
  onClose: () => void;
  onInstancesChange: () => void;
}

export function SettingsPanel({ onClose, onInstancesChange }: SettingsPanelProps) {
  const [instances, setInstances] = useState<MemoInstance[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInstance, setEditingInstance] = useState<MemoInstance | undefined>();
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = async () => {
    const loaded = await instanceStorage.getAll();
    setInstances(loaded);
  };

  const handleAdd = () => {
    setEditingInstance(undefined);
    setShowForm(true);
  };

  const handleEdit = (instance: MemoInstance) => {
    setEditingInstance(instance);
    setShowForm(true);
  };

  const handleSave = async (instance: MemoInstance) => {
    if (editingInstance) {
      await instanceStorage.update(instance.id, instance);
    } else {
      // If this is the first instance, make it default
      if (instances.length === 0) {
        instance.isDefault = true;
      }
      await instanceStorage.add(instance);
    }
    setShowForm(false);
    setEditingInstance(undefined);
    await loadInstances();
    onInstancesChange();
  };

  const handleRemove = async (id: string) => {
    if (confirm('Remove this instance? This will not delete any data from your server.')) {
      await instanceStorage.remove(id);
      await loadInstances();
      onInstancesChange();
    }
  };

  const handleSetDefault = async (id: string) => {
    await instanceStorage.setDefault(id);
    await loadInstances();
    onInstancesChange();
  };

  const handleTest = async (instance: MemoInstance) => {
    setTestingId(instance.id);
    const result = await testConnection(instance.url, instance.accessToken);

    if (result.success) {
      await instanceStorage.update(instance.id, {
        status: 'connected',
        lastConnected: new Date(),
      });
    } else {
      await instanceStorage.update(instance.id, {
        status: 'error',
      });
    }

    await loadInstances();
    setTestingId(null);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Instance Management</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Connected Instances</h3>
              <button
                onClick={handleAdd}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Instance</span>
              </button>
            </div>

            {instances.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No instances configured yet.</p>
                <button
                  onClick={handleAdd}
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Add your first instance
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {instances.map((instance) => (
                  <div
                    key={instance.id}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {instance.name}
                          </h4>
                          {instance.isDefault && (
                            <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                              Default
                            </span>
                          )}
                          {instance.status === 'connected' && (
                            <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          )}
                          {instance.status === 'error' && (
                            <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{instance.url}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Last connected: {formatDate(instance.lastConnected)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTest(instance)}
                        disabled={testingId === instance.id}
                        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 flex items-center"
                      >
                        {testingId === instance.id ? (
                          <>
                            <LoaderIcon className="w-3 h-3 mr-1 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          'Test'
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(instance)}
                        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
                      >
                        <EditIcon className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      {!instance.isDefault && (
                        <button
                          onClick={() => handleSetDefault(instance.id)}
                          className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(instance.id)}
                        className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center"
                      >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <InstanceSetupForm
          existingInstance={editingInstance}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingInstance(undefined);
          }}
        />
      )}
    </>
  );
}
