import Link from "next/link";
import { BsGithub, BsDiscord } from "react-icons/bs";
import { RiTwitterXLine } from "react-icons/ri";
import Icon from "./Icon";

const Footer = () => {
  return (
    <footer className="w-full mx-auto flex flex-row justify-center items-center py-8 px-6 sm:px-8">
      <div className="max-w-7xl w-full shadow-sm mx-auto bg-zinc-50 rounded-3xl py-8 sm:py-12 sm:pb-16 px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-6">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="flex flex-row justify-start items-center">
            <img src="/full-logo-landscape.png" className="h-12 md:h-14 w-auto" alt="" />
          </div>
          <div className="mt-2">
            <Link href="https://trendshift.io/repositories/1854" target="_blank">
              <img src="https://trendshift.io/api/badge/repositories/1854" className="h-12" alt="Trendshift" />
            </Link>
          </div>
          <div className="mt-4 ml-2 w-full flex flex-row justify-start items-center gap-3">
            <Link className="text-gray-400 hover:text-teal-600" href="https://x.com/usememos" target="_blank">
              <RiTwitterXLine className="w-7 h-auto" />
            </Link>
            <Link className="text-gray-400 hover:text-teal-600" href="https://github.com/usememos" target="_blank">
              <BsGithub className="w-7 h-auto" />
            </Link>
            <Link className="text-gray-400 hover:text-teal-600" href="https://discord.gg/tfPJa4UmAv" target="_blank">
              <BsDiscord className="w-7 h-auto" />
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">Resources</p>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600"
            href="/docs"
          >
            Documentation
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600"
            href="/blog"
          >
            Blog
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600"
            href="/changelog"
          >
            Changelog
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600"
            href="/supporters"
          >
            Supporters 💗
          </Link>
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">References</p>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600"
            href="/brand"
          >
            Brand
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600"
            href="https://memos.apidocumentation.com/reference"
            target="_blank"
          >
            API reference
            <Icon.ExternalLink className="w-4 h-auto ml-1" />
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600"
            href="https://github.com/usememos/memos"
            target="_blank"
          >
            Source code
            <Icon.ExternalLink className="w-4 h-auto ml-1" />
          </Link>
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">Others</p>
          <Link href="https://github.com/usememos/telegram-integration" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600">
              Telegram integration
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
          <Link href="https://github.com/usememos/mui" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600">
              MUI
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
          <Link href="https://github.com/usememos/gomark" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600">
              gomark
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
          <Link href="https://github.com/yourselfhosted/slash" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-teal-600">
              Slash
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
