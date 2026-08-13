import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private STORAGE_KEY = 'bike_motion_favorites';

  private favoritesSignal = signal<Set<number>>(this.loadFavoritesFromStorage());

  favoriteIds = computed(() => this.favoritesSignal());
  totalFavorites = computed(() => this.favoritesSignal().size);

  isFavorite(bikeId: number): boolean {
    return this.favoritesSignal().has(bikeId);
  }

  toggleFavorite(bikeId: number): void {
    this.favoritesSignal.update((set) => {
      const next = new Set(set);
      if (next.has(bikeId)) {
        next.delete(bikeId);
      } else {
        next.add(bikeId);
      }
      this.saveFavoritesToStorage(next);
      return next;
    });
  }

  private loadFavoritesFromStorage(): Set<number> {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  }

  private saveFavoritesToStorage(favorites: Set<number>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Erro ao salvar favoritos no localStorage', error);
    }
  }
}
