import { useEffect, useMemo, useState } from "preact/hooks";
import { AliasDialog } from "./components/AliasDialog";
import { FileTree } from "./components/FileTree";
import { GraphViz } from "./components/GraphViz";
import { NavLinks } from "./components/NavLinks";
import { SearchForm } from "./components/SearchForm";
import { WalkList } from "./components/WalkList";

import { createJunk, Doc } from "./helpers/DomainHelpers";
import { exportDocs } from "./helpers/ExportHelpers";
import {
  createWalkFilter,
  EmptyQueryRecord,
  QueryRecord,
} from "./helpers/SearchHelpers";
import { usePage } from "./hooks/usePage";
import { Graph } from "./utilities/Graph";
import { AliasMap } from "./utilities/ImportResolver";
import { TreeMap } from "./utilities/TreeMap";
import { useJsonMemo } from "./hooks/useJsonMemo";

export function App() {
  const [rootHandle, setRootHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [isAliasDialogOpen, setIsAliasDialogOpen] = useState(false);
  const [rootAliases, setRootAliases] = useState<AliasMap>(new Map());
  const [isFolderVisible, setIsFolderVisible] = useState(true);
  const [rawQueries, setRawQueries] = useState<QueryRecord>(EmptyQueryRecord);
  const [page] = usePage();
  const [allDocWalks, setAllDocWalks] = useState<Doc[][] | null>(null);
  const [importGraph, setImportGraph] = useState<Graph<string> | null>(null);
  const [docTree, setDocTree] = useState<TreeMap<string, Doc> | null>(null);

  const queries = useJsonMemo(rawQueries);

  useEffect(() => {
    if (!rootHandle) return;
    createJunk(rootHandle, rootAliases).then(
      ({ searchableWalks, importGraph, docTree }) => {
        setAllDocWalks(searchableWalks);
        setImportGraph(importGraph);
        setDocTree(docTree);
      },
    );
  }, [rootHandle, rootAliases]);

  const walkFilter = useMemo(() => createWalkFilter(queries), [queries]);

  const filteredWalks = useMemo(() => {
    if (!allDocWalks) return null;
    if (!walkFilter) return allDocWalks;
    return allDocWalks.filter(walkFilter);
  }, [allDocWalks, walkFilter]);

  useEffect(() => {
    setRawQueries(EmptyQueryRecord);
  }, [page]);

  const handlePickFolder = async () => {
    setRootHandle(null);
    setRootHandle(await window.showDirectoryPicker());
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
            <label>
              <input
                type="checkbox"
                checked={isFolderVisible}
                onChange={(e) => setIsFolderVisible(e.currentTarget.checked)}
              />
              Show folders
            </label>
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
      {rootHandle ? (
        <>
          {page === "chains" && (
            <main className="chains__content">
              <SearchForm onChange={setRawQueries} />
              {filteredWalks?.length === 0 && (
                <p className="nis__message">No results</p>
              )}
              {filteredWalks && filteredWalks.length > 1 && (
                <WalkList
                  walks={filteredWalks}
                  isFolderVisible={isFolderVisible}
                />
              )}
            </main>
          )}
          {page === "graph" && rootHandle && importGraph && (
            <main className="other__content">
              <GraphViz graph={importGraph} />
            </main>
          )}
          {page === "files" && docTree && (
            <main className="other__content">
              <FileTree tree={docTree} />
            </main>
          )}
        </>
      ) : (
        <div className="hero__container" onClick={handlePickFolder}>
          <button type="button" className="hero__button">
            Choose a folder
          </button>
        </div>
      )}

      <footer className="app__footer">
        {rootHandle && <NavLinks />}
        {page === "chains" && (
          <div>
            {allDocWalks !== filteredWalks && filteredWalks && (
              <>{filteredWalks.length}&nbsp;/&nbsp;</>
            )}
            {allDocWalks && <>{allDocWalks.length} Chains</>}
          </div>
        )}
      </footer>
    </div>
  );
}
