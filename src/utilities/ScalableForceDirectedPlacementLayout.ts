import {
  addPoints,
  getMagnitude,
  multiplyPoint,
  Point,
  subtractPoints,
} from "../helpers/MathHelpers";
import { Graph } from "./Graph";
import { SafeMap } from "./SafeMap";

interface SfdpLayoutOptions {
  springConstant: number;
  repulsiveConstant: number;
  gravityConstant: number;
}

export class ScalableForceDirectedPlacementLayout {
  private readonly repulsiveForceFactor: number;
  constructor(private readonly options: SfdpLayoutOptions) {
    this.repulsiveForceFactor =
      -this.options.repulsiveConstant * this.options.springConstant ** 2;
  }

  public calculateNextPositions<T>(
    graph: Graph<T>,
    prevPositions: SafeMap<T, Point>
  ): SafeMap<T, Point> {
    const nextPositions = new SafeMap<T, Point>();
    for (const source of graph.nodes()) {
      const pointA = prevPositions.get(source);
      const force = multiplyPoint(pointA, -this.options.gravityConstant);

      for (const otherNode of graph.nodes()) {
        if (source === otherNode) continue;

        const pointB = prevPositions.get(otherNode);
        const isNeighbor = graph.hasEdge(source, otherNode);
        const pointForce = this.getInterPointForce(pointA, pointB, isNeighbor);

        force.x += pointForce.x;
        force.y += pointForce.y;
      }
      const appliedForce = this.normalizeForce(force);
      nextPositions.set(source, addPoints(pointA, appliedForce));
    }
    return nextPositions;
  }

  private getInterPointForce(a: Point, b: Point, isNeighbor: boolean) {
    const distance = getMagnitude(subtractPoints(a, b));
    const strength =
      isNeighbor && distance > 10 // Todo: More rsesearch
        ? this.getAttractionForce(distance)
        : this.getRepulsionForce(distance);

    return this.directionalizeForce(a, b, strength);
  }

  private getAttractionForce(distance: number): number {
    return distance ** 2 / this.options.springConstant;
  }

  private getRepulsionForce(distance: number): number {
    return this.repulsiveForceFactor / distance;
  }

  private normalizeForce(a: Point): Point {
    return multiplyPoint(a, 1 / getMagnitude(a));
  }

  private directionalizeForce(a: Point, b: Point, force: number) {
    const delta = subtractPoints(b, a);
    return multiplyPoint(delta, force / getMagnitude(delta));
  }
}
