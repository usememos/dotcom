import { ArrowRightIcon, BirdIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";

export function HomeCtaSection() {
  return (
    <section className="bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="border-t border-stone-300/60 pt-12 text-center dark:border-white/10 sm:pt-14">
          <div className="mb-6 inline-flex items-center gap-3 text-sm font-medium text-stone-600 dark:text-stone-300">
            <span className="inline-flex h-5 w-5 items-center justify-center text-stone-700 dark:text-stone-200">
              <BirdIcon className="h-4 w-4" />
            </span>
            <span className="tracking-[0.18em] uppercase text-stone-500 dark:text-stone-400">Start Here</span>
          </div>
          <h2 className="mx-auto mb-4 w-fit max-w-full font-serif text-[clamp(2.6rem,10vw,5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-stone-900 dark:text-stone-100 sm:mb-6">
            {["Your Thoughts.", "Your Server.", "Your Rules."].map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mb-8 max-w-[38rem] text-balance text-base leading-7 text-stone-600 dark:text-stone-300 sm:mb-10 sm:text-lg">
            Deploy Memos in minutes. Capture thoughts in Markdown, on infrastructure you control.
          </p>
          <div className="mx-auto flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/docs/getting-started"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-stone-50 transition-colors duration-300 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white sm:px-8 sm:text-base"
            >
              <DownloadIcon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
              Install Now
            </Link>
            <Link
              href="https://github.com/usememos/memos"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-stone-300/70 bg-[rgba(255,252,247,0.74)] px-6 py-3.5 text-sm font-semibold text-stone-700 transition-colors duration-300 hover:bg-[rgba(255,252,247,0.95)] dark:border-white/10 dark:bg-white/5 dark:text-stone-200 dark:hover:bg-white/10 sm:px-8 sm:text-base"
            >
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
