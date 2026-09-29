import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { Category, Product, ProductFilterParams, StoreSettings } from '../types';
import { storage } from './storage';

const PRODUCTS_KEY = 'cdhome_products_v2';
const CATEGORIES_KEY = 'cdhome_categories_v2';
const SETTINGS_KEY = 'cdhome_settings_v2';
let productsMigrated = false;

// Unsplash photo ids that now return 404; replaced in the seed data on 29/09/2026
const DEAD_IMAGE_IDS = [
  '1540518614846-7ede433c4ef7',
  '1533090161767-e6ffed986b88',
  '1533779283484-8da497b1736c',
  '1580481077195-c228ff31a78a'
];
const isDeadImage = (url?: string) => !!url && DEAD_IMAGE_IDS.some((id) => url.includes(id));

export const dataService = {
  // --- Categories ---
  getCategories(includeHidden = false): Category[] {
    let list = storage.get<Category[]>(CATEGORIES_KEY, INITIAL_CATEGORIES);
    if (!list || list.length === 0) {
      storage.set(CATEGORIES_KEY, INITIAL_CATEGORIES);
      return includeHidden ? INITIAL_CATEGORIES : INITIAL_CATEGORIES.filter((c) => c.isVisible);
    }
    if (list.some((c) => isDeadImage(c.image))) {
      list = list.map((c) =>
        isDeadImage(c.image) ? { ...c, image: INITIAL_CATEGORIES.find((s) => s.id === c.id)?.image ?? '' } : c
      );
      storage.set(CATEGORIES_KEY, list);
    }
    return includeHidden ? list : list.filter((c) => c.isVisible);
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return this.getCategories(true).find((c) => c.slug === slug);
  },

  getCategoryById(id: string): Category | undefined {
    return this.getCategories(true).find((c) => c.id === id);
  },

  getCategoryTree(includeHidden = false): { category: Category; subcategories: Category[] }[] {
    const all = this.getCategories(includeHidden);
    const topLevel = all
      .filter((c) => c.parentId === null)
      .sort((a, b) => a.order - b.order);

    return topLevel.map((cat) => ({
      category: cat,
      subcategories: all
        .filter((c) => c.parentId === cat.id)
        .sort((a, b) => a.order - b.order)
    }));
  },

  saveCategory(cat: Category): Category[] {
    const all = this.getCategories(true);
    const exists = all.some((c) => c.id === cat.id);
    let updated: Category[];
    if (exists) {
      updated = all.map((c) => (c.id === cat.id ? cat : c));
    } else {
      updated = [...all, cat];
    }
    storage.set(CATEGORIES_KEY, updated);
    return updated;
  },

  deleteCategory(id: string): Category[] {
    const all = this.getCategories(true);
    const updated = all.filter((c) => c.id !== id && c.parentId !== id);
    storage.set(CATEGORIES_KEY, updated);
    return updated;
  },

  updateCategoriesOrder(updatedList: Category[]): Category[] {
    storage.set(CATEGORIES_KEY, updatedList);
    return updatedList;
  },

  canDeleteCategory(id: string): { canDelete: boolean; reason?: string } {
    const allCategories = this.getCategories(true);
    const target = allCategories.find((c) => c.id === id);
    if (!target) return { canDelete: true };

    // 1. Check for sub-categories
    const subCategories = allCategories.filter((c) => c.parentId === id);
    if (subCategories.length > 0) {
      return {
        canDelete: false,
        reason: `Không thể xóa vì danh mục "${target.name}" đang chứa ${subCategories.length} danh mục con (${subCategories.map((s) => s.name).join(', ')}). Vui lòng di chuyển hoặc xóa danh mục con trước.`
      };
    }

    // 2. Check for products in this category or subcategory
    const allProducts = this.getProducts(undefined, true);
    const linkedProducts = allProducts.filter(
      (p) => p.categoryId === id || p.subCategoryId === id
    );
    if (linkedProducts.length > 0) {
      return {
        canDelete: false,
        reason: `Không thể xóa vì danh mục "${target.name}" đang có ${linkedProducts.length} tác phẩm liên kết (${linkedProducts.slice(0, 3).map((p) => p.name).join(', ')}${linkedProducts.length > 3 ? '...' : ''}). Vui lòng gán lại danh mục cho các tác phẩm này trước khi xóa.`
      };
    }

    return { canDelete: true };
  },

  // --- Products ---
  getProducts(filters?: ProductFilterParams, includeHidden = false): Product[] {
    let list = storage.get<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
    if (!list || list.length === 0) {
      storage.set(PRODUCTS_KEY, INITIAL_PRODUCTS);
      list = INITIAL_PRODUCTS;
    } else if (!productsMigrated) {
      list = this.migrateProductDetailFields(list);
      productsMigrated = true;
    }

    if (!includeHidden) {
      list = list.filter((p) => p.isVisible);
    }

    if (!filters) {
      return list;
    }

    // Filter by Category
    if (filters.categorySlug) {
      const cat = this.getCategoryBySlug(filters.categorySlug);
      if (cat) {
        if (cat.parentId === null) {
          // Top level category: include products directly in category or in its subcategories
          const subIds = this.getCategories(true)
            .filter((c) => c.parentId === cat.id)
            .map((c) => c.id);
          list = list.filter((p) => p.categoryId === cat.id || (p.subCategoryId && subIds.includes(p.subCategoryId)));
        } else {
          // Subcategory
          list = list.filter((p) => p.subCategoryId === cat.id);
        }
      }
    }

    // Filter by Subcategory
    if (filters.subCategorySlug) {
      const subCat = this.getCategoryBySlug(filters.subCategorySlug);
      if (subCat) {
        list = list.filter((p) => p.subCategoryId === subCat.id);
      }
    }

    // Filter by Material Tags
    if (filters.materialTags && filters.materialTags.length > 0) {
      list = list.filter((p) =>
        filters.materialTags!.some((tag) => p.materialTags.includes(tag))
      );
    }

    // Filter by Size Tags
    if (filters.sizeTags && filters.sizeTags.length > 0) {
      list = list.filter((p) =>
        filters.sizeTags!.some((tag) => p.sizeTags.includes(tag))
      );
    }

    // Filter by Style Tags
    if (filters.styleTags && filters.styleTags.length > 0) {
      list = list.filter((p) =>
        filters.styleTags!.some((tag) => p.styleTags.includes(tag))
      );
    }

    // Filter by Search text
    if (filters.searchText && filters.searchText.trim()) {
      const q = filters.searchText.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.materialTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sort === 'featured') {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    } else if (filters.sort === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return list;
  },

  getProductBySlug(slug: string, includeHidden = false): Product | undefined {
    return this.getProducts(undefined, includeHidden).find((p) => p.slug === slug);
  },

  getProductById(id: string, includeHidden = false): Product | undefined {
    return this.getProducts(undefined, includeHidden).find((p) => p.id === id);
  },

  getRelatedProducts(product: Product): Product[] {
    const all = this.getProducts();

    if (product.relatedProductIds && product.relatedProductIds.length > 0) {
      const explicit = all.filter((p) => product.relatedProductIds.includes(p.id) && p.id !== product.id);
      if (explicit.length >= 4) return explicit.slice(0, 4);
    }

    // Else 4 from same subcategory, or same category
    let fallback = all.filter(
      (p) => p.id !== product.id && p.subCategoryId === product.subCategoryId
    );
    if (fallback.length < 4) {
      const sameCat = all.filter(
        (p) => p.id !== product.id && p.categoryId === product.categoryId && !fallback.includes(p)
      );
      fallback = [...fallback, ...sameCat];
    }
    return fallback.slice(0, 4);
  },

  // Admin CRUD for Products
  saveProduct(product: Product): Product {
    const all = this.getProducts(undefined, true);
    const index = all.findIndex((p) => p.id === product.id);
    const now = new Date().toISOString();
    const updatedProduct = {
      ...product,
      updatedAt: now
    };

    let updatedList: Product[];
    if (index >= 0) {
      updatedList = all.map((p) => (p.id === product.id ? updatedProduct : p));
    } else {
      updatedList = [{ ...updatedProduct, createdAt: now }, ...all];
    }
    storage.set(PRODUCTS_KEY, updatedList);
    return updatedProduct;
  },

  duplicateProduct(id: string): Product | null {
    const original = this.getProductById(id, true);
    if (!original) return null;

    const newId = `prod-${Date.now()}`;
    const newCode = `${original.code}-COPY`;
    const newName = `${original.name} (Bản sao)`;
    const newSlug = `${original.slug}-ban-sao-${Math.floor(Math.random() * 1000)}`;

    const copy: Product = {
      ...original,
      id: newId,
      code: newCode,
      name: newName,
      slug: newSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveProduct(copy);
    return copy;
  },

  deleteProduct(id: string): boolean {
    const all = this.getProducts(undefined, true);
    const updated = all.filter((p) => p.id !== id);
    storage.set(PRODUCTS_KEY, updated);
    return true;
  },

  bulkUpdateVisibility(ids: string[], isVisible: boolean): void {
    const all = this.getProducts(undefined, true);
    const updated = all.map((p) => (ids.includes(p.id) ? { ...p, isVisible } : p));
    storage.set(PRODUCTS_KEY, updated);
  },

  bulkDeleteProducts(ids: string[]): void {
    const all = this.getProducts(undefined, true);
    const updated = all.filter((p) => !ids.includes(p.id));
    storage.set(PRODUCTS_KEY, updated);
  },

  // Fill in the detail-page fields added later for products saved in visitors' localStorage.
  // Only missing fields are filled, so admin edits are never overwritten.
  migrateProductDetailFields(list: Product[]): Product[] {
    const OLD_PLACEHOLDER_DRAWING = 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80';
    let changed = false;
    const migrated = list.map((p) => {
      const seed = INITIAL_PRODUCTS.find((s) => s.id === p.id);
      if (!seed) return p;
      const next = { ...p };
      if (next.usageDescription === undefined && seed.usageDescription) next.usageDescription = seed.usageDescription;
      if (next.designPhilosophy === undefined && seed.designPhilosophy) next.designPhilosophy = seed.designPhilosophy;
      if (next.suitability === undefined && seed.suitability) next.suitability = seed.suitability;
      const drawings = next.dimensionImages || [];
      const onlyPlaceholder = drawings.length === 1 && drawings[0] === OLD_PLACEHOLDER_DRAWING;
      if ((drawings.length === 0 || onlyPlaceholder) && seed.dimensionImages.length > 0) {
        next.dimensionImages = seed.dimensionImages;
      }
      // Swap Unsplash photos that were removed upstream (404) for the seed's current photo at the same position
      if (next.images.some(isDeadImage)) {
        next.images = next.images
          .map((img, i) => (isDeadImage(img) ? seed.images[i] ?? '' : img))
          .filter((img) => img && !isDeadImage(img));
      }
      if (next.lifestyleImage && isDeadImage(next.lifestyleImage)) next.lifestyleImage = seed.lifestyleImage;
      // Only for products the admin never edited (updatedAt unchanged)
      if (next.updatedAt === seed.updatedAt) {
        if (seed.materials.length > (next.materials || []).length) next.materials = seed.materials;
        if (seed.items.length > (next.items || []).length) next.items = seed.items;
        if (seed.highlights.length > (next.highlights || []).length) next.highlights = seed.highlights;
        if (seed.suitability && (seed.suitability.spaces.length > (next.suitability?.spaces.length ?? 0)
          || seed.suitability.pairings.length > (next.suitability?.pairings.length ?? 0))) {
          next.suitability = seed.suitability;
        }
      }
      if (JSON.stringify(next) !== JSON.stringify(p)) changed = true;
      return next;
    });
    if (changed) storage.set(PRODUCTS_KEY, migrated);
    return migrated;
  },

  // --- Settings ---
  getSettings(): StoreSettings {
    const stored = storage.get<StoreSettings & { messengerUsername?: string }>(SETTINGS_KEY, INITIAL_SETTINGS);
    // Migrate old default values still saved in visitors' localStorage (admin-edited values are kept),
    // and drop the removed Messenger field
    const OLD_DEFAULTS: Partial<Record<keyof StoreSettings, string>> = {
      phone: '0988123456',
      zaloPhone: '0988123456',
      address: '215 Nguyễn Văn Hưởng, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
      openingHours: '09:00 - 20:00 (Thứ 2 - Chủ Nhật)',
      mapsUrl: 'https://maps.google.com/?q=215+Nguyen+Van+Huong+Thao+Dien+Thu+Duc'
    };
    const staleKeys = (Object.keys(OLD_DEFAULTS) as (keyof StoreSettings)[]).filter(
      (k) => stored[k] === OLD_DEFAULTS[k]
    );
    if (staleKeys.length > 0 || 'messengerUsername' in stored) {
      const { messengerUsername: _removed, ...settings } = stored;
      const migrated = { ...settings } as StoreSettings;
      for (const k of staleKeys) {
        (migrated as unknown as Record<string, string>)[k] = INITIAL_SETTINGS[k] as string;
      }
      storage.set(SETTINGS_KEY, migrated);
      return migrated;
    }
    return stored;
  },

  updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    storage.set(SETTINGS_KEY, updated);
    return updated;
  },

  resetAllData(): void {
    storage.set(PRODUCTS_KEY, INITIAL_PRODUCTS);
    storage.set(CATEGORIES_KEY, INITIAL_CATEGORIES);
    storage.set(SETTINGS_KEY, INITIAL_SETTINGS);
  }
};
