export const GET = async () => {
  const res = await fetch("https://api.github.com/repos/usememos/memos/releases", {
    headers: {
      Accept: "application/vnd.github.v3.star+json",
      Authorization: "",
    },
  });
  const data = (await res.json()) as any[];
  return Response.json(data[0].name.slice(1));
};
