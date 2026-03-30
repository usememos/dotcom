import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface MarketingAction {
  text: string;
  href: string;
  external?: boolean;
}

interface MarketingPageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  primaryCta?: MarketingAction;
  secondaryCta?: MarketingAction;
  aside?: ReactNode;
}

interface MarketingSectionIntroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  align?: "left" | "center";
}

function MarketingActionLink({ action, variant }: { action: MarketingAction; variant: "primary" | "secondary" }) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
      : "inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-900 backdrop-blur-md transition-colors hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10";

  const content = (
    <>
      <span>{action.text}</span>
      <ArrowRightIcon className="h-4 w-4" />
    </>
  );

  if (action.external) {
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

export function MarketingPageHero({ eyebrow, title, description, primaryCta, secondaryCta, aside }: MarketingPageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_16%_18%,_rgba(20,184,166,0.18),_transparent_24%),radial-gradient(circle_at_78%_22%,_rgba(14,165,233,0.1),_transparent_22%),linear-gradient(180deg,_rgba(246,252,251,1)_0%,_rgba(240,247,246,0.97)_40%,_rgba(255,255,255,1)_100%)] dark:bg-[radial-gradient(circle_at_16%_18%,_rgba(13,148,136,0.18),_transparent_24%),radial-gradient(circle_at_78%_22%,_rgba(8,145,178,0.14),_transparent_22%),linear-gradient(180deg,_rgba(9,13,16,1)_0%,_rgba(10,16,19,0.98)_42%,_rgba(7,10,12,1)_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-position:center] [background-size:32px_32px] dark:opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white dark:to-[#070a0c]" />

      <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-10 px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <span className="tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400">{eyebrow}</span>
          </div>

          <h1 className="max-w-3xl font-serif text-4xl leading-[0.95] font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">{description}</p>

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta ? <MarketingActionLink action={primaryCta} variant="primary" /> : null}
              {secondaryCta ? <MarketingActionLink action={secondaryCta} variant="secondary" /> : null}
            </div>
          )}
        </div>

        {aside ? <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:justify-self-end">{aside}</div> : null}
      </div>
    </section>
  );
}

export function MarketingSectionIntro({ eyebrow, title, description, align = "center" }: MarketingSectionIntroProps) {
  const isLeft = align === "left";

  return (
    <div className={`mb-10 ${isLeft ? "max-w-2xl text-left sm:mb-12" : "mx-auto max-w-3xl text-center sm:mb-16"}`}>
      <div
        className={`mb-5 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200 ${
          isLeft ? "" : "justify-center"
        }`}
      >
        <span className="tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400">{eyebrow}</span>
      </div>

      <h2 className="mb-4 text-balance font-serif text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className={`${isLeft ? "" : "mx-auto"} max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg`}>
        {description}
      </p>
    </div>
  );
}
