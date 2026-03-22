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
    <section className="bg-white px-4 py-12 dark:bg-slate-900 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-slate-50 p-8 shadow-xl dark:border-slate-600 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 sm:rounded-3xl sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 blur-3xl dark:from-teal-600/10 dark:to-cyan-600/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-400/20 to-teal-400/20 blur-3xl dark:from-cyan-600/10 dark:to-teal-600/10" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600 dark:from-teal-900/30 dark:to-cyan-900/30 dark:text-teal-400 sm:h-16 sm:w-16">
                <NotebookIcon className="h-7 w-7 sm:h-9 sm:w-9" />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
                Type. Save. Done.
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
                A browser-based scratchpad for when you just need to write something down. It stores locally and can sync to Memos when you
                are ready.
              </p>
              <ul className="mb-8 space-y-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 sm:text-base">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/scratchpad"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
              >
                Launch Scratchpad
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            {/* Visual mock */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl sm:p-6">
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
    </section>
  );
}
