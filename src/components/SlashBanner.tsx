import Link from "next/link";

const SlashBanner = () => {
  return (
    <Link
      className="text-sm sm:text-base flex flex-row justify-start items-center px-4 py-2 rounded-full bg-green-100 shadow text-green-600 hover:bg-green-200"
      href="https://github.com/boojack/slash"
      target="_blank"
    >
      <img
        className="w-6 sm:w-6 h-auto mr-1 inline-block rounded-full"
        src="https://github.com/boojack/slash/raw/main/resources/logo.png"
        alt=""
      />
      <span className="leading-4">Slash: Your bookmarks and link sharing platform</span>
    </Link>
  );
};

export default SlashBanner;
