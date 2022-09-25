import Icon from "./Icon";

interface ThirdPartyItem {
  name: string;
  author: string;
  description: string;
  link: string;
  repo?: string;
}

const THIRD_PARTY_LIST: ThirdPartyItem[] = [
  {
    name: "Shortcut in iOS",
    author: "monlor",
    description: "Quick write down your memo with shortcut in iOS.",
    link: "https://github.com/usememos/memos/discussions/52",
  },
];

const ThirdParty = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center">
      <p className="text-gray-400 mb-2">🧩 Third party products:</p>
      {THIRD_PARTY_LIST.map((thirdPartyItem) => (
        <div key={thirdPartyItem.name} className="w-full max-w-lg py-4 border-b flex flex-col justify-start items-center text-center">
          <p className="mb-2">
            <span className="font-bold">{thirdPartyItem.name} </span>
            <span className="text-gray-500">by {thirdPartyItem.author}</span>
          </p>
          <p className="mb-2 text-gray-600">{thirdPartyItem.description}</p>
          <div className="flex flex-row justify-start items-center">
            {thirdPartyItem.link && (
              <a
                href={thirdPartyItem.link}
                target="blank"
                className="flex flex-row justify-start items-center text-blue-600 hover:underline"
              >
                <Icon.ExternalLink className="w-4 h-auto mr-1 text-gray-600" /> Link
              </a>
            )}
            {thirdPartyItem.repo && (
              <a
                href={thirdPartyItem.repo}
                target="blank"
                className="ml-4 flex flex-row justify-start items-center text-blue-600 hover:underline"
              >
                <Icon.GitHub className="w-4 h-auto mr-1 text-gray-600" /> Source Code
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThirdParty;
