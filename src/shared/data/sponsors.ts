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
    logo: "https://raw.githubusercontent.com/usememos/.github/refs/heads/main/assets/sponsors/coderabbit/orange-typemark.svg",
    logoDark: "https://raw.githubusercontent.com/usememos/.github/refs/heads/main/assets/sponsors/coderabbit/white-typemark.svg",
    description: "Cut code review time & bugs in half, instantly.",
  },
  {
    name: "TestMu AI",
    url: "https://www.testmuai.com/?utm_medium=sponsor&utm_source=memos",
    logo: "https://raw.githubusercontent.com/usememos/.github/refs/heads/main/assets/sponsors/testmuai/black.png",
    logoDark: "https://raw.githubusercontent.com/usememos/.github/refs/heads/main/assets/sponsors/testmuai/white.png",
    description: "The world’s first full-stack Agentic AI Quality Engineering platform.",
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
