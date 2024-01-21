"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";
import useResponsiveWidth from "@/hooks/useResponsiveWidth";
import Banner from "./Banner";

const Header = () => {
  const { sm } = useResponsiveWidth();
  const [pageScrolled, setPageScrolled] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      setPageScrolled(window.scrollY > 0);
    });
  }, []);

  return (
    <header
      className={classNames(
        "sticky top-0 transition-all bg-zinc-100 bg-opacity-80 backdrop-blur-lg z-10 w-full mx-auto flex flex-col justify-center items-center",
        pageScrolled && "border-b shadow",
        pageScrolled ? "pt-0" : "pt-2",
      )}
    >
      {false && <Banner text="🤩 20k GitHub Stars in Just 2 Years" url="/blog/20k-github-stars-in-2-years" />}
      <div className="max-w-6xl w-full mx-auto py-2 px-4 sm:px-10 flex flex-row justify-between items-center">
        <div className="w-auto flex flex-row justify-start items-center">
          <Link href="/">
            <div className="cursor-pointer flex flex-row justify-start items-center hover:opacity-80">
              <span className="sr-only">Memos</span>
              <img src="/full-logo-landscape.png" className="h-9 sm:h-10 w-auto mr-2" alt="" />
            </div>
          </Link>
          <div className="ml-2 sm:ml-4 w-auto flex flex-row justify-end items-center space-x-2 sm:space-x-3 font-medium text-zinc-700">
            <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/docs">
              {sm ? "Documentation" : "Docs"}
            </Link>
            <span className="font-mono text-gray-300">/</span>
            <Link className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600" href="/blog">
              Blogs
            </Link>
          </div>
        </div>
        <div className="w-auto flex flex-row justify-end items-center space-x-2 sm:space-x-3">
          <Link
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://github.com/usememos/memos"
            target="_blank"
          >
            <BsGithub className="w-5 h-auto mr-1 -mt-0.5" />
            <span className="hidden sm:block">GitHub</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
