export interface Point {
  x: number;
  y: number;
}

export const radToDeg = (angle: number) => (angle / Math.PI) * 180;

export const getAngleBetween = (a: Point, b: Point): number =>
  Math.atan2(b.y - a.y, b.x - a.x);

const pointFromVector = (angle: number, distance: number): Point => ({
  x: distance * Math.cos(angle),
  y: distance * Math.sin(angle),
});

export const addPoints = (...points: Point[]): Point =>
  points.reduce(
    (sum: Point, point: Point) => {
      sum.x += point.x;
      sum.y += point.y;
      return sum;
    },
    { x: 0, y: 0 }
  );

export const subtractPoints = (a: Point, b: Point): Point => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

export const multiplyPoint = (point: Point, multiplier: number): Point => ({
  x: point.x * multiplier,
  y: point.y * multiplier,
});

export const getMagnitude = (point: Point) =>
  Math.sqrt(point.x ** 2 + point.y ** 2);

export const offsetPoint = (start: Point, angle: number, distance: number) =>
  addPoints(start, pointFromVector(angle, distance));

export const getTriangle = (
  tip: Point,
  angle: number,
  magnitude: number
): [Point, Point, Point] => [
  tip,
  offsetPoint(tip, angle - (Math.PI * 7) / 6, magnitude),
  offsetPoint(tip, angle + (Math.PI * 7) / 6, magnitude),
];

export const calculateBounds = (points: Point[]) => {
  const [firstPoint] = points;
  let x1 = firstPoint.x;
  let y1 = firstPoint.y;
  let x2 = firstPoint.x;
  let y2 = firstPoint.y;
  points.forEach((point) => {
    x1 = Math.min(x1, point.x);
    y1 = Math.min(y1, point.y);
    x2 = Math.max(x2, point.x);
    y2 = Math.max(y2, point.y);
  });
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
};
