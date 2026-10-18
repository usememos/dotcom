import { ArrowRightIcon, TagIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";
import { MemoHeroMock } from "@/features/marketing/components/memo-hero-mock";
import { MarketingActions } from "./marketing-page";

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
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950">
      <div className="site-container grid gap-12 pt-12 pb-16 sm:pt-14 sm:pb-20 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:py-20">
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

          <h1 className="mt-6 text-balance font-serif text-[clamp(2.25rem,10.5vw,3.25rem)] leading-[0.96] font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-[4.25rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-md text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8">
            {subtitle}
          </p>

          <div className="mt-6">
            <MarketingActions
              align="left"
              actions={[
                { label: primaryCta.text, href: primaryCta.href },
                { label: secondaryCta.text, href: secondaryCta.href, external: secondaryCta.external },
              ]}
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[54rem] lg:mx-0 lg:justify-self-end">
          <MemoHeroMock />
        </div>
      </div>
    </section>
  );
}
