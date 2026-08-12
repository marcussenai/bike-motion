import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  bike: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  items = this.cartItems.asReadonly();

  totalItems = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.bike.price * item.quantity, 0)
  );

  addToCart(bike: any) {
    const current = this.cartItems();
    const existingIndex = current.findIndex(item => item.bike.id === bike.id);

    if (existingIndex > -1) {
      const currentQty = current[existingIndex].quantity;
      if (currentQty < bike.stock) {
        const updated = [...current];
        updated[existingIndex].quantity += 1;
        this.cartItems.set(updated);
      }
    } else {
      if (bike.stock > 0) {
        this.cartItems.set([...current, { bike, quantity: 1 }]);
      }
    }
  }

  updateQuantity(bikeId: number | string, newQuantity: number, maxStock: number) {
    if (newQuantity <= 0) {
      this.removeFromCart(bikeId);
      return;
    }

    // Trava no limite máximo de estoque
    const targetQuantity = Math.min(newQuantity, maxStock);

    this.cartItems.update(items =>
      items.map(item =>
        item.bike.id === bikeId ? { ...item, quantity: targetQuantity } : item
      )
    );
  }

  removeFromCart(bikeId: number | string) {
    this.cartItems.update(items => items.filter(item => item.bike.id !== bikeId));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}