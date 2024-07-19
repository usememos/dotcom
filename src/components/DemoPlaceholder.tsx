import Link from "next/link";
import Icon from "./Icon";
import SectionContainer from "./SectionContainer";

const DemoPlaceholder = () => {
  return (
    <div className="relative w-full min-h-[256px] mt-4 mb-2">
      <SectionContainer className="mx-auto">
        <div className="py-2 w-auto flex flex-row justify-center items-center gap-2 sm:gap-4">
          <Link
            className="bg-teal-600 text-white w-32 py-2 rounded-md shadow-lg flex flex-row justify-center items-center hover:bg-teal-700"
            href="/docs"
          >
            Get Started
          </Link>
          <Link
            className="w-32 py-2 rounded-md flex flex-row justify-center items-center hover:bg-teal-50 hover:text-teal-800"
            href="https://demo.usememos.com/"
            target="_blank"
          >
            Live Demo
            <Icon.ArrowRight className="w-5 h-auto ml-1" />
          </Link>
        </div>
      </SectionContainer>
      <div className="relative w-full sm:max-w-7xl mx-auto overflow-auto">
        <img className="block w-[200vw] max-w-none sm:w-full h-auto" src="/demo.png" alt="demo-screenshot" />
      </div>
    </div>
  );
};

export default DemoPlaceholder;
