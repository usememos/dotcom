import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { FEATURED_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export function SponsorsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 fill-current" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Supported by</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Thank you to our amazing sponsors who make this project possible
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 max-w-4xl mx-auto">
          {FEATURED_SPONSORS.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-1 transition-all duration-300 w-full md:w-[calc(50%-1rem)]"
            >
              <div className="h-12 sm:h-14 flex items-center">
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
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {sponsor.description}
                </p>
              )}
            </a>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium hover:underline transition-colors"
          >
            View all sponsors and backers
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
