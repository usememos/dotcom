import { getMetadata } from "@/utils/metadata";

const Page = () => {
  return (
    <>
      <div className="w-full max-w-3xl flex flex-col justify-center items-center sm:px-16">
        <h2 className="w-full text-center text-4xl sm:text-6xl font-medium sm:font-bold mt-4 mb-6">Brand</h2>

        <div className="mt-12 w-full grid grid-cols-2 gap-6 sm:gap-12">
          <div className="col-span-1 border p-4 flex justify-center items-center">
            <img src="/logo.png" alt="memos" />
          </div>
          <div className="col-span-1 border p-4 flex justify-center items-center">
            <img src="/logo-rounded.png" alt="memos" />
          </div>
        </div>
        <div className="mt-6 sm:mt-12 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
          <div className="col-span-1 sm:col-span-2 border p-4 flex justify-center items-center">
            <img src="/full-logo-landscape.png" alt="memos" />
          </div>
          <div className="col-span-1 border p-4 flex justify-center items-center">
            <img src="/full-logo.png" alt="memos" />
          </div>
        </div>
      </div>
    </>
  );
};

export const metadata = getMetadata({ title: "Brand", pathname: "/brand" });

export default Page;
