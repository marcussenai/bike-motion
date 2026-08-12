import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/products/product-list.component').then(
        (m) => m.ProductListComponent
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/products/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then(
        (m) => m.CartComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) 
  }
];