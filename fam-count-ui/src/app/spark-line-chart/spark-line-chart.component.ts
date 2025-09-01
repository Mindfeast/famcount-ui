import { Component, Input } from '@angular/core';
import {
  ChartOptions,
  LineChartData,
  Point,
  SeriesWithCategory,
} from './models/spark.models';
import { getBounds } from '../../util/getBounds';

import { createLinearScale } from '../../util/createLinearScale';
import { CommonModule } from '@angular/common';
import { SparkLineDotsComponent } from './spark-line-dots/spark-line-dots.component';
import { SparkchartLineComponent } from './sparkchart-line/sparkchart-line.component';
import { getColor } from '../../util/colorSetChart';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { GeneralTooltipDirective } from '../shared/general-tooltip.directive';

@Component({
  selector: 'app-spark-line-chart',
  standalone: true,
  templateUrl: './spark-line-chart.component.html',
  styleUrls: ['./spark-line-chart.component.scss'],
  imports: [
    CommonModule,
    SparkLineDotsComponent,
    SparkchartLineComponent,
    ChartLegendComponent,
    GeneralTooltipDirective,
  ],
})
export class SparkLineChartComponent {
  public computedPoints: Point[][] = [];
  public getColor = getColor;
  public legend!: boolean;
  public categories!: SeriesWithCategory[];

  @Input() set data(data: LineChartData) {
    this.legend = data.options.legend;
    this.categories = data.series;
    const bounds = getBounds(data.series.flatMap((s) => s.points));
    const xScale = createLinearScale([bounds.minX, bounds.maxX], [0, 500]);
    const yScale = createLinearScale([bounds.minY, bounds.maxY], [300, 0]);

    this.computedPoints = data.series.map((s) =>
      s.points.map((p: Point) => ({
        x: xScale(p.x),
        y: yScale(p.y),
        tooltip: p.tooltip,
      }))
    );
  }
}
