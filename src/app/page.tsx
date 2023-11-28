import DemoPlaceholder from "@/components/DemoPlaceholder";
import FeatureMatrix from "@/components/FeatureMatrix";
import LatestVersion from "@/components/LatestVersion";

const Page = () => {
  return (
    <>
      <div className="mt-4 sm:mt-6 w-full flex flex-col justify-start items-center">
        <LatestVersion />
      </div>
      <div className="w-full flex flex-col justify-center items-center sm:px-16">
        <h2 className="w-full max-w-3xl text-center text-4xl sm:text-6xl font-medium sm:font-bold mt-4 mb-6">
          A privacy-first, lightweight note-taking service
        </h2>
        <h3 className="w-full text-base sm:text-xl text-gray-500 text-center">Easily capture and share your great thoughts.</h3>
      </div>
      <DemoPlaceholder />
      <FeatureMatrix />
    </>
  );
};

export default Page;
