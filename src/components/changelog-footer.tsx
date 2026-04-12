import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { CHANGELOG_ARTICLE_COLUMN_CLASS, formatChangelogDate } from "@/lib/changelog";

interface ChangelogFooterProps {
  date?: string;
  version: string;
}

export function ChangelogFooter({ version, date }: ChangelogFooterProps) {
  return (
    <div className={CHANGELOG_ARTICLE_COLUMN_CLASS}>
      <footer className="mt-10 sm:mt-14">
        <div className="border-t border-zinc-200/80 pt-6 dark:border-white/10 sm:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Release {version}</p>
              {date && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Published on {formatChangelogDate(date)}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/changelog"
                className="text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-700 dark:text-zinc-200 dark:hover:text-zinc-700 sm:text-base"
              >
                All Releases
              </Link>
              <a
                href="https://github.com/usememos/memos/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-700 dark:text-zinc-700 dark:hover:text-zinc-700 sm:text-base"
              >
                <span>GitHub Releases</span>
                <ExternalLinkIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
