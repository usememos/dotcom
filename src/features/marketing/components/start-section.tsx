import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import heroStyles from "@/features/marketing/components/home-hero.module.css";
import { type MarketingAction, MarketingActions } from "@/features/marketing/components/marketing-page";
import { MemoComposer } from "@/features/marketing/components/memo-composer";

const DEFAULT_ACTIONS: readonly MarketingAction[] = [
  { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
  { label: "Try Live Demo", href: "https://demo.usememos.com/", external: true },
];

interface StartSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: readonly MarketingAction[];
}

/** The closing chapter shared across pages: the empty composer every timeline starts from. */
export function StartSection({
  eyebrow = "Start here",
  title = "Start with one memo.",
  description = "Run it yourself or try the public demo before choosing where your timeline will live.",
  actions = DEFAULT_ACTIONS,
}: StartSectionProps) {
  return (
    <section id="start" className="scroll-mt-20 bg-white py-16 dark:bg-zinc-950 sm:py-20 lg:py-24">
      <div className="site-container flex flex-col items-center text-center">
        <ChapterHeader eyebrow={eyebrow} title={title} description={description} />
        <div aria-hidden="true" className={`${heroStyles.productTokens} mt-10 w-full max-w-[31rem] text-left`}>
          <MemoComposer className="shadow-[0_20px_50px_rgba(24,24,27,0.1)] dark:shadow-none" />
        </div>
        <div className="mt-10">
          <MarketingActions actions={actions} />
        </div>
      </div>
    </section>
  );
}
