"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  FileSearchIcon,
  HomeIcon,
  MessageCircleIcon,
  RotateCcwIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type FallbackVariant = "error" | "not-found";

interface FallbackAction {
  href: string;
  label: string;
  kind?: "primary" | "secondary";
}

interface ErrorBoundaryFallbackProps {
  error?: Error & { digest?: string };
  variant?: FallbackVariant;
  retry?: () => void;
  retryLabel?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: FallbackAction[];
  showDiagnostics?: boolean;
}

const defaultActions: Record<FallbackVariant, FallbackAction[]> = {
  error: [
    { href: "/", label: "Home", kind: "secondary" },
    { href: "/docs", label: "Docs", kind: "secondary" },
    { href: "https://github.com/usememos/memos/issues", label: "Report issue", kind: "secondary" },
  ],
  "not-found": [
    { href: "/", label: "Home", kind: "primary" },
    { href: "/docs", label: "Docs", kind: "secondary" },
    { href: "/blog", label: "Blog", kind: "secondary" },
  ],
};

export function ErrorBoundaryFallback({
  error,
  variant = "error",
  retry,
  retryLabel = "Try again",
  eyebrow,
  title,
  description,
  actions,
  showDiagnostics = variant === "error",
}: ErrorBoundaryFallbackProps) {
  const [currentPath, setCurrentPath] = useState<string>();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const isNotFound = variant === "not-found";
  const errorReference = error?.digest || error?.message;
  const resolvedEyebrow = eyebrow ?? (isNotFound ? "404" : "Unexpected error");
  const resolvedTitle = title ?? (isNotFound ? "Page not found." : "Something went wrong.");
  const resolvedDescription =
    description ??
    (isNotFound
      ? "The page may have moved, or the link may be outdated. Use one of the links below to get back to Memos."
      : "The page failed to load. Try again, or use the links below to keep browsing Memos.");
  const resolvedActions = actions ?? defaultActions[variant];
  const showPath = isNotFound || showDiagnostics;

  return (
    <main className="flex min-h-screen flex-col bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <section className="relative isolate flex flex-1 items-center overflow-hidden px-5 py-12 sm:px-8 lg:py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-500/40 to-transparent" />
        <div className="absolute top-10 right-10 hidden h-40 w-40 rotate-6 rounded-lg border border-zinc-200/70 dark:border-white/10 lg:block" />
        <div className="absolute right-24 bottom-14 hidden h-24 w-24 -rotate-12 rounded-lg border border-teal-200/70 bg-teal-50/50 dark:border-teal-400/15 dark:bg-teal-400/5 lg:block" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
          <div className="max-w-3xl">
            <a href="/" className="mb-10 inline-flex items-center gap-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              <span aria-hidden="true" className="h-7 w-7 rounded bg-cover bg-center" style={{ backgroundImage: "url('/logo.png')" }} />
              <span>Memos</span>
            </a>

            <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">{resolvedEyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl lg:text-6xl dark:text-zinc-50">
              {resolvedTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">{resolvedDescription}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {retry && (
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <RotateCcwIcon className="h-4 w-4" />
                  {retryLabel}
                </button>
              )}
              {resolvedActions.map((action) => {
                const isExternal = action.href.startsWith("http");
                const className =
                  action.kind === "primary"
                    ? "inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                    : "inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition-all hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/5";

                return (
                  <a
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className={className}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {action.href === "/" && <HomeIcon className="h-4 w-4" />}
                    {action.href === "/docs" && <BookOpenIcon className="h-4 w-4" />}
                    {isExternal && <MessageCircleIcon className="h-4 w-4" />}
                    {action.label}
                    {action.href !== "/" && !isExternal && <ArrowRightIcon className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </div>

          <aside className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
              {isNotFound ? "What happened" : "Recovery details"}
            </p>
            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                  <FileSearchIcon className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                  {isNotFound ? "Missing route" : "Load interrupted"}
                </div>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {isNotFound
                    ? "The requested address does not match a published Memos page."
                    : "The application caught this problem before showing a raw server error."}
                </p>
              </div>

              {(showPath || errorReference) && (
                <dl className="space-y-3 border-t border-zinc-200 pt-5 text-sm dark:border-white/10">
                  {showPath && (
                    <div>
                      <dt className="font-medium text-zinc-500 dark:text-zinc-400">Page</dt>
                      <dd className="mt-1 break-words font-mono text-zinc-800 dark:text-zinc-200">{currentPath ?? "Requested page"}</dd>
                    </div>
                  )}
                  {showDiagnostics && errorReference && (
                    <div>
                      <dt className="font-medium text-zinc-500 dark:text-zinc-400">Reference</dt>
                      <dd className="mt-1 break-words font-mono text-zinc-800 dark:text-zinc-200">{errorReference}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
