import Link from "next/link";

interface ComparisonItem {
  slug: string;
  title: string;
  description: string;
}

export const COMPARISON_LIST: ComparisonItem[] = [
  {
    slug: "notion",
    title: "Notion",
    description: "The all-in-one workspace — for your tasks, notes, wikis, and calendar.",
  },
  {
    slug: "obsidian",
    title: "Obsidian",
    description: "A knowledge base that works on local Markdown files.",
  },
  {
    slug: "twitter",
    title: "Twitter",
    description: "It's what's happening",
  },
  {
    slug: "mastodon",
    title: "Mastodon",
    description: "Decentralized social media",
  },
  {
    slug: "github-gist",
    title: "GitHub gist",
    description: "GitHub Gist: instantly share code, notes, and snippets.",
  },
];

const ComparisonMatrix = () => {
  return (
    <div className="sr-only hidden w-full grid-cols-2 sm:grid-cols-3 gap-4 px-4 sm:px-16">
      {COMPARISON_LIST.map((comparisonItem) => (
        <Link key={comparisonItem.title} href={`/comparison/${comparisonItem.slug}`}>
          <div className="w-full flex flex-col justify-start items-start mb-2 sm:mb-8">
            <span className="text-base sm:text-xl sm:leading-10 my-1">{comparisonItem.title}</span>
            <p className="text-sm sm:text-base text-gray-500">{comparisonItem.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ComparisonMatrix;
