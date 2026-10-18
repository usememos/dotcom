import { type MarketingAction, MarketingActions } from "@/features/marketing/components/marketing-page";

const DEFAULT_LINKS: readonly MarketingAction[] = [
  { label: "Documentation", href: "/docs" },
  { label: "Demo", href: "https://demo.usememos.com/", external: true },
];

/** Quiet references at the end of a product page, without repeating its pitch. */
export function StartSection({
  title = "Further reading",
  description,
  actions = DEFAULT_LINKS,
}: {
  title?: string;
  description?: string;
  actions?: readonly MarketingAction[];
}) {
  return (
    <section className="bg-white py-14 dark:bg-zinc-950 lg:py-20">
      <div className="site-container">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">{description}</p> : null}
        <div className="mt-3">
          <MarketingActions actions={actions} align="left" />
        </div>
      </div>
    </section>
  );
}
