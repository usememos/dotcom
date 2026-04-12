import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { formatChangelogDate } from "@/lib/changelog";

interface ChangelogListItemProps {
  breaking?: boolean;
  date?: string;
  description?: string;
  href: string;
  isLatest?: boolean;
  version: string;
}

export function ChangelogListItem({ breaking = false, date, description, href, isLatest = false, version }: ChangelogListItemProps) {
  return (
    <article className="group">
      <Link href={href} className="block rounded-lg px-4 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          {date ? (
            <span className="text-zinc-700/90 dark:text-zinc-700/90">{formatChangelogDate(date)}</span>
          ) : (
            <span className="text-zinc-700/90 dark:text-zinc-700/90">Release</span>
          )}
          {isLatest && <span className="text-amber-700 dark:text-amber-300">Latest</span>}
          {breaking && <span className="text-red-700 dark:text-red-300">Breaking</span>}
        </div>

        <h2 className="max-w-4xl text-balance font-serif text-2xl font-semibold tracking-normal text-zinc-950 transition-colors duration-300 dark:text-zinc-100 sm:text-3xl lg:text-[2.75rem] lg:leading-[1.04]">
          {version}
        </h2>

        {description && <p className="mt-4 max-w-4xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p>}

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition-colors duration-300 dark:text-zinc-200 sm:text-base">
          <span>Read release</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
