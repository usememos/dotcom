import { ChevronDownIcon, GithubIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAV_ITEMS } from "@/lib/seo";

export function HomeHeader() {
  return (
    <header
      id="nd-nav"
      className="sticky top-0 z-40 h-14 border-b border-zinc-200 bg-white/85 backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/85"
    >
      <nav className="mx-auto flex h-14 w-full max-w-(--fd-layout-width) items-center px-4" aria-label="Main">
        <Link href="/" className="inline-flex items-center gap-2.5 font-semibold text-zinc-950 dark:text-zinc-100">
          <Image src="/logo.png" alt="Memos" width={24} height={24} className="rounded" priority />
          Memos
        </Link>

        <div className="hidden flex-row items-center gap-2 px-6 sm:flex">
          {SITE_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <a
          href="https://github.com/usememos/memos"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-100 sm:inline-flex"
          aria-label="GitHub"
        >
          <GithubIcon className="h-5 w-5" />
        </a>

        <details className="group relative ml-auto sm:hidden">
          <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 [&::-webkit-details-marker]:hidden dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-100">
            <ChevronDownIcon className="h-5 w-5 transition-transform group-open:rotate-180" />
            <span className="sr-only">Toggle menu</span>
          </summary>
          <div className="absolute right-0 top-11 w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-zinc-950">
            {SITE_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-100"
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://github.com/usememos/memos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-100"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </details>
      </nav>
    </header>
  );
}
