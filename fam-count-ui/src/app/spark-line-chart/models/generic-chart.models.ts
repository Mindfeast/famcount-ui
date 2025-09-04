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
  type: ChartType;
  smooth?: boolean;
}

export interface Point {
  x: number;
  y: number;
  tooltip?: string;
}

export enum ChartType {
  Line = 'line',
  Bar = 'bar',
  Pie = 'pie',
}
