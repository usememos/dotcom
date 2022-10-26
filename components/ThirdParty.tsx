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
    name: "Moe Memos",
    author: "mudkipme",
    description: "Third party client for iOS and Android.",
    link: "https://memos.moe",
  },
  {
    name: "Shortcut in iOS",
    author: "monlor",
    description: "Quick write down your memo with shortcut in iOS.",
    link: "https://github.com/usememos/memos/discussions/52",
  },
];

const ThirdParty = () => {
  return (
    <div className="w-full flex flex-col justify-start items-start px-4 sm:px-10">
      <p className="text-gray-500 border-t pt-4">🧩 Third party products</p>
      {THIRD_PARTY_LIST.map((thirdPartyItem) => (
        <div key={thirdPartyItem.name} className="w-full max-w-lg mt-4 flex flex-col justify-start items-start">
          <p className="mb-2 w-full flex flex-row justify-start items-center">
            {thirdPartyItem.link && (
              <a
                href={thirdPartyItem.link}
                target="_blank"
                className="flex flex-row justify-start items-center hover:text-blue-600 hover:underline"
                rel="noreferrer"
              >
                <span className="">{thirdPartyItem.name}</span> <Icon.ExternalLink className="w-4 h-auto ml-1" />
              </a>
            )}
          </p>
          <p className="text-gray-500">{thirdPartyItem.description}</p>
          <div className="flex flex-row justify-start items-center">
            {thirdPartyItem.repo && (
              <a
                href={thirdPartyItem.repo}
                target="_blank"
                className="ml-4 flex flex-row justify-start items-center text-blue-600 hover:underline"
                rel="noreferrer"
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
