import React from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { Category, Product, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';

interface SearchResultsPageProps {
  query: string;
  results: Product[];
  categories: Category[];
  wishlistIds: string[];
  onToggleWishlist: (e: React.MouseEvent, product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  query,
  results,
  categories,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onSelectCategory,
  settings,
  onShowToast,
  sortBy,
  onSelectSortBy
}) => {
  const topCategories = categories.filter((c) => c.parentId === null && c.isVisible);

  return (
    <div className="flex-1 min-w-0 font-sans pb-16 animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="bg-[#FEF9F2] border border-[#D2C4BA] rounded-2xl p-6 sm:p-8 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#523D2A]">
              <Search className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Tìm kiếm sản phẩm
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1D1B17] font-normal tracking-tight">
              Kết quả cho: <span className="italic text-[#523D2A]">"{query || 'Tất cả'}"</span>
            </h1>
            <p className="text-xs text-[#4E453E] font-mono">
              Tìm thấy <strong className="text-[#1D1B17]">{results.length}</strong> tác phẩm phù hợp
            </p>
          </div>

          {results.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-[#4E453E]">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => onSelectSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
              >
                <option value="featured">Tiêu biểu</option>
                <option value="newest">Mới nhất</option>
                <option value="name_asc">Tên A-Z</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Results or No-results State */}
      {results.length === 0 ? (
        <div className="bg-[#FEF9F2] border border-[#D2C4BA] rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-8 animate-in fade-in duration-300">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EDE6] text-[#4E453E] flex items-center justify-center">
              <Search className="w-7 h-7 stroke-[1.5]" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B17] font-normal">
              Không tìm thấy tác phẩm phù hợp
            </h2>

            <p className="text-xs sm:text-sm text-[#4E453E] leading-relaxed font-light">
              Chúng tôi không tìm thấy kết quả nào cho từ khóa{' '}
              <strong className="text-[#523D2A]">"{query}"</strong>. Vui lòng kiểm tra lại chính tả hoặc khám phá các danh mục không gian gợi ý bên dưới.
            </p>
          </div>

          {/* Suggested Categories */}
          <div className="pt-4 border-t border-[#F2EDE6]">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#523D2A]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#523D2A]">
                Bộ Sưu Tập Gợi Ý Cho Bạn
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {topCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="group p-4 bg-white border border-[#D2C4BA] rounded-2xl hover:border-[#523D2A] hover:shadow-md cursor-pointer transition-all flex items-center gap-4 text-left"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base text-[#1D1B17] group-hover:text-[#523D2A] transition-colors truncate">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-[#4E453E] line-clamp-1 mt-0.5">
                      {cat.description || 'Khám phá bộ sưu tập'}
                    </p>
                    <span className="text-[11px] font-semibold text-[#523D2A] flex items-center gap-1 mt-1">
                      <span>Xem tác phẩm</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {results.map((product) => (
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
