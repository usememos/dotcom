import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

interface ChangelogFooterProps {
  version: string;
  date?: string;
}

/**
 * Reusable footer component for changelog detail pages
 */
export function ChangelogFooter({ version, date }: ChangelogFooterProps) {
  return (
    <footer className="mt-8">
      <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-700 border border-gray-100 dark:border-gray-700 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-1">
              Release <span className="font-bold text-gray-900 dark:text-gray-100">{version}</span>
            </p>
            {date && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Released on{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/changelog"
              className="px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm text-sm text-center"
            >
              All Releases
            </Link>
            <a
              href="https://github.com/usememos/memos/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg text-sm"
            >
              <span>View on GitHub</span>
              <ExternalLinkIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
