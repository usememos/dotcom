export interface Author {
  name: string;
  email?: string;
  url?: string;
  github?: string;
  twitter?: string;
}

const authorList: Author[] = [
  {
    name: "Steven",
    github: "boojack",
    twitter: "stevenx1ee",
  },
];

export default authorList;
