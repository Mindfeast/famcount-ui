import { Component, Input } from '@angular/core';
import { Series } from '../models/generic-chart.models';

@Component({
  selector: 'app-chart-legend',
  standalone: true,
  imports: [],
  templateUrl: './chart-legend.component.html',
  styleUrl: './chart-legend.component.scss',
})
export class ChartLegendComponent {
  @Input() data!: Series;
  @Input() color: string = '';
}
