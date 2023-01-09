import Icon from "./Icon";

const Footer = () => {
  return (
    <footer className="border-t w-full mx-auto flex flex-row justify-center items-center">
      <div className="max-w-4xl w-full mx-auto py-4 leading-10 sm:px-10 flex flex-row flex-wrap justify-center sm:justify-between items-center">
        <div className="w-auto flex flex-row justify-start items-center space-x-2 sm:space-x-2">
          <span className="text-gray-500 mr-1">Discuss in</span>
          <a
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            target="_blank"
            href="https://t.me/+-_tNF1k70UU4ZTc9"
            rel="noreferrer"
          >
            <Icon.MessageSquare className="w-5 h-auto mr-1" /> Telegram
          </a>
          <span className="font-mono text-gray-300">/</span>
          <a
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://discord.gg/tfPJa4UmAv"
            target="_blank"
            rel="noreferrer"
          >
            <Icon.MessageCircle className="w-5 h-auto mr-1" /> Discord
          </a>
        </div>
        <div className="w-auto flex flex-row justify-end items-center">
          <a
            className="w-auto flex flex-row justify-center items-center hover:underline hover:text-blue-600"
            href="https://ko-fi.com/stevenlgtm"
            target="_blank"
            rel="noreferrer"
          >
            <Icon.Heart className="w-5 h-auto mr-1" />
            Become a Sponsor
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
