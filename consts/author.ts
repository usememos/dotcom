export interface Author {
  name: string;
  email?: string;
  url?: string;
  github?: string;
  twitter?: string;
  funding?: string;
}

const authorList: Author[] = [
  {
    name: "Steven",
    github: "boojack",
    twitter: "stevenx1ee",
    funding: "https://ko-fi.com/stevenlgtm",
  },
  {
    name: "Anthony",
    github: "Antzed",
    url: "https://antzed.com",
  },
];

export default authorList;
