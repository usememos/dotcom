import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { FEATURED_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export function SponsorsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-500 fill-current flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Supported by</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
            Thank you to our amazing sponsors who make this project possible
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 max-w-4xl mx-auto">
          {FEATURED_SPONSORS.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 sm:gap-4 p-5 sm:p-8 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="h-10 sm:h-12 flex items-center justify-start">
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
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{sponsor.description}</p>
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
