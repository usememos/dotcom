export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  slug?: string;
}

export const MAIN_FEATURES: FeatureItem[] = [
  {
    icon: "🏠",
    slug: "privacy-first",
    title: "Privacy First",
    description: "Keep your own data by yourself. All data generated at runtime is saved in the SQLite database file.",
  },
  {
    icon: "✍️",
    slug: "plain-text",
    title: "Plain text with Markdown",
    description: "All content will be saved as plain text, not HTML. And lots of useful markdown syntax are supported.",
  },
  {
    icon: "🤲",
    slug: "lightweight",
    title: "Lightweight but Powerful",
    description: "Using Go + React.js + SQLite architecture, the overall package is very lightweight.",
  },
  {
    icon: "🧩",
    slug: "customizable",
    title: "Customizable",
    description: "You can customize the server name, icon, description, custom system style and execution script, etc.",
  },
  {
    icon: "🦦",
    slug: "open-source",
    title: "Open Source Completely",
    description: "Memos believes that open source is the future, and all code is already open source in GitHub.",
  },
  {
    icon: "💸",
    slug: "free-to-use",
    title: "Free to Use",
    description: "All features are free to use and will never be charged in any form or content.",
  },
];

const SUB_FEATURES: FeatureItem[] = [
  {
    icon: "🌟",
    title: "30K+",
    description: "GitHub Stars",
  },
  {
    icon: "👥",
    title: "240+",
    description: "Contributors",
  },
  {
    icon: "🧑‍💻",
    title: "3.5M+",
    description: "Docker Pulls",
  },
  {
    icon: "📦",
    title: "68+",
    description: "Releases",
  },
];

const FeatureMetrix = () => {
  return (
    <>
      <p className="w-full text-center mt-8 mb-4 sm:px-6 text-xl sm:text-2xl font-normal text-gray-400">Why Memos?</p>
      <div className="w-full my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 sm:px-12">
        {MAIN_FEATURES.map((featureItem) => (
          <div key={featureItem.title} className="w-full flex flex-col justify-start items-start rounded-2xl">
            <span className="text-4xl sm:text-5xl">{featureItem.icon}</span>
            <span className="relative text-base sm:text-xl mt-4">{featureItem.title}</span>
            <p className="mt-1 text-sm sm:text-base text-gray-500">{featureItem.description}</p>
          </div>
        ))}
      </div>
      <div className="w-full mt-12 sm:px-12">
        <div className="w-full bg-teal-50 border-2 border-teal-600 shadow rounded-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SUB_FEATURES.map((featureItem) => (
            <div key={featureItem.title} className="w-full flex flex-row justify-start items-center gap-4">
              <span className="text-3xl sm:text-4xl">{featureItem.icon}</span>
              <div className="flex flex-col justify-center items-start whitespace-nowrap">
                <p className="text-sm text-gray-500">{featureItem.description}</p>
                <p className="relative text-base font-medium font-mono sm:text-lg">{featureItem.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeatureMetrix;
