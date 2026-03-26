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
    gradient: "from-slate-50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20",
  },
  {
    slug: "family",
    icon: <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Family",
    description: "Private updates & shared memories",
    gradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
  },
  {
    slug: "developers",
    icon: <CodeIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Developers",
    description: "Code snippets & debugging logs",
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  },
  {
    slug: "writers",
    icon: <PenToolIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Writers",
    description: "Draft stories & capture ideas",
    gradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
  },
  {
    slug: "personal-knowledge",
    icon: <BookOpenIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Journals",
    description: "Daily notes & idea trails",
    gradient: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
  },
  {
    slug: "hobbyists-makers",
    icon: <WrenchIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Makers",
    description: "Project logs & ideas",
    gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
  },
  {
    slug: "students-researchers",
    icon: <GraduationCapIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Students",
    description: "Lecture notes & research",
    gradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
  },
  {
    slug: "privacy-professionals",
    icon: <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Privacy Pros",
    description: "Confidential information",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
  },
];

export function HomeUseCasesSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eef6f4_0%,#ffffff_100%)] px-4 py-14 dark:bg-[linear-gradient(180deg,#081014_0%,#070a0c_100%)] sm:px-6 sm:py-18 lg:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-500/10" />
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="mb-10 flex flex-col gap-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            icon={LightbulbIcon}
            title="Who Uses Memos?"
            description="Developers, writers, self-hosters, and anyone who wants a faster way to save a thought."
            align="left"
          />
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-300/70 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:text-base"
          >
            Explore All Use Cases
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-200/80 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((useCase) => (
            <Link
              key={useCase.title}
              href={`/use-cases/${useCase.slug}`}
              className="group relative min-h-[13rem] bg-white/90 p-5 transition-colors duration-300 hover:bg-white dark:bg-[#091015] dark:hover:bg-[#0c151a] sm:p-6"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-90 dark:opacity-30 dark:group-hover:opacity-45 ${useCase.gradient}`}
              />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-900 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-none">
                  {useCase.icon}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white sm:text-xl">{useCase.title}</h3>
                  <p className="max-w-[18rem] text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-[0.95rem]">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
