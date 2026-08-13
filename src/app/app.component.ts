import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { FavoriteService } from './core/services/favorite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="header">
      <div class="logo">
        <a routerLink="/">Bike Motion</a>
      </div>
      <nav class="nav-links">
        <a routerLink="/">Catálogo</a>

        <a routerLink="/favoritos" class="nav-item">
          ❤️ Favoritos
          @if (favoriteService.totalFavorites() > 0) {
            <span class="badge">{{ favoriteService.totalFavorites() }}</span>
          }
        </a>

        <a routerLink="/cart" class="nav-item">
          🛒 Carrinho
          @if (cartService.totalItems() > 0) {
            <span class="badge">{{ cartService.totalItems() }}</span>
          }
        </a>

        @if (authService.currentUser()) {
          <a routerLink="/meus-pedidos" class="header-btn">📦 Pedidos</a>
          <span class="user-greeting"
            >Olá, {{ getUserDisplayName(authService.currentUser()) }}!</span
          >
          <button (click)="authService.logout()" class="logout-btn">Sair</button>
        } @else {
          <a routerLink="/login" class="login-btn">Entrar / Login</a>
        }
      </nav>
    </header>

    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .header {
        background-color: #1a202c;
        color: #ffffff;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .logo a {
        font-size: 1.5rem;
        font-weight: 700;
        color: #00d1b2;
        text-decoration: none;
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: 1.2rem;
      }
      .nav-links a {
        color: #e2e8f0;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
      }
      .nav-links a:hover {
        color: #00d1b2;
      }
      .nav-item {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
      .badge {
        background-color: #00d1b2;
        color: #1a202c;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.15rem 0.45rem;
        border-radius: 9999px;
      }
      .header-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
      }
      .user-greeting {
        color: #00d1b2;
        font-weight: 600;
        font-size: 0.95rem;
      }
      .logout-btn {
        background: transparent;
        border: 1px solid #e53e3e;
        color: #e53e3e;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }
      .logout-btn:hover {
        background: #e53e3e;
        color: #ffffff;
      }
      .login-btn {
        background-color: #00d1b2;
        color: #1a202c !important;
        padding: 0.4rem 0.9rem;
        border-radius: 6px;
        font-weight: 600;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.5rem 1rem;
        min-height: calc(100vh - 80px);
      }
    `,
  ],
})
export class AppComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  favoriteService = inject(FavoriteService);

  getUserDisplayName(emailOrName: string | null): string {
    if (!emailOrName) return 'Usuário';

    if (emailOrName.includes('@')) {
      const namePart = emailOrName.split('@')[0];
      const formatted = namePart.replace(/[._-]/g, ' ');
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    return emailOrName;
  }
}
