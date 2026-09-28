import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export interface LinkGridItem {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  /** Shown instead of the arrow, for example "WIP". */
  badge?: string;
}

/** A lean open grid of destinations: icon, title, and one line, with no card chrome. */
export function LinkGrid({ items, columns = 3 }: { items: readonly LinkGridItem[]; columns?: 2 | 3 }) {
  return (
    <ul className={`grid w-full gap-x-10 gap-y-9 text-left sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            prefetch={false}
            className="group flex gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-300"
          >
            <span className="mt-0.5 text-zinc-400 transition-colors group-hover:text-brand-700 dark:text-zinc-500 dark:group-hover:text-brand-300">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold tracking-tight text-zinc-950 transition-colors group-hover:text-brand-700 sm:text-lg dark:text-zinc-100 dark:group-hover:text-brand-300">
                  {item.title}
                </span>
                {item.badge ? (
                  <span className="shrink-0 rounded-md border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                    {item.badge}
                  </span>
                ) : (
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-zinc-300 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-brand-700 dark:text-zinc-600 dark:group-hover:text-brand-300"
                  />
                )}
              </span>
              <span className="mt-1.5 block text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
