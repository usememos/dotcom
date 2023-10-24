"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import Banner from "./Banner";
import Icon from "./Icon";

const Header = () => {
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      setShowShadow(window.scrollY > 0);
    });
  }, []);

  return (
    <header
      className={classNames(
        "sticky top-0 bg-white bg-opacity-80 backdrop-blur-lg z-10 w-full mx-auto flex flex-col justify-center items-center",
        showShadow && "border-b shadow",
      )}
    >
      <Banner text="🐘 Choosing Between SQLite and MySQL" url="/blog/choosing-between-sqlite-and-mysql" />
      <div className="max-w-6xl w-full mx-auto py-2 sm:py-4 px-4 sm:px-10 flex flex-row justify-between items-center">
        <div className="w-auto flex flex-row justify-start items-center">
          <Link href="/">
            <div className="cursor-pointer flex flex-row justify-start items-center hover:opacity-80">
              <img src="/logo.png" className="h-8 w-auto mr-2 rounded-full shadow" alt="" />
              <span className="text-xl">memos</span>
            </div>
          </Link>
        </div>
        <div className="w-auto flex flex-row justify-end items-center space-x-2 sm:space-x-3">
          <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/docs">
            Docs
          </Link>
          <span className="font-mono text-gray-300">/</span>
          <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/blog">
            Blog
          </Link>
          <span className="font-mono text-gray-300">/</span>
          <Link
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="/github"
            target="_blank"
          >
            <Icon.Github className="w-5 h-auto" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
