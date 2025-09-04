import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { GenericChartComponent } from './spark-line-chart/generic-chart.component';
import {
  ChartType,
  GenericChartData,
} from './spark-line-chart/models/generic-chart.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AsyncPipe,
    FormsModule,
    GenericChartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fam-count-ui';

  public data: GenericChartData = {
    series: [
      {
        category: 'Grapes',
        points: [
          { x: 2014, y: 100 },
          { x: 2015, y: 320 },
          { x: 2016, y: 180 },
          { x: 2017, y: 400 },
          { x: 2018, y: 250 },
          { x: 2019, y: 600 },
          { x: 2019, y: 450 },
          { x: 2020, y: 900 },
          { x: 2021, y: 700 },
          { x: 2022, y: 1200 },
          { x: 2023, y: 1100 },
          { x: 2024, y: 800 },
          { x: 2025, y: 1700 },
          { x: 2025, y: 950 },
          { x: 2026, y: 1600 },
          { x: 2026, y: 400 },
          { x: 2027, y: 2100 },
          { x: 2028, y: 1300 },
          { x: 2029, y: 600 },
          { x: 2030, y: 2000 },
        ],
      },
      {
        category: 'Berries',
        points: [
          { x: 2014, y: 150 },
          { x: 2015, y: 500 },
          { x: 2016, y: 200 },
          { x: 2017, y: 900 },
          { x: 2018, y: 400 },
          { x: 2019, y: 1200 },
          { x: 2020, y: 700 },
          { x: 2021, y: 1350 },
          { x: 2022, y: 800 },
          { x: 2023, y: 1700 },
          { x: 2024, y: 950 },
          { x: 2025, y: 2100 },
          { x: 2026, y: 1950 },
          { x: 2027, y: 600 },
          { x: 2028, y: 2250 },
          { x: 2029, y: 1400 },
          { x: 2030, y: 2550 },
          { x: 2031, y: 1100 },
          { x: 2032, y: 2850 },
          { x: 2033, y: 1700 },
          { x: 2034, y: 3150 },
        ],
      },
    ],
    options: {
      title: 'Fruit Sales',
      legend: true,
      type: ChartType.Line,
      smooth: true,
    },
  };

  mappedData: GenericChartData = {
    series: this.data.series.map((serie) => ({
      category: serie.category,
      points: serie.points.map((point) => ({
        x: point.x,
        y: point.y,
        tooltip: `Year: ${point.x} Value: ${point.y} €`,
      })),
    })),
    options: this.data.options,
  };

  createTooltipByDateFormat(type: 'year' | 'month' | 'day' | 'number') {
    return (point: { x: number | string; y: number }) => {
      let xLabel: string;
      if (type === 'year') {
        xLabel = `Year: ${new Date(point.x).getFullYear()}`;
      } else if (type === 'month') {
        xLabel = `Month: ${new Date(point.x).toLocaleString(undefined, {
          month: 'long',
        })}`;
      } else if (type === 'day') {
        xLabel = `Day: ${new Date(point.x).toLocaleDateString()}`;
      } else {
        xLabel = `X: ${point.x}`;
      }
      return `${xLabel} Value: ${point.y} €`;
    };
  }
}
