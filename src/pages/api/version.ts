import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.get(`https://api.github.com/repos/usememos/memos/tags`, {
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: "",
      },
    });
    res.status(200).json(data[0].name);
  } catch (error) {
    res.status(200).json("");
  }
}
