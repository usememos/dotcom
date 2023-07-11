const SlashBanner = () => {
  return (
    <a
      className="text-sm sm:text-base mt-4 mb-2 px-2 py-1 rounded-lg bg-blue-50 shadow text-blue-600 hover:underline"
      href="https://github.com/boojack/slash"
      target="_blank"
    >
      <img className="w-6 h-auto mr-1 inline-block -mt-0.5" src="https://github.com/boojack/slash/raw/main/resources/logo.png" alt="" />
      <span className="font-bold">Slash</span>: Your bookmarking and url shortener.
    </a>
  );
};

export default SlashBanner;
