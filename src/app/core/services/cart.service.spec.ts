import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Bike } from './bike.service';

const createBike = (overrides?: Partial<Bike>): Readonly<Bike> =>
  Object.freeze({
    id: 1,
    name: 'Mountain Bike Teste',
    brand: 'TestBrand',
    category: 'Mountain Bike',
    description: 'Bicicleta para testes unitários',
    price: 1000,
    stock: 2,
    imageUrl: 'https://example.com/bike.jpg',
    ...overrides,
  });

describe('CartService - Bike Motion', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('deve inicializar com o carrinho totalmente vazio', () => {
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('deve adicionar item ao carrinho respeitando a quantidade solicitada', () => {
    const bike = createBike();

    service.addToCart(bike, 1);

    expect(service.totalItems()).toBe(1);
    expect(service.totalPrice()).toBe(1000);
  });

  it('não deve permitir adicionar de uma só vez uma quantidade acima do estoque', () => {
    const bike = createBike({ stock: 2 });

    service.addToCart(bike, 3);

    expect(service.totalItems()).toBe(0);
  });

  it('não deve permitir acumular quantidade superior ao estoque através de adições sucessivas', () => {
    const bike = createBike({ stock: 2 });

    service.addToCart(bike, 1);
    service.addToCart(bike, 1);
    service.addToCart(bike, 1);

    expect(service.totalItems()).toBe(2);
  });

  it('deve limitar a quantidade máxima ao estoque ao atualizar via updateQuantity', () => {
    const bike = createBike({ stock: 2 });

    service.addToCart(bike, 1);
    service.updateQuantity(bike.id, 10);

    expect(service.totalItems()).toBe(2);
  });

  it('deve remover o item do carrinho se a nova quantidade for menor ou igual a zero', () => {
    const bike = createBike();

    service.addToCart(bike, 1);
    service.updateQuantity(bike.id, 0);

    expect(service.totalItems()).toBe(0);
  });
});
