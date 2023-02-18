export class TreeMap<KeyType, LeafType> {
  private readonly root = this.createNode();

  constructor(entries?: Iterable<[KeyType[], LeafType]>) {
    if (entries) {
      for (const [keys, value] of entries) this.set(keys, value);
    }
  }

  public set(keys: KeyType[], value: LeafType): void {
    let currentNode = this.root;
    for (const key of keys) {
      let nextNode = currentNode.children.get(key);
      if (!nextNode) {
        nextNode = this.createNode();
        currentNode.children.set(key, nextNode);
      }
      currentNode = nextNode;
    }
    currentNode.value = value;
    currentNode.hasValue = true;
  }

  public get(keys: KeyType[]): LeafType | undefined {
    let currentNode = this.root;
    for (const key of keys) {
      const nextNode = currentNode.children.get(key);
      if (!nextNode) return;
      currentNode = nextNode;
    }
    return currentNode?.hasValue ? (currentNode!.value as LeafType) : undefined;
  }

  public *entries(): Generator<[KeyType[], LeafType]> {
    yield* this.iterEntries(this.root, []);
  }

  private *iterEntries(
    node: TmNode<KeyType, LeafType>,
    keyPath: KeyType[]
  ): Generator<[KeyType[], LeafType]> {
    if (node.hasValue) {
      yield [keyPath, node.value!];
    }
    for (const [childKey, childNode] of node.children.entries()) {
      yield* this.iterEntries(childNode, [...keyPath, childKey]);
    }
  }

  private createNode(): TmNode<KeyType, LeafType> {
    return {
      hasValue: false,
      value: null,
      children: new Map(),
    };
  }
}

interface TmNode<KeyType, LeafType> {
  hasValue: boolean;
  value: LeafType | null;
  children: Map<KeyType, TmNode<KeyType, LeafType>>;
}
