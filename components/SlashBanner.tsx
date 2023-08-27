const SlashBanner = () => {
  return (
    <a
      className="text-sm sm:text-base flex flex-row justify-start items-start px-2 py-1 rounded-lg bg-blue-50 shadow text-blue-600 hover:underline"
      href="https://github.com/boojack/slash"
      target="_blank"
    >
      <img className="w-6 sm:w-6 h-auto mr-1 inline-block" src="https://github.com/boojack/slash/raw/main/resources/logo.png" alt="" />
      <span className="leading-6">Slash: Your bookmarks and link sharing platform</span>
    </a>
  );
};

export default SlashBanner;
