import { Point } from '../app/spark-line-chart/models/spark.models';

export function getPathCommandsForLine(points: Point[]): string {
  const [firstPoint, ...restPoints] = points;
  const move = `M ${firstPoint.x} ${firstPoint.y}`;
  const lines = restPoints.map((p) => {
    return `L ${p.x},${p.y}`;
  });
  return `${move} ${lines.join(' ')}`;
}
