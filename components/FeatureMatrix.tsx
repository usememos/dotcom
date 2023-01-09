import Icon from "./Icon";

interface FeatureItem {
  slug: string;
  icon: Icon.Icon;
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
    icon: Icon.GitHub,
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
    <>
      <div className="w-full mt-8 mb-12 flex flex-col justify-center items-center">
        <h2 className="border-t pt-4 px-8 text-xl text-center text-gray-500 italic">
          <span className="text-2xl mr-2">✨</span>Features
        </h2>
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 sm:px-16">
        {FEATURE_LIST.map((featureItem) => (
          <a
            key={featureItem.title}
            href={`/feature/${featureItem.slug}`}
            className="w-full flex flex-col justify-start items-start mb-2 sm:mb-8"
          >
            <featureItem.icon className="h-10 mt-4 mb-2 sm:h-14 w-auto text-gray-500" />
            <span className="text-base sm:text-xl sm:leading-10 my-1">{featureItem.title}</span>
            <p className="text-sm sm:text-base text-gray-500">{featureItem.description}</p>
          </a>
        ))}
      </div>
    </>
  );
};

export default FeatureMatrix;
