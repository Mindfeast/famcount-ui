// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { Point } from '../models/line-chart.model';
// import { createLinearScale } from '../../../util/createLinearScale';
// import { CommonModule } from '@angular/common';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { GeneralTooltipDirective } from '../../shared/general-tooltip.directive';

// @Component({
//   schemas: [],
//   selector: 'svg:g[app-bullet-point]',
//   standalone: true,
//   imports: [CommonModule, GeneralTooltipDirective],
//   styleUrl: './bullet-point.component.scss',
//   template: `
//     @for (point of points ?? []; track point.x) {
//     <svg:circle
//       [attr.cx]="getScaledX(point)"
//       [attr.cy]="yScale(point.y)"
//       r="3"
//       [attr.fill]="color"
//       class="bullet-point"
//       (mouseenter)="pointHover.emit(point)"
//       (mouseleave)="pointHover.emit(undefined)"
//       [tooltip]="tooltipText(point)"
//     />
//     }
//   `,
// })
// export class BulletPointComponent {
//   @Input() points: Point[] | null = null;
//   @Input() xScale!: (x: number) => number;
//   @Input() yScale!: (y: number) => number;
//   @Input() color: string = '';
//   @Input() legend!: { series: string; value: string };
//   @Output() pointHover = new EventEmitter<Point>();

//   getXValue(x: string | number | Date): number {
//     return typeof x === 'number' ? x : new Date(x).getTime();
//   }

//   getScaledX(point: Point): number {
//     const x =
//       typeof point.x === 'number'
//         ? point.x
//         : point.x instanceof Date
//         ? point.x.getTime()
//         : new Date(point.x).getTime();
//     return this.xScale(x);
//   }

//   get tooltipText() {
//     return (point: Point) => {
//       if (!point.y) return '';
//       const date =
//         point.x instanceof Date
//           ? point.x
//           : typeof point.x === 'number'
//           ? new Date(point.x)
//           : new Date(point.x);
//       const formattedDate = date.toLocaleDateString('en-GB'); // or use your preferred locale
//       return `Date: ${formattedDate} ${this.legend.value}: ${point.y}`;
//     };
//   }
// }
