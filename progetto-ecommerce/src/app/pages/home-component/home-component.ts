import { Component, OnInit, inject } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-home-component',
  imports: [ProductCardComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  productSvc = inject(ProductService);
  private cartSvc = inject(CartService);

  async ngOnInit(): Promise<void> {
    await this.productSvc.loadAll();
  }

  onAddToCart(product: Product): void {
    this.cartSvc.add(product);
  }
}
