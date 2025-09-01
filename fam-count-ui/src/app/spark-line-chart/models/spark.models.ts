export interface LineChartData {
  series: SeriesWithCategory[];
  options: ChartOptions;
}

export interface SeriesWithCategory {
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
