import {
  ArrowRightIcon,
  BookOpenIcon,
  CodeIcon,
  GraduationCapIcon,
  LightbulbIcon,
  PenToolIcon,
  ServerIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";

const USE_CASES = [
  {
    slug: "self-hosting",
    icon: <ServerIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Self-Hosters",
    description: "Infrastructure docs & configs",
  },
  {
    slug: "family",
    icon: <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Family",
    description: "Private updates & shared memories",
  },
  {
    slug: "developers",
    icon: <CodeIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Developers",
    description: "Code snippets & debugging logs",
  },
  {
    slug: "writers",
    icon: <PenToolIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Writers",
    description: "Draft stories & capture ideas",
  },
  {
    slug: "personal-knowledge",
    icon: <BookOpenIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Journals",
    description: "Daily notes & idea trails",
  },
  {
    slug: "hobbyists-makers",
    icon: <WrenchIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Makers",
    description: "Project logs & ideas",
  },
  {
    slug: "students-researchers",
    icon: <GraduationCapIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Students",
    description: "Lecture notes & research",
  },
  {
    slug: "privacy-professionals",
    icon: <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Privacy Pros",
    description: "Confidential information",
  },
];

export function HomeUseCasesSection() {
  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 border-t border-stone-300/60 pt-10 dark:border-white/10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeader
              icon={LightbulbIcon}
              title="Who Uses Memos?"
              description="Developers, writers, self-hosters, and anyone who wants a faster way to save a thought."
              align="left"
            />
            <Link
              href="/use-cases"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-200 sm:text-base"
            >
              Explore All Use Cases
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 sm:gap-x-8">
            {USE_CASES.map((useCase, index) => (
              <Link
                key={useCase.title}
                href={`/use-cases/${useCase.slug}`}
                className="group flex gap-4 border-b border-stone-300/60 py-6 transition-colors hover:text-stone-700 dark:border-white/10 dark:hover:text-stone-200 sm:py-7"
              >
                <div className="flex flex-col items-start gap-4">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-stone-400 uppercase dark:text-stone-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="inline-flex h-8 w-8 items-center justify-center text-stone-800 dark:text-stone-200">{useCase.icon}</div>
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-balance text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-xl">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 max-w-[24rem] text-balance text-sm leading-7 text-stone-600 dark:text-stone-300 sm:text-[0.98rem]">
                    {useCase.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
