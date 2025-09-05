import { Component, Input } from '@angular/core';
import { Point } from '../models/generic-chart.models';
import { getPathCommandsForLine, getSmoothPath } from '../util/getPathForLine';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svg:g[app-sparkchart-line]',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './sparkchart-line.component.scss',
  template: `<svg:path
    [attr.d]="d"
    stroke-width="2"
    [attr.stroke]="color"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  /> `,
})
export class SparkchartLineComponent {
  public d: string = '';

  @Input() color: string = 'blue';
  @Input() smooth: boolean = true;

  @Input() set points(points: Point[]) {
    this.updatePath(points);
  }

  private updatePath(points: Point[]) {
    if (!points || points.length === 0) {
      this.d = '';
      return;
    }
    if (this.smooth) {
      const numericPoints = points.map((p) => ({
        x:
          typeof p.x === 'string'
            ? new Date(p.x).getTime()
            : p.x instanceof Date
            ? p.x.getTime()
            : p.x,
        y: p.y,
      }));
      this.d = getSmoothPath(numericPoints);
    } else {
      this.d = getPathCommandsForLine(points);
    }
  }
}
