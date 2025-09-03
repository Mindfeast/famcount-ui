import { Component, Input } from '@angular/core';
import { Point } from '../models/generic-chart.models';
import { getPathCommandsForLine } from '../../../util/getPathForLine';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svg:g[app-sparkchart-line]',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './sparkchart-line.component.scss',
  template: `<svg:path
    [attr.d]="d"
    stroke-width="1.5"
    [attr.stroke]="color"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  /> `,
})
export class SparkchartLineComponent {
  d: string = '';

  @Input() set points(points: Point[]) {
    this.d = getPathCommandsForLine(points);
  }
  @Input() color: string = 'blue';
}
