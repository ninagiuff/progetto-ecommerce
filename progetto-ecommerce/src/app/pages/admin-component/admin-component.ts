import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { AuthService } from '../../services/auth-service';
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-admin-component',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent implements OnInit {
  productSvc = inject(ProductService);
  auth = inject(AuthService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.productSvc.loadAll();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  async deleteProduct(p: Product): Promise<void> {
    if (confirm(`Eliminare "${p.name}"?`)) {
      await this.productSvc.delete(p.id);
    }
  }
}

