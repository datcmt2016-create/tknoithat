import React from 'react';
import { ChevronRight, ArrowRight, MessageSquare, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { Category, Product, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';
import { contactUtils } from '../utils/contact';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  settings: StoreSettings;
  onSelectCategory: (categorySlug: string) => void;
  onSelectProduct: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (e: React.MouseEvent, product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  products,
  settings,
  onSelectCategory,
  onSelectProduct,
  wishlistIds,
  onToggleWishlist,
  onShowToast
}) => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  const handleBookVisitZalo = () => {
    contactUtils.copyAndOpenZalo(settings, null, 'Chào CDHome, tôi muốn đặt lịch ghé thăm showroom Thảo Điền.', onShowToast);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 font-sans">
      {/* 1. Hero Showcase (Quiet Luxury) */}
      <section className="relative rounded-3xl overflow-hidden border border-[#D2C4BA] bg-[#523D2A] text-[#FEF9F2] shadow-sm">
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <img
            src={settings.heroImage}
            alt={settings.heroHeadline}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1D1B17]/95 via-[#1D1B17]/75 to-transparent"></div>

        <div className="relative z-10 max-w-2xl p-6 sm:p-10 md:p-14 space-y-4">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#F1E0C6] font-semibold block">
            Atelier Serenity • Thảo Điền
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight text-white">
            {settings.heroHeadline}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#D2C4BA] font-light leading-relaxed">
            {settings.heroTagline}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectCategory('giuong-ngu')}
              className="px-6 py-3 bg-[#FEF9F2] hover:bg-[#F1E0C6] text-[#523D2A] rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md min-h-[44px]"
            >
              Khám Phá Bộ Sưu Tập
            </button>
            <button
              onClick={handleBookVisitZalo}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-[#FEF9F2] border border-[#D2C4BA]/50 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 min-h-[44px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#F1E0C6]" />
              <span>Đặt Lịch Qua Zalo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Band Quote: Quiet Luxury Statement */}
      <section className="py-6 px-4 sm:px-8 text-center max-w-3xl mx-auto space-y-2">
        <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#523D2A] leading-relaxed">
          "{settings.bandQuote}"
        </p>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#4E453E] block pt-1">
          CDHome Atelier Philosophy
        </span>
      </section>

      {/* 3. Categories Grid: 8 Top-level categories */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#D2C4BA] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#523D2A] font-bold">
              Không Gian Sống
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B17] mt-0.5">
              Danh Mục Không Gian
            </h2>
          </div>
          <span className="text-xs text-[#4E453E] hidden sm:inline font-light">
            Gỗ óc chó & sồi Bắc Mỹ chuẩn FAS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] overflow-hidden cursor-pointer hover:border-[#523D2A] hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE6]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-serif text-sm sm:text-base font-medium">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Seasonal Banner: Giường ngủ & Phòng tịnh dưỡng */}
      <section className="relative rounded-3xl overflow-hidden border border-[#D2C4BA] bg-[#F2EDE6] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-3 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#523D2A] font-bold">
            Tiêu Điểm Mùa
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B17]">
            {settings.seasonalBannerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#4E453E] font-light leading-relaxed">
            {settings.seasonalBannerText}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectCategory('giuong-ngu')}
              className="px-5 py-2.5 bg-[#523D2A] text-white hover:bg-[#6B5440] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Xem Bộ Giường Mộc Miên</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 h-52 rounded-2xl overflow-hidden border border-[#D2C4BA] shrink-0">
          <img
            src={settings.seasonalBannerImage}
            alt={settings.seasonalBannerTitle}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 5. Featured Products Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#D2C4BA] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#523D2A] font-bold">
              Tuyển Chọn Đặc Biệt
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B17] mt-0.5">
              Tác Phẩm Tiêu Biểu
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('')}
            className="text-xs font-semibold text-[#523D2A] hover:underline flex items-center gap-1 min-h-[44px]"
          >
            <span>Tất cả tác phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWishlisted={wishlistIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              settings={settings}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
