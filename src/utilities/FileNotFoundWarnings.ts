export class FileNotFoundWarnings {
  private readonly warnings = new Map<string, Set<string>>();

  add(context: {
    resolvedImportPath: string[];
    rawImport: string;
    folderParts: string[];
  }) {
    const leadUp = context.folderParts.join("/");
    const existingSet = this.warnings.get(context.rawImport);
    if (existingSet) {
      existingSet.add(leadUp);
    } else {
      this.warnings.set(context.rawImport, new Set([leadUp]));
    }
  }

  get size(): number {
    let totalCount = 0;
    for (const set of this.warnings.values()) {
      totalCount += set.size;
    }
    return totalCount;
  }

  toString() {
    return `FileNotFoundWarnings(${this.size}):\n${[
      ...this.warnings.keys(),
    ].join("\n")}`;
  }
}
