import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h2>Seu Carrinho</h2>

      @if (cartService.items().length === 0) {
        <div class="empty-cart">
          <p>Seu carrinho está vazio.</p>
          <a routerLink="/" class="btn-primary">Ver Produtos</a>
        </div>
      } @else {
        <div class="cart-content">
          <div class="cart-items">
            @for (item of cartService.items(); track item.bike.id) {
              <div class="cart-item">
                <img [src]="item.bike.imageUrl" [alt]="item.bike.name" class="item-img" />
                
                <div class="item-info">
                  <h3>{{ item.bike.name }}</h3>
                  <p class="price">R$ {{ item.bike.price.toFixed(2) }}</p>
                  <p class="stock-info">Estoque disponível: {{ item.bike.stock }}</p>
                </div>

                <div class="quantity-controls">
                  <button 
                    (click)="cartService.updateQuantity(item.bike.id, item.quantity - 1, item.bike.stock)"
                    class="btn-qty"
                  >
                    -
                  </button>
                  
                  <span class="quantity">{{ item.quantity }}</span>
                  
                  <button 
                    (click)="cartService.updateQuantity(item.bike.id, item.quantity + 1, item.bike.stock)"
                    [disabled]="item.quantity >= item.bike.stock"
                    class="btn-qty"
                  >
                    +
                  </button>
                </div>

                <div class="item-total">
                  <span>R$ {{ (item.bike.price * item.quantity).toFixed(2) }}</span>
                </div>

                <button (click)="cartService.removeFromCart(item.bike.id)" class="btn-remove">
                  &times;
                </button>
              </div>
            }
          </div>

          <div class="cart-summary">
            <h3>Resumo do Pedido</h3>
            <div class="summary-row">
              <span>Total de itens:</span>
              <span>{{ cartService.totalItems() }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>R$ {{ cartService.totalPrice().toFixed(2) }}</span>
            </div>
            <a routerLink="/checkout" class="btn-checkout">Finalizar Compra</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
    .cart-content { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
    .cart-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #eee; }
    .item-img { width: 80px; height: 80px; object-fit: contain; }
    .item-info { flex: 1; }
    .stock-info { font-size: 0.8rem; color: #718096; margin-top: 0.2rem; }
    .quantity-controls { display: flex; align-items: center; gap: 0.5rem; }
    .btn-qty { width: 32px; height: 32px; border: 1px solid #ddd; background: #fff; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .btn-qty:disabled { opacity: 0.4; cursor: not-allowed; background: #e2e8f0; }
    .quantity { font-weight: bold; min-width: 20px; text-align: center; }
    .item-total { font-weight: bold; min-width: 100px; text-align: right; }
    .btn-remove { background: none; border: none; font-size: 1.5rem; color: #ef4444; cursor: pointer; }
    .cart-summary { background: #f8fafc; padding: 1.5rem; border-radius: 12px; height: fit-content; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .summary-row.total { font-weight: bold; font-size: 1.2rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
    .btn-checkout { display: block; width: 100%; text-align: center; background: #00d1b2; color: #fff; padding: 0.8rem; border-radius: 8px; text-decoration: none; font-weight: bold; }
    .empty-cart { text-align: center; padding: 3rem; }
    .btn-primary { display: inline-block; margin-top: 1rem; background: #00d1b2; color: #fff; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
}