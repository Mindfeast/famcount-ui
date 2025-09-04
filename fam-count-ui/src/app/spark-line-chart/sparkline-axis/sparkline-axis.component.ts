import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createLinearScale } from '../util/createLinearScale';
import { getBounds } from '../util/getBounds';
import { Series } from '../models/generic-chart.models';

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

  public yTicks: number[] = [];
  public yScale: (y: number) => number = (y) => y;
  public xTicks: number[] = [];

  ngOnChanges() {
    const allPoints = this.series.flatMap((s) => s.points);
    if (allPoints.length === 0) return;

    const bounds = getBounds(allPoints);
    const paddedMinY = 0;
    const paddedMaxY = bounds.maxY + (bounds.maxY - bounds.minY) * this.padding;

    this.yScale = createLinearScale([paddedMinY, paddedMaxY], [this.height, 0]);

    const targetNumTicks = 12;
    const range = paddedMaxY - paddedMinY;
    const roughStep = range / (targetNumTicks - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const niceStep = Math.ceil(roughStep / magnitude) * magnitude;
    this.yTicks = [];
    for (let tick = paddedMinY; tick <= paddedMaxY; tick += niceStep) {
      this.yTicks.push(Math.round(tick));
    }
    if (this.yTicks[this.yTicks.length - 1] < paddedMaxY) {
      this.yTicks.push(Math.round(paddedMaxY));
    }

    const xTargetNumTicks = 12;
    const xRange = bounds.maxX - bounds.minX;
    const xRoughStep = xRange / (xTargetNumTicks - 1);
    const xMagnitude = Math.pow(10, Math.floor(Math.log10(xRoughStep)));
    const xNiceStep = Math.ceil(xRoughStep / xMagnitude) * xMagnitude;

    this.xTicks = [];
    for (let i = 0; i < xTargetNumTicks; i++) {
      const rawTick =
        bounds.minX + (i * (bounds.maxX - bounds.minX)) / (xTargetNumTicks - 1);
      // Round to nearest "nice" step
      const roundedTick = Math.round(rawTick / xNiceStep) * xNiceStep;
      this.xTicks.push(roundedTick);
    }
  }
}
