import { Injectable, signal } from '@angular/core';
import { Coupon } from '../models/coupon.model';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private STORAGE_KEY = 'bikemotion_coupons';

  coupons = signal<Coupon[]>(this.loadFromStorage());

  private loadFromStorage(): Coupon[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Erro ao carregar cupons do localStorage', e);
      }
    }
    return [
      {
        id: '1',
        code: 'BOAVINDAS10',
        discountPercent: 10,
        maxUsage: 50,
        usedCount: 5,
        active: true,
      },
    ];
  }

  private saveToStorage(updatedCoupons: Coupon[]) {
    this.coupons.set(updatedCoupons);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCoupons));
  }

  addCoupon(couponData: Omit<Coupon, 'id' | 'usedCount'>) {
    const newCoupon: Coupon = {
      ...couponData,
      id: Date.now().toString(),
      code: couponData.code.toUpperCase().trim(),
      usedCount: 0,
    };
    this.saveToStorage([...this.coupons(), newCoupon]);
  }

  updateCoupon(id: string, updatedData: Partial<Coupon>) {
    const updated = this.coupons().map((c) =>
      c.id === id
        ? {
            ...c,
            ...updatedData,
            code: updatedData.code ? updatedData.code.toUpperCase().trim() : c.code,
          }
        : c,
    );
    this.saveToStorage(updated);
  }

  deleteCoupon(id: string) {
    const filtered = this.coupons().filter((c) => c.id !== id);
    this.saveToStorage(filtered);
  }

  getCouponByCode(code: string): Coupon | undefined {
    return this.coupons().find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase() && c.active,
    );
  }
}
