import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-checkout-component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout-component.html',
  styleUrl: './checkout-component.css',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cart = inject(CartService);

  orderDone = signal(false);
  orderId = signal<number | null>(null);
  submitting = signal(false);

  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    country: ['', Validators.required],
  });

  isInvalid(field: string): boolean {
    const ctrl = this.checkoutForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    try {
      const result = await this.cart.confirmOrder(this.checkoutForm.value as any);
      this.orderId.set(result.orderId);
      this.orderDone.set(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
