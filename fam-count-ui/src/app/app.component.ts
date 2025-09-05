import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { GenericChartComponent } from './spark-line-chart/generic-chart.component';
import {
  ChartType,
  GenericChartData,
  ViewType,
} from './spark-line-chart/models/generic-chart.models';
import { data } from './spark-line-chart/util/testData';

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
  public data: GenericChartData = data;

  mappedData: GenericChartData = {
    series: this.data.series.map((serie) => ({
      category: serie.category,
      points: serie.points.map((point) => ({
        x: point.x,
        y: point.y,
        tooltip: this.createTooltipByDateFormat(this.data.options.viewType)({
          x: point.x,
          y: point.y,
        }),
      })),
    })),
    options: this.data.options,
  };

  createTooltipByDateFormat(type: ViewType) {
    return (point: { x: number | string | Date; y: number }) => {
      const locale = navigator.language || 'en';
      const labels: Record<
        string,
        { year: string; month: string; day: string }
      > = {
        pt: { year: 'Ano', month: 'Mês', day: 'Dia' },
        en: { year: 'Year', month: 'Month', day: 'Day' },
        // Add more languages as needed
      };
      // Use only the first part of the locale (e.g., 'pt' from 'pt-BR')
      const lang = locale.split('-')[0];
      const labelSet = labels[lang] || labels['en'];
      let xLabel: string;
      const date = new Date(point.x);

      if (type === ViewType.Year) {
        const yearText = new Intl.DateTimeFormat(locale, {
          year: 'numeric',
        }).format(date);
        xLabel = `${labelSet.year}: ${yearText}`;
      } else if (type === ViewType.Month) {
        const monthText =
          new Intl.DateTimeFormat(locale, {
            month: 'long',
          })
            .format(date)
            .charAt(0)
            .toUpperCase() +
          new Intl.DateTimeFormat(locale, {
            month: 'long',
          })
            .format(date)
            .slice(1);
        xLabel = `${labelSet.month}: ${monthText}`;
      } else if (type === ViewType.Day) {
        const dayText = new Intl.DateTimeFormat(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(date);
        xLabel = `${labelSet.day}: ${dayText}`;
      } else {
        xLabel = `X: ${point.x}`;
      }
      return `${xLabel}\n Value: ${point.y} €`;
    };
  }
}
