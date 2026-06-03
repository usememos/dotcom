import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import ts from "typescript";

const APP_DIR = join(process.cwd(), "src/app");
const SITE_NAME = "Memos";
const BRANDED_TITLE_PATTERN = new RegExp(`(^${SITE_NAME}\\s+-\\s+|\\s+-\\s+${SITE_NAME}$)`);

async function listSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        return listSourceFiles(path);
      }

      return [".ts", ".tsx"].includes(extname(entry.name)) ? [path] : [];
    }),
  );

  return files.flat();
}

function getPropertyName(node) {
  if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) {
    return node.name.text;
  }

  return undefined;
}

function getTitleValue(node, constants = new Map()) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isTemplateExpression(node)) {
    return node.getText();
  }

  if (ts.isIdentifier(node)) {
    return constants.get(node.text);
  }

  return undefined;
}

function isBrandedTitle(node, constants) {
  const title = getTitleValue(node, constants);
  return title ? BRANDED_TITLE_PATTERN.test(title) : false;
}

function getLineNumber(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function auditMetadataObject(sourceFile, file, objectNode, constants, issues) {
  for (const property of objectNode.properties) {
    if (!ts.isPropertyAssignment(property) || getPropertyName(property) !== "title") {
      continue;
    }

    if (isBrandedTitle(property.initializer, constants)) {
      issues.push({
        file,
        line: getLineNumber(sourceFile, property),
        title: getTitleValue(property.initializer, constants),
      });
    }
  }
}

function auditSource(file, source) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const constants = new Map();
  const issues = [];

  function visit(node) {
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          const value = getTitleValue(declaration.initializer, constants);
          if (value) {
            constants.set(declaration.name.text, value);
          }
        }

        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === "metadata" &&
          declaration.initializer &&
          ts.isObjectLiteralExpression(declaration.initializer)
        ) {
          auditMetadataObject(sourceFile, file, declaration.initializer, constants, issues);
        }
      }
    }

    if (ts.isFunctionDeclaration(node) && node.name?.text === "generateMetadata") {
      node.forEachChild(function visitGenerateMetadata(child) {
        if (ts.isReturnStatement(child) && child.expression && ts.isObjectLiteralExpression(child.expression)) {
          auditMetadataObject(sourceFile, file, child.expression, constants, issues);
        }

        child.forEachChild(visitGenerateMetadata);
      });
      return;
    }

    node.forEachChild(visit);
  }

  visit(sourceFile);
  return issues;
}

const files = await listSourceFiles(APP_DIR);
const issues = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  issues.push(...auditSource(file, source));
}

if (issues.length > 0) {
  console.error("Browser metadata titles should not include the Memos brand; the root title template adds it.");
  for (const issue of issues) {
    console.error(`${issue.file}:${issue.line} ${issue.title}`);
  }
  process.exitCode = 1;
}
