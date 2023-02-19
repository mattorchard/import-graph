import { isNotOneOf, isOneOf } from "../helpers/CollectionHelpers";
import { getFileExtension, removeFileExtension } from "../helpers/FileHelpers";

export class ImportResolver {
  private readonly separator = "/";

  constructor(
    private readonly options: {
      isAllowedFileExtension: (extension: string | null) => boolean;
      rootAliases: Map<string, string[]>;
    }
  ) {}

  public resolve(startPath: string[], rawImportPath: string): string[] | null {
    const importParts = rawImportPath.split(this.separator);

    const fileName = importParts.at(-1);
    if (!fileName) return null;
    if (!this.options.isAllowedFileExtension(getFileExtension(fileName)))
      return null;

    const allPathSegments = [
      ...startPath,
      ...this.applyAliases(importParts).slice(0, -1),
      removeFileExtension(fileName),
    ];
    const resolvedPath = new Array<string>();
    for (const part of allPathSegments) {
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

  private applyAliases(importParts: string[]) {
    const [rootSegment] = importParts;
    if (!this.options.rootAliases.has(rootSegment)) return importParts;

    return [
      ...this.options.rootAliases.get(rootSegment)!,
      ...importParts.slice(1),
    ];
  }
}
