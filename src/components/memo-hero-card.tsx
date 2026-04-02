import { EllipsisVertical, MapPin } from "lucide-react";
import type { ReactNode } from "react";

type MemoHeroCardProps = {
  title: ReactNode;
  tags: string[];
  children: ReactNode;
  footer?: ReactNode;
  location?: string;
  className?: string;
  date: string;
};

export function MemoHeroCard({ title, tags, children, footer, location, className = "", date }: MemoHeroCardProps) {
  return (
    <article
      className={`relative flex h-full min-h-[24rem] w-full flex-col items-start px-5 py-4 text-stone-900 dark:text-stone-100 sm:px-6 sm:py-5 ${className}`}
    >
      <div className="mb-4 flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">{date}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-stone-400 dark:text-stone-500">
          <EllipsisVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col">
        <div className="space-y-3.5">
          <h2 className="border-b border-stone-200 pb-3.5 text-lg font-semibold tracking-tight dark:border-white/10 sm:text-xl">{title}</h2>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-stone-300/70 bg-stone-100 px-2 py-0.5 text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4 pt-4 text-sm leading-6">{children}</div>

        {location && (
          <div className="relative mt-auto w-full overflow-hidden pt-4">
            <div className="inline-flex h-7 items-center gap-1 rounded-md border border-stone-300/70 bg-stone-100/80 px-2 text-xs text-stone-500 dark:border-white/10 dark:bg-white/6 dark:text-stone-300">
              <MapPin className="h-3.5 w-3.5" />
              <span>[48.86°, 2.35°]</span>
              <span className="max-w-[10rem] truncate sm:max-w-none">{location}</span>
            </div>
          </div>
        )}

        {footer ? <div className="w-full pt-4">{footer}</div> : null}
      </div>
    </article>
  );
}
