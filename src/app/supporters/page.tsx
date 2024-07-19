import Icon from "@/components/Icon";
import { getMetadata } from "@/utils/metadata";

const SPONSORS = [
  {
    title: "yourselfhosted",
    logo: "https://www.yourselfhosted.com/sea-otter.svg",
    url: "https://yourselfhosted.com",
  },
];

const GITHUB_USER_SPONSORS = [
  {
    title: "redmetablue",
    logo: "https://avatars.githubusercontent.com/u/121377500?v=4",
    url: "https://github.com/redmetablue",
  },
  {
    title: "weikib",
    logo: "https://avatars.githubusercontent.com/u/80217737?v=4",
    url: "https://github.com/weikib",
  },
];

const Page = () => {
  return (
    <div className="w-full flex flex-col justify-center items-start sm:px-12">
      <h3 className="mt-12 mb-4 text-5xl sm:text-6xl leading-relaxed font-bold w-full">Thanks! 💗</h3>
      <p className="text-xl max-w-3xl leading-normal">
        {
          "All donations directly support the development and operation of Memos. Recurring donations allow us to plan for the future. We deeply appreciate every donation — Thank you!"
        }
      </p>
      <div className="w-full flex flex-col mt-12">
        <p className="text-2xl sm:text-3xl font-medium">🦄 Sponsors</p>
        <div className="mt-4 sm:mt-6 flex flex-row flex-wrap gap-3 sm:gap-4">
          {SPONSORS.map((sponsor) => (
            <div key={sponsor.title} className="w-auto py-4 px-6 border rounded-2xl hover:shadow">
              <a className="w-full h-full flex flex-row justify-start items-center gap-2" href={sponsor.url} target="_blank">
                <img className="w-12 sm:w-16 rounded-2xl" src={sponsor.logo} alt="" />
                <span className="text-2xl sm:text-3xl">{sponsor.title}</span>
              </a>
            </div>
          ))}

          <div className="w-auto py-4 px-6 border border-dashed rounded-2xl hover:shadow">
            <a
              className="w-full h-full flex flex-row justify-start items-center gap-2 opacity-40"
              href="https://github.com/sponsors/usememos"
              target="_blank"
            >
              <Icon.HeartHandshake className="w-10 sm:w-14 h-auto" strokeWidth={1} />
              <div className="h-auto flex flex-col justify-center items-start">
                <span className="text-2xl !leading-none">Your logo</span>
                <p className="opacity-70">Become a sponsor</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col mt-12">
        <p className="text-2xl sm:text-3xl font-medium">🤠 Current backers</p>
        <div className="mt-4 sm:mt-6 flex flex-row flex-wrap gap-3 sm:gap-4">
          {GITHUB_USER_SPONSORS.map((sponsor) => (
            <div key={sponsor.title} className="w-auto p-3 border rounded-2xl hover:shadow">
              <a className="w-full h-full flex flex-row justify-start items-center gap-2" href={sponsor.url} target="_blank">
                <img className="w-6 sm:w-8 rounded-full" src={sponsor.logo} alt="" />
                <span className="text-lg sm:text-xl">{sponsor.title}</span>
              </a>
            </div>
          ))}

          <div className="w-auto p-3 border border-dashed rounded-2xl hover:shadow">
            <a
              className="w-full h-full flex flex-row justify-start items-center gap-2 opacity-40"
              href="https://github.com/sponsors/usememos"
              target="_blank"
            >
              <Icon.SmilePlus className="w-5 sm:w-7 h-auto" strokeWidth={1.5} />
              <div className="h-auto flex flex-col justify-center items-start">
                <span className="text-lg">Become a backer</span>
              </div>
            </a>
          </div>
        </div>
        <a className="mt-2 text-teal-600 hover:underline hover:opacity-80" href="https://github.com/sponsors/usememos" target="_blank">
          <span className="">And more than 40+ sponsors in GitHub</span>
          <Icon.ExternalLink className="ml-1 inline w-4 h-auto" />
        </a>
      </div>
    </div>
  );
};

export const generateMetadata = () => {
  return getMetadata({
    title: "Supporters - Memos",
    description: "A simple note-taking app that helps you to organize your thoughts.",
    pathname: `/supporters`,
  });
};

export default Page;
