import Link from "next/link";
import Icon from "./Icon";

const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur border-b w-full mx-auto flex flex-row justify-center items-center">
      <div className="max-w-4xl w-full mx-auto py-2 sm:px-10 flex flex-row justify-between items-center">
        <div className="w-auto flex flex-row justify-start items-center">
          <Link href="/">
            <div className="cursor-pointer flex flex-row justify-start items-center hover:opacity-80">
              <img src="/logo.png" className="w-6 h-auto mr-1 mt-1" alt="" />
              <h1 className="mr-2">memos</h1>
            </div>
          </Link>
        </div>
        <div className="w-auto flex flex-row justify-end items-center space-x-2 sm:space-x-3">
          <a
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            target="_blank"
            href="https://demo.usememos.com"
            rel="noreferrer"
          >
            <Icon.Package className="hidden sm:block w-5 h-auto mr-1" /> Live demo
          </a>
          <span className="font-mono text-gray-300">/</span>
          <a
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://github.com/usememos/memos"
            target="_blank"
            rel="noreferrer"
          >
            <Icon.GitHub className="hidden sm:block w-5 h-auto mr-1" /> Source code
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
