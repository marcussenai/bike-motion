export interface Bike {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  category?: string;
  brand?: string;
  stock: number;
}

export type Product = Bike;
