import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  template: `
    <div class="history-container">
      <h2>📋 Meu Histórico de Compras</h2>

      @if (orderService.orders().length === 0) {
        <div class="empty-state">
          <p>Você ainda não realizou nenhum pedido.</p>
          <a routerLink="/" class="btn-shop">Ir para as Compras</a>
        </div>
      } @else {
        <div class="orders-list">
          @for (order of orderService.orders(); track order.id) {
            <div class="order-card">
              <div class="order-header">
                <div>
                  <span class="order-id">{{ order.id }}</span>
                  <span class="order-date">{{ order.date | date: 'dd/MM/yyyy às HH:mm' }}</span>
                </div>
                <span class="order-status" [class.completed]="order.status === 'Concluído'">
                  {{ order.status }}
                </span>
              </div>

              <div class="order-items">
                @for (item of order.items; track item.bike.id) {
                  <div class="item-row">
                    <img [src]="item.bike.imageUrl" [alt]="item.bike.name" class="item-img" />
                    <div class="item-details">
                      <span class="item-title">{{ item.bike.name }}</span>
                      <span class="item-qty">Qtd: {{ item.quantity }}</span>
                    </div>
                    <span class="item-price">
                      {{ item.bike.price * item.quantity | currency: 'BRL' : 'symbol' : '1.2-2' }}
                    </span>
                  </div>
                }
              </div>

              <div class="order-footer">
                <span>Total Pago:</span>
                <strong class="total-value">
                  {{ order.totalAmount | currency: 'BRL' : 'symbol' : '1.2-2' }}
                </strong>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .history-container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
      h2 {
        color: #1a202c;
        margin-bottom: 1.5rem;
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: #f7fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      .btn-shop {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.6rem 1.2rem;
        background-color: #00d1b2;
        color: #fff;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
      }
      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .order-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      }
      .order-header {
        background: #f8fafc;
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .order-id {
        font-weight: 700;
        color: #2d3748;
        margin-right: 1rem;
      }
      .order-date {
        color: #718096;
        font-size: 0.85rem;
      }
      .order-status {
        padding: 0.25rem 0.6rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        background: #edf2f7;
        color: #4a5568;
      }
      .order-status.completed {
        background: #e6fffa;
        color: #234e52;
      }
      .order-items {
        padding: 1rem;
      }
      .item-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #edf2f7;
      }
      .item-row:last-child {
        border-bottom: none;
      }
      .item-img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
      }
      .item-details {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .item-title {
        font-weight: 600;
        color: #2d3748;
      }
      .item-qty {
        font-size: 0.85rem;
        color: #718096;
      }
      .item-price {
        font-weight: 600;
        color: #2d3748;
      }
      .order-footer {
        padding: 1rem;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.05rem;
      }
      .total-value {
        color: #00d1b2;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class OrderHistoryComponent {
  orderService = inject(OrderService);
}
