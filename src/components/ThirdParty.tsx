import Link from "next/link";
import Icon from "./Icon";

interface ThirdPartyItem {
  name: string;
  author: string;
  description: string;
  link: string;
}

export const THIRD_PARTY_LIST: ThirdPartyItem[] = [
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
];

const ThirdParty = () => {
  return (
    <>
      <div className="w-full mt-8 mb-12 flex flex-col justify-center items-center">
        <h2 className="border-t pt-4 px-8 text-xl text-center text-gray-500 italic">
          <span className="text-2xl mr-2">🧩</span>Community Products
        </h2>
      </div>
      <div className="w-auto mx-auto flex flex-col justify-start items-start px-4 sm:px-10">
        {THIRD_PARTY_LIST.map((thirdPartyItem) => (
          <div key={thirdPartyItem.name} className="w-auto mt-4 flex flex-col justify-start items-start">
            <p className="mb-1 w-full flex flex-row justify-start items-center">
              {thirdPartyItem.link && (
                <Link
                  href={thirdPartyItem.link}
                  target="_blank"
                  className="flex flex-row justify-start items-center hover:text-blue-600 hover:underline"
                >
                  <span className="">{thirdPartyItem.name}</span> <Icon.ExternalLink className="w-4 h-auto ml-1" />
                </Link>
              )}
            </p>
            <p className="text-gray-500">{thirdPartyItem.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ThirdParty;
