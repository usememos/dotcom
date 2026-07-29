import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const srcRoot = join(process.cwd(), "src");
const borderWidthUtility = /(?:^|:)border(?:-[trblxy])?$/;
const nonColorBorderValues = /^(?:0|2|4|8|collapse|dashed|dotted|double|hidden|none|separate|solid)$/;

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, { recursive: true, encoding: "utf8" })
    .filter((entry) => [".ts", ".tsx"].includes(extname(entry)) && !entry.includes(".test."))
    .map((entry) => join(directory, entry));
}

function isBorderColorUtility(token: string): boolean {
  const utility = token.slice(token.lastIndexOf(":") + 1).replace(/^!/, "");
  const match = utility.match(/^border(?:-[trblxy])?-(.+)$/);
  if (!match) {
    return false;
  }

  const value = match[1];
  if (nonColorBorderValues.test(value) || /^\d/.test(value)) {
    return false;
  }

  // Arbitrary numeric lengths set border width; arbitrary colors remain valid.
  if (/^\[(?:calc|length:|[+-]?(?:\d|\.\d))/.test(value)) {
    return false;
  }

  return true;
}

function literalText(node: ts.Node): string | null {
  if (ts.isStringLiteralLike(node)) {
    return node.text;
  }
  if ([ts.SyntaxKind.TemplateHead, ts.SyntaxKind.TemplateMiddle, ts.SyntaxKind.TemplateTail].includes(node.kind)) {
    return (node as ts.LiteralLikeNode).text;
  }
  return null;
}

describe("border color boundary", () => {
  it("pairs every Tailwind border width with an explicit color", () => {
    const violations: string[] = [];

    for (const file of listSourceFiles(srcRoot)) {
      const source = readFileSync(file, "utf8");
      const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);

      function visit(node: ts.Node) {
        const text = literalText(node);
        if (text) {
          const tokens = text.split(/\s+/).filter(Boolean);
          const hasBorderWidth = tokens.some((token) => borderWidthUtility.test(token));
          const hasBorderColor = tokens.some(isBorderColorUtility);

          if (hasBorderWidth && !hasBorderColor) {
            const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
            violations.push(`${relative(srcRoot, file)}:${line + 1}`);
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);
    }

    expect(violations).toEqual([]);
  });
});
