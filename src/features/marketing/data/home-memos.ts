/**
 * Compact, editorial adaptations of the official demo seed, checked 2026-09-13:
 * https://github.com/usememos/memos/blob/main/store/seed/sqlite/01__dump.sql
 * Ordered to show everyday capture, developer notes, travel, reading, and bookmarks.
 * Dates are relative to the viewer's local day in this personal example timeline.
 */
interface HomeMemo {
  id: string;
  sourceUid: string;
  daysAgo: number;
  title: string;
  tags: string[];
  text?: string;
  tasks?: { text: string; done: boolean }[];
  code?: string;
  image?: { src: string; alt: string };
  location?: string;
  quote?: string;
  link?: { label: string; href: string };
  referenceId?: string;
}

export const HOME_MEMOS: HomeMemo[] = [
  {
    id: "weekly",
    sourceUid: "johnnyweekly001",
    daysAgo: 0,
    title: "A small win, and what’s next",
    tasks: [
      { text: "Ship v0.2 of the side project", done: true },
      { text: "Build the digest CLI next week", done: false },
    ],
    referenceId: "git",
    tags: ["weekly"],
  },
  {
    id: "git",
    sourceUid: "johnnytilgit001",
    daysAgo: 1,
    title: "TIL: compare files across branches",
    text: "No checkout. No stash. Just the diff I need.",
    code: "git diff main..feature -- path/to/file.go",
    tags: ["dev/til", "dev/git"],
  },
  {
    id: "travel",
    sourceUid: "goldenhour0001",
    daysAgo: 2,
    title: "A little color from the coastal trail",
    image: {
      src: "/demo/golden-hour-trail.png",
      alt: "Golden-hour coastal landscape from the Memos demo: a warm sky above purple hills and blue water.",
    },
    location: "Point Reyes, California",
    tags: ["travel/hikes"],
  },
  {
    id: "reading",
    sourceUid: "johnnyreading01",
    daysAgo: 3,
    title: "Reading: Deep Work",
    quote: "“Human beings, it seems, are at their best when immersed deeply in something challenging.”",
    text: "My two-week experiment: no Slack or email before 11am.",
    location: "Sightglass Coffee, San Francisco",
    tags: ["books"],
  },
  {
    id: "bookmark",
    sourceUid: "johnnybookmark1",
    daysAgo: 4,
    title: "Save this for the weekend",
    text: "A good read on storing small files in SQLite. Keeping the source here so I can find it again.",
    link: { label: "SQLite: 35% faster than the filesystem", href: "https://sqlite.org/fasterthanfs.html" },
    tags: ["dev/reading"],
  },
];

/** Parent tag counts include nested tags, once per memo, as in the product. */
export const HOME_TAGS = [
  ...new Set(
    HOME_MEMOS.flatMap((memo) =>
      memo.tags.flatMap((tag) => {
        const parts = tag.split("/");
        return parts.map((_, index) => parts.slice(0, index + 1).join("/"));
      }),
    ),
  ),
]
  .map((tag) => ({
    tag,
    count: HOME_MEMOS.filter((memo) => memo.tags.some((value) => value === tag || value.startsWith(`${tag}/`))).length,
  }))
  .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

export function buildHomeCalendar(today: Date) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((first.getDay() + daysInMonth) / 7) * 7;
  // Calendar-day arithmetic, not 24-hour subtraction, also works across DST.
  const dayKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const activity = new Map<string, number>();
  for (const memo of HOME_MEMOS) {
    const key = dayKey(new Date(year, month, today.getDate() - memo.daysAgo));
    activity.set(key, (activity.get(key) ?? 0) + 1);
  }
  return {
    label: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(today),
    days: Array.from({ length: cellCount }, (_, index) => {
      const date = new Date(year, month, index - first.getDay() + 1);
      const key = dayKey(date);
      const outside = date.getMonth() !== month;
      return { key, label: date.getDate(), outside, today: key === dayKey(today), count: outside ? 0 : (activity.get(key) ?? 0) };
    }),
  };
}
