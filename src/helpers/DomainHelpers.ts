import { isNotOneOf, isOneOf } from "./CollectionHelpers";
import { FileExplorer } from "../utilities/FileExplorer";
import { getFileExtension, readBlob, removeFileExtension } from "./FileHelpers";
import { getImportModuleSpecifiers } from "./ParserHelpers";
import { TreeMap } from "../utilities/TreeMap";
import { createId } from "./IdHelpers";
import { AliasMap, ImportResolver } from "../utilities/ImportResolver";
import { Graph } from "../utilities/Graph";
import { SafeMap } from "../utilities/SafeMap";

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

export interface Doc {
  id: string;
  parts: string[];
  folderParts: string[];
  stem: string;
  name: string;
  extension: string | null;
  handle: FileSystemFileHandle;
  searchTarget: string;
}

export const createSourceFileTree = async (root: FileSystemDirectoryHandle) => {
  const { fileTree, warnings } = await createExplorer().explore(root);
  if (warnings.length) {
    console.warn("FileTree warnings", warnings);
  }
  return new TreeMap<string, Doc>(
    [...fileTree.entries()].map(([parts, handle]) => {
      const folderParts = parts.slice(0, -1);
      const name = parts.at(-1)!;
      const stem = removeFileExtension(name);
      const extension = getFileExtension(name);
      const indexedPath = [...folderParts, stem];
      return [
        indexedPath,
        {
          id: createId(),
          parts,
          folderParts,
          stem,
          name,
          extension,
          handle,
          searchTarget: parts.join("/"),
        },
      ];
    })
  );
};

export const createImportGraph = async (
  sourceFileTree: TreeMap<string, Doc>,
  rootAliases: AliasMap = new Map()
) => {
  const resolver = new ImportResolver({
    isAllowedFileExtension: isOneOf([...sourceFileExtensions, null]),
    rootAliases,
  });
  const importGraph = new Graph<string>();
  for (const doc of sourceFileTree.values()) {
    importGraph.addNode(doc.id);

    for (const rawImport of await parseRawImports(doc.handle)) {
      // Todo: Emit warnings
      const resolvedImportPath = resolver.resolve(doc.folderParts, rawImport);
      if (!resolvedImportPath) continue;

      // Todo: Emit warnings
      const importedDoc = sourceFileTree.get(resolvedImportPath);
      if (!importedDoc) continue;

      importGraph.addEdge(doc.id, importedDoc.id);
    }
  }
  return importGraph;
};

export const findAllWalks = <T>(graph: Graph<T>) => {
  const walksByNode = new TreeMap<T, true>();

  const findWalksForNode = (node: T, preceedingPath: T[]) => {
    const path = [...preceedingPath, node];
    if (walksByNode.get(path)) return;

    walksByNode.set(path, true);
    for (const connectedNode of graph.getConnectedNodes(node)) {
      if (preceedingPath.includes(connectedNode)) continue;
      findWalksForNode(connectedNode, path);
    }
  };

  for (const node of graph.nodes()) {
    findWalksForNode(node, []);
  }

  return [...walksByNode.keys()].filter((walk) => walk.length > 1);
};

export const buildSearchableWalks = async (
  root: FileSystemDirectoryHandle,
  rootAliases: AliasMap
) => {
  const fileTree = await createSourceFileTree(root);
  const importGraph = await createImportGraph(fileTree, rootAliases);
  const allWalks = findAllWalks(importGraph);
  const idLookup = new SafeMap(
    [...fileTree.values()].map((doc) => [doc.id, doc])
  );
  return allWalks.map((walk) => walk.map((id) => idLookup.get(id)));
};

const parseRawImports = async (handle: FileSystemFileHandle) =>
  getImportModuleSpecifiers(
    handle.name,
    await readBlob(await handle.getFile())
  );
