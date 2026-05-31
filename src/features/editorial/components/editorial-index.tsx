import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/shared/lib/seo";
import { cn } from "@/shared/lib/utils";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

export interface EditorialIndexMetric {
  icon?: ReactNode;
  label: ReactNode;
}

export interface EditorialIndexHeaderProps {
  breadcrumbs: readonly BreadcrumbItem[];
  description: ReactNode;
  eyebrow: string;
  metrics?: readonly EditorialIndexMetric[];
  title: ReactNode;
}

export interface EditorialLabel {
  label: ReactNode;
  tone?: "default" | "accent" | "danger";
}

interface EditorialIndexShellProps {
  children: ReactNode;
}

interface EditorialListProps {
  children: ReactNode;
}

interface EditorialListItemProps {
  actionLabel: string;
  description?: ReactNode;
  href: string;
  labels?: readonly EditorialLabel[];
  meta?: ReactNode;
  title: ReactNode;
}

interface EditorialEmptyStateProps {
  description: ReactNode;
  icon: ReactNode;
  title: ReactNode;
}

function getLabelClassName(tone: EditorialLabel["tone"] = "default") {
  if (tone === "accent") {
    return "text-amber-700 dark:text-amber-300";
  }

  if (tone === "danger") {
    return "text-red-700 dark:text-red-300";
  }

  return "text-zinc-700/90 dark:text-zinc-300";
}

export function EditorialIndexShell({ children }: EditorialIndexShellProps) {
  return (
    <section className="px-4 py-14 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-[48rem]">{children}</div>
    </section>
  );
}

export function EditorialIndexHeader({ breadcrumbs, description, eyebrow, metrics = [], title }: EditorialIndexHeaderProps) {
  return (
    <div className="mb-12 border-b border-zinc-200 pb-10 dark:border-white/10 sm:mb-16">
      <Breadcrumbs items={breadcrumbs} className="mb-10" />
      <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">{eyebrow}</p>
      <h1 className="text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p>

      {metrics.length > 0 ? (
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          {metrics.map((metric, index) => (
            <div key={typeof metric.label === "string" ? metric.label : `metric-${index}`} className="inline-flex items-center gap-2">
              {metric.icon ? (
                <span className="flex h-4 w-4 items-center justify-center text-zinc-500 dark:text-zinc-400">{metric.icon}</span>
              ) : null}
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function EditorialList({ children }: EditorialListProps) {
  return <div className="space-y-8 sm:space-y-10">{children}</div>;
}

export function EditorialListItem({ actionLabel, description, href, labels = [], meta, title }: EditorialListItemProps) {
  return (
    <article className="group">
      <Link
        href={href}
        prefetch={false}
        className="-mx-4 block rounded-lg px-4 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
      >
        {labels.length > 0 ? (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
            {labels.map((item, index) => (
              <span
                key={typeof item.label === "string" ? item.label : `label-${index}`}
                className={cn("leading-5", getLabelClassName(item.tone))}
              >
                {item.label}
              </span>
            ))}
          </div>
        ) : null}

        <h2 className="max-w-4xl text-balance font-serif text-2xl font-semibold tracking-normal text-zinc-950 transition-colors duration-300 dark:text-zinc-100 sm:text-3xl lg:text-[2.35rem] lg:leading-[1.1]">
          {title}
        </h2>

        {description ? (
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p>
        ) : null}

        {meta ? <div className="mt-6 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">{meta}</div> : null}

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition-colors duration-300 dark:text-zinc-200 sm:text-base">
          <span>{actionLabel}</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}

export function EditorialEmptyState({ description, icon, title }: EditorialEmptyStateProps) {
  return (
    <div className="py-12 text-center sm:py-16">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 dark:bg-white/5 sm:mb-6 sm:h-16 sm:w-16">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-medium text-zinc-900 dark:text-zinc-100 sm:text-lg">{title}</h3>
      <p className="px-4 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">{description}</p>
    </div>
  );
}
