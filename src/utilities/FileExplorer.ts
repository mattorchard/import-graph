import { TreeMap } from "./TreeMap";

type DirHandle = FileSystemDirectoryHandle;
type FileHandle = FileSystemFileHandle;

interface FileSystemOptions {
  maxDepth: number;
  isAllowedFileName: (name: string) => boolean;
  isAllowedDirectoryName: (name: string) => boolean;
}

const defaultOptions: FileSystemOptions = {
  maxDepth: 5,
  isAllowedFileName: () => true,
  isAllowedDirectoryName: () => true,
};

export class FileExplorer {
  private readonly options: FileSystemOptions;

  constructor(options?: Partial<FileSystemOptions>) {
    this.options = { ...defaultOptions, ...options };
  }

  public async explore(rootDirectory: DirHandle) {
    const state: ExploreState = {
      seenDirectories: new Set(),
      fileTree: new TreeMap(),
      warnings: [],
    };
    await this.exploreInternal(rootDirectory, [], state);
    return state;
  }

  private async exploreInternal(
    directory: DirHandle,
    preceedingPath: string[],
    state: ExploreState
  ): Promise<void> {
    if (state.seenDirectories.has(directory)) return;
    state.seenDirectories.add(directory);

    if (preceedingPath.length > this.options.maxDepth) {
      state.warnings.push({ kind: "max-depth", path: preceedingPath });
      return;
    }

    for await (const handle of directory.values()) {
      const path = [...preceedingPath, handle.name];
      switch (handle.kind) {
        case "directory":
          if (this.options.isAllowedDirectoryName(directory.name)) {
            await this.exploreInternal(handle, path, state);
          } else {
            state.warnings.push({ kind: "disallowed-folder", path });
          }
          break;
        case "file":
          if (this.options.isAllowedFileName(handle.name)) {
            state.fileTree.set(path, handle);
          } else {
            state.warnings.push({ kind: "disallowed-file", path });
          }
          break;
        default:
          console.warn(`Unhandled directory kind`, { handle, path });
          break;
      }
    }
  }
}

interface ExploreState {
  seenDirectories: Set<DirHandle>;
  fileTree: TreeMap<string, FileHandle>;
  warnings: FileSystemWarning[];
}
type FileSystemWarning = {
  kind: "max-depth" | "disallowed-folder" | "disallowed-file";
  path: string[];
};
