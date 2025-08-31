import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Point } from '../app.component';
import { createLinearScale } from '../../helpers/createLinearScale';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeneralTooltipDirective } from '../shared/general-tooltip.directive';

@Component({
  schemas: [],
  selector: 'svg:g[app-bullet-point]',
  standalone: true,
  imports: [CommonModule, GeneralTooltipDirective],
  styleUrl: './bullet-point.component.scss',
  template: `
    @for (point of points ?? []; track point.x) {
    <svg:circle
      [attr.cx]="xScale(point.x)"
      [attr.cy]="yScale(point.y)"
      r="3"
      [attr.fill]="color"
      class="bullet-point"
      (mouseenter)="pointHover.emit(point)"
      (mouseleave)="pointHover.emit(undefined)"
      [tooltip]="tooltipText(point)"
    />
    }
  `,
})
export class BulletPointComponent {
  @Input() points: Point[] | null = null;
  @Input() xScale!: (x: number) => number;
  @Input() yScale!: (y: number) => number;
  @Input() color: string = '';
  @Input() legend!: { series: string; value: string };
  @Output() pointHover = new EventEmitter<Point>();

  get tooltipText() {
    return (point: Point) => {
      return point.y
        ? `${this.legend.series}: ${point.x.toString()} ${
            this.legend.value
          }: ${point.y.toString()}`
        : '';
    };
  }

  ngOnInit() {
    console.log(this.points);
  }
}
