import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BikeService, Bike } from '../../core/services/bike.service';
import { CartService } from '../../core/services/cart.service';
import { FavoriteService } from '../../core/services/favorite.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="detail-container">
      <a routerLink="/" class="back-link">← Voltar para o catálogo</a>

      @if (bike(); as currentBike) {
        <div class="product-detail-card">
          <div class="img-wrapper">
            <button
              class="favorite-btn"
              [class.active]="favoriteService.isFavorite(currentBike.id)"
              (click)="favoriteService.toggleFavorite(currentBike.id)"
              [title]="
                favoriteService.isFavorite(currentBike.id)
                  ? 'Remover dos favoritos'
                  : 'Adicionar aos favoritos'
              "
            >
              {{ favoriteService.isFavorite(currentBike.id) ? '❤️' : '🤍' }}
            </button>

            @if (hasImageError()) {
              <div class="no-image-text">Imagem Indisponível :(</div>
            } @else {
              <img [src]="currentBike.imageUrl" [alt]="currentBike.name" (error)="onImgError()" />
            }
          </div>

          <div class="info-section">
            <span class="category">{{ currentBike.category }}</span>
            <h1 class="title">{{ currentBike.name }}</h1>
            <p class="brand">
              Marca: <strong>{{ currentBike.brand }}</strong>
            </p>

            <p class="description">{{ currentBike.description }}</p>

            <div class="price-container">
              <span class="price">{{
                currentBike.price | currency: 'BRL' : 'symbol' : '1.2-2'
              }}</span>
              <span class="stock-tag" [class.out-of-stock]="remainingStock() <= 0">
                {{ remainingStock() > 0 ? remainingStock() + ' em estoque' : 'Sem Estoque' }}
              </span>
            </div>

            <div class="actions">
              <button
                class="btn-fav-action"
                [class.is-favorite]="favoriteService.isFavorite(currentBike.id)"
                (click)="favoriteService.toggleFavorite(currentBike.id)"
              >
                {{
                  favoriteService.isFavorite(currentBike.id)
                    ? '❤️ Salvo nos Favoritos'
                    : '🤍 Favoritar'
                }}
              </button>

              @if (remainingStock() > 0) {
                <button (click)="addToCart(currentBike)" class="btn-buy">
                  🛒 Adicionar ao Carrinho
                </button>
              } @else {
                <button class="btn-disabled" disabled>Produto Esgotado</button>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="not-found">
          <h2>Bicicleta não encontrada!</h2>
          <a routerLink="/" class="btn-primary">Voltar ao início</a>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .detail-container {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
      .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: #00d1b2;
        text-decoration: none;
        font-weight: 600;
      }
      .product-detail-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
        background: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;
      }
      @media (max-width: 768px) {
        .product-detail-card {
          grid-template-columns: 1fr;
        }
      }
      .img-wrapper {
        position: relative;
        width: 100%;
        height: 350px;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        overflow: hidden;
      }
      .img-wrapper img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .no-image-text {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
        padding: 1rem;
        user-select: none;
      }
      .favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e2e8f0;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
        z-index: 2;
      }
      .favorite-btn:hover {
        transform: scale(1.1);
      }
      .favorite-btn.active {
        background: #fff5f5;
        border-color: #feb2b2;
      }
      .info-section {
        display: flex;
        flex-direction: column;
      }
      .category {
        font-size: 0.85rem;
        text-transform: uppercase;
        font-weight: 700;
        color: #00d1b2;
        letter-spacing: 0.5px;
      }
      .title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0.4rem 0;
      }
      .brand {
        font-size: 0.95rem;
        color: #666;
        margin-bottom: 1rem;
      }
      .description {
        font-size: 0.95rem;
        color: #4a5568;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      .price-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .price {
        font-size: 1.8rem;
        font-weight: 800;
        color: #00d1b2;
      }
      .stock-tag {
        font-size: 0.85rem;
        font-weight: 600;
        color: #10b981;
        background: #ecfdf5;
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
      }
      .stock-tag.out-of-stock {
        color: #ef4444;
        background: #fef2f2;
      }
      .actions {
        display: flex;
        gap: 1rem;
        margin-top: auto;
      }
      .btn-fav-action {
        flex: 1;
        padding: 0.8rem;
        background: #ffffff;
        border: 1px solid #cbd5e0;
        border-radius: 8px;
        color: #2d3748;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-fav-action:hover {
        border-color: #feb2b2;
        background: #fff5f5;
      }
      .btn-fav-action.is-favorite {
        background: #fff5f5;
        border-color: #feb2b2;
        color: #e53e3e;
      }
      .btn-buy {
        flex: 1.5;
        padding: 0.8rem;
        background: #00d1b2;
        border: none;
        border-radius: 8px;
        color: #ffffff;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-buy:hover {
        background: #00b89c;
      }
      .btn-disabled {
        flex: 1.5;
        padding: 0.8rem;
        background: #e2e8f0;
        border: none;
        border-radius: 8px;
        color: #a0aec0;
        font-weight: 600;
        cursor: not-allowed;
      }
      .not-found {
        text-align: center;
        padding: 3rem;
      }
      .btn-primary {
        display: inline-block;
        margin-top: 1rem;
        background: #00d1b2;
        color: white;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        text-decoration: none;
      }
    `,
  ],
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bikeService = inject(BikeService);
  private readonly cartService = inject(CartService);
  public readonly favoriteService = inject(FavoriteService);

  readonly hasImageError = signal<boolean>(false);

  private readonly bikeId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
  );

  readonly bike = computed(() => {
    const id = this.bikeId();
    return id ? this.bikeService.getBikeById(id) : undefined;
  });

  readonly remainingStock = computed(() => {
    const currentBike = this.bike();
    if (!currentBike) return 0;

    const cartItem = this.cartService.items().find((item) => item.bike.id === currentBike.id);

    const quantityInCart = cartItem ? cartItem.quantity : 0;
    return Math.max(0, currentBike.stock - quantityInCart);
  });

  addToCart(bike: Bike): void {
    if (this.remainingStock() > 0) {
      this.cartService.addToCart(bike);
    }
  }

  onImgError(): void {
    this.hasImageError.set(true);
  }
}
