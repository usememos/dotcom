import Icon from "./Icon";

export interface FeatureItem {
  icon: Icon.LucideIcon;
  title: string;
  description: string;
  slug?: string;
}

export const MAIN_FEATURES: FeatureItem[] = [
  {
    slug: "privacy-first",
    icon: Icon.Shield,
    title: "Privacy First",
    description: "Keep your own data by yourself. All data generated at runtime is saved in the SQLite database file.",
  },
  {
    slug: "plain-text",
    icon: Icon.Edit3,
    title: "Plain text with Markdown",
    description: "All content will be saved as plain text, not HTML. And lots of useful markdown syntax are supported.",
  },
  {
    slug: "lightweight",
    icon: Icon.Compass,
    title: "Lightweight but Powerful",
    description: "Using Go + React.js + SQLite architecture, the overall package is very lightweight.",
  },
  {
    slug: "customizable",
    icon: Icon.Sliders,
    title: "Customizable",
    description: "You can customize the server name, icon, description, custom system style and execution script, etc.",
  },
  {
    slug: "open-source",
    icon: Icon.Github,
    title: "Open Source Completely",
    description: "Memos believes that open source is the future, and all code is already open source in GitHub.",
  },
  {
    slug: "free-to-use",
    icon: Icon.Smile,
    title: "Free to Use",
    description: "All features are free to use and will never be charged in any form or content.",
  },
];

const SUB_FEATURES: FeatureItem[] = [
  {
    icon: Icon.Star,
    title: "29K+",
    description: "GitHub Stars",
  },
  {
    icon: Icon.Users,
    title: "230+",
    description: "Contributors",
  },
  {
    icon: Icon.Download,
    title: "3.2M+",
    description: "Docker Pulls",
  },
  {
    icon: Icon.Package,
    title: "65+",
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
            <div className="w-10 h-10 text-gray-600 rounded-lg">
              <featureItem.icon className="h-10 w-auto" strokeWidth={1} />
            </div>
            <span className="relative text-base sm:text-xl mt-4">{featureItem.title}</span>
            <p className="mt-1 text-sm sm:text-base text-gray-500">{featureItem.description}</p>
          </div>
        ))}
      </div>
      <div className="w-full mt-4 sm:px-12">
        <div className="w-full bg-teal-50 border-2 border-teal-600 shadow rounded-xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SUB_FEATURES.map((featureItem) => (
            <div key={featureItem.title} className="w-full flex flex-row justify-start items-center gap-4">
              <div className="text-gray-600 rounded-lg">
                <featureItem.icon className="h-8 sm:h-10 w-auto" strokeWidth={1} />
              </div>
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
