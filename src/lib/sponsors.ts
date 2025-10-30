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
    name: "Warp",
    url: "https://go.warp.dev/memos",
    logo: "https://raw.githubusercontent.com/warpdotdev/brand-assets/refs/heads/main/Logos/Warp-Wordmark-Black.png",
    logoDark: "https://raw.githubusercontent.com/warpdotdev/brand-assets/refs/heads/main/Logos/Warp-Wordmark-White.png",
    description: "The best way to code with Al agents. Prompt, review, edit, and ship.",
  },
  {
    name: "LambdaTest",
    url: "https://www.lambdatest.com/?utm_source=memos&utm_medium=sponsor",
    logo: "https://www.lambdatest.com/resources/images/logos/logo.svg",
    description: "The Native AI-Agentic Cloud Platform to Supercharge Quality Engineering.",
  },
];

// Additional sponsors shown on sponsors page
export const COMMUNITY_SPONSORS: Sponsor[] = [
  {
    name: "yourselfhosted",
    url: "https://yourselfhosted.com",
    logo: "https://www.yourselfhosted.com/sea-otter.svg",
    description: "Self-hosted solutions and guides for privacy-focused individuals.",
  },
];
