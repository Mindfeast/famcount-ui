import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ChartOptions,
  ChartType,
  GenericChartData,
  Point,
  Series,
  ViewType,
} from './models/generic-chart.models';
import { getBounds, getBounds1 } from './util/getBounds';

import { createLinearScale } from './util/createLinearScale';
import { CommonModule } from '@angular/common';
import { SparkLineDotsComponent } from './spark-line-dots/spark-line-dots.component';
import { SparkchartLineComponent } from './sparkchart-line/sparkchart-line.component';
import { getColor } from './util/colorSetChart';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { GeneralTooltipDirective } from '../shared/general-tooltip.directive';
import { SparklineAxisComponent } from './sparkline-axis/sparkline-axis.component';

@Component({
  selector: 'app-generic-chart',
  standalone: true,
  templateUrl: './generic-chart.component.html',
  styleUrls: ['./generic-chart.component.scss'],
  imports: [
    CommonModule,
    SparkLineDotsComponent,
    SparkchartLineComponent,
    ChartLegendComponent,
    GeneralTooltipDirective,
    SparklineAxisComponent,
  ],
})
export class GenericChartComponent implements OnChanges {
  public computedPoints: Point[][] = [];
  public getColor = getColor;
  public ChartType = ChartType;
  public chartData: GenericChartData = {
    series: [],
    options: {
      title: '',
      legend: false,
      type: ChartType.Line,
      smooth: false,
      viewType: ViewType.Day,
    },
  };

  public yTicks: number[] = [];
  public yScale: (y: number) => number = (y) => y;
  public xScale: (x: number) => number = (x) => x;
  public allPoints: Point[] = [];

  @Input() height: number = 300;
  @Input() width: number = 500;
  @Input() data!: GenericChartData;
  @Input() viewType: ViewType = ViewType.Day;
  @Input() selectedYear: number = 2019;
  @Input() selectedMonth: number = 2;

  ngOnChanges() {
    this.viewType = this.data.options.viewType || ViewType.Day;
    const allPoints = this.data.series.flatMap((s) => s.points);
    if (allPoints.length === 0) return;

    const bounds = getBounds(allPoints);
    this.setupYScale(bounds);
    this.setupYTicks(bounds);

    if (this.viewType === ViewType.Year) {
      this.handleYearView();
    } else if (this.viewType === ViewType.Month) {
      this.handleMonthView();
    } else if (this.viewType === ViewType.Day) {
      this.handleDayView();
    } else {
      this.handleDefaultView();
    }
  }

  public getMonthName(monthIndex: number): string {
    const date = new Date(2000, monthIndex, 1); // Year 2000 is arbitrary
    return (
      date
        .toLocaleString('default', { month: 'long' })
        .charAt(0)
        .toUpperCase() +
      date.toLocaleString('default', { month: 'long' }).slice(1)
    );
  }

  private handleYearView() {
    // Get all years present in the data
    let filteredSeries = this.data.series.map((series) => {
      let points = series.points
        .map((p) => {
          const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
          return {
            ...p,
            x: d instanceof Date ? d.getFullYear() : Number(d),
          };
        })
        .sort((a, b) => Number(a.x) - Number(b.x));

      // Ensure first and last year exist
      const years = points.map((p) => Number(p.x));
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);

      if (!years.includes(minYear)) {
        points = [{ x: minYear, y: 0 }, ...points];
      }
      if (!years.includes(maxYear)) {
        points = [...points, { x: maxYear, y: 0 }];
      }

      return { ...series, points };
    });

    this.allPoints = filteredSeries.flatMap((s) => s.points);

    // Setup xScale for years
    const years = this.allPoints.map((p) => Number(p.x));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    this.xScale = createLinearScale([minYear, maxYear], [0, this.width]);

