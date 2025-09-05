import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createLinearScale } from '../util/createLinearScale';
import { getBounds } from '../util/getBounds';
import { Series, ViewType } from '../models/generic-chart.models';

@Component({
  selector: 'app-sparkline-axis',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './sparkline-axis.component.scss',
  templateUrl: './sparkline-axis.component.html',
})
export class SparklineAxisComponent {
  @Input() series: Series[] = [];
  @Input() height: number = 300;
  @Input() width: number = 500;
  @Input() padding: number = 0.1; // 10% top padding
  @Input() xScale!: (x: number) => number;
  @Input() viewType: ViewType = ViewType.Day;
  @Input() selectedYear: number = 2019;
  @Input() selectedMonth: number = 0;

  public yTicks: number[] = [];
  public yScale: (y: number) => number = (y) => y;
  public xTicks: (number | Date)[] = [];
  public yAxisWidth: number = 30;
  public xTickFormat: (tick: number | Date) => string = (tick: number | Date) =>
    tick.toString();

  ngOnChanges() {
    console.log('SparklineAxisComponent ngOnChanges called');
    const allPoints = this.series.flatMap((s) => s.points);
    if (allPoints.length === 0) return;

    const bounds = getBounds(allPoints);
    this.setupYScale(bounds);
    this.setupYTicks(bounds);

    if (this.viewType === ViewType.Year) {
      this.setupYearTicks(bounds);
    } else if (this.viewType === ViewType.Month) {
      this.setupMonthTicks();
    } else if (this.viewType === ViewType.Day) {
      this.setupDayTicks();
    }
  }

  private setupYScale(bounds: { minY: number; maxY: number }) {
    const paddedMinY = 0;
    const paddedMaxY = bounds.maxY + (bounds.maxY - bounds.minY) * this.padding;
    this.yScale = createLinearScale([paddedMinY, paddedMaxY], [this.height, 0]);
  }

  private setupYTicks(bounds: { minY: number; maxY: number }) {
    const paddedMinY = 0;
    const paddedMaxY = bounds.maxY + (bounds.maxY - bounds.minY) * this.padding;
    const yTickCount = 16;
    const yStep = (paddedMaxY - paddedMinY) / (yTickCount - 1);
    this.yTicks = [];
    for (let i = 0; i < yTickCount; i++) {
      this.yTicks.push(Math.round(paddedMinY + i * yStep)); // <-- round to integer
    }
  }

  private setupYearTicks(bounds: { minX: number; maxX: number }) {
    this.xTicks = [];
    const minYear = new Date(bounds.minX).getFullYear();
    const maxYear = new Date(bounds.maxX).getFullYear();
    for (let y = minYear; y <= maxYear; y++) {
      this.xTicks.push(y);
    }
    this.xTickFormat = (tick: number | Date) => tick.toString();
  }

  private setupMonthTicks() {
    this.xTicks = [];
    for (let m = 0; m < 12; m++) {
      this.xTicks.push(new Date(this.selectedYear, m, 1));
    }
    this.xTickFormat = (tick: number | Date) => {
      const str = new Date(tick)
        .toLocaleString(undefined, { month: 'short' })
        .replace('.', '')
        .toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  }

  private setupDayTicks() {
    this.xTicks = [];
    const year = this.selectedYear;
    const month = this.selectedMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d += 5) {
      this.xTicks.push(new Date(year, month, d));
    }
    if (
      this.xTicks.length &&
      this.xTicks[this.xTicks.length - 1] instanceof Date &&
      (this.xTicks[this.xTicks.length - 1] as Date).getDate() !== daysInMonth
    ) {
      this.xTicks.push(new Date(year, month, daysInMonth));
    }

    this.xTickFormat = (tick: number | Date) =>
      new Date(tick).getDate().toString();
  }

  tickToNumber(tick: number | Date): number {
    return tick instanceof Date ? tick.getTime() : Number(tick);
  }
}
