import { Injectable, signal } from '@angular/core';
import { Order, OrderItem } from '../models/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSignal = signal<Order[]>(this.loadFromStorage());

  orders = this.ordersSignal.asReadonly();

  private loadFromStorage(): Order[] {
    const saved = localStorage.getItem('bike_motion_orders');
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      return parsed.map((order: Order) => ({
        ...order,
        date: new Date(order.date),
      }));
    } catch {
      return [];
    }
  }

  addOrder(items: OrderItem[], totalAmount: number): Order {
    const newOrder: Order = {
      id: `#BM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date(),
      items: [...items],
      totalAmount,
      status: 'Concluído',
    };

    const updatedOrders = [newOrder, ...this.ordersSignal()];
    this.ordersSignal.set(updatedOrders);
    localStorage.setItem('bike_motion_orders', JSON.stringify(updatedOrders));

    return newOrder;
  }
}
