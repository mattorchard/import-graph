import { useEffect, useMemo, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { SearchForm } from "./components/SearchForm";
import { WalkList } from "./components/WalkList";

import { buildSearchableWalks, Doc } from "./helpers/DomainHelpers";
import { exportDocs } from "./helpers/ExportHelpers";
import { createWalkFilter, QueryRecord } from "./helpers/SearchHelpers";

export function App() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);
  const [docWalks, setDocWalks] = useState<Doc[][] | null>(null);
  const [queries, setQueries] = useState<QueryRecord>({
    start: "",
    middle: "",
    end: "",
  });

  useEffect(() => {
    if (!root) return;
    buildSearchableWalks(root).then(setDocWalks);
  }, [root]);

  const walkFilter = useMemo(() => createWalkFilter(queries), [queries]);

  const filteredWalks = useMemo(() => {
    if (!docWalks) return null;
    if (!walkFilter) return docWalks;
    return docWalks.filter(walkFilter);
  }, [docWalks, queries]);

  const handlePickFolder = async () => {
    setDocWalks(null);
    setRoot(await window.showDirectoryPicker());
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Import Graph</h1>
        {docWalks && (
          <div className="app__header__actions">
            <button type="button">Set aliases</button>

            <button type="button" onClick={() => exportDocs(docWalks)}>
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
        {walkFilter && filteredWalks && (
          <>{filteredWalks.length}&nbsp;/&nbsp;</>
        )}
        {docWalks && <>{docWalks.length} Chains</>}
      </footer>
    </div>
  );
}
