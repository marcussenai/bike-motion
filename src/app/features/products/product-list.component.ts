import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BikeService } from '../../core/services/bike.service';
import { CartService, CartItem } from '../../core/services/cart.service';
import { FavoriteService } from '../../core/services/favorite.service';

export interface Bike {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="catalog-container">
      <h2 class="catalog-title">Nossas Bicicletas</h2>

      <div class="product-grid">
        @for (bike of bikes(); track bike.id) {
          @let remaining = getAvailableStock(bike);

          <div class="product-card">
            <div class="img-wrapper">
              <button
                class="favorite-btn"
                [class.active]="favoriteService.isFavorite(bike.id)"
                (click)="favoriteService.toggleFavorite(bike.id)"
                [attr.aria-label]="
                  favoriteService.isFavorite(bike.id)
                    ? 'Remover dos favoritos'
                    : 'Adicionar aos favoritos'
                "
                [title]="
                  favoriteService.isFavorite(bike.id)
                    ? 'Remover dos favoritos'
                    : 'Adicionar aos favoritos'
                "
              >
                {{ favoriteService.isFavorite(bike.id) ? '❤️' : '🤍' }}
              </button>

              <img
                [src]="bike.imageUrl"
                [alt]="bike.name"
                loading="lazy"
                (error)="onImgError($event)"
              />
            </div>

            <div class="card-body">
              <span class="category">{{ bike.category }}</span>
              <h3 class="title">{{ bike.name }}</h3>
              <p class="brand">
                Marca: <strong>{{ bike.brand }}</strong>
              </p>
              <p class="description">{{ bike.description }}</p>

              <div class="price-row">
                <span class="price">{{
                  bike.price | currency: 'BRL' : 'symbol' : '1.2-2' : 'pt-BR'
                }}</span>
                <span class="stock-tag" [class.out-of-stock]="remaining <= 0">
                  {{ remaining > 0 ? remaining + ' em estoque' : 'Sem Estoque' }}
                </span>
              </div>

              <div class="card-actions">
                <a [routerLink]="['/product', bike.id]" class="btn-details">Detalhes</a>

                @if (remaining > 0) {
                  <button (click)="addToCart(bike)" class="btn-buy">Comprar</button>
                } @else {
                  <button class="btn-disabled" disabled>Esgotado</button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .catalog-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      .catalog-title {
        font-size: 1.8rem;
        color: #1a1a1a;
        margin-bottom: 1.5rem;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .product-card {
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;
        display: flex;
        flex-direction: column;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }

      .img-wrapper {
        position: relative;
        width: 100%;
        height: 200px;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
      }

      .favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e2e8f0;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.1rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
        z-index: 2;
      }

      .favorite-btn:hover {
        transform: scale(1.15);
        background: #ffffff;
      }

      .favorite-btn.active {
        border-color: #feb2b2;
        background: #fff5f5;
      }

      .img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .card-body {
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .category {
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 700;
        color: #00d1b2;
        letter-spacing: 0.5px;
      }

      .title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0.3rem 0;
        line-height: 1.3;
      }

      .brand {
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 0.5rem;
      }

      .description {
        font-size: 0.85rem;
        color: #718096;
        line-height: 1.4;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        margin-bottom: 0.8rem;
      }

      .price {
        font-size: 1.35rem;
        font-weight: 800;
        color: #00d1b2;
      }

      .stock-tag {
        font-size: 0.75rem;
        font-weight: 600;
        color: #10b981;
        background: #ecfdf5;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }

      .stock-tag.out-of-stock {
        color: #ef4444;
        background: #fef2f2;
      }

      .card-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.6rem;
      }

      .btn-details {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.65rem;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        color: #2d3748;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.2s;
      }

      .btn-details:hover {
        border-color: #00d1b2;
        color: #00d1b2;
      }

      .btn-buy {
        padding: 0.65rem;
        background: #00d1b2;
        border: none;
        border-radius: 8px;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s;
      }

      .btn-buy:hover {
        background: #00b89c;
      }

      .btn-disabled {
        padding: 0.65rem;
        background: #e2e8f0;
        border: none;
        border-radius: 8px;
        color: #a0aec0;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: not-allowed;
      }
    `,
  ],
})
export class ProductListComponent {
  private bikeService = inject(BikeService);
  cartService = inject(CartService);
  favoriteService = inject(FavoriteService);

  bikes = () => this.bikeService.getBikes();

  getAvailableStock(bike: Bike): number {
    const cartItems = this.cartService.items() as CartItem[];
    const cartItem = cartItems.find((item: CartItem) => item.bike.id === bike.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    return bike.stock - quantityInCart;
  }

  addToCart(bike: Bike) {
    if (this.getAvailableStock(bike) > 0) {
      this.cartService.addToCart(bike);
    }
  }

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80';
  }
}
