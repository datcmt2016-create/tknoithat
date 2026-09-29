import React, { useState, useMemo, useEffect } from 'react';
import { Heart, MessageSquare, Copy, ArrowRight, ArrowLeft, Filter } from 'lucide-react';
import { Category, Product, StoreSettings, User } from '../types';
import { contactUtils } from '../utils/contact';

interface FavoritesPageProps {
  favoriteProducts: Product[];
  categories: Category[];
  onRemoveFavorite: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onBackToCatalog: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  settings: StoreSettings;
  user: User | null;
  onShowToast: (msg: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favoriteProducts,
  categories,
  onRemoveFavorite,
  onSelectProduct,
  onBackToCatalog,
  onOpenAuth,
  settings,
  user,
  onShowToast
}) => {
  useEffect(() => {
    document.title = 'Tác Phẩm Yêu Thích | CDHome Atelier';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name_asc'>('newest');

  // Categories present in favorite products
  const availableCategories = useMemo(() => {
    const catMap = new Map<string, string>();
    favoriteProducts.forEach((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      if (cat) {
        catMap.set(cat.id, cat.name);
      }
    });
    return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
  }, [favoriteProducts, categories]);

  // Filter & Sort
  const displayedProducts = useMemo(() => {
    let list = [...favoriteProducts];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    if (sortBy === 'newest') {
      // "Mới lưu" - keep list in reverse of initial order or preserve favorited order
      // list is already ordered by favorites addition
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return list;
  }, [favoriteProducts, selectedCategory, sortBy]);

  const handleSendAllZalo = () => {
    if (displayedProducts.length === 0) return;
    contactUtils.copyFavoritesAndOpenZalo(settings, displayedProducts, onShowToast);
  };

  const handleCopyList = () => {
    if (displayedProducts.length === 0) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const textList = displayedProducts
      .map(
        (p, idx) =>
          `${idx + 1}. ${p.name} (Mã: ${p.code})\n   Chi tiết: ${origin}/san-pham/${p.slug}`
      )
      .join('\n\n');

    const fullMessage = `DANH SÁCH TÁC PHẨM YÊU THÍCH - CDHOME ATELIER\nKhách hàng: ${
      user?.username || ''
    }\nSố lượng: ${displayedProducts.length} tác phẩm\n\n${textList}\n\nLiên hệ hotline/Zalo: ${
      settings.phone
    }`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(fullMessage)
        .then(() => {
          onShowToast('Đã sao chép danh sách tác phẩm vào bộ nhớ tạm');
        })
        .catch(() => {
          onShowToast('Không thể sao chép tự động. Vui lòng thử lại.');
        });
    }
  };

  // 1. LOGGED-OUT STATE
  if (!user) {
    return (
      <div className="flex-1 w-full flex items-center justify-center py-16 px-4 font-sans animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-[#FEF9F2] border border-[#D2C4BA] rounded-3xl p-8 sm:p-10 text-center shadow-sm space-y-6">
          <div className="w-18 h-18 mx-auto rounded-full bg-[#F2EDE6] text-[#523D2A] flex items-center justify-center border border-[#D2C4BA]/50">
            <Heart className="w-8 h-8 stroke-[1.5] text-[#523D2A]" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1D1B17] font-normal leading-snug">
              Đăng nhập để xem danh sách yêu thích
            </h1>
            <p className="text-xs sm:text-sm text-[#4E453E] leading-relaxed font-light">
              Tài khoản giúp bạn lưu trữ những tuyệt tác nội thất yêu thích, dễ dàng gửi danh sách tới đội ngũ kiến trúc sư để nhận tư vấn và báo giá.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full py-3.5 px-6 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs min-h-[44px]"
            >
              Đăng Nhập Ngay
            </button>

            <div className="text-xs text-[#4E453E]">
              <span>Chưa có tài khoản? </span>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-[#523D2A] font-semibold underline underline-offset-2 hover:text-[#6B5440] transition-colors p-1"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F2EDE6]">
            <button
              onClick={onBackToCatalog}
              className="text-xs text-[#4E453E] hover:text-[#523D2A] inline-flex items-center gap-1.5 transition-colors p-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tiếp tục khám phá không gian showroom</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE (Desktop + Mobile)
  if (favoriteProducts.length === 0) {
    return (
      <div className="flex-1 w-full flex items-center justify-center py-20 px-4 font-sans animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-[#FEF9F2] border border-[#D2C4BA] rounded-3xl p-8 sm:p-10 text-center shadow-xs space-y-6">
          <div className="w-18 h-18 mx-auto rounded-full bg-[#F2EDE6] text-[#4E453E] flex items-center justify-center border border-[#D2C4BA]/50">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#523D2A]">
              Bộ Sưu Tập Đang Trống
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B17] font-normal">
              Bạn chưa lưu tác phẩm nào
            </h2>
            <p className="text-xs sm:text-sm text-[#4E453E] leading-relaxed font-light">
              Nhấn biểu tượng trái tim để lưu những mẫu bạn yêu thích khi dạo xem các bộ sưu tập nội thất tĩnh lặng của chúng tôi.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onBackToCatalog}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs min-h-[44px]"
            >
              Khám Phá Bộ Sưu Tập
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. FAVORITES LIST (Populated State)
  return (
    <div className="flex-1 min-w-0 font-sans pb-16 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-[#FEF9F2] border border-[#D2C4BA] rounded-2xl p-6 sm:p-8 mb-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#523D2A]">
                Bộ Sưu Tập Riêng
              </span>
              <span className="text-[#D2C4BA]">•</span>
              <span className="text-xs font-mono font-medium text-[#4E453E]">
                {favoriteProducts.length} tác phẩm đã lưu
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B17] font-normal tracking-tight">
              Tác Phẩm Yêu Thích
            </h1>

            <p className="italic text-xs sm:text-sm text-[#4E453E] pt-0.5">
              Xin chào, <strong className="font-medium text-[#523D2A] not-italic">{user.username}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSendAllZalo}
              className="px-5 py-3 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all min-h-[44px]"
              title="Gửi danh sách qua Zalo để nhận tư vấn báo giá"
            >
              <MessageSquare className="w-4 h-4 text-[#F1E0C6]" />
              <span>Gửi danh sách qua Zalo</span>
            </button>

            <button
              onClick={handleCopyList}
              className="px-5 py-3 bg-white hover:bg-[#F2EDE6] text-[#1D1B17] border border-[#D2C4BA] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all min-h-[44px]"
              title="Sao chép tên và mã sản phẩm vào bộ nhớ tạm"
            >
              <Copy className="w-4 h-4 text-[#523D2A]" />
              <span>Sao chép danh sách</span>
            </button>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="mt-6 pt-5 border-t border-[#F2EDE6] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#523D2A]" />
            <span className="text-xs font-semibold text-[#1D1B17]">Lọc danh mục:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
            >
              <option value="all">Tất cả danh mục ({favoriteProducts.length})</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4E453E]">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
            >
              <option value="newest">Mới lưu</option>
              <option value="name_asc">Tên A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4-column Grid (image 4:5, name, code, filled heart to remove, "Chi tiết tác phẩm" link) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {displayedProducts.map((p) => {
          const mainImg = p.images[p.mainImageIndex] || p.images[0];
          const primaryItem = p.items?.[0];
          const dims = primaryItem?.dimensions;
          const dimStr = dims ? `D${dims.length} x R${dims.width} x C${dims.height} cm` : null;

          return (
            <div
              key={p.id}
              className="group bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#6B5440] transition-all duration-300 flex flex-col"
            >
              {/* Image with 4:5 ratio */}
              <div className="relative aspect-[4/5] bg-[#F2EDE6] overflow-hidden">
                <img
                  src={mainImg}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 cursor-pointer"
                  onClick={() => onSelectProduct(p)}
                />

                {/* Filled Heart to Remove */}
                <button
                  onClick={() => onRemoveFavorite(p.id)}
                  className="absolute top-2.5 right-2.5 min-w-[40px] min-h-[40px] rounded-full bg-white/95 text-red-600 shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
                  title="Xóa khỏi danh sách yêu thích"
                  aria-label="Xóa khỏi yêu thích"
                >
                  <Heart className="w-4 h-4 fill-current text-red-600" />
                </button>

                {/* Category tag */}
                <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full bg-[#1D1B17]/70 backdrop-blur-xs text-[#FEF9F2] text-[9px] font-mono uppercase tracking-wider">
                    {p.code}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectProduct(p)}
                    className="font-serif text-sm sm:text-base font-normal text-[#1D1B17] hover:text-[#523D2A] cursor-pointer transition-colors line-clamp-1 leading-snug"
                    title={p.name}
                  >
                    {p.name}
                  </h3>

                  {dimStr && (
                    <p className="text-[10px] font-mono text-[#4E453E] mt-0.5">{dimStr}</p>
                  )}

                  <p className="text-[11px] text-[#4E453E] line-clamp-1 mt-1 font-light">
                    {p.shortDescription}
                  </p>
                </div>

                {/* Action Link: "Chi tiết tác phẩm" */}
                <div className="pt-3 mt-3 border-t border-[#F2EDE6] flex items-center justify-between">
                  <button
                    onClick={() => onSelectProduct(p)}
                    className="text-xs font-semibold text-[#523D2A] hover:text-[#6B5440] flex items-center gap-1 group-hover:underline underline-offset-2 transition-colors min-h-[36px]"
                  >
                    <span>Chi tiết tác phẩm</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    onClick={() =>
                      contactUtils.copyAndOpenZalo(settings, p, undefined, onShowToast)
                    }
                    className="p-1.5 rounded-lg text-[#523D2A] hover:bg-[#F2EDE6] transition-colors"
                    title="Hỏi báo giá qua Zalo"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
