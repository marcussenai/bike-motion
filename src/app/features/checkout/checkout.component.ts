import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="checkout-container">
      <h2>Finalizar Compra</h2>

      <form [formGroup]="checkoutForm" (ngSubmit)="processOrder()">
        <div class="form-group">
          <label for="checkout-name">Nome Completo</label>
          <input
            id="checkout-name"
            type="text"
            formControlName="name"
            [class.invalid]="isFieldInvalid('name')"
            placeholder="Seu nome completo"
          />
          @if (isFieldInvalid('name')) {
            <span class="error-msg">Informe o nome completo (mínimo de 3 letras).</span>
          }
        </div>

        <div class="form-group">
          <label for="checkout-email">E-mail</label>
          <input
            id="checkout-email"
            type="email"
            formControlName="email"
            [class.invalid]="isFieldInvalid('email')"
            placeholder="exemplo@email.com"
          />
          @if (isFieldInvalid('email')) {
            <span class="error-msg">Digite um e-mail válido.</span>
          }
        </div>

        <div class="form-group">
          <label for="checkout-cpf">CPF</label>
          <input
            id="checkout-cpf"
            type="text"
            formControlName="cpf"
            [class.invalid]="isFieldInvalid('cpf')"
            placeholder="Apenas números (11 dígitos)"
            maxlength="11"
          />
          @if (isFieldInvalid('cpf')) {
            <span class="error-msg">Informe um CPF válido com 11 dígitos.</span>
          }
        </div>

        <div class="form-group">
          <label for="checkout-zip">CEP</label>
          <input
            id="checkout-zip"
            type="text"
            formControlName="zip"
            [class.invalid]="isFieldInvalid('zip')"
            placeholder="Apenas números (8 dígitos)"
            maxlength="8"
          />
          @if (isFieldInvalid('zip')) {
            <span class="error-msg">Informe um CEP válido com 8 dígitos.</span>
          }
        </div>

        <div class="form-group">
          <label for="checkout-address">Endereço</label>
          <input
            id="checkout-address"
            type="text"
            formControlName="address"
            [class.invalid]="isFieldInvalid('address')"
            placeholder="Rua, Avenida, etc."
          />
          @if (isFieldInvalid('address')) {
            <span class="error-msg">O endereço é obrigatório.</span>
          }
        </div>

        <div class="form-group">
          <label for="checkout-number">Número</label>
          <input
            id="checkout-number"
            type="text"
            formControlName="number"
            [class.invalid]="isFieldInvalid('number')"
            placeholder="Nº da residência"
          />
          @if (isFieldInvalid('number')) {
            <span class="error-msg">O número é obrigatório.</span>
          }
        </div>

        <div class="form-group">
          <label for="checkout-city">Cidade</label>
          <input
            id="checkout-city"
            type="text"
            formControlName="city"
            [class.invalid]="isFieldInvalid('city')"
            placeholder="Sua cidade"
          />
          @if (isFieldInvalid('city')) {
            <span class="error-msg">A cidade é obrigatória.</span>
          }
        </div>

        <button type="submit" class="btn-submit" [disabled]="cartService.items().length === 0">
          Confirmar Pedido
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .checkout-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }
      .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.2rem;
      }
      label {
        font-weight: 600;
        margin-bottom: 0.4rem;
        color: #2d3748;
      }
      input {
        padding: 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s ease;
      }
      input:focus {
        border-color: #3182ce;
      }
      input.invalid {
        border-color: #e53e3e !important;
        background-color: #fff5f5;
      }
      .error-msg {
        color: #e53e3e;
        font-size: 0.85rem;
        margin-top: 0.3rem;
      }
      .btn-submit {
        width: 100%;
        padding: 0.9rem;
        background-color: #00d1b2;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin-top: 1rem;
      }
      .btn-submit:hover:not(:disabled) {
        background-color: #00b89c;
      }
      .btn-submit:disabled {
        background-color: #a0aec0;
        cursor: not-allowed;
      }
    `,
  ],
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);

  checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    zip: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    address: ['', [Validators.required]],
    number: ['', [Validators.required]],
    city: ['', [Validators.required]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  processOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const items = this.cartService.items();
    if (items.length === 0) return;

    const totalAmount = this.cartService.totalPrice();

    this.orderService.addOrder(items, totalAmount);
    this.cartService.clearCart();
    this.router.navigate(['/meus-pedidos']);
  }
}
