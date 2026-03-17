import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product-model';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const res = await fetch(`${API}/products`);
      const data: Product[] = await res.json();
      this._products.set(data);
    } catch (e) {
      console.error('Errore caricamento prodotti', e);
      // Fallback dati demo
      this._products.set(DEMO_PRODUCTS);
    } finally {
      this._loading.set(false);
    }
  }

  async getById(id: number): Promise<Product | null> {
    try {
      const res = await fetch(`${API}/products/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return DEMO_PRODUCTS.find(p => p.id === id) ?? null;
    }
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const created: Product = await res.json();
    this._products.update(list => [...list, created]);
    return created;
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const updated: Product = await res.json();
    this._products.update(list => list.map(p => (p.id === id ? updated : p)));
    return updated;
  }

  async delete(id: number): Promise<void> {
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    this._products.update(list => list.filter(p => p.id !== id));
  }
}

const DEMO_PRODUCTS: Product[] = [
  { id: 1, name: 'Orologio Minimalista', description: 'Design épuré con movimento svizzero. Cassa in acciaio satinato 40mm.', price: 249, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Accessori' },
  { id: 2, name: 'Borsa in Pelle', description: 'Pelle italiana vegetale conciata. Capiente e versatile, artigianale.', price: 189, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', category: 'Borse' },
  { id: 3, name: 'Sneakers Urban', description: 'Tomaia in mesh tecnico, suola in gomma riciclata. Comfort assoluto.', price: 129, quantity: 0, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Scarpe' },
  { id: 4, name: 'Occhiali Vintage', description: 'Montatura in acetato handmade. Lenti polarizzate UV400.', price: 95, quantity: 8, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category: 'Accessori' },
  { id: 5, name: 'Cappello Fedora', description: 'Feltro di lana merino. Forma classica, tesa media. Made in Italy.', price: 75, quantity: 0, imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400', category: 'Cappelli' },
  { id: 6, name: 'Cintura Intrecciata', description: 'Pelle bovina piena fiore. Lavorazione intrecciata artigianale.', price: 65, quantity: 12, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Accessori' },
];
