import { INITIAL_FAVORITES } from '../data/initialData';
import { Favorite } from '../types';
import { storage } from './storage';

const FAVORITES_KEY = 'cdhome_favorites_v2';

export const favoritesService = {
  getAllFavorites(): Favorite[] {
    const list = storage.get<Favorite[]>(FAVORITES_KEY, INITIAL_FAVORITES);
    if (!list || list.length === 0) {
      storage.set(FAVORITES_KEY, INITIAL_FAVORITES);
      return INITIAL_FAVORITES;
    }
    return list;
  },

  list(userId: string): string[] {
    if (!userId) return [];
    const all = this.getAllFavorites();
    return all.filter((f) => f.userId === userId).map((f) => f.productId);
  },

  isFavorite(userId: string, productId: string): boolean {
    if (!userId) return false;
    return this.getAllFavorites().some((f) => f.userId === userId && f.productId === productId);
  },

  add(userId: string, productId: string): boolean {
    if (!userId || !productId) return false;
    const all = this.getAllFavorites();
    if (all.some((f) => f.userId === userId && f.productId === productId)) {
      return true;
    }
    const newFav: Favorite = {
      userId,
      productId,
      createdAt: new Date().toISOString()
    };
    storage.set(FAVORITES_KEY, [...all, newFav]);
    return true;
  },

  remove(userId: string, productId: string): boolean {
    if (!userId || !productId) return false;
    const all = this.getAllFavorites();
    const updated = all.filter((f) => !(f.userId === userId && f.productId === productId));
    storage.set(FAVORITES_KEY, updated);
    return true;
  },

  // Admin only: counts per product
  countsPerProduct(): Record<string, number> {
    const all = this.getAllFavorites();
    const counts: Record<string, number> = {};
    for (const f of all) {
      counts[f.productId] = (counts[f.productId] || 0) + 1;
    }
    return counts;
  },

  getTotalFavoritesCount(): number {
    return this.getAllFavorites().length;
  }
};
