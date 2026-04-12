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
      ? "inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
      : "inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/8";

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
    <section className="border-b border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">{eyebrow}</p>

          <h1 className="max-w-3xl text-balance font-serif text-4xl leading-[1.04] font-semibold tracking-normal text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">{description}</p>

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
      <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">{eyebrow}</p>

      <h2 className="mb-4 text-balance font-serif text-3xl font-semibold leading-[1.05] tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <p className={`${isLeft ? "" : "mx-auto"} max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg`}>
        {description}
      </p>
    </div>
  );
}
