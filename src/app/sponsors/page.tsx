import type { Metadata } from "next";
import { HeartIcon, ExternalLinkIcon, UsersIcon, HandshakeIcon } from "lucide-react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { FEATURED_SPONSORS, COMMUNITY_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sponsors - Memos",
  description: "Thank you to all our sponsors and backers who support the development of Memos, the open-source note-taking platform.",
};

const GITHUB_USER_BACKERS = [
  {
    title: "fixermark",
    logo: "https://avatars.githubusercontent.com/u/169982?v=4",
    url: "https://github.com/fixermark",
  },
  {
    title: "jeancoded",
    logo: "https://avatars.githubusercontent.com/u/121377500?v=4",
    url: "https://github.com/jeancoded",
  },
  {
    title: "alik-agaev",
    logo: "https://avatars.githubusercontent.com/u/2662697?v=4",
    url: "https://github.com/alik-agaev",
  },
];

export default function SponsorsPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl">
                  <HeartIcon className="w-12 h-12 fill-current" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 leading-tight">Thanks!</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                All donations directly support the development and operation of Memos. Recurring donations allow us to plan for the future.
                We deeply appreciate every donation — Thank you!
              </p>
            </div>

            {/* Featured Sponsors Section */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                  <span className="text-2xl">🦄</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Sponsors</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {FEATURED_SPONSORS.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center mb-4 h-16">
                      <img
                        src={sponsor.logo}
                        alt={`${sponsor.name} logo`}
                        className={cn("h-full w-auto max-w-full object-contain", sponsor.logoDark && "dark:hidden")}
                      />
                      {sponsor.logoDark && (
                        <img
                          src={sponsor.logoDark}
                          alt={`${sponsor.name} logo`}
                          className="hidden dark:block h-full w-auto max-w-full object-contain"
                        />
                      )}
                    </div>
                    {sponsor.description && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{sponsor.description}</p>
                    )}
                  </a>
                ))}
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-6 text-center">Community Sponsors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMMUNITY_SPONSORS.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-8 py-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-6">
                      <img src={sponsor.logo} alt={`${sponsor.name} logo`} className="w-16 h-16 rounded-2xl object-contain flex-shrink-0" />
                      <div>
                        <span className="text-2xl font-bold group-hover:text-teal-600 dark:text-gray-100 transition-colors tracking-tight block">
                          {sponsor.name}
                        </span>
                        {sponsor.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sponsor.description}</p>
                        )}
                      </div>
                    </div>
                  </a>
                ))}

                <a
                  href="https://github.com/sponsors/usememos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-8 py-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 transition-all duration-300"
                >
                  <div className="flex items-center gap-6 opacity-60 group-hover:opacity-80 transition-opacity">
                    <HandshakeIcon strokeWidth={"1px"} className="w-16 h-16 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <div>
                      <div className="text-2xl font-bold dark:text-gray-200 tracking-tight">Your logo</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Become a sponsor</p>
                    </div>
                  </div>
                </a>
              </div>
            </section>

            {/* Current Backers Section */}
            <section className="mb-20">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <span className="text-2xl">🤠</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Current Backers</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {GITHUB_USER_BACKERS.map((sponsor) => (
                  <a
                    key={sponsor.title}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img src={sponsor.logo} alt={`${sponsor.title} avatar`} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-base font-semibold group-hover:text-teal-600 dark:text-gray-100 transition-colors">
                        {sponsor.title}
                      </span>
                    </div>
                  </a>
                ))}

                <a
                  href="https://github.com/sponsors/usememos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 opacity-60 group-hover:opacity-80 transition-opacity">
                    <span className="block text-base font-semibold dark:text-gray-200">Become a backer</span>
                  </div>
                </a>
              </div>

              <a
                href="https://github.com/sponsors/usememos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline transition-colors font-semibold"
              >
                And more than 40+ sponsors on GitHub
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </section>

            {/* Support Options */}
            <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950 rounded-3xl p-12 sm:p-16 shadow-lg">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-6">Support Memos Development</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Your support helps us maintain and improve Memos for everyone. Choose how you&apos;d like to contribute to our open-source
                  mission.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://github.com/sponsors/usememos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                  >
                    <HeartIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Become a Sponsor
                  </a>

                  <a
                    href="https://github.com/usememos/memos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
                  >
                    <UsersIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Contribute Code
                  </a>
                </div>
              </div>
            </section>

            {/* Thank You Message */}
            <section className="mt-20 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight mb-6">Every Contribution Matters</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Whether you&apos;re contributing code, reporting bugs, writing documentation, or providing financial support, you&apos;re
                  helping make Memos better for everyone. Our community is what makes this project special.
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
