import { Injectable, signal, computed, inject } from '@angular/core';
import { CouponService } from './coupon.service';
import { Coupon } from '../models/coupon.model';
import { Bike } from './bike.service';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  bike: Bike;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly couponService = inject(CouponService);

  readonly items = signal<CartItem[]>([]);
  readonly appliedCoupon = signal<Coupon | null>(null);
  readonly couponError = signal<string | null>(null);

  readonly totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));

  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  readonly discountValue = computed(() => {
    const coupon = this.appliedCoupon();
    if (!coupon) return 0;
    return (this.subtotal() * coupon.discountPercent) / 100;
  });

  readonly total = computed(() => {
    const finalPrice = this.subtotal() - this.discountValue();
    return Math.max(0, finalPrice);
  });

  readonly totalPrice = computed(() => this.total());

  addToCart(bike: Bike, quantity = 1): void {
    if (quantity <= 0) return;

    const currentItems = this.items();
    const existingIndex = currentItems.findIndex((item) => item.id === bike.id);
    const currentQuantity = existingIndex > -1 ? currentItems[existingIndex].quantity : 0;
    const targetQuantity = currentQuantity + quantity;

    if (targetQuantity > bike.stock) {
      return;
    }

    if (existingIndex > -1) {
      const updated = currentItems.map((item, index) =>
        index === existingIndex ? { ...item, quantity: targetQuantity } : item,
      );
      this.items.set(updated);
    } else {
      const newItem: CartItem = {
        id: bike.id,
        name: bike.name,
        price: bike.price,
        quantity,
        imageUrl: bike.imageUrl,
        bike,
      };
      this.items.set([...currentItems, newItem]);
    }
  }

  removeFromCart(id: number): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    this.items.update((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        const maxQuantity = Math.min(quantity, item.bike.stock);
        return { ...item, quantity: maxQuantity };
      }),
    );
  }

  clearCart(): void {
    this.items.set([]);
    this.removeCoupon();
  }

  applyCoupon(code: string): boolean {
    this.couponError.set(null);

    const cleanCode = code.trim();
    if (!cleanCode) {
      this.couponError.set('Digite o código do cupom.');
      return false;
    }

    const coupon = this.couponService.getCouponByCode(cleanCode);
    if (!coupon) {
      this.couponError.set('Cupom inválido ou expirado.');
      return false;
    }

    if (coupon.usedCount >= coupon.maxUsage) {
      this.couponError.set('Este cupom atingiu o limite máximo de usos.');
      return false;
    }

    this.appliedCoupon.set(coupon);
    return true;
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
    this.couponError.set(null);
  }

  completeCheckout(): void {
    const coupon = this.appliedCoupon();
    if (coupon) {
      this.couponService.updateCoupon(coupon.id, {
        usedCount: coupon.usedCount + 1,
      });
    }
    this.clearCart();
  }
}
