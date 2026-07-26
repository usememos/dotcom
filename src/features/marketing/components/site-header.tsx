"use client";

import { MenuIcon, StarIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGithubStarCount } from "@/features/marketing/hooks/use-github-star-count";
import { GITHUB_REPO_URL, SITE_NAV_ITEMS } from "@/shared/lib/seo";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { GithubIcon } from "@/shared/ui/github-icon";

const MOBILE_NAV_ID = "site-mobile-navigation";

interface SiteNavLinkProps {
  item: (typeof SITE_NAV_ITEMS)[number];
  pathname: string;
  className: string;
  activeClassName: string;
}

/**
 * One nav item, shared by the desktop bar and the mobile panel.
 *
 * `aria-current` needs an exact match — a section index is not the current page
 * — while the active styling deliberately covers the whole section.
 */
function SiteNavLink({ item, pathname, className, activeClassName }: SiteNavLinkProps) {
  const isCurrent = pathname === item.href;
  const inSection = isCurrent || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      // Prefetching every nav target pulls in each route's CSS chunk — including
      // the docs-only Fumadocs sheet — on marketing pages.
      prefetch={false}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(className, inSection && activeClassName)}
    >
      {item.name}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const githubStarCount = useGithubStarCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // A route change leaves the panel covering the new page: SiteHeader lives in
  // the persistent (site) layout, so it never unmounts between navigations.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      toggleRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return;
      setMobileMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 h-14 border-b border-border bg-background/85 backdrop-blur-lg">
      <nav className="site-container flex h-14 items-center" aria-label="Main navigation">
        <Link href="/" prefetch={false} className="inline-flex items-center gap-2.5 font-semibold">
          <Image src="/logo.png" alt="" width={24} height={24} className="rounded" priority aria-hidden="true" />
          <span>Memos</span>
        </Link>

        <ul className="ml-6 hidden items-center gap-2 sm:flex">
          {SITE_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <SiteNavLink
                item={item}
                pathname={pathname}
                className="inline-flex rounded-md p-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                activeClassName="text-primary"
              />
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center sm:flex">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Memos on GitHub, ${githubStarCount} stars`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 rounded-full border-zinc-200 bg-background/70 px-2.5 shadow-none dark:border-white/15 dark:bg-background/50",
            )}
          >
            <GithubIcon className="size-4" />
            <span aria-hidden="true" className="mx-1 h-3.5 w-px bg-border" />
            <StarIcon aria-hidden="true" className="size-3.5 fill-current text-muted-foreground" />
            <span aria-hidden="true" className="text-xs font-semibold tabular-nums">
              {githubStarCount}
            </span>
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-auto sm:hidden")}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls={MOBILE_NAV_ID}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>

        {/* Kept inside <nav> so the primary links stay in the navigation landmark
            on mobile, and always rendered so `aria-controls` resolves when closed. */}
        <div
          id={MOBILE_NAV_ID}
          hidden={!mobileMenuOpen}
          className="absolute inset-x-0 top-14 border-b border-border bg-background/95 py-4 shadow-lg backdrop-blur-lg sm:hidden"
        >
          <div className="site-container flex flex-col">
            {SITE_NAV_ITEMS.map((item) => (
              <SiteNavLink
                key={item.href}
                item={item}
                pathname={pathname}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                activeClassName="bg-accent text-accent-foreground"
              />
            ))}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <GithubIcon className="size-4" />
              GitHub
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium tabular-nums text-muted-foreground">
                <StarIcon aria-hidden="true" className="size-3.5 fill-current" />
                {githubStarCount}
                <span className="sr-only"> stars</span>
              </span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
