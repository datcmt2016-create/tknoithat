import React from 'react';
import { Package, Eye, Users, Heart, ArrowUpRight, Layers } from 'lucide-react';
import { Category, Product, User } from '../../types';
import { favoritesService } from '../../services/favoritesService';

interface AdminOverviewProps {
  products: Product[];
  categories: Category[];
  users: User[];
  onSelectProduct: (product: Product) => void;
  onNavigateToProducts: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  categories,
  users,
  onSelectProduct,
  onNavigateToProducts
}) => {
  const visibleProductsCount = products.filter((p) => p.isVisible).length;
  const totalFavoritesCount = favoritesService.getTotalFavoritesCount();
  const favoriteCountsMap = favoritesService.countsPerProduct();

  // Top 10 most favorited products
  const top10Favorited = [...products]
    .map((p) => ({
      product: p,
      favCount: favoriteCountsMap[p.id] || 0
    }))
    .sort((a, b) => b.favCount - a.favCount)
    .slice(0, 10);

  // Favorites distribution by category
  const topCategories = categories.filter((c) => c.parentId === null);
  const categoryDistribution = topCategories.map((cat) => {
    const subCatIds = categories.filter((c) => c.parentId === cat.id).map((c) => c.id);
    const catProducts = products.filter(
      (p) => p.categoryId === cat.id || (p.subCategoryId && subCatIds.includes(p.subCategoryId))
    );
    const totalFavsInCat = catProducts.reduce(
      (sum, p) => sum + (favoriteCountsMap[p.id] || 0),
      0
    );
    return {
      category: cat,
      productCount: catProducts.length,
      favoriteCount: totalFavsInCat
    };
  });

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-200">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#4E453E] uppercase tracking-wider">Tổng Tác Phẩm</p>
            <h3 className="text-3xl font-serif text-[#1D1B17] mt-1">{products.length}</h3>
            <p className="text-[11px] text-[#4E453E] mt-1">Trong kho cơ sở dữ liệu</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F2EDE6] text-[#523D2A] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#4E453E] uppercase tracking-wider">Đang Hiển Thị</p>
            <h3 className="text-3xl font-serif text-[#523D2A] mt-1">{visibleProductsCount}</h3>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">Xuất hiện trên Showroom</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#4E453E] uppercase tracking-wider">Người Dùng</p>
            <h3 className="text-3xl font-serif text-[#1D1B17] mt-1">{users.length}</h3>
            <p className="text-[11px] text-[#4E453E] mt-1">Tài khoản lưu trữ yêu thích</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F2EDE6] text-[#523D2A] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#4E453E] uppercase tracking-wider">Lượt Yêu Thích</p>
            <h3 className="text-3xl font-serif text-[#523D2A] mt-1">{totalFavoritesCount}</h3>
            <p className="text-[11px] text-[#4E453E] mt-1">Tổng lượt thả tim toàn hệ thống</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F1E0C6] text-[#523D2A] flex items-center justify-center">
            <Heart className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Top 10 sản phẩm được yêu thích nhất (7 cols) */}
        <div className="lg:col-span-7 bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2EDE6]">
            <div>
              <h3 className="font-serif text-lg font-normal text-[#1D1B17]">
                Top 10 Sản Phẩm Được Yêu Thích Nhất
              </h3>
              <p className="text-xs text-[#4E453E]">Thống kê theo số lượng khách thả tim lưu lại</p>
            </div>
            <button
              onClick={onNavigateToProducts}
              className="text-xs font-semibold text-[#523D2A] hover:underline"
            >
              Quản lý sản phẩm
            </button>
          </div>

          <div className="divide-y divide-[#F2EDE6]">
            {top10Favorited.map(({ product: p, favCount }, idx) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-[#F2EDE6]/50 rounded-xl px-2 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 font-mono text-xs font-bold text-[#4E453E]">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-lg border border-[#D2C4BA] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#523D2A] font-bold">
                      {p.code}
                    </span>
                    <h4 className="text-xs font-medium text-[#1D1B17] group-hover:text-[#523D2A] truncate">
                      {p.name}
                    </h4>
                    <span className="text-[10px] text-[#4E453E] line-clamp-1">
                      {p.shortDescription}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold font-mono text-[#523D2A] bg-[#F1E0C6] px-2.5 py-1 rounded-full border border-[#D2C4BA]">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{favCount}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#D2C4BA] group-hover:text-[#523D2A] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Phân bổ yêu thích theo danh mục (5 cols) */}
        <div className="lg:col-span-5 bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#F2EDE6]">
            <h3 className="font-serif text-lg font-normal text-[#1D1B17]">
              Phân Bổ Yêu Thích Theo Danh Mục
            </h3>
            <p className="text-xs text-[#4E453E]">Mức độ quan tâm của khách hàng theo từng không gian</p>
          </div>

          <div className="space-y-3 pt-1">
            {categoryDistribution.map(({ category, productCount, favoriteCount }) => {
              const percentage =
                totalFavoritesCount > 0
                  ? Math.round((favoriteCount / totalFavoritesCount) * 100)
                  : 0;

              return (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1D1B17]">{category.name}</span>
                    <span className="font-mono text-[#4E453E]">
                      {favoriteCount} lượt ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F2EDE6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#523D2A] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
