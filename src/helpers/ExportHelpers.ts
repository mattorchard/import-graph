import { Doc } from "./DomainHelpers";
import { downloadFile } from "./FileHelpers";

export const exportDocs = (walks: Doc[][]) => {
  downloadFile(
    new File(
      [
        walks
          .map((walk) => walk.map((doc) => docToCell(doc)).join(","))
          .join("\n"),
      ],
      "exported-walks.txt"
    )
  );
};
const docToCell = (doc: Doc) => [...doc.folderParts, doc.name].join("/");
