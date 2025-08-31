import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LineChartComponent } from './line-chart/line-chart.component';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

export interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LineChartComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'fam-count-ui';

  points$: Observable<Point[][]> = of([
    [
      { x: 2018, y: 1200 },
      { x: 2019, y: 1500 },
      { x: 2020, y: 1100 },
      { x: 2021, y: 1000 },
      { x: 2022, y: 1700 },
      { x: 2023, y: 600 },
      { x: 2024, y: 33 },
      { x: 2025, y: 600 },
      { x: 2026, y: 222 },
    ],
    [
      { x: 2018, y: 2444 },
      { x: 2019, y: 222 },
      { x: 2020, y: 4242 },
      { x: 2021, y: 1000 },
      { x: 2022, y: 2433 },
      { x: 2023, y: 600 },
      { x: 2024, y: 2233 },
      { x: 2025, y: 2222 },
      { x: 2026, y: 4000 },
    ],
    [
      { x: 2018, y: 222 },
      { x: 2019, y: 222 },
      { x: 2020, y: 12 },
      { x: 2021, y: 2333 },
      { x: 2022, y: 2433 },
      { x: 2023, y: 222 },
      { x: 2024, y: 2444 },
      { x: 2025, y: 600 },
      { x: 2026, y: 600 },
    ],
  ]);
}
