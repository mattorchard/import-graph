import { Graph } from "./Graph";
import { SafeMap } from "./SafeMap";
import { ScalableForceDirectedPlacementLayout } from "./ScalableForceDirectedPlacementLayout";

export class GraphPositionStateManager<T> {
  private layout = new ScalableForceDirectedPlacementLayout({
    springConstant: 2,
    repulsiveConstant: 25,
    gravityConstant: 1,
  });
  private positions: SafeMap<T, { x: number; y: number }>;
  constructor(public readonly graph: Graph<T>) {
    this.positions = new SafeMap(
      [...graph.nodes()].map((node, index, allNodes) => {
        const nodeCount = allNodes.length;
        const angle = (Math.PI * 2 * index) / nodeCount;
        return [
          node,
          { x: nodeCount * Math.cos(angle), y: nodeCount * Math.sin(angle) },
        ];
      })
    );
  }

  tick(count = 1) {
    for (let i = 0; i < count; i += 1)
      this.positions = this.layout.calculateNextPositions(
        this.graph,
        this.positions
      );
    return this.positions;
  }
}
