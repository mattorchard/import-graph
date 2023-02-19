import { useEffect, useMemo, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";

import { buildSearchableWalks, Doc } from "./helpers/DomainHelpers";

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
    <Fragment>
      <header>
        <h1>Import Graph</h1>
        <button onClick={handlePickFolder}>
          {root ? "Reselect Folder" : "Select Folder"}
        </button>
      </header>
      <main>
        <form>
          <label>
            Query:
            <input type="search" />
          </label>
        </form>
        <ul className="walk-list">
          {docWalks?.map((walk, index) => (
            <li key={index} className="walk-list__item">
              <ol className="walk">
                {walk.map((doc) => (
                  <li key={doc.id} className="walk__item">
                    <code>
                      <span className="walk__item__path">
                        {doc.path.slice(0, -1).join("/")}
                        {doc.path.length !== 1 && "/"}
                      </span>
                      <span className="walk__item__name">
                        {doc.handle.name}
                      </span>
                    </code>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </main>
    </Fragment>
  );
}
