import React from 'react';
import { 
  SlidersHorizontal, ChevronRight, RotateCcw, Compass, ArrowUpDown
} from 'lucide-react';
import { Category, Product, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  currentCategory?: Category;
  currentSubCategory?: Category;
  subcategories: Category[];
  selectedSubcategorySlug?: string;
  sortBy: string;
  searchQuery: string;
  onSelectCategory: (categorySlug: string, subCategorySlug?: string) => void;
  onSelectSubcategory: (subSlug: string) => void;
  onSelectSortBy: (sort: string) => void;
  onClearFilters: () => void;
  onOpenMobileFilters: () => void;
  onSelectProduct: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (e: React.MouseEvent, product: Product) => void;
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currentCategory,
  currentSubCategory,
  subcategories,
  selectedSubcategorySlug,
  sortBy,
  searchQuery,
  onSelectCategory,
  onSelectSubcategory,
  onSelectSortBy,
  onClearFilters,
  onOpenMobileFilters,
  onSelectProduct,
  wishlistIds,
  onToggleWishlist,
  settings,
  onShowToast
}) => {
  return (
    <div className="flex-1 min-w-0 space-y-6 font-sans">
      {/* Category Hero / Collection Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#D2C4BA] bg-[#523D2A] text-[#FEF9F2] p-6 sm:p-8 md:p-10 shadow-xs">
        {currentCategory?.image && (
          <img
            src={currentCategory.image}
            alt={currentCategory.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D1B17]/95 via-[#1D1B17]/80 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#F1E0C6] uppercase tracking-wider font-mono">
            <button
              onClick={() => onSelectCategory('')}
              className="hover:underline transition-colors"
            >
              CDHome Catalog
            </button>
            <ChevronRight className="w-3 h-3 text-[#D2C4BA]" />
            <span className="text-white font-medium">
              {currentCategory ? currentCategory.name : 'Tất cả tác phẩm'}
            </span>
            {currentSubCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-[#D2C4BA]" />
                <span className="text-[#F1E0C6] font-semibold">{currentSubCategory.name}</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-white">
            {currentSubCategory
              ? currentSubCategory.name
              : currentCategory
              ? currentCategory.name
              : 'Tất Cả Tác Phẩm Atelier'}
          </h1>

          <p className="text-xs sm:text-sm text-[#D2C4BA] leading-relaxed font-light">
            {currentCategory?.description ||
              'Nơi hội tụ các thiết kế nội thất gỗ tự nhiên theo triết lý Japandi, tôn vinh nghệ thuật sống chậm và tĩnh tại.'}
          </p>

          {/* Subcategory horizontal pills */}
          {subcategories.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onSelectSubcategory('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[36px] ${
                  !selectedSubcategorySlug
                    ? 'bg-[#FEF9F2] text-[#523D2A] font-bold shadow-xs'
                    : 'bg-white/10 text-[#D2C4BA] hover:bg-white/20 hover:text-white'
                }`}
              >
                Tất cả {currentCategory?.name}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubcategory(sub.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all min-h-[36px] ${
                    selectedSubcategorySlug === sub.slug
                      ? 'bg-[#FEF9F2] text-[#523D2A] font-bold shadow-xs'
                      : 'bg-white/10 text-[#D2C4BA] hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar: Count, Mobile filter button, Sorting (Keep Mới nhất, Nổi bật; remove Lưu nhiều nhất) */}
      <div className="bg-[#FEF9F2] p-3.5 sm:p-4 rounded-2xl border border-[#D2C4BA] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#4E453E]">
            Hiển thị <strong className="text-[#1D1B17] font-mono">{products.length}</strong> tác phẩm
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile Filter Button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D2C4BA] bg-white text-xs font-medium text-[#1D1B17] hover:bg-[#F2EDE6] min-h-[44px]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#523D2A]" />
            <span>Bộ lọc</span>
          </button>

          {/* Sort By Dropdown (Strictly: Mới nhất, Nổi bật, Tên A-Z; NO 'Lưu nhiều nhất') */}
          <div className="flex items-center gap-1.5 bg-white border border-[#D2C4BA] rounded-xl px-2.5 py-1.5 text-xs min-h-[44px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#4E453E]" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value)}
              className="bg-transparent text-[#1D1B17] text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured">Nổi bật</option>
              <option value="newest">Mới nhất</option>
              <option value="name_asc">Tên (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filters note */}
      {searchQuery && (
        <div className="flex items-center justify-between text-xs text-[#4E453E] px-1">
          <span>Tìm kiếm: <strong className="text-[#1D1B17]">"{searchQuery}"</strong></span>
          <button onClick={onClearFilters} className="text-[#523D2A] hover:underline flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            <span>Xóa tìm kiếm</span>
          </button>
        </div>
      )}

      {/* Products Grid: 2 cols on mobile (<768px), 3 cols on md tablet, 3-4 on desktop */}
      {products.length === 0 ? (
        <div className="bg-[#FEF9F2] rounded-3xl border border-[#D2C4BA] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EDE6] flex items-center justify-center text-[#4E453E]">
            <Compass className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-medium text-[#1D1B17]">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-[#4E453E] max-w-sm mx-auto leading-relaxed font-light">
            Vui lòng thử từ khóa khác hoặc xóa bộ lọc để xem các tác phẩm nội thất sẵn có của CDHome.
          </p>
          <button
            onClick={onClearFilters}
            className="px-5 py-2.5 bg-[#523D2A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#6B5440] transition-colors min-h-[44px]"
          >
            Xem Tất Cả Sản Phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              settings={settings}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};
