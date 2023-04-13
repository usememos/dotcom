import Link from "next/link";
import Icon from "./Icon";

const Header = () => {
  return (
    <header className="sticky top-0 bg-white bg-opacity-80 backdrop-blur border-b z-10 w-full mx-auto flex flex-row justify-center items-center">
      <div className="max-w-4xl w-full mx-auto py-2 sm:px-10 flex flex-row justify-between items-center">
        <div className="w-auto flex flex-row justify-start items-center">
          <Link href="/">
            <div className="cursor-pointer flex flex-row justify-start items-center hover:opacity-80">
              <img src="/logo.webp" className="h-7 w-auto mr-1 rounded-lg" alt="" />
              <span className="font-mono text-lg">memos</span>
            </div>
          </Link>
        </div>
        <div className="w-auto flex flex-row justify-end items-center space-x-2 sm:space-x-3">
          <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/docs">
            <Icon.BookOpen className="hidden sm:block w-5 h-auto mr-1" /> Docs
          </Link>
          <span className="font-mono text-gray-300">/</span>
          <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/blog">
            <Icon.Newspaper className="hidden sm:block w-5 h-auto mr-1" /> Blog
          </Link>
          <span className="font-mono text-gray-300">/</span>
          <a
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://github.com/usememos/memos"
            target="_blank"
          >
            <Icon.Github className="hidden sm:block w-5 h-auto mr-1" /> Source code
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
