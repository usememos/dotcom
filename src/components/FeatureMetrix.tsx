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
    description: "Take control of your data. All runtime data is securely stored in your local database.",
  },
  {
    icon: "✍️",
    slug: "plain-text",
    title: "Create at Speed",
    description: "Save content as plain text for quick access, with Markdown support for fast formatting and easy sharing.",
  },
  {
    icon: "🤲",
    slug: "lightweight",
    title: "Lightweight but Powerful",
    description: "Built with Go, React.js, and a compact architecture, our service delivers powerful performance in a lightweight package.",
  },
  {
    icon: "🧩",
    slug: "customizable",
    title: "Customizable",
    description: "Easily customize your server name, icon, description, system style, and execution scripts to make it uniquely yours.",
  },
  {
    icon: "🦦",
    slug: "open-source",
    title: "Open Source",
    description: "Memos embraces the future of open source, with all code available on GitHub for transparency and collaboration.",
  },
  {
    icon: "💸",
    slug: "free-to-use",
    title: "Free to Use",
    description: "Enjoy all features completely free, with no charges ever for any content",
  },
];

const SUB_FEATURES: FeatureItem[] = [
  {
    icon: "🌟",
    title: "32K+",
    description: "GitHub Stars",
  },
  {
    icon: "👥",
    title: "260+",
    description: "Contributors",
  },
  {
    icon: "📈",
    title: "3.9M+",
    description: "Docker Pulls",
  },
  {
    icon: "📦",
    title: "70+",
    description: "Releases",
  },
];

const FeatureMetrix = () => {
  return (
    <>
      <p className="w-full text-start mt-20 mb-4 sm:px-12 text-3xl sm:text-5xl font-serif font-medium text-gray-500">
        The pain-less way to create meaningful notes.
      </p>
      <div className="w-full mb-8 mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 sm:px-12">
        {MAIN_FEATURES.map((featureItem) => (
          <div key={featureItem.title} className="w-full flex flex-col justify-start items-start rounded-2xl">
            <div className="flex flex-row items-center gap-2 sm:gap-4 sm:flex-col sm:items-start">
              <span className="text-3xl sm:text-5xl">{featureItem.icon}</span>
              <span className="text-base sm:text-xl">{featureItem.title}</span>
            </div>
            <p className="mt-1 text-sm sm:text-base text-gray-500">{featureItem.description}</p>
          </div>
        ))}
      </div>
      <div className="w-full mt-12 sm:px-12">
        <div className="w-full bg-teal-50 border-2 border-teal-600 shadow rounded-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SUB_FEATURES.map((featureItem) => (
            <div key={featureItem.title} className="w-full flex flex-row justify-start items-center gap-4">
              <span className="text-3xl sm:text-5xl">{featureItem.icon}</span>
              <div className="flex flex-col justify-center items-start whitespace-nowrap">
                <p className="text-sm sm:text-base text-gray-500">{featureItem.description}</p>
                <p className="relative text-lg font-medium font-mono sm:text-xl">{featureItem.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeatureMetrix;
