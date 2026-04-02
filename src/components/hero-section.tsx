import { ArrowRight, PlayCircleIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { MemoHeroMock } from "@/components/memo-hero-mock";

interface HeroSectionProps {
  version?: string;
  titleLines: [ReactNode, ReactNode];
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

export function HeroSection({ version = "0.26.2", titleLines, subtitle, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-transparent">
      <div className="mx-auto w-full max-w-(--fd-layout-width) px-4 pb-16 pt-14 sm:px-6 sm:pt-18 md:px-4 lg:pb-24 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,40rem)_minmax(0,38rem)] xl:gap-20">
          <div className="relative z-10 max-w-[40rem] lg:pt-4">
            <div className="mb-6 inline-flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
              {version && (
                <Link
                  href={`/changelog/${version.replace(/\./g, "-")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-[rgba(255,252,247,0.7)] px-3 py-1.5 text-xs font-medium tracking-[0.16em] uppercase transition-colors hover:bg-[rgba(255,252,247,0.95)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <SparklesIcon className="h-3.5 w-3.5" />
                  <span>Latest Release</span>
                  <span className="font-semibold tracking-normal text-stone-800 normal-case dark:text-stone-100">v{version}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            <h1 className="w-fit max-w-full font-serif text-[clamp(1.8rem,10.5vw,3.4rem)] leading-[0.88] font-semibold tracking-[-0.06em] text-stone-950 dark:text-stone-100 sm:tracking-[-0.055em] md:text-[clamp(3.6rem,7vw,5.6rem)]">
              {titleLines.map((line, index) => (
                <span key={index} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-[34rem] text-balance text-base leading-8 text-stone-600 sm:text-lg dark:text-stone-300">{subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-500 dark:text-stone-400">
              <span>Self-hosted</span>
              <span>Markdown-native</span>
              <span>MIT licensed</span>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-stone-50 transition-colors duration-300 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white"
              >
                {primaryCta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryCta.href}
                target={secondaryCta.external ? "_blank" : undefined}
                rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300/80 bg-[rgba(255,252,247,0.7)] px-6 py-3.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-[rgba(255,252,247,0.95)] dark:border-white/15 dark:bg-white/5 dark:text-stone-100 dark:hover:bg-white/10"
              >
                <PlayCircleIcon className="h-4 w-4" />
                {secondaryCta.text}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[42rem] lg:pt-4 xl:mx-0 xl:justify-self-end">
            <div className="rounded-[2.2rem] border border-stone-300/70 bg-[rgba(255,250,244,0.78)] p-5 shadow-[0_24px_90px_-58px_rgba(68,50,33,0.4)] dark:border-white/10 dark:bg-[rgba(22,18,15,0.92)] dark:shadow-[0_28px_90px_-48px_rgba(0,0,0,0.7)] sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4 px-5 sm:px-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase dark:text-stone-400">Inside Memos</p>
                  <p className="mt-2 max-w-xs text-balance text-sm leading-6 text-stone-600 dark:text-stone-300">
                    A calm timeline for notes, logs, reading lists, and the small things worth keeping.
                  </p>
                </div>
                <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-stone-500 dark:text-stone-400">
                  Private by default
                </span>
              </div>
              <MemoHeroMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
