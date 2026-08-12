import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-container">
      <h2 class="page-title">Finalizar Compra</h2>

      @if (orderCompleted) {
        <div class="success-card">
          <div class="success-icon">✓</div>
          <h3>Pedido Confirmado com Sucesso!</h3>
          <p>Obrigado por comprar na <strong>Bike Motion</strong>.</p>
          <p>Enviamos os detalhes do pedido e o código de rastreio para <strong>{{ customer.email }}</strong>.</p>
          <a routerLink="/" class="btn-home">Voltar ao Catálogo</a>
        </div>
      } @else if (cartService.items().length > 0) {
        <div class="checkout-grid">
          <form (ngSubmit)="onSubmit()" class="checkout-form">
            <h3>Dados Pessoais e de Entrega</h3>

            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" [(ngModel)]="customer.name" name="name" required placeholder="Seu nome completo" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>E-mail</label>
                <input type="email" [(ngModel)]="customer.email" name="email" required placeholder="seuemail@exemplo.com" />
              </div>
              <div class="form-group">
                <label>CPF</label>
                <input type="text" [(ngModel)]="customer.cpf" name="cpf" required placeholder="000.000.000-00" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Telefone / WhatsApp</label>
                <input type="text" [(ngModel)]="customer.phone" name="phone" required placeholder="(00) 00000-0000" />
              </div>
              <div class="form-group">
                <label>CEP</label>
                <input type="text" [(ngModel)]="customer.zip" name="zip" required placeholder="00000-000" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-2">
                <label>Endereço</label>
                <input type="text" [(ngModel)]="customer.address" name="address" required placeholder="Rua, Avenida, Número, Bairro" />
              </div>
              <div class="form-group">
                <label>Cidade / UF</label>
                <input type="text" [(ngModel)]="customer.city" name="city" required placeholder="Cidade - UF" />
              </div>
            </div>

            <h3>Forma de Pagamento</h3>
            <div class="payment-options">
              <label class="radio-card" [class.selected]="paymentMethod === 'pix'">
                <input type="radio" [(ngModel)]="paymentMethod" name="payment" value="pix" />
                <span>⚡ PIX (Aprovação Imediata)</span>
              </label>
              <label class="radio-card" [class.selected]="paymentMethod === 'credit'">
                <input type="radio" [(ngModel)]="paymentMethod" name="payment" value="credit" />
                <span>💳 Cartão de Crédito</span>
              </label>
              <label class="radio-card" [class.selected]="paymentMethod === 'boleto'">
                <input type="radio" [(ngModel)]="paymentMethod" name="payment" value="boleto" />
                <span>📄 Boleto Bancário</span>
              </label>
            </div>

            <button type="submit" class="btn-finish">Confirmar e Pagar</button>
          </form>

          <div class="order-summary">
            <h3>Resumo do Pedido</h3>
            <div class="summary-items">
              @for (item of cartService.items(); track item.bike.id) {
                <div class="summary-item">
                  <img [src]="item.bike.imageUrl" [alt]="item.bike.name" />
                  <div class="item-info">
                    <h4>{{ item.bike.name }}</h4>
                    <p>Qtd: {{ item.quantity }} × R$ {{ item.bike.price.toFixed(2) }}</p>
                  </div>
                  <span class="item-total">R$ {{ (item.bike.price * item.quantity).toFixed(2) }}</span>
                </div>
              }
            </div>

            <div class="summary-totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>R$ {{ cartService.totalPrice().toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>Frete</span>
                <span class="free-shipping">Grátis</span>
              </div>
              <div class="total-row final">
                <span>Total</span>
                <span>R$ {{ cartService.totalPrice().toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="empty-cart-msg">
          <p>Seu carrinho está vazio para finalizar a compra.</p>
          <a routerLink="/" class="btn-home">Ver Catálogo</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1100px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .page-title {
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
      color: #1a1a1a;
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 2rem;
    }

    .checkout-form, .order-summary, .success-card {
      background: white;
      padding: 1.8rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border: 1px solid #f0f0f0;
    }

    h3 {
      font-size: 1.15rem;
      margin-bottom: 1.2rem;
      color: #222;
      border-bottom: 2px solid #00d1b2;
      padding-bottom: 0.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .flex-2 {
      grid-column: span 1;
    }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #4a4a4a;
    }

    input[type="text"], input[type="email"] {
      padding: 0.7rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus {
      border-color: #00d1b2;
    }

    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin: 1rem 0 1.5rem 0;
    }

    .radio-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.8rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .radio-card.selected {
      border-color: #00d1b2;
      background-color: #f0fdfa;
    }

    .btn-finish {
      width: 100%;
      padding: 1rem;
      background-color: #00d1b2;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.05rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-finish:hover {
      background-color: #00b89c;
    }

    .summary-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 320px;
      overflow-y: auto;
      margin-bottom: 1.2rem;
      padding-right: 0.3rem;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.8rem;
    }

    .summary-item img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      border-radius: 6px;
      background: #fafafa;
      border: 1px solid #eee;
    }

    .item-info {
      flex: 1;
    }

    .item-info h4 {
      font-size: 0.9rem;
      margin: 0;
      color: #222;
    }

    .item-info p {
      font-size: 0.8rem;
      color: #777;
      margin-top: 0.2rem;
    }

    .item-total {
      font-weight: 700;
      font-size: 0.9rem;
    }

    .summary-totals {
      border-top: 1px solid #eee;
      padding-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: #555;
    }

    .free-shipping {
      color: #10b981;
      font-weight: 600;
    }

    .total-row.final {
      font-size: 1.2rem;
      font-weight: 800;
      color: #00d1b2;
      margin-top: 0.4rem;
      border-top: 1px solid #eee;
      padding-top: 0.6rem;
    }

    .success-card {
      text-align: center;
      padding: 3rem 1.5rem;
    }

    .success-icon {
      width: 70px;
      height: 70px;
      background: #10b981;
      color: white;
      font-size: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
    }

    .btn-home {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.8rem 1.8rem;
      background: #00d1b2;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
    }

    .empty-cart-msg {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    @media (max-width: 768px) {
      .checkout-grid {
        grid-template-columns: 1fr;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);

  orderCompleted = false;
  paymentMethod = 'pix';

  customer = {
    name: '',
    email: '',
    cpf: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  };

  onSubmit() {
    if (this.cartService.items().length > 0) {
      this.orderCompleted = true;
      this.cartService.clearCart();
    }
  }
}