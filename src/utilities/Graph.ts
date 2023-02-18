export class Graph<T> {
  private readonly adjacencyMatrix = new Map<T, Set<T>>();

  public addEdge(start: T, end: T) {
    this.addNode(start);
    this.addNode(end);
    this.adjacencyMatrix.get(start)!.add(end);
  }

  private addNode(node: T) {
    if (!this.adjacencyMatrix.has(node)) {
      this.adjacencyMatrix.set(node, new Set());
    }
  }

  public calculateReverseAdjacencies() {
    const reverse = new Graph<T>();
    for (const [source, targets] of this.adjacencyMatrix.entries()) {
      for (const target of targets) {
        reverse.addEdge(target, source);
      }
    }
    return reverse;
  }
}
