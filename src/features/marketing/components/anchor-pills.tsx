/** A centered row of in-page destinations, in the same pill style as the Homepage's view switch. */
export function AnchorPills({ label, items }: { label: string; items: readonly { href: string; label: string; count?: number }[] }) {
  return (
    <nav aria-label={label} className="flex justify-center">
      <ul className="flex max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white p-1.5 dark:border-white/10 dark:bg-zinc-950">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="inline-flex h-9 touch-manipulation items-center gap-2 rounded-xl px-3.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-stone-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:text-zinc-300 dark:hover:bg-white/8 dark:hover:text-zinc-100 dark:focus-visible:outline-brand-300"
            >
              {item.label}
              {item.count !== undefined ? (
                <span className="text-xs text-zinc-400 tabular-nums dark:text-zinc-500">{item.count}</span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
