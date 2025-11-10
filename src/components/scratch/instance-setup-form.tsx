'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LoaderIcon, CheckCircleIcon, XCircleIcon, HelpCircleIcon, XIcon } from 'lucide-react';
import { testConnection } from '@/lib/scratch/api';
import type { MemoInstance } from '@/lib/scratch/types';

interface InstanceSetupFormProps {
  open: boolean;
  onSave: (instance: MemoInstance) => void;
  onCancel: () => void;
  existingInstance?: MemoInstance;
}

export function InstanceSetupForm({ open, onSave, onCancel, existingInstance }: InstanceSetupFormProps) {
  const [name, setName] = useState(existingInstance?.name || '');
  const [url, setUrl] = useState(existingInstance?.url || '');
  const [token, setToken] = useState(existingInstance?.accessToken || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    if (!url || !token) {
      setTestResult({ success: false, message: 'Please fill in URL and access token' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection(url, token);

      if (result.success) {
        setTestResult({
          success: true,
          message: `Connected as ${result.username} ✓`,
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || 'Connection failed',
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Unexpected error during connection test',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!url || !token) {
      setTestResult({ success: false, message: 'Please fill in required fields' });
      return;
    }

    const instance: MemoInstance = {
      id: existingInstance?.id || `instance-${Date.now()}`,
      name: name || 'My Memos Instance',
      url: url.replace(/\/$/, ''),
      accessToken: token,
      isDefault: existingInstance?.isDefault || false,
      lastConnected: null,
      status: testResult?.success ? 'connected' : 'untested',
    };

    onSave(instance);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50 p-8">
          <Dialog.Title className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {existingInstance ? 'Edit Instance' : 'Connect Memos Instance'}
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 dark:text-gray-400 mb-8">
            Enter your self-hosted Memos instance details to enable saving.
          </Dialog.Description>
          <Dialog.Close className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <XIcon className="w-5 h-5" />
          </Dialog.Close>

          <div className="space-y-6">
            {/* Instance Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Instance Name <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Personal Notes"
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Instance URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Instance URL <span className="text-red-500">*</span>
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://memo.example.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Access Token */}
            <div>
              <label htmlFor="token" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Access Token <span className="text-red-500">*</span>
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your access token"
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <HelpCircleIcon className="w-4 h-4 mr-1" />
                Get your token: Settings → Access Tokens → Create New Token
              </p>
            </div>

            {/* Test Result */}
            {testResult && (
              <div
                className={`p-4 rounded-xl flex items-center space-x-3 ${
                  testResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                {testResult.success ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p
                  className={`text-sm ${
                    testResult.success
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}
                >
                  {testResult.message}
                </p>
              </div>
            )}
          </div>

          {/* CORS Help */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Your Memos instance must have CORS enabled for{' '}
              <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">
                https://usememos.com
              </code>
              . Add this to your instance environment:
            </p>
            <code className="block mt-2 p-2 bg-blue-100 dark:bg-blue-900/50 rounded text-xs text-blue-900 dark:text-blue-200">
              MEMOS_CORS_ALLOW_ORIGINS=https://usememos.com
            </code>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleTest}
              disabled={testing || !url || !token}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {testing ? (
                <>
                  <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>

            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!url || !token}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save & Connect
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
