import axios from "axios";
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
    <a
      className={`${
        !version && "invisible"
      } flex flex-row justify-center items-center border my-2 mb-4 px-3 h-8 leading-8 rounded-full text-sm font-mono hover:underline`}
      href="https://github.com/usememos/memos/releases"
      target="_blank"
    >
      <Icon.Bell className="w-4 h-auto mr-1 animate-bounce" />
      <span className="mt-0.5">{version}</span>
    </a>
  );
};

export default LatestVersion;
