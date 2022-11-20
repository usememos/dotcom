import Icon from "./Icon";

interface ThirdPartyItem {
  name: string;
  author: string;
  description: string;
  link: string;
}

const THIRD_PARTY_LIST: ThirdPartyItem[] = [
  {
    name: "Moe Memos",
    author: "mudkipme",
    description: "Third party client for iOS and Android.",
    link: "https://memos.moe",
  },
  {
    name: "lmm214/memos-bber",
    author: "lmm214",
    description: "Chrome extension",
    link: "https://github.com/lmm214/memos-bber",
  },
  {
    name: "Rabithua/memos_wmp",
    author: "Rabithua",
    description: "Wechat miniprogram",
    link: "https://github.com/Rabithua/memos_wmp",
  },
  {
    name: "qazxcdswe123/telegramMemoBot",
    author: "qazxcdswe123",
    description: "Telegram bot",
    link: "https://github.com/qazxcdswe123/telegramMemoBot",
  },
];

const ThirdParty = () => {
  return (
    <div className="w-full flex flex-col justify-start items-start px-4 sm:px-10">
      <h3 className="text-gray-500 border-t pt-6">🧩 Products made by Community</h3>
      {THIRD_PARTY_LIST.map((thirdPartyItem) => (
        <div key={thirdPartyItem.name} className="w-full max-w-lg mt-4 flex flex-col justify-start items-start">
          <p className="mb-1 w-full flex flex-row justify-start items-center">
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
        </div>
      ))}
    </div>
  );
};

export default ThirdParty;
