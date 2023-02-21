import { FunctionComponent } from "preact";
import { Doc } from "../helpers/DomainHelpers";
import { TreeMap } from "../utilities/TreeMap";
import { DocPath } from "./DocPath";

export const FileTree: FunctionComponent<{
  tree: TreeMap<string, Doc>;
}> = ({ tree }) => {
  const docs = [...tree.values()];
  return (
    <div>
      <h2>{docs.length} Files</h2>
      <ol className="file-tree">
        {docs.map((doc) => (
          <li key={doc.id}>
            <DocPath doc={doc} isFolderVisible />
          </li>
        ))}
      </ol>
    </div>
  );
};
