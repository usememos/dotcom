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
  version = "0.26.1",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  demoImageLight,
  demoImageDark,
}: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center pt-12 text-center bg-gradient-to-b from-white to-teal-50/30 dark:from-gray-950 dark:to-teal-950/30 overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {version && (
          <div className="mb-4 sm:mb-6">
            <Link
              href={`/changelog/${version.replace(/\./g, "-")}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-teal-800 dark:text-teal-200 bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 rounded-full hover:bg-teal-200 dark:hover:bg-teal-900/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="opacity-80">Released </span>
              <span className="font-semibold">v{version}</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        )}

        <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight px-2">{title}</h1>

        <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-200 px-4">{subtitle}</p>

        <div className="mt-6 sm:mt-8 flex flex-row gap-2 sm:gap-4 w-auto mx-auto px-4 sm:px-0">
          <Link
            href={primaryCta.href}
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 border border-transparent rounded-xl sm:rounded-2xl shadow-lg hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-teal-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
          >
            {primaryCta.text}
          </Link>
          <Link
            href={secondaryCta.href}
            target={secondaryCta.external ? "_blank" : undefined}
            rel={secondaryCta.external ? "noopener noreferrer" : undefined}
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
          >
            {secondaryCta.text}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {(demoImageLight || demoImageDark) && (
          <div className="mt-8 sm:mt-12 w-full max-w-6xl overflow-auto">
            {demoImageLight && (
              <Image
                src={demoImageLight.src}
                alt={demoImageLight.alt}
                width={2546}
                height={1576}
                priority
                quality={85}
                sizes="(max-width: 640px) 200vw, 1280px"
                className="w-[200vw] max-w-none sm:w-full h-auto block dark:hidden"
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
                sizes="(max-width: 640px) 200vw, 1280px"
                className="w-[200vw] max-w-none sm:w-full h-auto hidden dark:block"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
