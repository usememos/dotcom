'use client';

import { CloudIcon, PlayIcon } from 'lucide-react';

interface WelcomeScreenProps {
  onConnect: () => void;
  onDemo: () => void;
}

export function WelcomeScreen({ onConnect, onDemo }: WelcomeScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to Memos Scratchpad
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A local workspace for temporary brainstorming that connects to your self-hosted Memos instance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={onConnect}
            className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CloudIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Connect Your Instance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Save your work to your self-hosted Memos server
              </p>
            </div>
          </button>

          <button
            onClick={onDemo}
            className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlayIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Try Demo Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore features without connecting (no saving)
              </p>
            </div>
          </button>
        </div>

        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="text-amber-600 dark:text-amber-400 text-xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Important: Data Loss Prevention
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Scratch items are stored in your browser only. Data will be lost if you clear browser data,
                switch devices/browsers, or use incognito mode. Save important items to your Memos instance!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
            <span className="mr-2">🔒</span> Privacy & Security
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Tokens stored encrypted in your browser only</li>
            <li>• Files stored locally until you save to your instance</li>
            <li>• No data sent to usememos.com servers</li>
            <li>• Direct connection to your instance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
