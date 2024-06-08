import type { Schema } from "@markdoc/markdoc";
import { admonitionTones } from "@/components/Admonition";

const admonitionSchema: Schema = {
  render: "Admonition",
  description: "Display the enclosed content in an admonition block",
  children: ["paragraph", "tag", "list", "link"],
  attributes: {
    icon: {
      type: String,
      default: "note",
      matches: admonitionTones,
      description: 'Controls the color and icon of the admonition. Can be: "note", "tip", "important", "warning", "caution"',
    },
    title: {
      type: String,
      description: "The title displayed at the top of the admonition",
    },
  },
};

export default admonitionSchema;
