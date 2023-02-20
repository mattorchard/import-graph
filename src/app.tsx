import { useEffect, useMemo, useState } from "preact/hooks";
import { AliasDialog } from "./components/AliasDialog";
import { SearchForm } from "./components/SearchForm";
import { WalkList } from "./components/WalkList";

import { buildSearchableWalks, Doc } from "./helpers/DomainHelpers";
import { exportDocs } from "./helpers/ExportHelpers";
import {
  createWalkFilter,
  EmptyQueryRecord,
  QueryRecord,
} from "./helpers/SearchHelpers";
import { AliasMap } from "./utilities/ImportResolver";

export function App() {
  const [root, setRoot] = useState<FileSystemDirectoryHandle | null>(null);
  const [allDocWalks, setAllDocWalks] = useState<Doc[][] | null>(null);
  const [queries, setQueries] = useState<QueryRecord>(EmptyQueryRecord);
  const [isAliasDialogOpen, setIsAliasDialogOpen] = useState(false);
  const [rootAliases, setRootAliases] = useState<AliasMap>(new Map());

  useEffect(() => {
    if (!root) return;
    buildSearchableWalks(root, rootAliases).then(setAllDocWalks);
  }, [root, rootAliases]);

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
        <AliasDialog
          isOpen={isAliasDialogOpen}
          onClose={() => setIsAliasDialogOpen(false)}
          aliases={rootAliases}
          onChange={setRootAliases}
        />
        {filteredWalks && (
          <div className="app__header__actions">
            <button type="button" onClick={() => setIsAliasDialogOpen(true)}>
              Configure aliases
            </button>

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
        {root ? <SearchForm onChange={setQueries} /> : <div />}
        {filteredWalks ? (
          <WalkList walks={filteredWalks} />
        ) : (
          <div className="hero__container">
            <button
              type="button"
              onClick={handlePickFolder}
              className="hero__button"
            >
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
