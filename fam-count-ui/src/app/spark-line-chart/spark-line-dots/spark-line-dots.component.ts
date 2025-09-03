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
    @for (point of points; track point.x) {
    <svg:circle
      [attr.cx]="point.x"
      [attr.cy]="point.y"
      r="4"
      [attr.fill]="color"
      class="dots"
      (mouseenter)="pointHover.emit(point)"
      (mouseleave)="pointHover.emit(undefined)"
      [tooltip]="point.tooltip || ''"
    />
    }
  `,
})
export class SparkLineDotsComponent {
  @Input() points: Point[] = [];
  @Input() color: string = 'blue';
  @Output() pointHover = new EventEmitter<Point>();
}
