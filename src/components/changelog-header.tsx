import { CalendarIcon, TagIcon } from "lucide-react";

interface ChangelogHeaderProps {
  version: string;
  date?: string;
  isLatest?: boolean;
  breaking?: boolean;
}

/**
 * Reusable header component for changelog detail pages
 */
export function ChangelogHeader({ version, date, isLatest = false, breaking = false }: ChangelogHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg">
          <TagIcon className="w-5 h-5" />
        </div>
        {isLatest && <span className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-full">Latest Release</span>}
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-4 leading-tight">{version}</h1>

      {date && (
        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-6">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {/* Breaking Changes Warning */}
      {breaking && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border border-red-200 dark:border-red-800 rounded-xl p-5 shadow-lg mb-6">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-300 mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg">
              <span className="text-lg">⚠️</span>
            </div>
            <span className="font-bold text-lg">Breaking Changes</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
            This release includes breaking changes. Please review the changelog carefully before updating.
          </p>
        </div>
      )}
    </header>
  );
}
