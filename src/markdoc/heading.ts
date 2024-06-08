import { Tag, type nodes } from "@markdoc/markdoc";
import type { Node, RenderableTreeNode, Schema } from "@markdoc/markdoc";

type Attributes = Readonly<Partial<typeof nodes.heading.attributes>>;

const generateID = (children: RenderableTreeNode[], attributes: Attributes) => {
  if (attributes?.id && typeof attributes.id === "string") {
    return attributes.id;
  }
  return children
    .filter((child: RenderableTreeNode) => typeof child === "string")
    .join(" ")
    .replace(/[?]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

const headingSchema = {
  render: "Heading",
  children: ["inline"],
  attributes: {
    id: { type: "String" },
    level: { type: "Number", required: true, default: 1 },
    className: { type: "String" },
  },
  transform(node: Node, config: Attributes) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config || {});
    const id = generateID(children, attributes);

    return new Tag(this.render, { ...attributes, id }, children);
  },
};

export default headingSchema as Schema;
