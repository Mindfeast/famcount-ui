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
  viewType: ViewType;
}

export interface Point {
  x: number | string | Date;
  y: number;
  tooltip?: string;
}

export enum ChartType {
  Line = 'line',
  Bar = 'bar',
  Pie = 'pie',
}

export enum ViewType {
  Year = 'year',
  Month = 'month',
  Day = 'day',
  Number = 'number',
}
