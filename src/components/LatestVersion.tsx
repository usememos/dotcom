"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";

const LatestVersion = () => {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    axios.get<string>("/api/version").then(({ data }) => {
      setVersion(data);
    });
  }, []);

  return (
    <Link
      className={`${
        !version && "invisible"
      } flex flex-row justify-center items-center my-2 mb-4 px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-600 hover:shadow hover:bg-blue-200`}
      href="https://github.com/usememos/memos/releases"
      target="_blank"
    >
      🎉 Released
      <span className="font-medium ml-1">v{version}</span>
      <Icon.ArrowRight className="w-4 h-auto ml-1" />
    </Link>
  );
};

export default LatestVersion;
