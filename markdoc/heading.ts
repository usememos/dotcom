import { nodes } from "@markdoc/markdoc";

function generateID(children: any, attributes: any) {
  if (attributes.id && typeof attributes.id === "string") {
    return attributes.id;
  }
  return children
    .filter((child: any) => typeof child === "string")
    .join(" ")
    .replace(/[?]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const header = {
  ...nodes.heading,
  transform(node: any, config: any) {
    const base = (nodes as any).heading.transform(node, config);
    base.attributes.id = generateID(base.children, base.attributes);
    return base;
  },
};

export default header;
