import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon, HeartIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingPageHero, MarketingSectionHeader } from "@/components/marketing-page";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";
import { COMMUNITY_SPONSORS, FEATURED_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Sponsors",
  description:
    "Thank you to the sponsors and backers who support the development of Memos, the open-source note-taking tool built for instant capture.",
  path: "/sponsors",
});

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/sponsors", name: "Sponsors" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const GITHUB_USER_BACKERS = [
  { title: "fixermark", logo: "https://avatars.githubusercontent.com/u/169982?v=4", url: "https://github.com/fixermark" },
  { title: "jeancoded", logo: "https://avatars.githubusercontent.com/u/121377500?v=4", url: "https://github.com/jeancoded" },
  { title: "alik-agaev", logo: "https://avatars.githubusercontent.com/u/2662697?v=4", url: "https://github.com/alik-agaev" },
] as const;

export default function SponsorsPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Sponsors"
          title="Back the project."
          description="Sponsorship helps keep Memos maintained, documented, and available for self-hosters."
          actions={[{ label: "Become a Sponsor", href: "https://github.com/sponsors/usememos", icon: <HeartIcon className="h-4 w-4" /> }]}
        />

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Featured" title="Sponsors helping Memos grow." align="left" />
            <div className="border-y border-zinc-200 dark:border-white/10">
              {FEATURED_SPONSORS.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-6 border-b border-zinc-200 py-6 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5 sm:grid-cols-[14rem_minmax(0,1fr)_auto] sm:items-center sm:px-4"
                >
                  <div className="flex h-12 items-center">
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className={cn("h-full w-auto max-w-full object-contain", sponsor.logoDark && "dark:hidden")}
                    />
                    {sponsor.logoDark && (
                      <img
                        src={sponsor.logoDark}
                        alt={`${sponsor.name} logo`}
                        className="hidden h-full w-auto max-w-full object-contain dark:block"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-950 dark:text-zinc-100">{sponsor.name}</h3>
                    {sponsor.description ? (
                      <p className="mt-1 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{sponsor.description}</p>
                    ) : null}
                  </div>
                  <ArrowRightIcon className="hidden h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 sm:block" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Community" title="Backers and supporters." align="left" />
            <div className="space-y-10">
              <div className="grid gap-3 sm:grid-cols-2">
                {COMMUNITY_SPONSORS.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5"
                  >
                    <img src={sponsor.logo} alt={`${sponsor.name} logo`} className="h-12 w-12 shrink-0 rounded-lg object-contain" />
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-950 dark:text-zinc-100">{sponsor.name}</p>
                      {sponsor.description ? (
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{sponsor.description}</p>
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {GITHUB_USER_BACKERS.map((sponsor) => (
                  <a
                    key={sponsor.title}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
                  >
                    <img src={sponsor.logo} alt={`${sponsor.title} avatar`} className="h-7 w-7 rounded-lg object-cover" />
                    {sponsor.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
