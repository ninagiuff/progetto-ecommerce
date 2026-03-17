import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component';
import { LoginComponent } from './pages/login-component/login-component';
import { AdminComponent } from './pages/admin-component/admin-component';
import { ProductDetailComponent } from './components/product-detail-component/product-detail-component';
import { CartComponent } from './components/cart-component/cart-component';
import { CheckoutComponent } from './components/checkout-component/checkout-component';
import { ProductFormComponent } from './components/product-form-component/product-form-component';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '',              component: HomeComponent },
  { path: 'prodotto/:id',  component: ProductDetailComponent },
  { path: 'carrello',      component: CartComponent },
  { path: 'checkout',      component: CheckoutComponent },
  { path: 'login',         component: LoginComponent },
  { path: 'admin', canActivate: [adminGuard], component: AdminComponent,
    children: [
      { path: 'prodotto/nuovo', component: ProductFormComponent },
      { path: 'prodotto/:id',   component: ProductFormComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
