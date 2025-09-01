// import {
//   Component,
//   CUSTOM_ELEMENTS_SCHEMA,
//   Input,
//   OnChanges,
//   SimpleChanges,
// } from '@angular/core';
// import { LineChartData, Point } from './models/line-chart.model';
// import { createLinearScale } from '../../util/createLinearScale';
// import { BulletPointComponent } from './bullet-point/bullet-point.component';
// import {
//   line,
//   curveBumpX,
//   curveCatmullRom,
//   curveLinear,
//   curveMonotoneX,
// } from 'd3-shape';
// import { CommonModule } from '@angular/common';
// import { ChartLegendComponent } from '../chart-legend/chart-legend.component';

// @Component({
//   selector: 'app-line-chart',
//   standalone: true,
//   imports: [BulletPointComponent, CommonModule, ChartLegendComponent],
//   templateUrl: './line-chart.component.html',
//   styleUrl: './line-chart.component.scss',
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class LineChartComponent implements OnChanges {
//   @Input() width: number = 800;
//   @Input() height: number = 400;
//   @Input() data!: LineChartData;
//   @Input() maxYTicks = 10;
//   @Input() xGranularity: 'year' | 'month' | 'day' = 'month';
//   @Input() selectedMonth: number = 5;
//   @Input() selectedYear: number = 2020;

//   public hoveredPoint: Point | null = null;
//   public padding = { left: 40, right: 20, top: 20, bottom: 40 };

//   // Store computed values as properties
//   public xTicks: Date[] = [];
//   public yTicks: number[] = [];
//   public xScale: (x: number) => number = () => 0;
//   public yScale: (y: number) => number = () => 0;
//   public paddedMaxY: number = 0;
//   public viewBoxSize: string = '';
//   public isChartReady = false;
//   public allDaysForScale: Date[] = [];

//   ngOnChanges(changes: SimpleChanges): void {
//     this.computeChartValues();
//   }

//   computeChartValues() {
//     // Compute xTicks
//     const allDates =
//       this.data?.series?.flatMap((s) =>
//         s.points.map((p) => (p.x instanceof Date ? p.x : new Date(p.x)))
//       ) ?? [];
//     if (allDates.length) {
//       const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
//       const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
//       this.xTicks = [];
//       if (this.xGranularity === 'year') {
//         for (
//           let year = minDate.getFullYear();
//           year <= maxDate.getFullYear();
//           year++
//         ) {
//           this.xTicks.push(new Date(year, 0, 1));
//         }
//       } else if (this.xGranularity === 'month') {
//         const year = minDate.getFullYear(); // You can later make this dynamic
//         for (let month = 0; month < 12; month++) {
//           this.xTicks.push(new Date(year, month, 1));
//         }
//       } else if (this.xGranularity === 'day') {
//         // You may want to use selectedYear/selectedMonth from @Input or parent
//         const year = this.selectedYear; // Make sure this is set correctly
//         const month =
//           typeof this.selectedMonth === 'number' ? this.selectedMonth : 0; // 0 = January

//         // Generate all days in the selected month of the selected year
//         const days: Date[] = [];
//         const start = new Date(year, month, 1);
//         const end = new Date(year, month + 1, 0); // last day of month
//         for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//           days.push(new Date(d));
//         }

//         // Ticks every 5 days
//         let ticks: Date[] = [];
//         for (let i = 0; i < days.length; i += 5) {
//           ticks.push(days[i]);
//         }
//         // Always include the last day if not already present
//         if (
//           ticks[ticks.length - 1].getTime() !== days[days.length - 1].getTime()
//         ) {
//           ticks.push(days[days.length - 1]);
//         }

//         this.xTicks = ticks;
//         this.allDaysForScale = days; // (optional, for xScale domain)
//       }
//     } else {
//       this.xTicks = [];
//     }

//     // Compute yTicks
//     const allY =
//       this.data?.series?.flatMap((s) => s.points.map((p) => p.y)) ?? [];
//     const maxY = Math.max(0, ...allY);
//     const numTicks = this.maxYTicks;
//     const step = maxY / numTicks;
//     const halfStep = step / 2;
//     this.yTicks = [];
//     for (let i = 0; i <= numTicks * 2; i++) {
//       this.yTicks.push(Math.round(i * halfStep));
//     }

//     // Compute paddedMaxY
//     this.paddedMaxY = Math.ceil(maxY * 1.2);

//     // Compute scales
//     const xTickTimes = this.allDaysForScale.length
//       ? this.allDaysForScale.map((d) => d.getTime())
//       : this.xTicks.map((d) => d.getTime());
//     if (xTickTimes.length) {
//       const minX = xTickTimes[0];
//       const maxX = xTickTimes[xTickTimes.length - 1];
//       const { left, right } = this.padding;
//       const usableWidth = this.width - left - right;
//       this.xScale = createLinearScale([minX, maxX], [left, left + usableWidth]);
//     } else {
//       this.xScale = () => 0;
//     }

//     if (allY.length) {
//       const minY = 0;
//       const maxY = this.paddedMaxY;
//       const { top, bottom } = this.padding;
//       const usableHeight = this.height - top - bottom;
//       this.yScale = createLinearScale([minY, maxY], [top + usableHeight, top]);
//     } else {
//       this.yScale = () => 0;
//     }

//     // Compute viewBox
//     this.viewBoxSize = `0 0 ${this.width + 20} ${this.height}`;

//     // Chart is ready if all required values are present
//     this.isChartReady =
//       !!this.xTicks.length &&
//       !!this.yTicks.length &&
//       !!this.width &&
//       !!this.height &&
//       !!this.padding &&
//       !!this.data?.series?.length;
//   }

//   onHover(event: Point | null) {
//     this.hoveredPoint = event;
//   }

//   getColor(index: number): string {
//     const colors = [
//       'rgb(33, 158, 188,1)',
//       'rgb(144, 190, 109,1)',
//       'rgb(255, 99, 132,1)',
//       'rgb(54, 255, 235,1)',
//       'rgb(248, 150, 30,1)',
//       'rgb(67, 170, 139,1)',
//       'rgb(249, 65, 68,1)',
//     ];
//     return colors[index % colors.length];
//   }

//   formatXLabel(x: number | string | Date): string {
//     const date = x instanceof Date ? x : new Date(x);
//     if (this.xGranularity === 'year') {
//       return date.getFullYear().toString();
//     }
//     if (this.xGranularity === 'month') {
//       return date.toLocaleString(undefined, { month: 'long' });
//     }
//     return date.toLocaleDateString();
//   }

//   sortPoints(points: Point[]): Point[] {
//     return [...points].sort((a, b) => {
//       const aTime =
//         a.x instanceof Date ? a.x.getTime() : new Date(a.x).getTime();
//       const bTime =
//         b.x instanceof Date ? b.x.getTime() : new Date(b.x).getTime();
//       return aTime - bTime;
//     });
//   }

//   xScaleValue(x: number | string | Date): number {
//     if (!this.isChartReady) return 0;
//     const xValue = x instanceof Date ? x.getTime() : new Date(x).getTime();
//     return this.xScale(xValue);
//   }

//   yScaleValue(y: number): number {
//     if (!this.isChartReady) return 0;
//     return this.yScale(y);
//   }

//   curvePath(points: Point[]): string {
//     if (!points || points.length < 2) return '';
//     const sorted = this.sortPoints(points);

//     const xTicks = this.xTicks;
//     if (xTicks.length) {
//       const firstTick = xTicks[0];
//       const lastTick = xTicks[xTicks.length - 1];
//       const firstPoint = sorted[0];
//       const lastPoint = sorted[sorted.length - 1];
//       const firstTickTime = new Date(firstTick).getTime();
//       const lastTickTime = new Date(lastTick).getTime();
//       const firstPointTime = new Date(firstPoint.x).getTime();
//       const lastPointTime = new Date(lastPoint.x).getTime();

//       // Add a virtual point at the first xTick if needed
//       if (firstPointTime > firstTickTime) {
//         sorted.unshift({ x: firstTick, y: firstPoint.y });
//       }
//       // Clamp the first point if it's before the first tick
//       if (firstPointTime < firstTickTime) {
//         sorted[0] = { x: firstTick, y: firstPoint.y };
//       }

//       // Add a virtual point at the last xTick if needed
//       if (lastPointTime < lastTickTime) {
//         sorted.push({ x: lastTick, y: lastPoint.y });
//       }
//       // Clamp the last point if it's after the last tick
//       if (lastPointTime > lastTickTime) {
//         sorted[sorted.length - 1] = { x: lastTick, y: lastPoint.y };
//       }
//     }

//     // Use a straight line if any two points are very close (e.g., < 2 days apart)
//     let useLinear = false;
//     for (let i = 1; i < sorted.length; i++) {
//       const prev = new Date(sorted[i - 1].x);
//       const curr = new Date(sorted[i].x);
//       if (Math.abs(curr.getTime() - prev.getTime()) < 2 * 24 * 60 * 60 * 1000) {
//         useLinear = true;
//         break;
//       }
//     }

//     const lineGenerator = line<Point>()
//       .x((d: Point) => this.xScaleValue(d.x))
//       .y((d: Point) => this.yScaleValue(d.y))
//       .curve(useLinear ? curveMonotoneX : curveCatmullRom.alpha(0.5));
//     return lineGenerator(sorted) || '';
//   }
// }
