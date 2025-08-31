import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Point } from '../app.component';
import { createLinearScale } from '../../helpers/createLinearScale';
import { BulletPointComponent } from '../bullet-point/bullet-point.component';
import { line, curveCatmullRom } from 'd3-shape';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BulletPointComponent, CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LineChartComponent {
  @Input() series: Point[][] = [];
  @Input() width: number = 400;
  @Input() height: number = 200;

  public hoveredPoint: Point | null = null;

  onHover(event: Point | null) {
    this.hoveredPoint = event;
  }

  get points(): Point[] {
    return this.series.flat();
  }

  getColor(index: number): string {
    const colors = [
      'rgb(33, 158, 188,1)',
      'rgb(144, 190, 109,1)',
      'rgb(255, 99, 132,1)',
      'rgb(54, 255, 235,1)',
      'rgb(248, 150, 30,1)',
      'rgb(67, 170, 139,1)',
      'rgb(249, 65, 68,1)',
    ];
    return colors[index % colors.length];
  }

  get viewBoxSize(): string {
    return `0 0 ${this.width} ${this.height}`;
  }

  get allSeries(): number[] {
    const series = this.series.flat().map((p) => p.x);
    return Array.from(new Set(series)).sort((a, b) => a - b);
  }

  // Add a function to scale series:
  xScaleSeries(serie: number): number {
    const series = this.series.flat().map((p) => p.x);
    const minYear = Math.min(...series);
    const maxYear = Math.max(...series);
    return ((serie - minYear) / (maxYear - minYear)) * 400; // adjust 400 to your SVG width
  }

  xScale(points: Point[]) {
    const years = (points ?? []).map((p) => p.x);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    return createLinearScale([minYear, maxYear], [0, 400]);
  }

  yScale(points: Point[]) {
    const values = (points ?? []).map((p) => p.y);
    const minValue = Math.min(...values, 1000);
    const maxValue = Math.max(...values, 2100);
    // SVG y=0 is top, so invert the range
    return createLinearScale([minValue, maxValue], [150, 70]);
  }

  curvePath(points: Point[]): string {
    if (!points || points.length < 2) return '';
    const x = this.xScale(points); // get the scaling function for this series
    const y = this.yScale(points); // get the scaling function for this series
    const lineGenerator = line<Point>()
      .x((d: Point) => x(d.x))
      .y((d: Point) => y(d.y))
      .curve(curveCatmullRom.alpha(1));
    return lineGenerator(points) || '';
  }
}
