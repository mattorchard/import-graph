import { useEffect, useMemo, useState } from "preact/hooks";
import { GraphViz } from "./components/GraphViz";
import {
  createImportGraph,
  createSourceFileTree,
} from "./helpers/DomainHelpers";
import { prettyJson } from "./helpers/JsonHelpers";

export function App() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);
  const [graph, setGraph] = useState<any>(null);

  const handleClick = async () => {
    setRoot(await window.showDirectoryPicker());
  };

  useEffect(() => {
    if (root)
      createSourceFileTree(root)
        .then((tree) => createImportGraph(tree))
        .then(setGraph);
  }, [root]);

  return (
    <main onClick={handleClick}>
      <button>Pick Folder</button>
      {graph && <GraphViz graph={graph} />}
      <code>
        <pre>{prettyJson(graph)}</pre>
      </code>
    </main>
  );
}
