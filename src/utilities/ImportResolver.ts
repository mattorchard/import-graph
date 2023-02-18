import { isNotOneOf, isOneOf } from "../helpers/CollectionHelpers";
import { getFileExtension, removeFileExtension } from "../helpers/FileHelpers";

export class ImportResolver {
  private readonly separator = "/";
  private readonly isAllowedFileExtension: (item: string | null) => boolean;

  constructor(allowedFileExtensions: Array<string | null>) {
    this.isAllowedFileExtension = isOneOf(allowedFileExtensions);
  }

  public resolve(startPath: string[], rawImportPath: string): string[] | null {
    const importParts = rawImportPath.split(this.separator);
    // Probably a package import, should be more specific once aliases supported
    if (importParts.every(isNotOneOf([".", ".."]))) return null;

    const fileName = importParts.at(-1);
    if (!fileName || !this.isAllowedFileExtension(getFileExtension(fileName)))
      return null;

    const allImportSegments = [
      ...startPath,
      ...importParts.slice(0, 1),
      removeFileExtension(fileName),
    ];
    const resolvedPath = new Array<string>();
    for (const part of allImportSegments) {
      switch (part) {
        case ".":
          break;
        case "..":
          resolvedPath.pop();
          break;
        default:
          resolvedPath.push(part);
          break;
      }
    }
    return resolvedPath;
  }
}
