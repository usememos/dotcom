import Icon from "./Icon";

const DemoPlaceholder = () => {
  return (
    <div className="relative w-full min-h-[256px] mt-2 mb-2">
      <img className="hidden sm:block w-full h-auto" src="/demo.webp" alt="demo-screenshot" />
      <img className="sm:hidden w-full h-auto" src="/demo-mobile.webp" alt="demo-mobile-screenshot" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 drop-shadow flex flex-col justify-center items-center gap-2 sm:gap-4">
        <a
          className="bg-green-600 text-white w-32 py-2 rounded-md shadow-lg flex flex-row justify-center items-center hover:bg-green-700"
          href="https://demo.usememos.com"
          target="_blank"
        >
          Live Demo
        </a>
        <a
          className="bg-white w-32 py-2 rounded-md drop-shadow flex flex-row justify-center items-center hover:bg-gray-100"
          href="https://discord.gg/tfPJa4UmAv"
          target="_blank"
        >
          <Icon.MessageCircle className="w-5 h-auto mr-1" />
          Discord
        </a>
      </div>
    </div>
  );
};

export default DemoPlaceholder;
