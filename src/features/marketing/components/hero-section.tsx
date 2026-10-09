import { ArrowRightIcon, CheckIcon, PlayCircleIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeroAmbient } from "@/features/marketing/components/hero-ambient";
import styles from "@/features/marketing/components/home-hero.module.css";
import { MemoHeroMock } from "@/features/marketing/components/memo-hero-mock";
import { BRAND_PROOF_POINTS } from "@/shared/lib/branding";

interface HeroSectionProps {
  version?: string;
  title: ReactNode;
  subtitle: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
    external?: boolean;
  };
}

export function HeroSection({ version = "26.10-rc.1", title, subtitle, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-white dark:bg-zinc-950">
      <HeroAmbient />
      <div className="site-container grid gap-12 pt-12 pb-16 sm:pt-14 sm:pb-20 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:py-20">
        <div className={`${styles.copy} min-w-0`}>
          {version ? (
            <Link
              href={`/changelog/${version.replace(/\./g, "-")}`}
              prefetch={false}
              className="group inline-flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-300 text-xs font-medium tracking-[0.14em] text-zinc-500 uppercase transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <TagIcon className="size-3.5 text-brand-600 dark:text-brand-300" />
              <span>{version.includes("-") ? "Release candidate" : "Latest release"}</span>
              <span className="font-semibold tracking-normal text-zinc-800 normal-case dark:text-zinc-200">
                {version.startsWith("0.") ? `v${version}` : version}
              </span>
              <ArrowRightIcon className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
            </Link>
          ) : null}

          <h1 className="mt-6 text-balance font-serif text-[clamp(2.25rem,12vw,3.25rem)] leading-[0.96] font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-[4.25rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-md text-pretty text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-zinc-500 dark:text-zinc-400 sm:text-sm">
            {BRAND_PROOF_POINTS.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckIcon className="size-3.5 text-brand-600 dark:text-brand-300" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCta.href}
              prefetch={false}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-300 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white sm:w-auto"
            >
              {primaryCta.text}
              <ArrowRightIcon className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
            </Link>
            <Link
              href={secondaryCta.href}
              prefetch={false}
              target={secondaryCta.external ? "_blank" : undefined}
              rel={secondaryCta.external ? "noopener noreferrer" : undefined}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white/80 px-5 py-3 text-sm font-semibold text-zinc-900 backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-300 hover:bg-zinc-50 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/8 sm:w-auto"
            >
              <PlayCircleIcon className="size-4" />
              {secondaryCta.text}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[54rem] lg:mx-0 lg:justify-self-end">
          <MemoHeroMock />
        </div>
      </div>
    </section>
  );
}
