import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BikeService, Bike } from '../../core/services/bike.service';
import { CartService } from '../../core/services/cart.service';
import { FavoriteService } from '../../core/services/favorite.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="products-container">
      <header class="catalog-header">
        <h1>Nosso Catálogo</h1>
        <p>Encontre a bicicleta perfeita para o seu estilo de pedal.</p>
      </header>

      <div class="filters-bar">
        <div class="search-box">
          <label for="catalog-search" class="sr-only">Buscar bicicletas</label>
          <input
            id="catalog-search"
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Buscar por nome ou marca..."
            class="search-input"
          />
        </div>

        <div class="category-filters">
          @for (cat of categories; track cat) {
            <button
              class="cat-btn"
              [class.active]="selectedCategory() === cat"
              (click)="selectedCategory.set(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>

      @if (filteredBikes().length === 0) {
        <div class="no-results">
          <p>Nenhuma bicicleta encontrada para essa busca.</p>
          <button (click)="resetFilters()" class="btn-reset">Limpar Filtros</button>
        </div>
      } @else {
        <div class="products-grid">
          @for (bike of filteredBikes(); track bike.id) {
            <div class="product-card">
              <button
                class="favorite-btn"
                [class.active]="favoriteService.isFavorite(bike.id)"
                (click)="favoriteService.toggleFavorite(bike.id)"
                [title]="
                  favoriteService.isFavorite(bike.id)
                    ? 'Remover dos favoritos'
                    : 'Adicionar aos favoritos'
                "
              >
                {{ favoriteService.isFavorite(bike.id) ? '❤️' : '🤍' }}
              </button>

              <div class="card-img-wrapper">
                <img
                  [src]="bike.imageUrl"
                  [alt]="bike.name"
                  class="product-image"
                  (error)="onImgError($event)"
                />
              </div>

              <div class="product-info">
                <span class="category">{{ bike.category }}</span>
                <h3>{{ bike.name }}</h3>
                <p class="brand">Marca: {{ bike.brand }}</p>
                <p class="price">R$ {{ bike.price.toFixed(2) }}</p>

                <div class="actions">
                  <a [routerLink]="['/product', bike.id]" class="btn-details">Detalhes</a>

                  @if (bike.stock > 0) {
                    <button (click)="cartService.addToCart(bike)" class="btn-cart">
                      🛒 Adicionar
                    </button>
                  } @else {
                    <button class="btn-out" disabled>Esgotado</button>
                  }
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
      .products-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
      .catalog-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .catalog-header h1 {
        font-size: 2rem;
        color: #1a202c;
        margin-bottom: 0.5rem;
      }
      .catalog-header p {
        color: #718096;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .filters-bar {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      @media (min-width: 768px) {
        .filters-bar {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }

      .search-input {
        padding: 0.75rem 1rem;
        border: 1px solid #cbd5e0;
        border-radius: 8px;
        width: 100%;
        max-width: 350px;
        font-size: 0.95rem;
      }
      .category-filters {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .cat-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #e2e8f0;
        background: white;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #4a5568;
        cursor: pointer;
        transition: all 0.2s;
      }
      .cat-btn.active,
      .cat-btn:hover {
        background: #00d1b2;
        color: white;
        border-color: #00d1b2;
      }

      .no-results {
        text-align: center;
        padding: 3rem;
        background: #f7fafc;
        border-radius: 8px;
      }
      .btn-reset {
        margin-top: 1rem;
        background: #3182ce;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.5rem;
      }
      .product-card {
        position: relative;
        background: white;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s;
      }
      .product-card:hover {
        transform: translateY(-4px);
      }

      .favorite-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e2e8f0;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .card-img-wrapper {
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .product-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .product-info {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      .category {
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 700;
        color: #00d1b2;
      }
      .product-info h3 {
        font-size: 1.1rem;
        margin: 0.2rem 0;
        color: #2d3748;
      }
      .brand {
        font-size: 0.85rem;
        color: #718096;
        margin-bottom: 0.5rem;
      }
      .price {
        font-weight: 800;
        color: #1a202c;
        font-size: 1.25rem;
        margin-bottom: 1rem;
        margin-top: auto;
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
      .btn-out {
        flex: 1;
        background: #e2e8f0;
        color: #a0aec0;
        border: none;
        border-radius: 6px;
        cursor: not-allowed;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class ProductsComponent {
  private bikeService = inject(BikeService);
  cartService = inject(CartService);
  favoriteService = inject(FavoriteService);

  searchQuery = signal('');
  selectedCategory = signal('Todas');

  categories = ['Todas', 'Urbana', 'Mountain Bike', 'Speed', 'Elétrica'];

  filteredBikes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const bikes = this.bikeService.getBikes();

    return bikes.filter((bike: Bike) => {
      const matchesQuery =
        bike.name.toLowerCase().includes(query) || bike.brand.toLowerCase().includes(query);
      const matchesCategory = cat === 'Todas' || bike.category === cat;
      return matchesQuery && matchesCategory;
    });
  });

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('Todas');
  }

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src =
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80';
  }
}
