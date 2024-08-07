import DemoPlaceholder from "@/components/DemoPlaceholder";
import FeatureMetrix from "@/components/FeatureMetrix";
import LatestVersion from "@/components/LatestVersion";
import SectionContainer from "@/components/SectionContainer";

const Page = () => {
  return (
    <>
      <h1 className="sr-only">Memos</h1>
      <div className="mt-4 sm:mt-6 w-full flex flex-col justify-start items-center">
        <LatestVersion />
      </div>
      <div className="w-full flex flex-col justify-center items-center px-4 sm:px-16">
        <h2 className="w-full max-w-3xl text-center text-4xl sm:text-5xl font-medium sm:font-bold mt-4 mb-4">
          A privacy-first, lightweight note-taking service
        </h2>
        <h3 className="w-full text-base sm:text-xl text-gray-600 text-center">Easily capture and share your great thoughts.</h3>
      </div>
      <DemoPlaceholder />
      <SectionContainer>
        <FeatureMetrix />
      </SectionContainer>
    </>
  );
};

export default Page;
