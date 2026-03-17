import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product-model';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-form-component',
  imports: [FormsModule, RouterLink],
  templateUrl: './product-form-component.html',
  styleUrl: './product-form-component.css',
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productSvc = inject(ProductService);

  isEdit = signal(false);
  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  formData: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
    category: 'Accessori',
  };

  private editId: number | null = null;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId = Number(id);
      const p = await this.productSvc.getById(this.editId);
      if (p) {
        const { id: _, ...rest } = p;
        this.formData = { ...rest };
      }
    }
  }

  async onSubmit(f: NgForm): Promise<void> {
    if (f.invalid) return;
    this.saving.set(true);
    this.errorMsg.set('');
    try {
      if (this.isEdit() && this.editId) {
        await this.productSvc.update(this.editId, this.formData);
        this.successMsg.set('Prodotto aggiornato con successo!');
      } else {
        await this.productSvc.create(this.formData);
        this.successMsg.set('Prodotto creato con successo!');
        f.resetForm({ category: 'Accessori' });
      }
      setTimeout(() => this.router.navigate(['/admin']), 1500);
    } catch (e) {
      this.errorMsg.set('Errore durante il salvataggio.');
    } finally {
      this.saving.set(false);
    }
  }
}

