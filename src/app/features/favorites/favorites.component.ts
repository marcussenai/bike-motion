import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BikeService } from '../../core/services/bike.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="favorites-container">
      <h2>❤️ Meus Favoritos</h2>

      @if (favoriteBikes().length === 0) {
        <div class="empty-state">
          <p>Você ainda não favoritou nenhuma bicicleta.</p>
          <a routerLink="/" class="btn-primary">Ver Catálogo</a>
        </div>
      } @else {
        <div class="products-grid">
          @for (bike of favoriteBikes(); track bike.id) {
            <div class="product-card">
              <button
                class="favorite-btn active"
                (click)="favoriteService.toggleFavorite(bike.id)"
                title="Remover dos favoritos"
              >
                ❤️
              </button>

              <img [src]="bike.imageUrl" [alt]="bike.name" class="product-image" />

              <div class="product-info">
                <span class="category">{{ bike.category }}</span>
                <h3>{{ bike.name }}</h3>
                <p class="price">R$ {{ bike.price.toFixed(2) }}</p>

                <div class="actions">
                  <a [routerLink]="['/product', bike.id]" class="btn-details">Detalhes</a>
                  <button (click)="cartService.addToCart(bike)" class="btn-cart">
                    🛒 Adicionar
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .favorites-container {
        padding: 1.5rem 1rem;
      }
      h2 {
        margin-bottom: 1.5rem;
        color: #1a202c;
        font-size: 1.8rem;
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: #f7fafc;
        border-radius: 8px;
        border: 1px dashed #cbd5e0;
      }
      .btn-primary {
        display: inline-block;
        margin-top: 1rem;
        background: #00d1b2;
        color: white;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      }
      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.5rem;
      }
      .product-card {
        position: relative;
        background: white;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .product-image {
        width: 100%;
        height: 180px;
        object-fit: contain;
      }
      .favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #fff5f5;
        border: 1px solid #feb2b2;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        cursor: pointer;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .category {
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 700;
        color: #00d1b2;
      }
      .product-info h3 {
        font-size: 1.1rem;
        margin: 0.3rem 0;
        color: #2d3748;
      }
      .price {
        font-weight: bold;
        color: #1a202c;
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
      }
      .btn-details {
        flex: 1;
        text-align: center;
        border: 1px solid #cbd5e0;
        padding: 0.5rem;
        border-radius: 6px;
        text-decoration: none;
        color: #4a5568;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .btn-cart {
        flex: 1;
        background: #00d1b2;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class FavoritesComponent {
  bikeService = inject(BikeService);
  favoriteService = inject(FavoriteService);
  cartService = inject(CartService);

  favoriteBikes = computed(() => {
    const favIds = this.favoriteService.favoriteIds();
    const allBikes = this.bikeService.getBikes();
    return allBikes.filter((b) => favIds.has(b.id));
  });
}
