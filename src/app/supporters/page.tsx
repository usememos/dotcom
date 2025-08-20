import type { Metadata } from "next";
import { Heart, ExternalLink, Users, Handshake } from "lucide-react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Supporters - Memos",
  description: "Thank you to all our sponsors and backers who support the development of Memos, the open-source note-taking platform.",
};

const SPONSORS = [
  {
    title: "yourselfhosted",
    logo: "https://www.yourselfhosted.com/sea-otter.svg",
    url: "https://yourselfhosted.com",
  },
];

const GITHUB_USER_SPONSORS = [
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

export default function SupportersPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Heart className="w-16 h-16 text-red-500 fill-current" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Thanks! 💗</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              All donations directly support the development and operation of Memos. Recurring donations allow us to plan for the future. We
              deeply appreciate every donation — Thank you!
            </p>
          </div>

          {/* Sponsors Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🦄</span>
              <h2 className="text-2xl font-semibold">Sponsors</h2>
            </div>

            <div className="flex flex-wrap gap-4">
              {SPONSORS.map((sponsor) => (
                <a
                  key={sponsor.title}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img src={sponsor.logo} alt={`${sponsor.title} logo`} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-contain" />
                    <span className="text-xl sm:text-2xl font-medium group-hover:text-teal-600 dark:text-gray-100 transition-colors">
                      {sponsor.title}
                    </span>
                  </div>
                </a>
              ))}

              <a
                href="https://github.com/sponsors/usememos"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 transition-all"
              >
                <div className="flex items-center gap-4 opacity-60 group-hover:opacity-80">
                  <Handshake className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
                  <div>
                    <div className="text-xl sm:text-2xl font-medium dark:text-gray-200">Your logo</div>
                    <p className="text-gray-500 dark:text-gray-400">Become a sponsor</p>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Current Backers Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🤠</span>
              <h2 className="text-2xl font-semibold">Current Backers</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {GITHUB_USER_SPONSORS.map((sponsor) => (
                <a
                  key={sponsor.title}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-teal-200 dark:hover:border-teal-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={sponsor.logo} alt={`${sponsor.title} avatar`} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" />
                    <span className="text-sm sm:text-base font-medium group-hover:text-teal-600 dark:text-gray-100 transition-colors">
                      {sponsor.title}
                    </span>
                  </div>
                </a>
              ))}

              <a
                href="https://github.com/sponsors/usememos"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 transition-all"
              >
                <div className="flex items-center gap-3 opacity-60 group-hover:opacity-80">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm sm:text-base font-medium dark:text-gray-200">Become a backer</span>
                </div>
              </a>
            </div>

            <a
              href="https://github.com/sponsors/usememos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline transition-colors"
            >
              And more than 40+ sponsors on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>

          {/* Support Options */}
          <section className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 rounded-2xl p-8 sm:p-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Support Memos Development</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Your support helps us maintain and improve Memos for everyone. Choose how you&apos;d like to contribute to our open-source
                mission.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/sponsors/usememos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Become a Sponsor
                </a>

                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Contribute Code
                </a>
              </div>
            </div>
          </section>

          {/* Thank You Message */}
          <section className="mt-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Every Contribution Matters</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you&apos;re contributing code, reporting bugs, writing documentation, or providing financial support, you&apos;re
                helping make Memos better for everyone. Our community is what makes this project special.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </HomeLayout>
  );
}
