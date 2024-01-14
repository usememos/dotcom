"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";
import Banner from "./Banner";

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
      {false && <Banner text="🤩 20k GitHub Stars in Just 2 Years" url="/blog/20k-github-stars-in-2-years" />}
      <div className="max-w-6xl w-full mx-auto py-2 px-4 sm:px-10 flex flex-row justify-between items-center">
        <div className="w-auto flex flex-row justify-start items-center">
          <Link href="/">
            <div className="cursor-pointer flex flex-row justify-start items-center hover:opacity-80">
              <span className="sr-only">Memos</span>
              <img src="/full-logo-landscape.png" className="h-8 sm:h-10 w-auto mr-2" alt="" />
            </div>
          </Link>
        </div>
        <div className="w-auto flex flex-row justify-end items-center space-x-2 sm:space-x-3">
          <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/docs">
            Docs
          </Link>
          <span className="font-mono text-gray-300">/</span>
          <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/blog">
            Blogs
          </Link>
          <span className="font-mono text-gray-300">/</span>
          <Link
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://github.com/usememos/memos"
            target="_blank"
          >
            <BsGithub className="w-5 h-auto" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
