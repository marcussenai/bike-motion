export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUsage: number;
  usedCount: number;
  active: boolean;
}
