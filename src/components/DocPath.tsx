import { FunctionComponent } from "preact";
import { Doc } from "../helpers/DomainHelpers";

export const DocPath: FunctionComponent<{
  doc: Doc;
  isFolderVisible?: boolean;
}> = ({ doc, isFolderVisible = true }) => (
  <span className="doc-path">
    {isFolderVisible && (
      <span className="doc-path__folder">
        {doc.folderParts.join("/")}
        {doc.folderParts.length > 0 && "/"}
      </span>
    )}
    <span
      className="doc-path__name"
      title={isFolderVisible ? "" : doc.searchTarget}
    >
      {doc.name}
    </span>
  </span>
);
