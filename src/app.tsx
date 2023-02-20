import { useEffect, useMemo, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { WalkList } from "./components/WalkList";

import { buildSearchableWalks, Doc } from "./helpers/DomainHelpers";
import { exportDocs } from "./helpers/ExportHelpers";

export function App() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);
  const [docWalks, setDocWalks] = useState<Doc[][] | null>(null);

  useEffect(() => {
    if (!root) return;
    buildSearchableWalks(root).then(setDocWalks);
  }, [root]);

  const handlePickFolder = async () => {
    setDocWalks(null);
    setRoot(await window.showDirectoryPicker());
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Import Graph</h1>
        {docWalks && (
          <>
            <button type="button" onClick={handlePickFolder}>
              Choose a different folder
            </button>

            <button type="button" onClick={() => exportDocs(docWalks)}>
              Download
            </button>
          </>
        )}
      </header>
      <main className="app__content">
        <form>
          <label>
            Query:
            <input type="search" />
          </label>
        </form>
        {docWalks ? (
          <WalkList walks={docWalks} />
        ) : (
          <div>
            <button type="button" onClick={handlePickFolder}>
              Choose a folder
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
