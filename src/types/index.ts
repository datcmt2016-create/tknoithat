export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null; // null = top level
  image: string;
  description?: string;
  order: number;
  isVisible: boolean;
}

export interface ProductItemDimension {
  name: string;
  dimensions: {
    length: number | string; // cm
    width: number | string;
    height: number | string;
    note?: string;
  };
}

export interface ProductMaterial {
  part: string;
  material: string;
}

export interface ProductHighlight {
  title: string;
  text: string;
  image?: string;
}

export interface ProductDetail {
  itemName: string;
  title: string;
  text: string;
  image?: string;
}

export interface MaterialCard {
  name: string;
  text: string;
  image?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSuitability {
  summary: string;     // Tóm tắt độ phù hợp (diện tích, phong cách)
  spaces: string[];    // Không gian phù hợp
  pairings: string[];  // Gợi ý phối hợp với đồ vật khác
}

export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  subCategoryId?: string;
  shortDescription: string;
  isVisible: boolean;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
  mainImageIndex: number;
  hoverImageIndex?: number;
  colors: ProductColor[];
  materialTags: string[];
  sizeTags: string[];
  styleTags: string[];
  items: ProductItemDimension[];
  materials: ProductMaterial[];
  highlights: ProductHighlight[];
  details: ProductDetail[];
  dimensionImages: string[]; // Ảnh bản vẽ kích thước
  materialCards: MaterialCard[];
  lifestyleImage?: string;
  usageDescription?: string; // Công dụng / Tính năng (đoạn văn cách nhau bởi dòng trống)
  designPhilosophy?: string; // Thiết kế / Phong cách (đoạn văn cách nhau bởi dòng trống)
  suitability?: ProductSuitability;
  relatedProductIds: string[];
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
  disabled?: boolean;
}

export interface Favorite {
  userId: string;
  productId: string;
  createdAt: string;
}

export interface StoreSettings {
  name: string;
  logo: string;
  phone: string;
  zaloPhone: string;
  facebookPageUrl: string;
  email: string;
  address: string;
  openingHours: string;
  mapsUrl: string;
  heroImage: string;
  heroHeadline: string;
  heroTagline: string;
  bandQuote: string;
  seasonalBannerImage: string;
  seasonalBannerTitle: string;
  seasonalBannerText: string;
}

export interface ProductFilterParams {
  categorySlug?: string;
  subCategorySlug?: string;
  materialTags?: string[];
  sizeTags?: string[];
  styleTags?: string[];
  colors?: string[];
  searchText?: string;
  sort?: 'newest' | 'featured' | 'name_asc';
}
