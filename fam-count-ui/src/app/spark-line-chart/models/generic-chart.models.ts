export interface GenericChartData {
  series: Series[];
  options: ChartOptions;
}

export interface Series {
  category: string;
  points: Point[];
}

export interface ChartOptions {
  title: string;
  legend: boolean;
}

export interface Point {
  x: number;
  y: number;
  tooltip?: string;
}
