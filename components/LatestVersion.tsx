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
      } flex flex-row justify-center items-center my-2 mb-4 px-2 h-6 rounded-lg text-xs bg-pink-200 hover:underline`}
      href="https://github.com/usememos/memos/releases"
      target="_blank"
    >
      <Icon.Sparkles className="w-4 h-auto mr-1" />
      Latest: {version}
    </a>
  );
};

export default LatestVersion;
