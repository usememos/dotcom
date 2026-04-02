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
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_16%_18%,_rgba(20,184,166,0.18),_transparent_24%),radial-gradient(circle_at_78%_22%,_rgba(14,165,233,0.1),_transparent_22%),linear-gradient(180deg,_rgba(246,252,251,1)_0%,_rgba(240,247,246,0.97)_40%,_rgba(255,255,255,1)_100%)] dark:bg-[radial-gradient(circle_at_16%_18%,_rgba(13,148,136,0.18),_transparent_24%),radial-gradient(circle_at_78%_22%,_rgba(8,145,178,0.14),_transparent_22%),linear-gradient(180deg,_rgba(9,13,16,1)_0%,_rgba(10,16,19,0.98)_42%,_rgba(7,10,12,1)_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-position:center] [background-size:32px_32px] dark:opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white dark:to-[#070a0c]" />

      <div className="mx-auto w-full max-w-(--fd-layout-width) px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-14 md:px-4 md:py-28 lg:py-36">
        <div className="grid gap-10 md:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] md:items-center md:gap-8 lg:gap-16">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              {version && (
                <Link
                  href={`/changelog/${version.replace(/\./g, "-")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/65 px-3 py-1 font-medium backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <SparklesIcon className="h-3.5 w-3.5" />
                  <span>v{version} released</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            <h1 className="max-w-3xl font-serif text-4xl leading-[0.95] font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">{subtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
              >
                {primaryCta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryCta.href}
                target={secondaryCta.external ? "_blank" : undefined}
                rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-900 backdrop-blur-md transition-colors hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <PlayCircleIcon className="h-4 w-4" />
                {secondaryCta.text}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[42rem] xl:mx-0 xl:justify-self-end">
            <div className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.16),_transparent_66%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.18),_transparent_68%)]" />
            <MemoHeroMock />
          </div>
        </div>
      </div>
    </section>
  );
}
