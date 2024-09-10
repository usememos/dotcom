import { Metadata } from "next";
import DemoPlaceholder from "@/components/DemoPlaceholder";
import FeatureMetrix, { MAIN_FEATURES, FeatureItem } from "@/components/FeatureMetrix";
import LatestVersion from "@/components/LatestVersion";
import SectionContainer from "@/components/SectionContainer";
import { getMetadata } from "@/utils/metadata";

interface Props {
  params: { slug: string };
}

const Page = ({ params }: Props) => {
  const feature = MAIN_FEATURES.find((feature) => feature.slug === params.slug) as FeatureItem;

  return (
    <SectionContainer>
      <div className="mt-6 sm:mt-12 w-full flex flex-col justify-start items-center">
        <LatestVersion />
      </div>
      <div className="w-full flex flex-col justify-center items-center sm:px-16">
        <feature.icon strokeWidth="1" className="h-20 mt-4 mb-2 sm:h-24 w-auto text-gray-500" />
        <h1 className="w-full text-center text-3xl sm:text-6xl font-bold mt-4 mb-4">{feature.title}</h1>
        <h2 className="w-full text-lg sm:text-xl text-gray-500 text-center mb-2">{feature.description}</h2>
      </div>
      <DemoPlaceholder />
      <FeatureMetrix />
    </SectionContainer>
  );
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const feature = MAIN_FEATURES.find((feature) => feature.slug === params.slug) as FeatureItem;
  return getMetadata({
    title: feature.title + " - Memos",
    description: feature.description,
    pathname: `/feature/${feature.slug}`,
  });
};

export const generateStaticParams = () => {
  return MAIN_FEATURES.map((feature) => {
    return {
      slug: feature.slug,
    };
  });
};

export default Page;
