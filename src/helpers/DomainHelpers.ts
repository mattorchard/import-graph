import { isNotOneOf, isOneOf } from "./CollectionHelpers";
import { FileExplorer } from "../utilities/FileExplorer";
import { getFileExtension, readBlob, removeFileExtension } from "./FileHelpers";
import { getImportModuleSpecifiers } from "./ParserHelpers";
import { TreeMap } from "../utilities/TreeMap";
import { createId } from "./IdHelpers";
import { ImportResolver } from "../utilities/ImportResolver";
import { Graph } from "../utilities/Graph";

export const sourceFileExtensions = ["js", "jsx", "mjs", "ts", "tsx"];

const createExplorer = () => {
  const isRelevantFileExtension = isOneOf<string | null>(sourceFileExtensions);
  return new FileExplorer({
    maxDepth: 10,
    isAllowedDirectoryName: isNotOneOf(["node_modules", ".DS_Store"]),
    isAllowedFileName: (name) =>
      isRelevantFileExtension(getFileExtension(name)),
  });
};

export const createSourceFileTree = async (root: FileSystemDirectoryHandle) => {
  const { fileTree, warnings } = await createExplorer().explore(root);
  if (warnings.length) {
    console.warn("FileTree warnings", warnings);
  }
  return new TreeMap<string, FileSystemFileHandle>(
    [...fileTree.entries()].map(([path, handle]) => [
      [...path.slice(0, -1), removeFileExtension(handle.name)],
      handle,
    ])
  );
};

export const createImportGraph = async (
  sourceFileTree: TreeMap<string, FileSystemFileHandle>
) => {
  const uidLookup = new Map(
    [...sourceFileTree.entries()].map(([, handle]) => [handle, createId()])
  );
  const resolver = new ImportResolver();
  const importGraph = new Graph<string>();
  for (const [path, handle] of sourceFileTree.entries()) {
    const folderPath = path.slice(0, -1);
    const ownUid = uidLookup.get(handle);
    if (!ownUid) continue;

    for (const rawImport of await getRawImports(handle)) {
      const resolvedImportPath = resolver.resolve(folderPath, rawImport);
      if (!resolvedImportPath) continue;

      const importedFile = sourceFileTree.get(resolvedImportPath);
      if (!importedFile) continue;

      const importedUid = uidLookup.get(importedFile);
      if (!importedUid) continue;

      importGraph.addEdge(ownUid, importedUid);
    }
  }
  return importGraph;
};

const getRawImports = async (handle: FileSystemFileHandle) =>
  getImportModuleSpecifiers(
    handle.name,
    await readBlob(await handle.getFile())
  );
