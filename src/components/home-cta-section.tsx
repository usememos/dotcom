import { ArrowRightIcon, BirdIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";

export function HomeCtaSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef7f5_100%)] px-4 py-14 dark:bg-[linear-gradient(180deg,#070a0c_0%,#0b1215_100%)] sm:py-18 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.14),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(245,251,249,0.98))] px-6 py-10 text-center shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.14),transparent_24%),linear-gradient(135deg,rgba(10,16,19,1),rgba(7,10,12,1))] sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <BirdIcon className="h-4 w-4" />
              </span>
              <span className="tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400">Start Here</span>
            </div>
            <h2 className="mb-4 text-balance font-serif text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:mb-6 sm:text-4xl lg:text-5xl">
              Your Thoughts. Your Server. Your Rules.
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:mb-10 sm:text-lg">
              Deploy Memos in minutes. Capture thoughts in Markdown, on infrastructure you control.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950 sm:px-8 sm:text-base"
              >
                <DownloadIcon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                Install Now
              </Link>
              <Link
                href="https://github.com/usememos/memos"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-slate-300/70 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-colors duration-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 sm:px-8 sm:text-base"
              >
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
