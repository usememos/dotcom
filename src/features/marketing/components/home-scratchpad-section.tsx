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
    <section className="bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 border-t border-stone-300/60 pt-10 dark:border-white/10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-5 inline-flex items-center gap-3 text-sm font-medium text-stone-600 dark:text-stone-300">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-300/70 bg-stone-100 text-stone-800 dark:border-white/10 dark:bg-white/5 dark:text-stone-100">
                <NotebookIcon className="h-4 w-4" />
              </span>
              <span className="tracking-[0.18em] uppercase text-stone-500 dark:text-stone-400">Scratchpad</span>
            </div>
            <h2 className="mb-4 font-serif text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-stone-900 dark:text-stone-100 sm:text-4xl lg:text-[3.15rem]">
              Type. Save. Done.
            </h2>
            <p className="mb-8 max-w-md text-balance text-base leading-7 text-stone-700 dark:text-stone-300 sm:text-lg">
              A browser-based scratchpad for loose thoughts and files. Keep it local, then send the pieces worth saving to Memos.
            </p>
            <Link
              href="/scratchpad"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-stone-50 transition-colors duration-300 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white sm:text-base"
            >
              Launch Scratchpad
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
            <ul className="grid gap-0">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 border-b border-stone-300/60 py-5 text-sm text-stone-700 dark:border-white/10 dark:text-stone-300 sm:text-base"
                >
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-stone-700 dark:text-stone-200" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="relative rounded-[1.75rem] border border-stone-300/60 bg-[rgba(255,253,249,0.7)] p-4 dark:border-white/10 dark:bg-[#181411] sm:p-6">
                <div className="mb-4 flex items-center gap-2 border-b border-stone-200 pb-3 dark:border-white/10">
                  <div className="h-3 w-3 rounded-full bg-stone-300" />
                  <div className="h-3 w-3 rounded-full bg-stone-400" />
                  <div className="h-3 w-3 rounded-full bg-stone-500" />
                </div>
                <div className="space-y-3">
                  {["Text Note", "Quick Idea", "Attachment"].map((label, index) => (
                    <div key={label} className="rounded-lg bg-stone-50/80 p-4 dark:bg-white/4">
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${index === 0 ? "bg-stone-500" : index === 1 ? "bg-stone-400" : "bg-stone-600"}`}
                        />
                        <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">{label}</span>
                      </div>
                      <div className="mb-1 h-2 w-full rounded bg-stone-200 dark:bg-stone-700" />
                      <div className="h-2 w-4/5 rounded bg-stone-200 dark:bg-stone-700" />
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
