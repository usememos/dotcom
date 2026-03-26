import { ArrowUpRightIcon, CalendarIcon } from "lucide-react";
import { CHANGELOG_ARTICLE_COLUMN_CLASS, formatChangelogDate } from "@/lib/changelog";

interface ChangelogHeaderProps {
  description?: string;
  date?: string;
  breaking?: boolean;
  isLatest?: boolean;
  version: string;
}

export function ChangelogHeader({ breaking = false, date, description, isLatest = false, version }: ChangelogHeaderProps) {
  return (
    <div className={CHANGELOG_ARTICLE_COLUMN_CLASS}>
      <header className="max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 sm:mb-6">
          <span className="text-teal-700/90 dark:text-teal-300/90">Release Notes</span>
          {isLatest && <span className="text-amber-700 dark:text-amber-300">Latest Release</span>}
          {breaking && <span className="text-red-700 dark:text-red-300">Upgrade Carefully</span>}
        </div>

        <h1 className="mb-5 font-serif text-3xl font-bold leading-[1.02] tracking-tight text-gray-950 dark:text-gray-50 sm:text-4xl lg:text-5xl xl:text-[4.25rem]">
          {version}
        </h1>

        {description && <p className="max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">{description}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-300">
          {date && (
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 flex-shrink-0 text-teal-600 dark:text-teal-400" />
              <span className="leading-6">{formatChangelogDate(date)}</span>
            </div>
          )}

          <a
            href={`https://github.com/usememos/memos/releases/tag/${version}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-semibold text-gray-700 transition-colors hover:text-teal-700 dark:text-gray-200 dark:hover:text-teal-300"
          >
            <span>View tagged release</span>
            <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {breaking && (
          <div className="mt-8 border-l-2 border-red-500/70 pl-4 text-sm leading-7 text-red-700 dark:text-red-300 sm:pl-5 sm:text-base">
            This release includes breaking changes. Review the notes before updating production or shared instances.
          </div>
        )}
      </header>
    </div>
  );
}
