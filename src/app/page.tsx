import DemoPlaceholder from "@/components/DemoPlaceholder";
import FeatureMetrix from "@/components/FeatureMetrix";
import LatestVersion from "@/components/LatestVersion";
import SectionContainer from "@/components/SectionContainer";

const Page = () => {
  return (
    <>
      <div className="w-full bg-gradient-to-b from-white to-teal-50">
        <h1 className="sr-only">Memos</h1>
        <div className="mt-4 sm:mt-6 w-full flex flex-col justify-start items-center">
          <LatestVersion />
        </div>
        <div className="w-full flex flex-col justify-center items-center px-4 sm:px-16">
          <h2 className="w-full max-w-3xl text-center text-3xl sm:text-5xl font-serif font-medium mt-4 mb-4">
            {"Open Source, Self-hosted,"}
            <br className="hidden sm:block" />
            <span className="inline sm:hidden"> </span>
            Your Notes, Your Way
          </h2>
          <h3 className="w-full text-lg sm:text-2xl text-gray-600 text-center font-serif">Effortlessly craft your impactful content</h3>
        </div>
        <DemoPlaceholder />
      </div>
      <SectionContainer>
        <FeatureMetrix />
      </SectionContainer>
    </>
  );
};

export default Page;
