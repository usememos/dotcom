export interface Sponsor {
  name: string;
  url: string;
  logo: string;
  logoDark?: string;
  description?: string;
}

// Featured sponsors displayed in docs sidebar and homepage
export const FEATURED_SPONSORS: Sponsor[] = [
  {
    name: "CodeRabbit",
    url: "https://coderabbit.link/usememos",
    logo: "https://victorious-bubble-f69a016683.media.strapiapp.com/Orange_Typemark_43bf516c9d.svg",
    logoDark: "https://victorious-bubble-f69a016683.media.strapiapp.com/White_Typemark_79b9189d19.svg",
    description: "Cut code review time & bugs in half, instantly.",
  },
  {
    name: "SSD Nodes",
    url: "https://www.ssdnodes.com/?utm_source=memos&utm_medium=sponsor",
    logo: "/sponsors/ssd-nodes.svg",
    logoDark: "/sponsors/ssd-nodes.svg",
    description: "Affordable VPS hosting for self-hosters.",
  },
  {
    name: "InstaPods",
    url: "https://instapods.com/apps/memos/",
    logo: "/sponsors/instapods.svg",
    logoDark: "/sponsors/instapods-dark.svg",
    description: "Get your app online in seconds. Deploy Memos in 30 seconds.",
  },
];

// Additional sponsors shown on sponsors page
export const COMMUNITY_SPONSORS: Sponsor[] = [
  {
    name: "yourselfhosted",
    url: "https://yourselfhosted.com",
    logo: "https://yourselfhosted.com/sea-otter.svg",
    description: "Self-hosted solutions and guides for privacy-focused individuals.",
  },
];
