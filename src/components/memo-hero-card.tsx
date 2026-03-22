import { ChevronDown, EllipsisVertical, Earth, MapPin } from "lucide-react";
import type { ReactNode } from "react";

type MemoHeroCardProps = {
  title: ReactNode;
  tags: string[];
  children: ReactNode;
  footer?: ReactNode;
  location?: string;
  className?: string;
};

export function MemoHeroCard({ title, tags, children, footer, location, className = "" }: MemoHeroCardProps) {
  return (
    <article
      className={`relative flex w-full flex-col items-start gap-2 rounded-[1.1rem] border border-slate-200/80 bg-white/92 px-4 py-3 text-slate-900 dark:border-white/10 dark:bg-slate-950/88 dark:text-slate-100 ${className}`}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">Mar 22, 2026 · 8:37 AM</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-slate-400 dark:text-slate-500">
          <EllipsisVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="space-y-2">
          <h2 className="border-b border-slate-200 pb-2 text-lg font-semibold tracking-tight dark:border-white/10 sm:text-xl">{title}</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-teal-500/30 bg-teal-500/12 px-2 py-0.5 text-teal-700 dark:text-teal-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm leading-6">{children}</div>

        {location && (
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/72" />
            <div className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-slate-100/70 px-2 text-xs text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5" />
              <span>[48.86°, 2.35°]</span>
              <span className="max-w-[10rem] truncate sm:max-w-none">{location}</span>
            </div>
          </div>
        )}

        {footer}
      </div>
    </article>
  );
}
