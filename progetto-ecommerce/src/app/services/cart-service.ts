import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Order, Product, ShippingData } from '../models/product-model';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();

  readonly count = computed(() =>
    this._items().reduce((sum, i) => sum + i.qty, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.qty, 0)
  );

  add(product: Product): void {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...items, { product, qty: 1 }];
    });
  }

  remove(productId: number): void {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }

  updateQty(productId: number, qty: number): void {
    if (qty <= 0) {
      this.remove(productId);
      return;
    }
    this._items.update(items =>
      items.map(i => (i.product.id === productId ? { ...i, qty } : i))
    );
  }

  clear(): void {
    this._items.set([]);
  }

  async confirmOrder(shipping: ShippingData): Promise<{ orderId: number }> {
    const order: Order = {
      items: this._items(),
      shipping,
      total: this.total(),
    };
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      const result = await res.json();
      this.clear();
      return result;
    } catch (e) {
      console.error('Errore conferma ordine', e);
      // Demo: simula successo
      this.clear();
      return { orderId: Math.floor(Math.random() * 10000) };
    }
  }
}
