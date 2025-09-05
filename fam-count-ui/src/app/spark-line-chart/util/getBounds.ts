import { Point } from '../models/generic-chart.models';

function toNumber(x: string | number | Date): number {
  return typeof x === 'string'
    ? new Date(x).getTime()
    : x instanceof Date
    ? x.getTime()
    : x;
}

export function getBounds(points: Point[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const xValues = points.map((p) => toNumber(p.x));
  const yValues = points.map((p) => p.y);
  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  };
}

// getBounds.ts
export function getBounds1(
  points: Point[],
  toNumber: (x: string | number | Date) => number
) {
  const xValues = points.map((p) => toNumber(p.x));
  const yValues = points.map((p) => p.y);
  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  };
}
