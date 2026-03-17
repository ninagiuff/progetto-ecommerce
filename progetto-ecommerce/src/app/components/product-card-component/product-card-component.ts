import { Component, input,output} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product} from '../../models/product-model';
import { EsauritoDirective } from '../../directives/esaurito-directive';

@Component({
  selector: 'app-product-card-component',
  imports: [RouterLink, EsauritoDirective],
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css',
})
export class ProductCardComponent {
product = input.required<Product>();
  addToCart = output<Product>();

  onAdd(): void {
    this.addToCart.emit(this.product());
  }
}
