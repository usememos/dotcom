import Icon from "./Icon";

export interface FeatureItem {
  slug: string;
  icon: Icon.LucideIcon;
  title: string;
  description: string;
}

export const FEATURE_LIST: FeatureItem[] = [
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
    description: "memos believes that open source is the future, and all code is already open source in GitHub.",
  },
  {
    slug: "free-forever",
    icon: Icon.Smile,
    title: "Free Forever",
    description: "All features are free forever and will never be charged in any form or content.",
  },
];

const FeatureMatrix = () => {
  return (
    <div className="w-full my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 sm:px-6">
      {FEATURE_LIST.map((featureItem) => (
        <div key={featureItem.title} className="w-full flex flex-col justify-start items-start p-6 rounded-2xl bg-zinc-100 hover:shadow">
          <div className="w-10 h-10 bg-white text-gray-600 rounded-lg p-2">
            <featureItem.icon className="h-6 w-auto " />
          </div>
          <span className="relative text-base sm:text-lg mb-2 mt-4">
            <span>{featureItem.title}</span>
          </span>
          <p className="text-sm text-gray-500">{featureItem.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureMatrix;
