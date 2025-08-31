import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[tooltip]',
  standalone: true,
})
export class GeneralTooltipDirective {
  @Input('tooltip') tooltipText = '';
  tooltipDiv?: HTMLDivElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    this.tooltipDiv = this.renderer.createElement('div');
    this.tooltipDiv!.textContent = this.tooltipText;
    this.renderer.addClass(this.tooltipDiv, 'tooltip');

    // Position the tooltip near the mouse
    this.renderer.setStyle(this.tooltipDiv, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipDiv, 'left', event.clientX + 12 + 'px');
    this.renderer.setStyle(this.tooltipDiv, 'top', event.clientY - 24 + 'px');
    this.renderer.setStyle(this.tooltipDiv, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipDiv, 'pointer-events', 'none');

    document.body.appendChild(this.tooltipDiv!);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.tooltipDiv) {
      this.renderer.setStyle(
        this.tooltipDiv,
        'left',
        event.clientX + 12 + 'px'
      );
      this.renderer.setStyle(this.tooltipDiv, 'top', event.clientY - 24 + 'px');
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipDiv) {
      this.tooltipDiv.remove();
      this.tooltipDiv = undefined;
    }
  }
}
