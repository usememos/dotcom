"use client";

import { ArrowRightIcon, ArrowUpRightIcon, ChevronDownIcon, MenuIcon, StarIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGithubStarCount } from "@/features/marketing/hooks/use-github-star-count";
import { GITHUB_REPO_URL, SITE_NAV_CTA, SITE_NAV_ITEMS, SITE_NAV_LINKS, type SiteNavGroup, type SiteNavLink } from "@/shared/lib/seo";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { GithubIcon } from "@/shared/ui/github-icon";

const MOBILE_NAV_ID = "site-mobile-navigation";
const DESKTOP_NAV_ITEM_CLASS =
  "inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface MobileSiteNavLinkProps {
  item: SiteNavLink;
  pathname: string;
  activeHref: string | undefined;
}

function getActiveNavHref(pathname: string): string | undefined {
  return SITE_NAV_LINKS.filter(
    (item) => item.href.startsWith("/") && (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  ).sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function MobileSiteNavLink({ item, pathname, activeHref }: MobileSiteNavLinkProps) {
  const isCurrent = pathname === item.href;
  const isActive = activeHref === item.href;
  const className = cn(
    "flex items-start rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
    isActive && "bg-accent text-accent-foreground",
  );

  const content = (
    <>
      <span className="min-w-0">
        <span className="block font-semibold text-foreground">{item.name}</span>
        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{item.description}</span>
      </span>
      {item.external ? <ArrowUpRightIcon aria-hidden="true" className="ml-auto mt-0.5 size-3.5" /> : null}
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} prefetch={false} aria-current={isCurrent ? "page" : undefined} className={className}>
      {content}
    </Link>
  );
}

function DesktopNavGroup({ group, pathname, activeHref }: { group: SiteNavGroup; pathname: string; activeHref?: string }) {
  const isActive = group.items.some((item) => item.href === activeHref);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        delay={75}
        closeDelay={150}
        onMouseDown={(event) => event.preventBaseUIHandler()}
        render={
          <button
            type="button"
            className={cn(
              DESKTOP_NAV_ITEM_CLASS,
              "cursor-pointer data-popup-open:bg-muted data-popup-open:text-foreground data-popup-open:[&_svg]:rotate-180",
              isActive && "text-primary",
            )}
          />
        }
      >
        {group.name}
        <ChevronDownIcon aria-hidden="true" className="size-3.5 transition-transform" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 space-y-1 p-1.5" sideOffset={8} align="start">
        {group.items.map((item) => {
          const isCurrent = pathname === item.href;

          return (
            <DropdownMenuItem
              key={item.href}
              className={cn("cursor-pointer items-start gap-3 px-2.5 py-2", activeHref === item.href && "bg-accent")}
              render={
                item.external ? (
                  // biome-ignore lint/a11y/useAnchorContent: Base UI merges the menu item children into this rendered anchor.
                  <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name} />
                ) : (
                  <Link href={item.href} prefetch={false} aria-current={isCurrent ? "page" : undefined} />
                )
              }
            >
              <span className="min-w-0">
                <span className="block font-semibold text-foreground">{item.name}</span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{item.description}</span>
              </span>
              {item.external ? <ArrowUpRightIcon aria-hidden="true" className="ml-auto mt-0.5 text-muted-foreground" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const activeHref = getActiveNavHref(pathname);
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
          <Image src="/logo-96.png" alt="" width={24} height={24} className="rounded" priority aria-hidden="true" />
          <span>Memos</span>
        </Link>

        <ul className="ml-5 hidden items-center gap-1 md:flex">
          {SITE_NAV_ITEMS.map((item) => (
            <li key={item.name}>
              {"items" in item ? (
                <DesktopNavGroup group={item} pathname={pathname} activeHref={activeHref} />
              ) : (
                <Link
                  href={item.href}
                  prefetch={false}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(DESKTOP_NAV_ITEM_CLASS, activeHref === item.href && "text-primary")}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-2 md:flex">
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
          <Link href={SITE_NAV_CTA.href} prefetch={false} className={cn(buttonVariants({ size: "sm" }), "h-8 rounded-full px-3")}>
            {SITE_NAV_CTA.name}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-auto md:hidden")}
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
          className="absolute inset-x-0 top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b border-border bg-background/95 py-4 shadow-lg backdrop-blur-lg md:hidden"
        >
          <div className="site-container flex flex-col gap-4">
            {SITE_NAV_ITEMS.map((item) =>
              "items" in item ? (
                <div key={item.name}>
                  <p className="px-3 pb-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{item.name}</p>
                  <div className="flex flex-col">
                    {item.items.map((child) => (
                      <MobileSiteNavLink key={child.href} item={child} pathname={pathname} activeHref={activeHref} />
                    ))}
                  </div>
                </div>
              ) : (
                <MobileSiteNavLink key={item.href} item={item} pathname={pathname} activeHref={activeHref} />
              ),
            )}
            <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link href={SITE_NAV_CTA.href} prefetch={false} className={cn(buttonVariants({ size: "default" }), "rounded-full")}>
                {SITE_NAV_CTA.name}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Memos on GitHub, ${githubStarCount} stars`}
                className={cn(buttonVariants({ variant: "outline", size: "default" }), "rounded-full")}
              >
                <GithubIcon className="size-4" />
                <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                  <StarIcon aria-hidden="true" className="size-3.5 fill-current text-muted-foreground" />
                  {githubStarCount}
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
