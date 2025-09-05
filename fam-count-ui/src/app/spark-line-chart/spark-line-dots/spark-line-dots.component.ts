import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Point } from '../models/generic-chart.models';
import { CommonModule } from '@angular/common';
import { GeneralTooltipDirective } from '../../shared/general-tooltip.directive';

@Component({
  selector: 'svg:g[app-spark-line-dots]',
  standalone: true,
  imports: [CommonModule, GeneralTooltipDirective],
  styleUrl: './spark-line-dots.component.scss',
  template: `
    <svg>
      <g>
        @for (point of filteredPoints; track point.x) {
        <circle
          [attr.cx]="point.x"
          [attr.cy]="point.y"
          r="8"
          fill="transparent"
          (mouseenter)="hovered = point"
          (mouseleave)="hovered = undefined"
          style="cursor: pointer;"
        />
        <svg:circle
          [attr.cx]="point.x"
          [attr.cy]="point.y"
          [attr.r]="hovered === point ? 7 : 2"
          [attr.fill]="color"
          class="dots"
          [tooltip]="point.tooltip || ''"
        />
        }
      </g>
    </svg>
  `,
})
export class SparkLineDotsComponent {
  @Input() points: Point[] = [];

  @Input() color: string = 'blue';
  @Output() pointHover = new EventEmitter<Point>();

  hovered?: Point;

  get filteredPoints(): Point[] {
    const getX = (p: Point) =>
      typeof p.x === 'number'
        ? p.x
        : p.x instanceof Date
        ? p.x.getTime()
        : new Date(p.x).getTime();

    if (!this.points.length) return [];

    const minX = Math.min(...this.points.map(getX));
    const maxX = Math.max(...this.points.map(getX));

    return this.points.filter((point) => {
      const px = getX(point);
      const isFirst = px === minX;
      const isLast = px === maxX;
      return !(isFirst && point.x === minX) && !(isLast && point.x === maxX);
    });
  }
}
