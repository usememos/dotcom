"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircleIcon, HelpCircleIcon, LoaderIcon, XCircleIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { testConnection } from "@/lib/scratch/api";
import type { MemoInstance } from "@/lib/scratch/types";

interface InstanceSetupFormProps {
  open: boolean;
  onSave: (instance: MemoInstance) => void;
  onCancel: () => void;
  existingInstance?: MemoInstance;
}

export function InstanceSetupForm({ open, onSave, onCancel, existingInstance }: InstanceSetupFormProps) {
  const [name, setName] = useState(existingInstance?.name || "");
  const [url, setUrl] = useState(existingInstance?.url || "");
  const [token, setToken] = useState(existingInstance?.accessToken || "");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    statusTone?: "success" | "warning" | "error";
    serverProfile?: MemoInstance["serverProfile"];
  } | null>(null);

  const handleTest = async () => {
    if (!url || !token) {
      setTestResult({
        success: false,
        message: "Please fill in URL and access token",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const result = await testConnection(url, token);

      if (result.success) {
        const supportStatus = result.serverProfile?.supportStatus;
        const versionLabel = result.serverProfile?.rawVersion || "Unknown version";
        const isSupported = supportStatus === "supported";
        setTestResult({
          success: true,
          statusTone: isSupported ? "success" : "warning",
          serverProfile: result.serverProfile,
          message: isSupported
            ? `Connected as ${result.username} · ${versionLabel} · Supported`
            : `Connected as ${result.username} · ${versionLabel} · Unsupported`,
        });
      } else {
        setTestResult({
          success: false,
          statusTone: "error",
          message: result.error || "Connection failed",
        });
      }
    } catch (_error) {
      setTestResult({
        success: false,
        message: "Unexpected error during connection test",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!url || !token) {
      setTestResult({
        success: false,
        message: "Please fill in required fields",
      });
      return;
    }

    const instance: MemoInstance = {
      id: existingInstance?.id || `instance-${Date.now()}`,
      name: name || "My Memos Instance",
      url: url.replace(/\/$/, ""),
      accessToken: token,
      isDefault: existingInstance?.isDefault || false,
      lastConnected: null,
      status: testResult?.success ? (testResult.serverProfile?.supportStatus === "supported" ? "connected" : "unsupported") : "untested",
      serverProfile: testResult?.serverProfile,
    };

    onSave(instance);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-1.5rem)] w-[min(calc(100vw-1.5rem),42rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.25rem] bg-white p-5 shadow-2xl dark:bg-gray-800 sm:max-h-[90vh] sm:rounded-2xl sm:p-8">
          <Dialog.Title className="mb-2 pr-10 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
            {existingInstance ? "Edit Instance" : "Connect Memos Instance"}
          </Dialog.Title>
          <Dialog.Description className="mb-6 pr-10 text-sm text-gray-600 dark:text-gray-400 sm:mb-8 sm:text-base">
            Enter your self-hosted Memos instance details to enable saving.
          </Dialog.Description>
          <Dialog.Close className="absolute top-4 right-4 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300 sm:top-6 sm:right-6">
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
              <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <HelpCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Get your token: Settings → Access Tokens → Create New Token</span>
              </p>
            </div>

            {/* Test Result */}
            {testResult && (
              <div
                className={`p-4 rounded-xl flex items-center space-x-3 ${
                  (testResult.statusTone || (testResult.success ? "success" : "error")) === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : (testResult.statusTone || (testResult.success ? "success" : "error")) === "warning"
                      ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                {(testResult.statusTone || (testResult.success ? "success" : "error")) === "success" ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (testResult.statusTone || (testResult.success ? "success" : "error")) === "warning" ? (
                  <HelpCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p
                  className={`text-sm ${
                    (testResult.statusTone || (testResult.success ? "success" : "error")) === "success"
                      ? "text-green-800 dark:text-green-300"
                      : (testResult.statusTone || (testResult.success ? "success" : "error")) === "warning"
                        ? "text-amber-800 dark:text-amber-300"
                        : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {testResult.message}
                </p>
              </div>
            )}
          </div>

          {/* CORS Help */}
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/10">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Your Memos instance must have CORS enabled for{" "}
              <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">https://usememos.com</code>. Add this to your instance
              environment:
            </p>
            <code className="mt-2 block break-all rounded bg-blue-100 p-2 text-xs text-blue-900 dark:bg-blue-900/50 dark:text-blue-200">
              MEMOS_CORS_ALLOW_ORIGINS=https://usememos.com
            </code>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !url || !token}
              className="flex w-full items-center justify-center rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 sm:flex-1"
            >
              {testing ? (
                <>
                  <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!url || !token}
              className="w-full rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Save & Connect
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
