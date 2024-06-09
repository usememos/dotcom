import type { Schema } from "@markdoc/markdoc";

const codeBlockSchema: Schema = {
  render: "CodeBlock",
  attributes: {
    content: { type: String },
    language: {
      type: String,
      description: "The programming language of the code block. Place it after the backticks.",
    },
  },
};
export default codeBlockSchema;
