import { HOME_MEMOS, type HomeMemo, memoTags } from "@/features/marketing/data/home-memos";

/** The hero timeline's own memos; the sponsor slot is not something anyone searches for. */
export const TIMELINE_NOTES = HOME_MEMOS.filter((memo) => memo.kind === "note");

export type FindLens =
  | { id: string; kind: "search"; title: string; query: string; description: string; term: string }
  | { id: string; kind: "tag"; title: string; query: string; description: string; tag: string }
  | { id: string; kind: "view"; title: string; query: string; description: string }
  | { id: string; kind: "day"; title: string; query: string; description: string; daysAgo: number }
  | { id: string; kind: "place"; title: string; query: string; description: string };

/** Each lens is a real way back in Memos v0.31, run against the same memos shown in the hero. */
export const FIND_LENSES: readonly FindLens[] = [
  {
    id: "search",
    kind: "search",
    title: "Search",
    query: "“pottery”",
    term: "pottery",
    description: "Type a word or phrase to see every memo that contains it.",
  },
  {
    id: "tag",
    kind: "tag",
    title: "Tag",
    query: "#reading",
    tag: "reading",
    description: "Choose a tag in the sidebar. Nested tags like #reading/books come along.",
  },
  {
    id: "view",
    kind: "view",
    title: "View",
    query: "Tasks",
    description: "A saved filter you reopen from the sidebar, here every memo with an unchecked task.",
  },
  {
    id: "day",
    kind: "day",
    title: "Day",
    query: "Today",
    daysAgo: 0,
    description: "Open any day on the calendar to see what you wrote then.",
  },
  {
    id: "place",
    kind: "place",
    title: "Place",
    query: "On the map",
    description: "Memos with a location appear on the map where you wrote them.",
  },
];

export function lensMatches(lens: FindLens, memo: HomeMemo) {
  switch (lens.kind) {
    case "search":
      return memo.text.toLowerCase().includes(lens.term);
    case "tag":
      return memoTags(memo).some((tag) => tag === lens.tag || tag.startsWith(`${lens.tag}/`));
    case "view":
      return memo.tasks?.some((task) => !task.done) ?? false;
    case "day":
      return memo.daysAgo === lens.daysAgo;
    case "place":
      return Boolean(memo.location);
  }
}
