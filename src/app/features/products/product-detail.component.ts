import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BikeService } from '../../core/services/bike.service';
import { CartService } from '../../core/services/cart.service';
import { Bike } from '../../core/models/bike.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (bike) {
      <div class="detail-container">
        <img [src]="bike.imageUrl" [alt]="bike.name" class="detail-img" />
        <div class="detail-info">
          <span class="category">{{ bike.category }}</span>
          <h1>{{ bike.name }}</h1>
          <p class="brand">Marca: <strong>{{ bike.brand }}</strong></p>
          <p class="description">{{ bike.description }}</p>
          <p class="stock">Estoque disponível: {{ bike.stock }} unidades</p>
          <p class="price">R$ {{ bike.price.toFixed(2) }}</p>
          <div class="actions">
            <button (click)="cartService.addToCart(bike)" class="btn-add">Adicionar ao Carrinho</button>
            <a routerLink="/" class="btn-back">Voltar ao Catálogo</a>
          </div>
        </div>
      </div>
    } @else {
      <p>Produto não encontrado.</p>
    }
  `,
  styles: [`
    .detail-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
    }
    .detail-img {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: 8px;
    }
    .category {
      color: #888;
      text-transform: uppercase;
      font-size: 0.85rem;
    }
    h1 { margin: 0.5rem 0; }
    .description { margin: 1rem 0; color: #555; line-height: 1.5; }
    .stock { color: #666; font-size: 0.9rem; }
    .price { font-size: 2rem; font-weight: bold; color: #00d1b2; margin: 1rem 0; }
    .actions { display: flex; gap: 1rem; }
    .btn-add {
      background: #00d1b2;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn-back {
      padding: 0.75rem 1.5rem;
      border: 1px solid #ccc;
      color: #333;
      text-decoration: none;
      border-radius: 4px;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bikeService = inject(BikeService);
  cartService = inject(CartService);

  bike?: Bike;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bike = this.bikeService.getBikeById(id);
  }
}