    // Setup computed points
    this.setupComputedPoints(filteredSeries, 'year');
  }

  private handleMonthView() {
    let filteredSeries = this.data.series.map((series) => {
      let points = series.points
        .filter((p) => {
          const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
          return d instanceof Date && d.getFullYear() === this.selectedYear;
        })
        .sort((a, b) => {
          const da = typeof a.x === 'string' ? new Date(a.x) : a.x;
          const db = typeof b.x === 'string' ? new Date(b.x) : b.x;
          return (
            (da instanceof Date ? da.getMonth() : 0) -
            (db instanceof Date ? db.getMonth() : 0)
          );
        });

      // Ensure Jan 1st exists
      const jan1 = new Date(this.selectedYear, 0, 1);
      if (
        !points.some((p) => {
          const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
          return d instanceof Date && d.getMonth() === 0 && d.getDate() === 1;
        })
      ) {
        points = [{ x: jan1, y: 0 }, ...points];
      }

      // Ensure Dec 31st exists
      const dec31 = new Date(this.selectedYear, 11, 31);
      if (
        !points.some((p) => {
          const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
          return d instanceof Date && d.getMonth() === 11 && d.getDate() === 31;
        })
      ) {
        points = [...points, { x: dec31, y: 0 }];
      }

      return { ...series, points };
    });

    this.allPoints = filteredSeries.flatMap((s) => s.points);
    this.selectedYear = Math.min(
      ...this.allPoints.map((p) => {
        const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
        return d instanceof Date ? d.getFullYear() : Number(d);
      })
    );

    const bounds = getBounds1(this.allPoints, (x) => {
      const d = typeof x === 'string' ? new Date(x) : x;
      return d instanceof Date ? d.getMonth() : Number(x);
    });
    this.setupScalesMonth(bounds);
    this.setupComputedPoints(filteredSeries, 'month');
  }

  private handleDayView() {
    let filteredSeries = this.data.series.map((series) => {
      let points = series.points
        .filter((p) => {
          const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
          return (
            d instanceof Date &&
            d.getFullYear() === this.selectedYear &&
            d.getMonth() === this.selectedMonth
          );
        })
        .sort((a, b) => {
          const da = typeof a.x === 'string' ? new Date(a.x) : a.x;
          const db = typeof b.x === 'string' ? new Date(b.x) : b.x;
          return (
            (da instanceof Date ? da.getTime() : 0) -
            (db instanceof Date ? db.getTime() : 0)
          );
        });

      // Ensure first day of month exists
      const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
      if (
        !points.some((p) => {
          const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
          return (
            d instanceof Date &&
            d.getDate() === 1 &&
            d.getMonth() === this.selectedMonth &&
            d.getFullYear() === this.selectedYear
          );
        })
      ) {
        points = [{ x: firstDay, y: 0 }, ...points];
      }

      // Ensure last day of month exists
      const lastDayNum = new Date(
        this.selectedYear,
        this.selectedMonth + 1,
        0
      ).getDate();
      const lastDay = new Date(
        this.selectedYear,
        this.selectedMonth,
        lastDayNum
      );
      if (
        !points.some((p) => {
          const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
          return (
            d instanceof Date &&
            d.getDate() === lastDayNum &&
            d.getMonth() === this.selectedMonth &&
            d.getFullYear() === this.selectedYear
          );
        })
      ) {
        points = [...points, { x: lastDay, y: 0 }];
      }

      return { ...series, points };
    });

    this.allPoints = filteredSeries.flatMap((s) => s.points);

    const bounds = getBounds1(this.allPoints, (x) => {
      const d = typeof x === 'string' ? new Date(x) : x;
      return d instanceof Date ? d.getTime() : Number(x);
    });
    this.setupScalesDay(bounds);
    this.setupComputedPoints(filteredSeries, 'day');
  }

  private handleDefaultView() {
    this.allPoints = this.data.series.flatMap((s) => s.points);
    this.selectedYear = Math.min(
      ...this.allPoints.map((p) => {
        const d = typeof p.x === 'string' ? new Date(p.x) : p.x;
        return d instanceof Date ? d.getFullYear() : Number(d);
      })
    );
    const bounds = getBounds1(this.allPoints, (x) => {
      const d = typeof x === 'string' ? new Date(x) : x;
      return d instanceof Date ? d.getTime() : Number(x);
    });
    this.setupScalesDefault(bounds);
    this.setupComputedPoints(this.data.series, 'default');
  }

  private setupScalesMonth(bounds: any) {
    this.xScale = createLinearScale(
      [
        new Date(this.selectedYear, 0, 1).getTime(),
        new Date(this.selectedYear, 11, 31, 23, 59, 59, 999).getTime(),
      ],
      [0, this.width]
    );
    const padding = (bounds.maxY - bounds.minY) * 0.1;
    this.yScale = createLinearScale(
      [0, bounds.maxY + padding],
      [this.height, 0]
    );
  }

  private setupScalesDay(bounds: any) {
    const start = new Date(this.selectedYear, this.selectedMonth, 1).getTime();
    const end = new Date(
      this.selectedYear,
      this.selectedMonth + 1,
      0,
      23,
      59,
      59,
      999
    ).getTime();
    this.xScale = createLinearScale([start, end], [0, this.width]);
    const padding = (bounds.maxY - bounds.minY) * 0.1;
    this.yScale = createLinearScale(
      [0, bounds.maxY + padding],
      [this.height, 0]
    );
  }

  private setupScalesDefault(bounds: any) {
    this.xScale = createLinearScale(
      [bounds.minX, bounds.maxX],
      [0, this.width]
    );
    const padding = (bounds.maxY - bounds.minY) * 0.1;
    this.yScale = createLinearScale(
      [0, bounds.maxY + padding],
      [this.height, 0]
    );
  }

  private setupComputedPoints(
    series: Series[],
    mode: 'year' | 'month' | 'day' | 'default'
  ) {
    this.computedPoints = series.map((s) =>
      s.points.map((p: Point) => {
        let xValue: number;
        if (mode === 'year') {
          xValue =
            typeof p.x === 'number'
              ? p.x
              : typeof p.x === 'string'
              ? Number(p.x)
              : p.x instanceof Date
              ? p.x.getFullYear()
              : Number(p.x);
        } else if (mode === 'month') {
          xValue =
            typeof p.x === 'string'
              ? new Date(p.x).getTime()
              : (p.x as Date).getTime();
        } else if (mode === 'day') {
          xValue =
            typeof p.x === 'string'
              ? new Date(p.x).getTime()
              : p.x instanceof Date
              ? p.x.getTime()
              : Number(p.x);
        } else {
          xValue =
            typeof p.x === 'number'
              ? p.x
              : typeof p.x === 'string'
              ? new Date(p.x).getTime()
              : (p.x as Date).getTime();
        }
        return {
          x: this.xScale(xValue),
          y: this.yScale(p.y),
          tooltip: p.tooltip,
        };
      })
    );
  }

  private setupYScale(bounds: { minY: number; maxY: number }) {
    const paddedMinY = 0;
    const paddedMaxY = bounds.maxY + (bounds.maxY - bounds.minY) * 0.1;
    this.yScale = createLinearScale([paddedMinY, paddedMaxY], [this.height, 0]);
  }

  private setupYTicks(bounds: { minY: number; maxY: number }) {
    const paddedMinY = 0;
    const paddedMaxY = bounds.maxY + (bounds.maxY - bounds.minY) * 0.1;
    const yTickCount = 16;
    const yStep = (paddedMaxY - paddedMinY) / (yTickCount - 1);
    this.yTicks = [];
    for (let i = 0; i < yTickCount; i++) {
      this.yTicks.push(paddedMinY + i * yStep);
    }
  }
}
