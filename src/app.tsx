import { useEffect, useMemo, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { SearchForm } from "./components/SearchForm";
import { WalkList } from "./components/WalkList";

import { buildSearchableWalks, Doc } from "./helpers/DomainHelpers";
import { exportDocs } from "./helpers/ExportHelpers";
import { createWalkFilter, QueryRecord } from "./helpers/SearchHelpers";

export function App() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);
  const [allDocWalks, setAllDocWalks] = useState<Doc[][] | null>(null);
  const [queries, setQueries] = useState<QueryRecord>({
    start: "",
    middle: "",
    end: "",
  });

  useEffect(() => {
    if (!root) return;
    buildSearchableWalks(root).then(setAllDocWalks);
  }, [root]);

  const walkFilter = useMemo(() => createWalkFilter(queries), [queries]);

  const filteredWalks = useMemo(() => {
    if (!allDocWalks) return null;
    if (!walkFilter) return allDocWalks;
    return allDocWalks.filter(walkFilter);
  }, [allDocWalks, queries]);

  const handlePickFolder = async () => {
    setAllDocWalks(null);
    setRoot(await window.showDirectoryPicker());
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Import Graph</h1>
        {filteredWalks && (
          <div className="app__header__actions">
            <button type="button">Set aliases</button>

            <button type="button" onClick={() => exportDocs(filteredWalks)}>
              Download
            </button>

            <button type="button" onClick={handlePickFolder}>
              Choose a different folder
            </button>
          </div>
        )}
      </header>
      <main className="app__content">
        <SearchForm onChange={setQueries} />
        {filteredWalks ? (
          <WalkList walks={filteredWalks} />
        ) : (
          <div>
            <button type="button" onClick={handlePickFolder}>
              Choose a folder
            </button>
          </div>
        )}
      </main>
      <footer className="app__footer">
        {allDocWalks !== filteredWalks && filteredWalks && (
          <>{filteredWalks.length}&nbsp;/&nbsp;</>
        )}
        {allDocWalks && <>{allDocWalks.length} Chains</>}
      </footer>
    </div>
  );
}
