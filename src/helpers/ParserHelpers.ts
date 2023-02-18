import * as ts from "typescript";

export const getImportModuleSpecifiers = (fileName: string, code: string) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    code,
    ts.ScriptTarget.Latest
  );
  const output = new Array<string>();

  const searchForImportNodes = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
      handleImportNode(node as ts.ImportDeclaration);
    }
    node.forEachChild((child) => searchForImportNodes(child));
  };
  const handleImportNode = (node: ts.ImportDeclaration) => {
    if (node.moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
      console.warn(
        "Grammar error in import, non string-literal module specifier"
      );
      return;
    }
    const importPathSpecifier = node.moduleSpecifier as ts.StringLiteral;
    output.push(importPathSpecifier.text);
  };
  searchForImportNodes(sourceFile);
  return output;
};
