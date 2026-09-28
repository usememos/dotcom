/**
 * Memos from the official demo seed (store/seed/sqlite/01__dump.sql, checked 2026-09-28), placed
 * the same number of days back from the visitor's today as the seed places them. The Find
 * section's Calendar and Map views are drawn from these, as demo.usememos.com shows them.
 */
export interface DemoMemo {
  id: string;
  author: "Steven" | "Johnny" | "Bob" | "Sam";
  daysAgo: number;
  /** The first line, as the calendar preview shows it. */
  title: string;
  excerpt?: string;
  image?: string;
  location?: { label: string; place: string };
  reactions?: { emoji: string; count: number }[];
  tag?: string;
}

export const DEMO_MEMOS: readonly DemoMemo[] = [
  {
    id: "golden-hour",
    author: "Bob",
    daysAgo: 0,
    title: "Golden hour on the coastal trail tonight. The camera couldn’t hold the colors, so here’s my minimal-art rendition instead 🎨",
    image: "/home/golden-hour-trail.png",
    location: { label: "Point Reyes, California, United States", place: "point-reyes" },
    reactions: [
      { emoji: "🔥", count: 1 },
      { emoji: "💛", count: 1 },
      { emoji: "👏", count: 1 },
    ],
    tag: "#travel/hikes",
  },
  {
    id: "spaces",
    author: "Steven",
    daysAgo: 0,
    title: "Spaces for the things we share",
    excerpt: "We’ve organized our memos into four Spaces…",
  },
  {
    id: "didion",
    author: "Sam",
    daysAgo: 0,
    title: "“We tell ourselves stories in order to live.”",
    excerpt: "Been thinking about this all morning.",
  },
  { id: "weekly", author: "Johnny", daysAgo: 1, title: "🗓️ Week 28 review", excerpt: "Shipped: v0.2 of the side project finally went out." },
  {
    id: "tag-tip",
    author: "Steven",
    daysAgo: 1,
    title: "Tip: tags are just typed inline",
    excerpt: "Nested ones grow a tree in the sidebar.",
  },
  { id: "welcome", author: "Steven", daysAgo: 2, title: "Welcome to Memos 👋", excerpt: "Hi, I’m Steven. I build Memos." },
  { id: "shipped", author: "Johnny", daysAgo: 2, title: "Shipped v0.2 of my side project tonight 🚀", excerpt: "Rewrote the sync engine." },
  {
    id: "git-til",
    author: "Johnny",
    daysAgo: 3,
    title: "TIL you can diff a single file between branches",
    excerpt: "No checkout, no stash dance.",
  },
  {
    id: "ramen",
    author: "Sam",
    daysAgo: 4,
    title: "🍜 Midnight miso ramen (15 minutes)",
    excerpt: "For nights when the book was too good to stop.",
  },
  { id: "movies", author: "Sam", daysAgo: 9, title: "🎬 Movie catch-up", excerpt: "Working through films I’ve meant to watch." },
  {
    id: "rendering",
    author: "Steven",
    daysAgo: 10,
    title: "🧪 Markdown rendering check",
    excerpt: "A quick smoke test I open after releases.",
  },
  {
    id: "night-train",
    author: "Bob",
    daysAgo: 12,
    title: "Overnight train from Oslo to Bergen.",
    excerpt: "Woke at 5am to fjords in fog.",
    location: { label: "Bergen, Vestland, Norway", place: "bergen" },
  },
  {
    id: "bucket-list",
    author: "Bob",
    daysAgo: 13,
    title: "🌍 My travel bucket list",
    excerpt: "Writing this from a tiny café near the Seine.",
    location: { label: "Paris, Île-de-France, France", place: "paris" },
  },
  {
    id: "git-cheatsheet",
    author: "Johnny",
    daysAgo: 17,
    title: "⚡ Git commands I keep forgetting",
    excerpt: "Writing these down so I stop googling.",
  },
  {
    id: "deep-work",
    author: "Johnny",
    daysAgo: 22,
    title: "📖 Reading: Deep Work",
    excerpt: "Started Cal Newport’s Deep Work this week.",
    location: { label: "Sightglass Coffee, San Francisco", place: "san-francisco" },
    tag: "#books",
  },
];

/** The two demo memos near San Francisco, which the map clusters into one "2" pin. */
export const BAY_AREA_MEMOS = DEMO_MEMOS.filter(
  (memo) => memo.location?.place === "point-reyes" || memo.location?.place === "san-francisco",
);

/**
 * Five Sunday-start weeks ending with the week that contains `today`, so the calendar always has
 * the last month of demo memos in view. Days outside today's month are muted, as in the product.
 */
export function buildDemoCalendar(today: Date) {
  const dayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const lastSaturday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
  const byDay = new Map<string, DemoMemo[]>();
  for (const memo of DEMO_MEMOS) {
    // Calendar-day arithmetic, not 24-hour subtraction, also works across DST.
    const key = dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - memo.daysAgo));
    byDay.set(key, [...(byDay.get(key) ?? []), memo]);
  }
  return {
    label: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(today),
    days: Array.from({ length: 35 }, (_, index) => {
      const date = new Date(lastSaturday.getFullYear(), lastSaturday.getMonth(), lastSaturday.getDate() - (34 - index));
      const key = dayKey(date);
      return {
        key,
        label: date.getDate(),
        outside: date.getMonth() !== today.getMonth(),
        today: key === dayKey(today),
        memos: date > today ? [] : (byDay.get(key) ?? []),
      };
    }),
  };
}
