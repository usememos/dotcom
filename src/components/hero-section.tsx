import { ArrowRight, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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
  demoImageLight?: {
    src: string;
    alt: string;
  };
  demoImageDark?: {
    src: string;
    alt: string;
  };
}

export function HeroSection({
  version = "0.26.2",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  demoImageLight,
  demoImageDark,
}: HeroSectionProps) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-4 pt-6 sm:pt-8 pb-12 overflow-hidden">
      {/* Main hero card */}
      <div className="relative mx-auto max-w-(--fd-layout-width) overflow-hidden rounded-3xl border border-fd-border bg-fd-card shadow-sm shadow-black/5 sm:rounded-[2rem]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/55 to-transparent dark:from-white/5" />
        <div className="relative z-10">
          {/* Text content - left aligned */}
          <div className="px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14 lg:pt-20 pb-8 sm:pb-10 lg:pb-14">
            {version && (
              <div className="mb-6 sm:mb-8">
                <Link
                  href={`/changelog/${version.replace(/\./g, "-")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-popover px-3 py-1.5 text-xs font-medium text-fd-primary shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-fd-secondary hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
                >
                  <SparklesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="opacity-70">Released</span>
                  <span className="font-semibold">v{version}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </Link>
              </div>
            )}

            <h1 className="max-w-4xl font-serif text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-fd-muted-foreground sm:mt-6 sm:text-xl lg:text-2xl">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link
                href={primaryCta.href}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-fd-primary px-5 py-3 text-sm font-semibold text-fd-primary-foreground shadow-lg shadow-[color:oklch(0.45_0.08_250_/_0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-[color:oklch(0.45_0.08_250_/_0.28)] sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
              >
                {primaryCta.text}
              </Link>
              <Link
                href={secondaryCta.href}
                target={secondaryCta.external ? "_blank" : undefined}
                rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-fd-border bg-fd-popover px-5 py-3 text-sm font-semibold text-fd-foreground shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-fd-secondary hover:shadow-lg sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
              >
                {secondaryCta.text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Demo image - use a focused crop on mobile and the wide preview on desktop */}
          {(demoImageLight || demoImageDark) && (
            <div className="border-t border-fd-border bg-fd-background px-0 pb-4 sm:pb-0 md:px-0">
              <div className="relative mr-auto overflow-hidden md:hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-[color:oklch(1_0_0_/_0.78)] via-[color:oklch(1_0_0_/_0.18)] to-transparent dark:from-gray-950/70 dark:via-gray-950/10" />
                {demoImageLight && (
                  <div className="relative aspect-[11/10] dark:hidden">
                    <Image
                      src={demoImageLight.src}
                      alt={demoImageLight.alt}
                      fill
                      priority
                      quality={85}
                      sizes="(max-width: 767px) 100vw"
                      className="origin-top-left scale-[1.04] object-cover object-left-top"
                    />
                  </div>
                )}
                {demoImageDark && (
                  <div className="relative hidden aspect-[11/10] dark:block">
                    <Image
                      src={demoImageDark.src}
                      alt={demoImageDark.alt}
                      fill
                      priority
                      quality={85}
                      sizes="(max-width: 767px) 100vw"
                      className="origin-top-left scale-[1.04] object-cover object-left-top"
                    />
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                {demoImageLight && (
                  <Image
                    src={demoImageLight.src}
                    alt={demoImageLight.alt}
                    width={2546}
                    height={1576}
                    priority
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 1280px"
                    className="w-full h-auto block dark:hidden"
                  />
                )}
                {demoImageDark && (
                  <Image
                    src={demoImageDark.src}
                    alt={demoImageDark.alt}
                    width={2546}
                    height={1576}
                    priority
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 1280px"
                    className="w-full h-auto hidden dark:block"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
