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
      <div className="relative max-w-(--fd-layout-width) mx-auto rounded-3xl sm:rounded-[2rem] bg-gradient-to-br from-teal-50 via-cyan-50/60 to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-200/40 via-cyan-200/20 to-transparent dark:from-teal-800/20 dark:via-cyan-800/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/30 via-teal-100/20 to-transparent dark:from-amber-900/10 dark:via-teal-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Text content - left aligned */}
          <div className="px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14 lg:pt-20 pb-8 sm:pb-10 lg:pb-14">
            {version && (
              <div className="mb-6 sm:mb-8">
                <Link
                  href={`/changelog/${version.replace(/\./g, "-")}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-teal-700 dark:text-teal-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-teal-200/60 dark:border-teal-700/60 rounded-full hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <SparklesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="opacity-70">Released</span>
                  <span className="font-semibold">v{version}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </Link>
              </div>
            )}

            <h1 className="max-w-4xl font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              {title}
            </h1>

            <p className="mt-5 sm:mt-6 max-w-lg text-lg sm:text-xl lg:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-row gap-3 sm:gap-4">
              <Link
                href={primaryCta.href}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-white bg-teal-600 dark:bg-teal-500 rounded-full shadow-lg shadow-teal-600/20 hover:bg-teal-700 dark:hover:bg-teal-400 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                {primaryCta.text}
              </Link>
              <Link
                href={secondaryCta.href}
                target={secondaryCta.external ? "_blank" : undefined}
                rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/80 dark:border-gray-600/80 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {secondaryCta.text}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Demo image - use a focused crop on mobile and the wide preview on desktop */}
          {(demoImageLight || demoImageDark) && (
            <div className="px-0 md:px-0 pb-4 sm:pb-0">
              <div className="relative mr-auto overflow-hidden md:hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-white/75 via-white/20 to-transparent dark:from-gray-950/70 dark:via-gray-950/10" />
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
