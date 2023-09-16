import Link from "next/link";
import Icon from "./Icon";
import { FEATURE_LIST } from "./FeatureMatrix";
import { THIRD_PARTY_LIST } from "./ThirdParty";

const Footer = () => {
  return (
    <footer className="border-t w-full mx-auto flex flex-row justify-center items-center sm:bg-zinc-100 sm:shadow-inner px-4 sm:px-0">
      <div className="max-w-6xl w-full mx-auto py-12 pb-16 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
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
              >
                {product.name}
                <Icon.ExternalLink className="w-4 h-auto inline ml-1" />
              </a>
            );
          })}
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">References</p>
          <Link href="/docs">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              Documentation
            </span>
          </Link>
          <Link href="/changelog">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              Changelog
            </span>
          </Link>
          <Link href="/blog">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              Blogs
            </span>
          </Link>
          <div className="w-auto flex flex-row justify-start items-center space-x-2">
            <span className="text-gray-500">Discuss in</span>
            <Link
              className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
              href="https://discord.gg/tfPJa4UmAv"
              target="_blank"
            >
              <Icon.MessageCircle className="w-5 h-auto mr-1" /> Discord
            </Link>
          </div>
          <div className="w-auto flex flex-row justify-start items-center space-x-2">
            <span className="text-gray-500">Join</span>
            <Link
              className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
              target="_blank"
              href="https://t.me/+-_tNF1k70UU4ZTc9"
            >
              <Icon.MessageSquare className="w-5 h-auto mr-1" /> Telegram
            </Link>
          </div>
          <Link
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://github.com/sponsors/usememos"
            target="_blank"
          >
            <Icon.Heart className="w-5 h-auto mr-1" />
            Become a Sponsor
          </Link>
          <Link
            className="w-auto px-3 py-1 rounded-full border-2 border-blue-700 flex flex-row justify-start items-center space-x-2 cursor-pointer hover:bg-blue-100"
            href="https://twitter.com/usememos"
            target="_blank"
          >
            <span className="text-blue-700">Follow us in </span>
            <Icon.Twitter className="w-5 h-auto mr-1 text-blue-700" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
