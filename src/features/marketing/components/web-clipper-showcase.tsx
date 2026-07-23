import { CheckIcon, ChevronDownIcon, Globe2Icon, LockIcon, MoreHorizontalIcon, PaperclipIcon, SettingsIcon } from "lucide-react";
import Image from "next/image";
import styles from "./web-clipper-showcase.module.css";

export function WebClipperHeroVisual() {
  return (
    <div className={`${styles.browser} pointer-events-none relative mx-auto w-full max-w-[47rem]`} aria-hidden="true">
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#f7f7f3] shadow-[0_36px_90px_rgba(0,0,0,0.38)]">
        <div className="flex h-10 items-center gap-3 border-b border-zinc-200 bg-white px-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-zinc-300" />
            <span className="size-2 rounded-full bg-zinc-300" />
            <span className="size-2 rounded-full bg-zinc-300" />
          </div>
          <div className="flex h-6 min-w-0 flex-1 items-center gap-2 rounded-md bg-zinc-100 px-3 text-[10px] text-zinc-500">
            <LockIcon className="size-2.5" />
            fieldnotes.example/designing-a-personal-archive
          </div>
          <MoreHorizontalIcon className="size-4 text-zinc-400" aria-hidden="true" />
        </div>

        <div className="relative min-h-[23rem] overflow-hidden bg-[#f5f2e9] px-7 py-9 sm:min-h-[27rem] sm:px-12 sm:py-12">
          <div className="max-w-[25rem]">
            <p className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">Field notes · 8 min read</p>
            <h2 className="mt-4 max-w-[12ch] font-serif text-3xl leading-[1.04] font-semibold tracking-tight text-zinc-900 sm:text-[2.55rem]">
              Designing a personal archive
            </h2>
            <p className="mt-5 max-w-[36ch] text-[11px] leading-5 text-zinc-600 sm:text-xs sm:leading-6">
              A useful archive is less about collecting everything and more about making the important fragments easy to return to.
            </p>
            <p className="mt-4 max-w-[38ch] text-[11px] leading-5 text-zinc-600 sm:text-xs sm:leading-6">
              <span className={`${styles.selection} box-decoration-clone px-0.5 text-zinc-900`}>
                Save the idea while its context is still close. A title, source, and a sentence are often enough to find your way back.
              </span>
            </p>
          </div>

          <div className="absolute right-[-1rem] bottom-[-1.25rem] h-44 w-44 rounded-full border-[34px] border-teal-200/50 sm:right-8 sm:bottom-[-3rem] sm:h-56 sm:w-56 sm:border-[46px]" />
        </div>
      </div>

      <div className="absolute right-2 bottom-[-2.75rem] w-[18.5rem] overflow-hidden rounded-xl border border-zinc-200 bg-[#fffefa] text-zinc-950 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:right-8 sm:bottom-[-3.5rem] sm:w-[21rem]">
        <div className="flex h-11 items-center justify-between border-b border-zinc-200 px-3">
          <div className="flex min-w-0 items-center gap-2">
            <Image src="/logo-rounded.png" alt="" width={20} height={20} className="rounded-full" />
            <span className="truncate text-xs font-semibold">steven · memos.example.com</span>
          </div>
          <SettingsIcon className="size-3.5 text-zinc-500" aria-hidden="true" />
        </div>
        <div className="p-3">
          <div className="min-h-40 rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[10px] leading-[1.65] text-zinc-600 sm:min-h-44 sm:text-[11px]">
            <p className="text-zinc-900">Save the idea while its context is still close.</p>
            <p className="mt-3 text-teal-700"># Designing a personal archive</p>
            <p className="mt-1 break-all text-zinc-400">fieldnotes.example/designing-a-personal-archive</p>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex h-8 items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 text-[11px] font-medium text-zinc-700">
              <LockIcon className="size-3" />
              Private
              <ChevronDownIcon className="size-3 text-zinc-400" />
            </div>
            <button
              type="button"
              tabIndex={-1}
              className={`${styles.saveButton} flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-zinc-900 text-[11px] font-semibold text-white`}
            >
              <CheckIcon className="size-3" />
              Save to Memos
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-4 hidden items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-[10px] font-semibold text-zinc-700 shadow-lg backdrop-blur-sm sm:flex">
        <PaperclipIcon className="size-3 text-teal-700" />
        Selection captured
      </div>
    </div>
  );
}

