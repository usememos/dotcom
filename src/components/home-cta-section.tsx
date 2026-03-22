import { ArrowRightIcon, BirdIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";

export function HomeCtaSection() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-teal-50/30 px-4 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600 dark:from-teal-900/30 dark:to-cyan-900/30 dark:text-teal-400 sm:h-16 sm:w-16">
          <BirdIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <h2 className="mb-4 px-2 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:mb-6 sm:text-4xl lg:text-5xl">
          Your Thoughts. Your Server. Your Rules.
        </h2>
        <p className="mx-auto mb-8 max-w-2xl px-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:mb-10 sm:text-lg">
          Deploy Memos in minutes. Capture thoughts in Markdown, on infrastructure you control.
        </p>
        <div className="mx-auto flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/docs/getting-started"
            className="group inline-flex items-center justify-center gap-3 rounded-xl border border-transparent bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
          >
            <DownloadIcon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
            Install Now
          </Link>
          <Link
            href="https://github.com/usememos/memos"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
          >
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
