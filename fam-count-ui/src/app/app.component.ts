import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { GenericChartComponent } from './spark-line-chart/generic-chart.component';
import { GenericChartData } from './spark-line-chart/models/generic-chart.models';

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
        category: 'Apples',
        points: [
          { x: 2018, y: 1200 },
          { x: 2019, y: 2222 },
          { x: 2020, y: 343 },
          { x: 2021, y: 1300 },
          { x: 2022, y: 1700 },
          { x: 2023, y: 600 },
          { x: 2024, y: 33 },
          { x: 2025, y: 600 },
          { x: 2026, y: 222 },
        ],
      },
      {
        category: 'Oranges',
        points: [
          { x: 2018, y: 2444 },
          { x: 2019, y: 222 },
          { x: 2019, y: 1500 },
          { x: 2021, y: 1000 },
          { x: 2022, y: 2433 },
          { x: 2023, y: 600 },
          { x: 2024, y: 2233 },
          { x: 2025, y: 2222 },
          { x: 2026, y: 4000 },
        ],
      },
        {
        category: 'Grapes',
        points: [
          { x: 2018, y: 2444 },
          { x: 2019, y: 222 },
          { x: 2019, y: 1123 },
          { x: 2021, y: 222 },
          { x: 2022, y: 233 },
          { x: 2023, y: 600 },
          { x: 2024, y: 2233 },
          { x: 2025, y: 4244 },
          { x: 2026, y: 123 },
        ],
      },
    ],
    options: {
      title: 'Fruit Sales',
      legend: true,
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

  // get years(): number[] {
  //   const yearsSet = new Set<number>();
  //   this.data?.series.forEach((serie) => {
  //     serie.points.forEach((point) => {
  //       const date = point.x instanceof Date ? point.x : new Date(point.x);
  //       yearsSet.add(date.getFullYear());
  //     });
  //   });
  //   return Array.from(yearsSet).sort();
  // }
  // filterData(data: LineChartData) {
  //   console.log(this.selectedYear);
  //   if (this.xGranularity === 'year') {
  //     this.filteredData = data;
  //     return;
  //   }
  //   this.filteredData = {
  //     series: data.series
  //       .map((serie: SeriesWithCategory) => ({
  //         ...serie,
  //         points: serie.points.filter((p: Point) => {
  //           const date = p.x instanceof Date ? p.x : new Date(p.x);
  //           return date.getFullYear() === Number(this.selectedYear);
  //         }),
  //       }))
  //       .filter((serie) => serie.points.length > 0),
  //   };
  //   console.log('filteredData:', this.filteredData);
  // }
}
