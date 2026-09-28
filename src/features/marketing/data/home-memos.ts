/**
 * One person's week in Memos, written the way the product is used: short memos with #tags typed
 * inline and no title field (a Markdown heading is optional). The weekly review, Deep Work note,
 * SQLite bookmark, and git tip follow Johnny's memos in the official demo seed, checked 2026-09-28:
 * https://github.com/usememos/memos/blob/main/store/seed/sqlite/01__dump.sql
 * Dates are relative to the viewer's local day in this personal example timeline.
 */
export interface HomeMemo {
  id: string;
  kind: "note" | "sponsors";
  daysAgo: number;
  /** An optional Markdown heading, rendered bold like the product's `##` headings. */
  heading?: string;
  /** Optional `**Label:** text` paragraphs. */
  lines?: { label: string; text: string }[];
  quote?: string;
  /** The memo's main paragraph, with inline #tags as typed. */
  text: string;
  tasks?: { text: string; done: boolean }[];
  code?: string;
  link?: { label: string; href: string };
  /** Memos this one links to, listed under it as "Referencing". */
  referencing?: { id: string; label: string }[];
  location?: string;
  reactions?: { emoji: string; count: number }[];
}

/** Matches inline tags as the product parses them, including nested `parent/child` tags. */
export const INLINE_TAG_PATTERN = /(#[\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*)/u;

export function memoTags(memo: Pick<HomeMemo, "text">) {
  // Splitting on a capturing pattern puts every matched tag at an odd index.
  return memo.text
    .split(INLINE_TAG_PATTERN)
    .filter((_, index) => index % 2 === 1)
    .map((part) => part.slice(1));
}

export const HOME_MEMOS: HomeMemo[] = [
  {
    id: "weekly",
    kind: "note",
    daysAgo: 0,
    heading: "🗓️ Week 28 review",
    lines: [
      { label: "Shipped:", text: "v0.2 of the side project finally went out." },
      { label: "Learned:", text: "the single-file branch diff trick. Saves me daily." },
    ],
    text: "Linked the memos below so future me can retrace the week. #weekly",
    referencing: [
      { id: "reading", label: "📖 Reading: Deep Work" },
      { id: "git", label: "TIL: diff a single file between branches" },
    ],
    reactions: [
      { emoji: "👏", count: 1 },
      { emoji: "💡", count: 1 },
    ],
  },
  {
    id: "gift",
    kind: "note",
    daysAgo: 0,
    text: "Mia’s birthday: the pottery class downtown, not another gadget. #family",
  },
  {
    id: "errands",
    kind: "note",
    daysAgo: 0,
    text: "Before Friday #errands",
    tasks: [
      { text: "Renew passport photos", done: true },
      { text: "Book the train to Lyon", done: false },
      { text: "Return the library books", done: false },
    ],
  },
  {
    id: "reading",
    kind: "note",
    daysAgo: 1,
    heading: "📖 Reading: Deep Work",
    quote: "“Human beings, it seems, are at their best when immersed deeply in something challenging.”",
    text: "Experiment for two weeks: no Slack or email before 11am. #reading/books",
    location: "Sightglass Coffee, San Francisco",
  },
  {
    id: "sponsors",
    kind: "sponsors",
    daysAgo: 2,
    text: "Memos stays open source with help from these sponsors.",
  },
  {
    id: "bookmark",
    kind: "note",
    daysAgo: 3,
    text: "Weekend read, bookmarking before I lose it. #reading/web",
    link: { label: "SQLite: 35% faster than the filesystem", href: "https://sqlite.org/fasterthanfs.html" },
    reactions: [{ emoji: "👀", count: 1 }],
  },
  {
    id: "git",
    kind: "note",
    daysAgo: 4,
    text: "TIL you can diff a single file between branches, no checkout needed. #dev/til",
    code: "git diff main..feature -- path/to/file.go",
    reactions: [{ emoji: "💡", count: 1 }],
  },
];

/** Parent tag counts include nested tags, once per memo, as in the product. */
export const HOME_TAGS = [
  ...new Set(
    HOME_MEMOS.flatMap((memo) =>
      memoTags(memo).flatMap((tag) => {
        const parts = tag.split("/");
        return parts.map((_, index) => parts.slice(0, index + 1).join("/"));
      }),
    ),
  ),
]
  .map((tag) => ({
    tag,
    count: HOME_MEMOS.filter((memo) => memoTags(memo).some((value) => value === tag || value.startsWith(`${tag}/`))).length,
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
