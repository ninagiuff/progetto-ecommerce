import { Directive, ElementRef, OnInit, Renderer2, input} from '@angular/core';

@Directive({
  selector: '[appEsaurito]',
  standalone: true,
})
export class EsauritoDirective implements OnInit {
  appEsaurito = input.required<number>(); // quantity

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.appEsaurito() === 0) {
      this.applyEsaurito();
    }
  }

  private applyEsaurito(): void {
    const host = this.el.nativeElement as HTMLElement;
    this.renderer.setStyle(host, 'position', 'relative');

    // Badge "Esaurito"
    const badge = this.renderer.createElement('span') as HTMLElement;
    this.renderer.setProperty(badge, 'textContent', 'ESAURITO');
    this.renderer.setStyle(badge, 'position', 'absolute');
    this.renderer.setStyle(badge, 'top', '12px');
    this.renderer.setStyle(badge, 'right', '12px');
    this.renderer.setStyle(badge, 'background', '#1a1a1a');
    this.renderer.setStyle(badge, 'color', '#fff');
    this.renderer.setStyle(badge, 'fontSize', '10px');
    this.renderer.setStyle(badge, 'fontWeight', '700');
    this.renderer.setStyle(badge, 'letterSpacing', '0.15em');
    this.renderer.setStyle(badge, 'padding', '4px 10px');
    this.renderer.setStyle(badge, 'borderRadius', '2px');
    this.renderer.setStyle(badge, 'zIndex', '10');
    this.renderer.setStyle(badge, 'fontFamily', 'inherit');
    this.renderer.appendChild(host, badge);

    // Overlay grigio
    const overlay = this.renderer.createElement('div') as HTMLElement;
    this.renderer.setStyle(overlay, 'position', 'absolute');
    this.renderer.setStyle(overlay, 'inset', '0');
    this.renderer.setStyle(overlay, 'background', 'rgba(255,255,255,0.6)');
    this.renderer.setStyle(overlay, 'borderRadius', 'inherit');
    this.renderer.setStyle(overlay, 'zIndex', '5');
    this.renderer.appendChild(host, overlay);

    // Disabilita pulsante acquisto
    const btn = host.querySelector<HTMLButtonElement>('[data-buy-btn]');
    if (btn) {
      this.renderer.setAttribute(btn, 'disabled', 'true');
      this.renderer.setStyle(btn, 'opacity', '0.4');
      this.renderer.setStyle(btn, 'cursor', 'not-allowed');
    }
  }
}
