import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="cart-container">
      <h2>🛒 Seu Carrinho de Compras</h2>

      <div class="cart-layout">
        <div class="cart-items">
          @for (item of cartService.items(); track item.id) {
            <div class="cart-item">
              <img [src]="item.imageUrl" [alt]="item.name" class="item-img" />

              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p class="item-price">R$ {{ item.price.toFixed(2) }}</p>
              </div>

              <div class="item-qty">
                <button
                  (click)="cartService.updateQuantity(item.id, item.quantity - 1)"
                  class="btn-qty"
                >
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button
                  (click)="cartService.updateQuantity(item.id, item.quantity + 1)"
                  class="btn-qty"
                >
                  +
                </button>
              </div>

              <div class="item-total">R$ {{ (item.price * item.quantity).toFixed(2) }}</div>

              <button
                (click)="cartService.removeFromCart(item.id)"
                class="btn-remove"
                title="Remover item"
              >
                🗑️
              </button>
            </div>
          } @empty {
            <div class="empty-cart">
              <p>Seu carrinho está vazio.</p>
              <a routerLink="/products" class="btn-continue">Ver produtos</a>
            </div>
          }
        </div>

        @if (cartService.items().length > 0) {
          <div class="cart-summary">
            <h3>Resumo do Pedido</h3>

            <div class="coupon-box">
              <label for="couponInput">Possui um cupom?</label>

              @if (!cartService.appliedCoupon()) {
                <div class="coupon-input-group">
                  <input
                    type="text"
                    id="couponInput"
                    [(ngModel)]="couponCodeInput"
                    placeholder="Digite o código"
                    (keyup.enter)="handleApplyCoupon()"
                  />
                  <button (click)="handleApplyCoupon()" class="btn-apply-coupon">Aplicar</button>
                </div>
              } @else {
                <div class="applied-coupon-tag">
                  <span
                    >🎟️ <strong>{{ cartService.appliedCoupon()?.code }}</strong> ({{
                      cartService.appliedCoupon()?.discountPercent
                    }}% OFF)</span
                  >
                  <button
                    (click)="cartService.removeCoupon()"
                    class="btn-remove-coupon"
                    title="Remover cupom"
                  >
                    ✕
                  </button>
                </div>
              }

              @if (cartService.couponError()) {
                <p class="coupon-error">{{ cartService.couponError() }}</p>
              }
            </div>

            <hr class="divider" />

            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>R$ {{ cartService.subtotal().toFixed(2) }}</span>
              </div>

              @if (cartService.appliedCoupon()) {
                <div class="summary-row discount">
                  <span>Desconto ({{ cartService.appliedCoupon()?.discountPercent }}%):</span>
                  <span>- R$ {{ cartService.discountValue().toFixed(2) }}</span>
                </div>
              }

              <div class="summary-row total">
                <span>Total:</span>
                <span>R$ {{ cartService.total().toFixed(2) }}</span>
              </div>
            </div>

            <button (click)="checkout()" class="btn-checkout">Ir para o Pagamento</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .cart-container {
        max-width: 1100px;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      h2 {
        margin-bottom: 1.5rem;
        color: #1a202c;
      }

      .cart-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      @media (min-width: 768px) {
        .cart-layout {
          grid-template-columns: 2fr 1fr;
        }
      }

      .cart-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .cart-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: #ffffff;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }

      .item-img {
        width: 60px;
        height: 60px;
        object-fit: contain;
      }

      .item-info {
        flex: 1;
      }

      .item-info h4 {
        margin: 0 0 0.3rem 0;
        color: #2d3748;
      }

      .item-price {
        margin: 0;
        color: #718096;
        font-size: 0.9rem;
      }

      .item-qty {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-qty {
        background: #edf2f7;
        border: 1px solid #cbd5e0;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
      }

      .btn-qty:hover {
        background: #e2e8f0;
      }

      .item-total {
        font-weight: bold;
        color: #2b6cb0;
      }

      .btn-remove {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
      }

      .empty-cart {
        background: #f7fafc;
        padding: 3rem;
        text-align: center;
        border-radius: 8px;
        color: #718096;
      }

      .btn-continue {
        display: inline-block;
        margin-top: 1rem;
        color: #00d1b2;
        text-decoration: none;
        font-weight: bold;
      }

      .cart-summary {
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        height: fit-content;
      }

      .cart-summary h3 {
        margin-top: 0;
        margin-bottom: 1.2rem;
        color: #1a202c;
      }

      .coupon-box {
        margin-bottom: 1rem;
      }

      .coupon-box label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        color: #4a5568;
        margin-bottom: 0.4rem;
      }

      .coupon-input-group {
        display: flex;
        gap: 0.5rem;
      }

      .coupon-input-group input {
        flex: 1;
        padding: 0.55rem 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        font-size: 0.9rem;
        outline: none;
        text-transform: uppercase;
      }

      .coupon-input-group input:focus {
        border-color: #00d1b2;
      }

      .btn-apply-coupon {
        background: #2b6cb0;
        color: #ffffff;
        border: none;
        padding: 0.55rem 1rem;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-apply-coupon:hover {
        background: #2c5282;
      }

      .applied-coupon-tag {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #e6fffa;
        border: 1px solid #b2f5ea;
        color: #234e52;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.9rem;
      }

      .btn-remove-coupon {
        background: transparent;
        border: none;
        color: #e53e3e;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
      }

      .coupon-error {
        color: #e53e3e;
        font-size: 0.8rem;
        margin: 0.4rem 0 0 0;
      }

      .divider {
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 1.2rem 0;
      }

      .summary-details {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        margin-bottom: 1.5rem;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        color: #4a5568;
        font-size: 0.95rem;
      }

      .summary-row.discount {
        color: #38a169;
        font-weight: 600;
      }

      .summary-row.total {
        font-size: 1.2rem;
        font-weight: bold;
        color: #1a202c;
        margin-top: 0.4rem;
      }

      .btn-checkout {
        width: 100%;
        background: #00d1b2;
        color: #ffffff;
        border: none;
        padding: 0.8rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-checkout:hover {
        background: #00b89f;
      }
    `,
  ],
})
export class CartComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  couponCodeInput = '';

  handleApplyCoupon() {
    if (this.cartService.applyCoupon(this.couponCodeInput)) {
      this.couponCodeInput = '';
    }
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
