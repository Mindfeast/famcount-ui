import { Component, Input } from '@angular/core';
import { SeriesWithCategory } from '../models/spark.models';

@Component({
  selector: 'app-chart-legend',
  standalone: true,
  imports: [],
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss',
})
export class ChartLegendComponent {
  @Input() data!: SeriesWithCategory;
  @Input() color: string = '';
}
