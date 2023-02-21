import Link from "next/link";
import Icon from "./Icon";
import { FEATURE_LIST } from "./FeatureMatrix";
import { THIRD_PARTY_LIST } from "./ThirdParty";

const Footer = () => {
  return (
    <footer className="border-t w-full mx-auto flex flex-row justify-center items-center">
      <div className="max-w-4xl w-full mx-auto py-4 pb-8 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">Features</p>
          {FEATURE_LIST.map((feature) => {
            return (
              <Link key={feature.slug} href={`/feature/${feature.slug}`}>
                <span className="cursor-pointer hover:underline hover:text-blue-600">{feature.title}</span>
              </Link>
            );
          })}
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">Community Products</p>
          {THIRD_PARTY_LIST.map((product) => {
            return (
              <a
                className="w-full break-all whitespace-pre-wrap hover:underline hover:text-blue-600"
                key={product.name}
                href={product.link}
                target="_blank"
                rel="noreferrer"
              >
                {product.name}
                <Icon.ExternalLink className="w-4 h-auto inline ml-1" />
              </a>
            );
          })}
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">References</p>
          <div className="w-auto flex flex-row justify-start items-center space-x-2">
            <span className="text-gray-500">Discuss in</span>
            <a
              className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
              href="https://discord.gg/tfPJa4UmAv"
              target="_blank"
              rel="noreferrer"
            >
              <Icon.MessageCircle className="w-5 h-auto mr-1" /> Discord
            </a>
          </div>
          <div className="w-auto flex flex-row justify-start items-center space-x-2">
            <span className="text-gray-500">Join</span>
            <a
              className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
              target="_blank"
              href="https://t.me/+-_tNF1k70UU4ZTc9"
              rel="noreferrer"
            >
              <Icon.MessageSquare className="w-5 h-auto mr-1" /> Telegram
            </a>
          </div>
          <a
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://github.com/sponsors/usememos"
            target="_blank"
            rel="noreferrer"
          >
            <Icon.Heart className="w-5 h-auto mr-1" />
            Become a Sponsor
          </a>
          <Link href={"/docs/hello-world"}>
            <span className="cursor-pointer opacity-60 hover:underline hover:text-blue-600">Hello world</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
