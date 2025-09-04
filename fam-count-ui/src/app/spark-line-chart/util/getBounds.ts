import { Point } from '../models/generic-chart.models';

export function getBounds(points: Point[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  };
}
