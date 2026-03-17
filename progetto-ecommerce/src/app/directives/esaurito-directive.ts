import { Directive, ElementRef, OnInit, input } from '@angular/core';

@Directive({
  selector: '[appEsaurito]',
  standalone: true,
})
export class EsauritoDirective implements OnInit {
  appEsaurito = input.required<number>();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.appEsaurito() === 0) {
      const host = this.el.nativeElement as HTMLElement;
      host.style.opacity = '0.6';

      const btn = host.querySelector<HTMLButtonElement>('[data-buy-btn]');
      if (btn) {
        btn.disabled = true;
      }
    }
  }
}
