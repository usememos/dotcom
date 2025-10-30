import Link from "next/link";
import { ExternalLink, ArrowRightIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-fd-background/50 to-gray-50/50 dark:to-gray-900/50 mt-auto">
      <div className="mx-auto max-w-fd-container px-4 py-8 sm:py-12 lg:py-16">
        {/* CTA Section */}
        <div className="mb-10 sm:mb-12 lg:mb-16 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-fd-foreground mb-3 sm:mb-4">Start using Memos today</h3>
          <p className="text-sm sm:text-base text-fd-muted-foreground mb-5 sm:mb-6 max-w-2xl mx-auto">
            Self-hosted, open source, and privacy-first note-taking for everyone
          </p>
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Get Started
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {/* About */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4 text-base sm:text-lg">Memos</h3>
            <p className="text-sm text-fd-muted-foreground leading-relaxed">
              Open source, self-hosted note-taking platform that puts your privacy first.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-sm">
              <li>
                <Link
                  href="/features"
                  className="text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <a
                  href="https://demo.usememos.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Live Demo
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4 text-sm sm:text-base">Community</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/tfPJa4UmAv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Discord
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/usememos/memos/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Discussions
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-fd-foreground mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/usememos/memos/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  MIT License
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/brand"
                  className="text-fd-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 hover:underline hover:underline-offset-4 transition-all"
                >
                  Brand Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
