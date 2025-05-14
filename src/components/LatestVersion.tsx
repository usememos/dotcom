"use client";

import Link from "next/link";
import Icon from "./Icon";

const LatestVersion = () => {
  const latestVerion = "v0.24.3";

  return (
    <Link
      className={`${
        !latestVerion && "invisible"
      } flex flex-row justify-center items-center my-2 mb-4 px-4 py-2 rounded-full text-sm bg-orange-100 text-gray-800 border border-orange-200 hover:shadow-sm hover:bg-orange-200`}
      href="https://github.com/usememos/memos/releases"
      target="_blank"
    >
      <span className="mr-2">🎉</span>
      Released
      <span className="font-medium ml-1">{latestVerion}</span>
      <Icon.ArrowRight className="w-4 h-auto ml-1" />
    </Link>
  );
};

export default LatestVersion;
