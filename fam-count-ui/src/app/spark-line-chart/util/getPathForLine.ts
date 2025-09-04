import { Point } from '../models/generic-chart.models';

export function getPathCommandsForLine(points: Point[]): string {
  const [firstPoint, ...restPoints] = points;
  const move = `M ${firstPoint.x} ${firstPoint.y}`;
  const lines = restPoints.map((p) => {
    return `L ${p.x},${p.y}`;
  });
  return `${move} ${lines.join(' ')}`;
}

export function getSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  const safe = (y: number) => Math.max(0, y);

  let d = `M ${points[0].x} ${safe(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = safe(p1.y + (p2.y - p0.y) / 6);
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = safe(p2.y - (p3.y - p1.y) / 6);

    // Clamp all y values in the curve command
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${safe(p2.y)}`;
  }
  return d;
}
