import Link from "next/link";
import { BsGithub, BsDiscord, BsTelegram } from "react-icons/bs";
import { RiTwitterXLine } from "react-icons/ri";
import Icon from "./Icon";

const Footer = () => {
  return (
    <footer className="border-t w-full mx-auto flex flex-row justify-center items-center bg-zinc-200 px-6 sm:px-0">
      <div className="max-w-7xl w-full mx-auto py-12 pb-16 sm:px-10 grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-6">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="flex flex-row justify-start items-center">
            <img src="/full-logo-landscape.png" className="h-10 md:h-12 w-auto" alt="" />
          </div>
          <div className="mt-4 ml-2 w-full flex flex-row justify-start items-center gap-2">
            <Link className="text-gray-400 hover:text-blue-600" href="https://x.com/usememos" target="_blank">
              <RiTwitterXLine className="w-6 h-auto" />
            </Link>
            <Link className="text-gray-400 hover:text-blue-600" href="https://github.com/usememos" target="_blank">
              <BsGithub className="w-6 h-auto" />
            </Link>
            <Link className="text-gray-400 hover:text-blue-600" href="https://discord.gg/tfPJa4UmAv" target="_blank">
              <BsDiscord className="w-6 h-auto" />
            </Link>
            <Link className="text-gray-400 hover:text-blue-600" href="https://t.me/+-_tNF1k70UU4ZTc9" target="_blank">
              <BsTelegram className="w-6 h-auto" />
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
            Blog
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600"
            href="/changelog"
          >
            Changelog
          </Link>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600"
            href="https://github.com/usememos/memos"
            target="_blank"
          >
            Source code
            <Icon.ExternalLink className="w-4 h-auto ml-1" />
          </Link>
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">References</p>
          <Link
            className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600"
            href="/brand"
          >
            Brand
          </Link>
          <Link href="https://github.com/sponsors/usememos" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              Sponsor us
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
          <Link href="https://github.com/orgs/usememos/projects/5/views/1" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              Roadmap
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
        </div>
        <div className="w-full flex flex-col justify-start items-start space-y-2">
          <p className="my-2 text-gray-400 font-medium font-mono">Others</p>
          <Link href="https://github.com/yourselfhosted/slash" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              Slash
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
          <Link href="https://github.com/yourselfhosted/gomark" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              gomark
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
          <Link href="https://github.com/yourselfhosted/favicons" target="_blank">
            <span className="w-auto flex flex-row justify-center items-center cursor-pointer hover:underline hover:text-blue-600">
              favicons
              <Icon.ExternalLink className="w-4 h-auto ml-1" />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
