const ShortifyBanner = () => {
  return (
    <a
      className="mt-4 mb-2 px-2 py-1 rounded-lg bg-blue-50 shadow hover:underline hover:text-blue-600"
      href="https://github.com/boojack/shortify"
      target="_blank"
    >
      <img className="w-6 h-auto mr-1 inline-block -mt-0.5" src="https://github.com/boojack/shortify/raw/main/resources/logo.png" alt="" />
      <span className="font-bold">Shortify</span>: Your bookmarking and short link service.
    </a>
  );
};

export default ShortifyBanner;
