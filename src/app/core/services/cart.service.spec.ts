import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Bike } from '../models/bike.model';

describe('CartService - Bike Motion', () => {
  let service: CartService;
  const mockBike: Bike = {
    id: 1,
    name: 'Mountain Bike Teste',
    brand: 'TestBrand',
    category: 'Mountain Bike',
    description: 'Bicicleta de teste',
    price: 1000,
    stock: 2,
    imageUrl: '',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.runInInjectionContext(() => {
      service = new CartService();
    });
  });

  it('deve inicializar o carrinho vazio', () => {
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('deve adicionar item ao carrinho respeitando o estoque', () => {
    service.addToCart(mockBike, 1);
    expect(service.totalItems()).toBe(1);
    expect(service.totalPrice()).toBe(1000);
  });

  it('não deve permitir adicionar além da quantidade em estoque', () => {
    service.addToCart(mockBike, 3); // Estoque máximo é 2
    expect(service.totalItems()).toBe(0);
  });
});
