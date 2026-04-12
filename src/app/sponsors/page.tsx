import { HomeLayout } from "fumadocs-ui/layouts/home";
import { HeartIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
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

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-10" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Sponsors</p>
              <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                Back the project.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Sponsorship helps keep Memos maintained, documented, and available for self-hosters.
              </p>
            </div>
            <div className="mt-9 flex justify-center">
              <a
                href="https://github.com/sponsors/usememos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                <HeartIcon className="h-4 w-4" />
                Become a Sponsor
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Featured</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Sponsors helping Memos grow.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURED_SPONSORS.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5"
                >
                  <div className="flex h-14 items-center">
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
                  {sponsor.description ? (
                    <p className="mt-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{sponsor.description}</p>
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Community</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Backers and supporters.
              </h2>
            </div>
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
