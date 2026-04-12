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
    <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 sm:py-18 lg:py-22">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeader
              icon={LightbulbIcon}
              eyebrow="Use Cases"
              title="Where Memos fits."
              description="Use it where small notes matter: logs, links, snippets, journals, and private updates you want to keep."
              align="left"
            />
            <Link
              href="/use-cases"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300 sm:text-base"
            >
              Explore Use Cases
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 sm:gap-x-8">
            {USE_CASES.map((useCase, index) => (
              <Link
                key={useCase.title}
                href={`/use-cases/${useCase.slug}`}
                className="group flex gap-4 border-b border-zinc-200 py-6 transition-colors hover:text-zinc-700 dark:border-white/10 dark:hover:text-zinc-200 sm:py-7"
              >
                <div className="flex flex-col items-start gap-4">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="inline-flex h-8 w-8 items-center justify-center text-zinc-800 dark:text-zinc-200">{useCase.icon}</div>
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-balance text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-xl">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 max-w-[24rem] text-balance text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.98rem]">
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
