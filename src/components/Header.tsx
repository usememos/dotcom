"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";
import { DocsNavigationDrawer } from "@/app/docs/[[...slug]]/navigation";
import Banner from "./Banner";

const Header = () => {
  const pathname = usePathname();
  const [showShadow, setShowShadow] = useState(false);
  const showDocsNavigationMenu = pathname.startsWith("/docs");

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
      <Banner text="☁️ Syncing Data Across My Macbooks with iCloud" url="/blog/syncing-data-with-icloud" />
      <div className="max-w-6xl w-full mx-auto py-2 px-4 sm:px-10 flex flex-row justify-between items-center">
        <div className="w-auto flex flex-row justify-start items-center">
          <Link href="/">
            <div className="cursor-pointer flex flex-row justify-start items-center hover:opacity-80">
              <span className="sr-only">memos</span>
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
          {showDocsNavigationMenu && (
            <div className="block sm:hidden col-span-1">
              <DocsNavigationDrawer />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
