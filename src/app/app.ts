import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="app-header">
      <div class="header-container">
        <a routerLink="/" class="logo">
          🚴 <span>BikeMotion</span>
        </a>

        <nav class="nav-links">
          <a routerLink="/" class="header-btn">
            Produtos
          </a>

          <a routerLink="/admin" class="header-btn">
            ⚙️ Admin
          </a>
          
          <a routerLink="/cart" class="header-btn">
            🛒 Carrinho
            @if (cartService.totalItems() > 0) {
              <span class="cart-badge">{{ cartService.totalItems() }}</span>
            }
          </a>

          @if (authService.isLoggedIn()) {
            <button (click)="authService.logout()" class="header-btn">
              🚪 Sair
            </button>
          } @else {
            <a routerLink="/login" class="header-btn">
              👤 Login
            </a>
          }
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.8rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.4rem;
      font-weight: 800;
      color: #1a1a1a;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo span {
      color: #00d1b2;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .header-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      height: 38px;
      padding: 0 1rem;
      background-color: #ffffff;
      border: 1px solid #dbe2ea;
      border-radius: 8px;
      color: #2d3748;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      box-sizing: border-box;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .header-btn:hover {
      background-color: #f7fafc;
      border-color: #cbd5e0;
      color: #00d1b2;
    }

    .cart-badge {
      background: #00d1b2;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 10px;
      padding: 0.1rem 0.45rem;
      margin-left: 0.2rem;
    }

    .main-content {
      min-height: calc(100vh - 70px);
    }
  `]
})
export class AppComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
}