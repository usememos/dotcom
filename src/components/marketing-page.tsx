import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo";
import { cn } from "@/lib/utils";

export interface MarketingAction {
  label: ReactNode;
  href: string;
  external?: boolean;
  icon?: ReactNode;
  showArrow?: boolean;
  variant?: "primary" | "secondary";
}

interface MarketingPageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: readonly MarketingAction[];
  aside?: ReactNode;
  align?: "left" | "center";
  titleSize?: "default" | "large";
}

interface MarketingSectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

interface MarketingSummaryItem {
  key?: string;
  title?: ReactNode;
  description: ReactNode;
}

interface MarketingSummaryBandProps {
  items: readonly MarketingSummaryItem[];
  numbered?: boolean;
}

interface MarketingCtaSectionProps {
  title: ReactNode;
  description: ReactNode;
  actions?: readonly MarketingAction[];
  borderTop?: boolean;
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function MarketingActionLink({
  action,
  variant = action.variant ?? "primary",
}: {
  action: MarketingAction;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "group inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
      : "group inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8";

  const content = (
    <>
      {action.icon}
      <span>{action.label}</span>
      {action.showArrow ? <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" /> : null}
    </>
  );

  if (action.external || isExternalHref(action.href)) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}

export function MarketingActions({ actions, align = "center" }: { actions: readonly MarketingAction[]; align?: "left" | "center" }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", align === "center" ? "justify-center" : "justify-start")}>
      {actions.map((action, index) => (
        <MarketingActionLink
          key={`${action.href}-${index}`}
          action={action}
          variant={action.variant ?? (index === 0 ? "primary" : "secondary")}
        />
      ))}
    </div>
  );
}

export function MarketingPageHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  actions = [],
  aside,
  align = aside ? "left" : "center",
  titleSize = "large",
}: MarketingPageHeroProps) {
  const isLeft = align === "left";

  return (
    <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
      <div className="mx-auto w-full max-w-6xl">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-10" /> : null}
        <div className={cn(aside && "grid gap-10 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:items-end lg:gap-16")}>
          <div className={cn(isLeft ? "max-w-2xl" : "mx-auto max-w-3xl text-center")}>
            <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">{eyebrow}</p>

            <h1
              className={cn(
                "text-balance font-serif font-semibold tracking-normal text-zinc-950 dark:text-zinc-50",
                titleSize === "large"
                  ? "text-5xl leading-[1.04] sm:text-6xl lg:text-7xl"
                  : "text-4xl leading-[1.06] sm:text-6xl lg:text-7xl",
              )}
            >
              {title}
            </h1>

            <p
              className={cn(
                "mt-7 max-w-2xl text-balance text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg",
                !isLeft && "mx-auto",
              )}
            >
              {description}
            </p>

            {actions.length > 0 ? (
              <div className="mt-9">
                <MarketingActions actions={actions} align={align} />
              </div>
            ) : null}
          </div>

          {aside ? <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:justify-self-end">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function MarketingSectionHeader({ eyebrow, title, description, align = "center", className }: MarketingSectionHeaderProps) {
  const isLeft = align === "left";

  return (
    <div className={cn(isLeft ? "mb-10 max-w-2xl" : "mx-auto mb-12 max-w-3xl text-center sm:mb-16", className)}>
      <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">{eyebrow}</p>

      <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className={cn("mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg", !isLeft && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function MarketingSummaryBand({ items, numbered = false }: MarketingSummaryBandProps) {
  return (
    <section className="border-b border-zinc-200 px-4 dark:border-white/10 sm:px-6">
      <div className="mx-auto grid max-w-6xl divide-y divide-zinc-200 dark:divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {items.map((item, index) => (
          <div
            key={
              item.key ??
              (typeof item.title === "string" ? item.title : typeof item.description === "string" ? item.description : `summary-${index}`)
            }
            className="py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0"
          >
            {numbered ? (
              <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
            ) : null}
            {item.title ? <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h2> : null}
            <p className={cn("max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base", item.title ? "mt-3" : "mt-4")}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MarketingCtaSection({ title, description, actions = [], borderTop = false }: MarketingCtaSectionProps) {
  return (
    <section className={cn("px-4 py-14 sm:px-6 lg:py-20", borderTop && "border-t border-zinc-200 dark:border-white/10")}>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p>
        <MarketingActions actions={actions} />
      </div>
    </section>
  );
}
