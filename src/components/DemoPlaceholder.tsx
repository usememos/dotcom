import Link from "next/link";
import Icon from "./Icon";

const DemoPlaceholder = () => {
  return (
    <div className="relative w-full min-h-[256px] mt-4 mb-2">
      <div className="p-2 flex flex-row justify-center items-center gap-2 sm:gap-4">
        <Link
          className="bg-teal-600 text-white w-32 py-2 rounded-md shadow-lg flex flex-row justify-center items-center hover:bg-teal-700"
          href="/docs"
        >
          Get Started
        </Link>
        <Link
          className="w-32 py-2 rounded-md flex flex-row justify-center items-center hover:bg-gray-200 hover:opacity-70"
          href="https://demo.usememos.com/"
          target="_blank"
        >
          Live Demo
          <Icon.ArrowRight className="w-5 h-auto ml-1" />
        </Link>
      </div>
      <img className="hidden sm:block w-full h-auto" src="/demo.png" alt="demo-screenshot" />
      <img className="sm:hidden w-full h-auto" src="/demo-mobile.png" alt="demo-mobile-screenshot" />
    </div>
  );
};

export default DemoPlaceholder;
