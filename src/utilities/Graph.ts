export class Graph<T> {
  private readonly adjacencyMatrix = new Map<T, Set<T>>();

  public addEdge(start: T, end: T) {
    this.addNode(start);
    this.addNode(end);
    this.adjacencyMatrix.get(start)!.add(end);
  }

  public addNode(node: T) {
    if (!this.adjacencyMatrix.has(node)) {
      this.adjacencyMatrix.set(node, new Set());
    }
  }

  public createInverseGraph() {
    const reverse = new Graph<T>();
    for (const [source, targets] of this.adjacencyMatrix.entries()) {
      for (const target of targets) {
        reverse.addEdge(target, source);
      }
    }
    return reverse;
  }

  public hasEdge(a: T, b: T) {
    return !!this.adjacencyMatrix.get(a)?.has(b);
  }

  public nodes() {
    return this.adjacencyMatrix.keys();
  }

  public *edges() {
    for (const [source, targets] of this.adjacencyMatrix.entries()) {
      for (const target of targets) {
        yield [source, target] as const;
      }
    }
  }

  public *getConnectedNodes(node: T) {
    if (!this.adjacencyMatrix.has(node)) return;
    yield* this.adjacencyMatrix.get(node)!;
  }
}
