import { ArrowRight, PlayCircleIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { MemoHeroMock } from "@/components/memo-hero-mock";

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

export function HeroSection({ version = "0.26.2", title, subtitle, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-(--fd-layout-width) px-4 pt-12 sm:px-6 lg:pt-18">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              {version && (
                <Link
                  href={`/changelog/${version.replace(/\./g, "-")}`}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase transition-colors hover:text-zinc-950 dark:hover:text-zinc-100"
                >
                  <SparklesIcon className="h-3.5 w-3.5" />
                  <span>Latest Release</span>
                  <span className="font-semibold tracking-normal text-zinc-800 normal-case dark:text-zinc-200">v{version}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            <h1 className="mx-auto max-w-5xl text-balance font-serif text-5xl leading-[1.02] font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl md:text-7xl lg:text-8xl">
              {title}
            </h1>

            <p className="mx-auto mt-7 max-w-[37rem] text-balance text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">
              {subtitle}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Private timeline</span>
              <span>Markdown-native</span>
              <span>Self-hosted</span>
            </div>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                {primaryCta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryCta.href}
                target={secondaryCta.external ? "_blank" : undefined}
                rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                <PlayCircleIcon className="h-4 w-4" />
                {secondaryCta.text}
              </Link>
            </div>
          </div>

          <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2 border-t border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 lg:mt-16">
            <div className="mx-auto max-w-[1500px]">
              <MemoHeroMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
