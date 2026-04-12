import { ArrowRightIcon, BirdIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";

export function HomeCtaSection() {
  return (
    <section className="bg-white px-4 py-14 dark:bg-zinc-950 sm:px-6 sm:py-18 lg:py-22">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <span className="inline-flex h-5 w-5 items-center justify-center text-zinc-700 dark:text-zinc-200">
              <BirdIcon className="h-4 w-4" />
            </span>
            <span className="tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400">Start Here</span>
          </div>
          <h2 className="mx-auto mb-4 w-fit max-w-full text-balance font-serif text-[clamp(2.6rem,10vw,5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-zinc-950 dark:text-zinc-100 sm:mb-6">
            {["Start with", "one thought."].map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mb-8 max-w-[38rem] text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:mb-10 sm:text-lg">
            Deploy Memos in minutes and keep every quick note on your own server.
          </p>
          <div className="mx-auto flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/docs/getting-started"
              className="group inline-flex items-center justify-center gap-3 rounded-md bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white sm:px-8 sm:text-base"
            >
              <DownloadIcon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
              Install Memos
            </Link>
            <Link
              href="https://github.com/usememos/memos"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-md border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 transition-colors duration-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/10 sm:px-8 sm:text-base"
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
