import { isNotOneOf } from "../helpers/CollectionHelpers";

export class ImportResolver {
  private readonly separator = "/";

  public resolve(startPath: string[], rawImportPath: string): string[] | null {
    const importParts = rawImportPath.split(this.separator);
    // Probably a package import, should be more specific once aliases supported
    if (importParts.every(isNotOneOf([".", ".."]))) return null;

    const resolvedPath = new Array<string>();
    for (const part of [...startPath, ...importParts]) {
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
