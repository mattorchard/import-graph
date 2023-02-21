import { Fragment, FunctionComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { createRafLoop } from "../helpers/AnimationHelpers";
import {
  calculateBounds,
  getAngleBetween,
  getMagnitude,
  getTriangle,
  offsetPoint,
  Point,
  subtractPoints,
} from "../helpers/MathHelpers";

import { Graph } from "../utilities/Graph";
import { GraphPositionStateManager } from "../utilities/GraphPositionStateManager";

export const GraphViz: FunctionComponent<{ graph: Graph<string> }> = ({
  graph,
}) => {
  const [positionManager, setPositionManager] = useState(
    () => new GraphPositionStateManager(graph)
  );
  const [positionMap, setPositionMap] = useState(() => positionManager.tick());
  useEffect(() => {
    const manager = new GraphPositionStateManager(graph);
    setPositionManager(manager);
    setPositionMap(manager.tick(1_000));
    return createRafLoop(() => setPositionMap(manager.tick(3)));
  }, [graph]);

  const viewBox = useMemo(() => {
    const rawBounds = calculateBounds([...positionMap.values()]);
    const margin = 10;
    return [
      rawBounds.x - margin,
      rawBounds.y - margin,
      rawBounds.width + 2 * margin,
      rawBounds.height + 2 * margin,
    ].join(" ");
  }, [positionMap]);

  return (
    <svg viewBox={viewBox} height={900}>
      {[...positionManager.graph.edges()].map(([source, target]) => (
        <GraphVizArrow
          key={`${source}::${target}`}
          start={positionMap.get(source)}
          end={positionMap.get(target)}
        />
      ))}

      {[...positionManager.graph.nodes()].map((node) => (
        <GraphVizNode key={node} id={node} position={positionMap.get(node)} />
      ))}
    </svg>
  );
};

const GraphVizNode: FunctionComponent<{
  id: string;
  position: Point;
}> = ({ id, position }) => (
  <Fragment>
    <circle
      data-node-id={id}
      cx={position.x}
      cy={position.y}
      r={VizStyle.nodeRadius}
      fill={VizStyle.nodeColor}
    />
    <text x={position.x} y={position.y} style={{ fontSize: VizStyle.fontSize }}>
      {id}
    </text>
  </Fragment>
);

const GraphVizArrow: FunctionComponent<{
  start: Point;
  end: Point;
}> = ({ start, end }) => {
  const angle = getAngleBetween(start, end);
  const distance = getMagnitude(subtractPoints(end, start));

  const triangleEnd = offsetPoint(start, angle, distance - VizStyle.nodeRadius);
  const lineEnd = offsetPoint(
    start,
    angle,
    distance - VizStyle.nodeRadius - VizStyle.arrowSize / 2
  );
  return (
    <Fragment>
      <line
        x1={start.x}
        y1={start.y}
        x2={lineEnd.x}
        y2={lineEnd.y}
        strokeWidth={VizStyle.lineWidth}
        stroke={VizStyle.arrowColor}
      />
      <polygon
        fill={VizStyle.arrowColor}
        points={pointsToString(
          getTriangle(triangleEnd, angle, VizStyle.arrowSize)
        )}
      />
    </Fragment>
  );
};

const VizStyle = {
  nodeRadius: 3,
  arrowSize: 5,
  lineWidth: 1,
  arrowColor: "darkslateblue",
  nodeColor: "mediumslateblue",
  fontSize: 5,
} as const;

export const pointsToString = (points: Point[]) =>
  points.map((point) => `${point.x},${point.y}`).join(" ");