export function ConnectionVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-[#fbfaf7] shadow-[0_22px_60px_rgba(24,24,27,0.08)] dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <Image src="/logo-rounded.png" alt="" width={28} height={28} className="rounded-full" />
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">memos web clipper</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Choose how you want to connect</p>
          </div>
        </div>
        <span className="rounded-md bg-amber-100 px-2 py-1 font-mono text-[10px] font-medium text-amber-900 dark:bg-amber-300/10 dark:text-amber-200">
          v0.2.0
        </span>
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-white/10">
        <div className="group grid gap-4 bg-white p-5 transition-colors hover:bg-teal-50/60 dark:bg-zinc-950 dark:hover:bg-teal-950/20 sm:grid-cols-[2.5rem_1fr_auto] sm:items-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-400/15 dark:text-teal-300">
            <Image src="/logo-rounded.png" alt="" width={24} height={24} className="rounded-full" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Connect with usememos.com</p>
              <span className="text-[9px] font-semibold tracking-wider text-teal-700 uppercase dark:text-teal-300">Recommended</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Sign in once and bring your instance connection to another browser.
            </p>
          </div>
          <span className="hidden text-sm text-zinc-400 transition-transform group-hover:translate-x-1 sm:block">→</span>
        </div>
        <div className="group grid gap-4 p-5 transition-colors hover:bg-zinc-100/70 dark:hover:bg-white/5 sm:grid-cols-[2.5rem_1fr_auto] sm:items-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-zinc-200 text-zinc-700 dark:bg-white/8 dark:text-zinc-300">
            <Globe2Icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Connect directly</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Use your instance URL and a personal access token. No Memos account required.
            </p>
          </div>
          <span className="hidden text-sm text-zinc-400 transition-transform group-hover:translate-x-1 sm:block">→</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-200 px-5 py-3 text-[10px] text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <CheckIcon className="size-3 text-teal-600" /> Connection validated first
        </span>
        <span className="flex items-center gap-1.5">
          <LockIcon className="size-3 text-teal-600" /> Credentials protected
        </span>
      </div>
    </div>
  );
}

export function TemplateVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
      <div className="grid sm:grid-cols-2">
        <div className="border-b border-white/10 p-5 sm:border-r sm:border-b-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Clip template</p>
            <span className="font-mono text-[9px] text-zinc-500">LOCAL</span>
          </div>
          <div className="mt-5 space-y-2 font-mono text-[11px] leading-6">
            <p>
              <span className="text-amber-300">{"{{content}}"}</span>
            </p>
            <p className="text-zinc-500">---</p>
            <p>
              <span className="text-zinc-500">Source: </span>
              <span className="text-cyan-300">
                [{"{{title}}"}]({"{{url}}"})
              </span>
            </p>
            <p>
              <span className="text-zinc-500">Captured: </span>
              <span className="text-amber-300">{"{{date}}"}</span>
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-1.5">
            {["content", "title", "url", "date"].map((token) => (
              <span key={token} className="rounded bg-amber-300/10 px-2 py-1 font-mono text-[9px] text-amber-200">
                {`{{${token}}}`}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          <p className="text-xs font-semibold">Live preview</p>
          <div className="mt-5 text-xs leading-6 text-zinc-600 dark:text-zinc-300">
            <p>A useful archive is less about collecting everything and more about making important fragments easy to return to.</p>
            <div className="my-4 h-px bg-zinc-200 dark:bg-white/10" />
            <p className="text-zinc-400">
              Source:{" "}
              <span className="text-teal-700 underline decoration-teal-200 underline-offset-2 dark:text-teal-300">
                Designing a personal archive
              </span>
            </p>
            <p className="text-zinc-400">Captured: Jul 23, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
