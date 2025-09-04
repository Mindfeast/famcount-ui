import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ChartOptions,
  ChartType,
  GenericChartData,
  Point,
  Series,
} from './models/generic-chart.models';
import { getBounds } from './util/getBounds';

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
  public chartData!: GenericChartData;
  public yTicks: number[] = [];
  public yScale: (y: number) => number = (y) => y;
  public xScale: (x: number) => number = (x) => x;

  @Input() height: number = 300;
  @Input() width: number = 500;
  @Input() data!: GenericChartData;

  ngOnChanges(changes: SimpleChanges) {
    if (!this.data) return;
    this.chartData = this.data;

    const bounds = getBounds(this.data.series.flatMap((s) => s.points));
    const padding = (bounds.maxY - bounds.minY) * 0.1;
    const paddedMinY = 0;
    const paddedMaxY = bounds.maxY + padding;

    this.xScale = createLinearScale(
      [bounds.minX, bounds.maxX],
      [0, this.width]
    );
    this.yScale = createLinearScale([paddedMinY, paddedMaxY], [this.height, 0]);

    this.computedPoints = this.data.series.map((s) =>
      [...s.points] // create a shallow copy to avoid mutating original data
        .sort((a, b) => a.x - b.x)
        .map((p: Point) => ({
          x: this.xScale(p.x),
          y: this.yScale(p.y),
          tooltip: p.tooltip,
        }))
    );
  }
}
