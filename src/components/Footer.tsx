import Link from "next/link";
import { BsTwitter, BsGithub, BsDiscord, BsTelegram } from "react-icons/bs";
import Icon from "./Icon";

const Footer = () => {
  return (
    <footer className="border-t w-full mx-auto flex flex-row justify-center items-center bg-zinc-100 px-6 sm:px-0">
      <div className="max-w-6xl w-full mx-auto py-12 pb-16 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="flex flex-row justify-start items-center mb-6">
            <img src="/logo.png" className="h-10 w-auto mr-2 rounded-full shadow" alt="" />
            <span className="text-2xl">memo</span>
          </div>
          <div className="w-full flex flex-row justify-start items-center gap-3">
            <Link href="https://twitter.com/usememos" target="_blank">
              <BsTwitter className="w-6 h-auto text-blue-700" />
            </Link>
            <Link href="https://github.com/usememos" target="_blank">
              <BsGithub className="w-6 h-auto text-blue-700" />
            </Link>
            <Link href="https://discord.gg/tfPJa4UmAv" target="_blank">
              <BsDiscord className="w-6 h-auto text-blue-700" />
            </Link>
            <Link href="https://t.me/+-_tNF1k70UU4ZTc9" target="_blank">
              <BsTelegram className="w-6 h-auto text-blue-700" />
            </Link>
          </div>
          <div className="mt-4">
            <Link
              className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
              href="https://github.com/sponsors/usememos"
              target="_blank"
            >
              <Icon.Heart className="w-5 h-auto mr-1 text-red-700" />
              Become a Sponsor
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">Resources</p>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600"
            href="/docs"
          >
            Documentation
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600"
            href="/blog"
          >
            Blogs
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600"
            href="/changelog"
          >
            Changelog
          </Link>
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">References</p>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600"
            href="/legal/privacy-policy"
          >
            Policy
          </Link>
          <Link href="/roadmap" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              Roadmap
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
