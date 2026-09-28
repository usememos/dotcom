import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { type MarketingAction, MarketingActions } from "@/features/marketing/components/marketing-page";

interface PageHeroProps {
  eyebrow: ReactNode;
  title: ReactNode;
  lead: ReactNode;
  /** A quieter second paragraph under the lead. */
  detail?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  back?: { href: string; label: string };
  actions?: readonly MarketingAction[];
  /** The page's proof, centered under the copy. */
  children?: ReactNode;
}

/** The centered page hero for catalog pages: eyebrow, thesis, lead, actions, then the product proof. */
export function PageHero({ eyebrow, title, lead, detail, icon, badge, back, actions = [], children }: PageHeroProps) {
  return (
    <section className="py-14 lg:py-20">
      <div className="site-container flex flex-col items-center text-center">
        {back ? (
          <Link
            href={back.href}
            prefetch={false}
            className="group mb-10 inline-flex items-center gap-2 self-start rounded-sm text-sm font-semibold text-zinc-500 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:text-zinc-400 dark:hover:text-brand-300 dark:focus-visible:outline-brand-300"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1" />
            {back.label}
          </Link>
        ) : null}
        <div className="flex items-center gap-2.5">
          {icon ? <span className="text-brand-700 dark:text-brand-300">{icon}</span> : null}
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">{eyebrow}</p>
          {badge}
        </div>
        <h1 className="mt-5 max-w-4xl text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-zinc-700 sm:text-lg dark:text-zinc-200">{lead}</p>
        {detail ? (
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-7 text-zinc-500 sm:text-base dark:text-zinc-400">{detail}</p>
        ) : null}
        {actions.length > 0 ? (
          <div className="mt-9">
            <MarketingActions actions={actions} />
          </div>
        ) : null}
        {children ? <div className="mt-14 w-full sm:mt-16">{children}</div> : null}
      </div>
    </section>
  );
}
