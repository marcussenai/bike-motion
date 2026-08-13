import { Bike } from './product.interface';

export interface OrderItem {
  bike: Bike;
  quantity: number;
}

export interface Order {
  id: string;
  date: Date;
  items: OrderItem[];
  totalAmount: number;
  status: 'Concluído' | 'Pendente' | 'Cancelado';
}
