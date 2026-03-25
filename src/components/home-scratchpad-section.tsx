import { ArrowRightIcon, CheckIcon, NotebookIcon } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  "Works entirely in your browser—no account needed",
  "Drag-and-drop interface for quick organization",
  "Supports text notes and file attachments",
  "Optional sync to your self-hosted Memos instance",
];

export function HomeScratchpadSection() {
  return (
    <section className="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_15%_18%,rgba(20,184,166,0.16),transparent_24%),linear-gradient(135deg,rgba(248,252,251,1),rgba(236,246,244,1))] p-8 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_15%_18%,rgba(20,184,166,0.14),transparent_24%),linear-gradient(135deg,rgba(11,17,20,1),rgba(8,12,15,1))] sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/10 blur-3xl dark:from-teal-500/15 dark:to-cyan-500/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-400/20 to-teal-400/10 blur-3xl dark:from-cyan-500/10 dark:to-teal-500/10" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <NotebookIcon className="h-4 w-4" />
                </span>
                <span className="tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400">Scratchpad</span>
              </div>
              <h2 className="mb-4 font-serif text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
                Type. Save. Done.
              </h2>
              <p className="mb-8 max-w-xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
                A browser-based scratchpad for when you just need to write something down. It stores locally and can sync to Memos when you
                are ready.
              </p>
              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:text-base"
                  >
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/scratchpad"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950 sm:text-base"
              >
                Launch Scratchpad
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute inset-x-10 top-6 h-full rounded-[2rem] border border-white/40 bg-white/30 blur-xl dark:border-white/5 dark:bg-white/5" />
              <div className="relative rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_32px_100px_-56px_rgba(15,23,42,0.6)] dark:border-white/10 dark:bg-[#0b1114] dark:shadow-[0_32px_100px_-44px_rgba(0,0,0,0.75)] sm:p-6">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-700">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-3">
                  {[
                    { color: "teal", label: "Text Note" },
                    { color: "cyan", label: "Quick Idea" },
                    { color: "purple", label: "Attachment" },
                  ].map(({ color, label }) => (
                    <div
                      key={label}
                      className={`rounded-lg border p-4 bg-gradient-to-r
                      ${color === "teal" ? "from-teal-50 to-cyan-50 border-teal-100 dark:from-teal-900/20 dark:to-cyan-900/20 dark:border-teal-800" : ""}
                      ${color === "cyan" ? "from-cyan-50 to-teal-50 border-cyan-100 dark:from-cyan-900/20 dark:to-teal-900/20 dark:border-cyan-800" : ""}
                      ${color === "purple" ? "from-purple-50 to-pink-50 border-purple-100 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800" : ""}
                    `}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full
                          ${color === "teal" ? "bg-teal-600 dark:bg-teal-400" : ""}
                          ${color === "cyan" ? "bg-cyan-600 dark:bg-cyan-400" : ""}
                          ${color === "purple" ? "bg-purple-600 dark:bg-purple-400" : ""}
                        `}
                        />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</span>
                      </div>
                      <div className="mb-1 h-2 w-full rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-2 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
