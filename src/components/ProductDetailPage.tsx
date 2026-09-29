import React, { useState, useEffect } from 'react';
import { 
  Heart, Share2, Check, MessageSquare, Phone, ChevronRight, 
  Ruler, ShieldCheck, Palette, FileText, Sparkles, Layers, ArrowLeft, ZoomIn, X
} from 'lucide-react';
import { Product, StoreSettings, User } from '../types';
import { contactUtils } from '../utils/contact';
import { ProductCard } from './ProductCard';
import { ProductSpecs } from './ProductSpecs';

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  settings: StoreSettings;
  user: User | null;
  isWishlisted: boolean;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onBackToCatalog: () => void;
  onShowToast: (msg: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  settings,
  user,
  isWishlisted,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onBackToCatalog,
  onShowToast
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [focusDimensionsRequest, setFocusDimensionsRequest] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(product.mainImageIndex || 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${product.name} | CDHome Atelier`;
  }, [product.slug]);

  const handleZaloQuote = () => {
    contactUtils.copyAndOpenZalo(settings, product, undefined, onShowToast);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      onShowToast('Đã sao chép liên kết sản phẩm');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="font-sans pb-28 md:pb-16 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <nav className="flex items-center gap-1.5 text-xs text-[#4E453E] overflow-x-auto whitespace-nowrap">
          <button
            onClick={onBackToCatalog}
            className="hover:text-[#523D2A] transition-colors flex items-center gap-1 min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog CDHome</span>
          </button>
          <ChevronRight className="w-3 h-3 text-[#D2C4BA]" />
          <span className="font-mono text-[#523D2A] font-semibold">{product.code}</span>
          <ChevronRight className="w-3 h-3 text-[#D2C4BA]" />
          <span className="text-[#1D1B17] font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery & Lightbox (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#F2EDE6] border border-[#D2C4BA] shadow-inner group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                loading="eager"
                className="w-full h-full object-cover object-center cursor-zoom-in transition-all duration-300"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Lightbox zoom button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#FEF9F2]/80 hover:bg-white rounded-full text-[#1D1B17] shadow-sm backdrop-blur-xs transition-colors"
                title="Phóng to ảnh"
                aria-label="Phóng to ảnh"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                {product.isNew && (
                  <span className="px-2.5 py-1 rounded-full bg-[#523D2A] text-white text-[11px] font-medium">
                    Mới ra mắt
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-2.5 py-1 rounded-full bg-[#F1E0C6] text-[#523D2A] text-[11px] font-semibold border border-[#D2C4BA]">
                    Tác phẩm tiêu biểu
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row / Dots on Mobile */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 items-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#523D2A] ring-2 ring-[#523D2A]/20 scale-95'
                        : 'border-[#D2C4BA] hover:border-[#6B5440] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Atelier Craftsmanship Promises (Quiet Luxury) */}
            <div className="bg-[#F2EDE6] rounded-2xl p-4 border border-[#D2C4BA] grid grid-cols-3 gap-3 text-center">
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#523D2A]" />
                <p className="text-xs font-bold text-[#1D1B17]">Bảo Hành 5 - 10 Năm</p>
                <p className="text-[10px] text-[#4E453E]">Khung sườn gỗ tự nhiên</p>
              </div>
              <div className="space-y-1 border-x border-[#D2C4BA]">
                <Ruler className="w-5 h-5 mx-auto text-[#523D2A]" />
                <p className="text-xs font-bold text-[#1D1B17]">Tùy Biến Kích Thước</p>
                <p className="text-[10px] text-[#4E453E]">May đo chuẩn theo bản vẽ</p>
              </div>
              <div className="space-y-1">
                <Palette className="w-5 h-5 mx-auto text-[#523D2A]" />
                <p className="text-xs font-bold text-[#1D1B17]">Mẫu Gỗ & Da Vải</p>
                <p className="text-[10px] text-[#4E453E]">Trực tiếp tại showroom CDHome</p>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Quote CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#523D2A] bg-[#F1E0C6] px-2.5 py-0.5 rounded-full border border-[#D2C4BA]">
                  Mã: {product.code}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#4E453E] hover:text-[#1D1B17] hover:bg-[#F2EDE6] transition-colors"
                    title="Chia sẻ liên kết"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
                      isWishlisted
                        ? 'text-red-600 bg-red-50'
                        : 'text-[#4E453E] hover:text-red-600 hover:bg-[#F2EDE6]'
                    }`}
                    title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Lưu vào yêu thích'}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1D1B17] leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-[#4E453E] mt-3 leading-relaxed font-light">
                {product.shortDescription}
              </p>
            </div>

            {/* Colors list if present */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1D1B17] block">
                  Tùy chọn hoàn thiện bề mặt:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <span
                      key={c.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17]"
                    >
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }}></span>
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Dimensions Box */}
            {product.items && product.items.length > 0 && (
              <div className="bg-[#FEF9F2] p-4 rounded-2xl border border-[#D2C4BA] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#523D2A] uppercase tracking-wider">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Quy Cách Kích Thước Tiêu Chuẩn (cm)</span>
                </div>
                <div className="divide-y divide-[#F2EDE6] text-xs">
                  {product.items.map((item, i) => (
                    <div key={i} className="py-1.5 first:pt-0 last:pb-0 flex justify-between items-center">
                      <span className="font-medium text-[#1D1B17]">{item.name}</span>
                      <span className="font-mono text-[#4E453E]">
                        D{item.dimensions.length} x R{item.dimensions.width} x C{item.dimensions.height} cm
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setFocusDimensionsRequest((n) => n + 1)}
                  className="pt-1 text-xs font-semibold text-[#523D2A] hover:underline flex items-center gap-1 min-h-[44px]"
                >
                  <span>{product.dimensionImages.length > 0 ? 'Xem bản vẽ kỹ thuật & thông số chi tiết' : 'Xem thông số chi tiết'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* CTA Buttons (NO prices, NO cart, NO checkout) */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleZaloQuote}
                className="w-full py-4 px-6 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] rounded-2xl text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-[#F1E0C6]" />
                <span>Nhận Báo Giá Qua Zalo</span>
              </button>

              <a
                href={`tel:${settings.phone}`}
                className="w-full py-3 px-3 bg-white border border-[#D2C4BA] hover:bg-[#F2EDE6] text-[#1D1B17] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5 text-[#523D2A]" />
                <span>Gọi Hotline</span>
                <span className="font-mono text-[#523D2A]">{settings.phone}</span>
              </a>

              <p className="text-[11px] text-[#4E453E] text-center font-light pt-1">
                Quý khách có thể gửi mặt bằng kiến trúc để chuyên gia tư vấn phối cảnh 3D miễn phí.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specs & Details: Dimensions, Design, Materials, Usage (tabs on desktop, accordion on mobile) */}
        <ProductSpecs key={product.id} product={product} focusDimensionsRequest={focusDimensionsRequest} />

        {/* Highlights (hidden when empty) */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#D2C4BA] space-y-6">
            <h2 className="font-serif text-2xl text-[#1D1B17]">
              Điểm Chạm Chế Tác
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.highlights.map((h, i) => (
                <div key={i} className="bg-[#F2EDE6] p-6 rounded-2xl border border-[#D2C4BA] space-y-2">
                  <h3 className="font-serif text-lg text-[#523D2A]">{h.title}</h3>
                  <p className="text-xs text-[#4E453E] leading-relaxed">{h.text}</p>
                  {h.image && (
                    <img src={h.image} alt={h.title} className="w-full h-48 object-cover rounded-xl mt-3 border border-[#D2C4BA]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifestyle / Atmosphere Image */}
        {product.lifestyleImage && (
          <div className="mt-12 rounded-3xl overflow-hidden border border-[#D2C4BA] aspect-[21/9] bg-[#F2EDE6]">
            <img src={product.lifestyleImage} alt={`${product.name} Lifestyle`} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#D2C4BA] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#523D2A] font-semibold">
                  Gợi Ý Cùng Phong Cách
                </span>
                <h2 className="font-serif text-2xl text-[#1D1B17] mt-0.5">
                  Tác Phẩm Liên Quan
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  isWishlisted={wishlistIds.includes(rel.id)}
                  onToggleWishlist={(_, p) => onToggleWishlist(p)}
                  onSelectProduct={onSelectProduct}
                  settings={settings}
                  onShowToast={onShowToast}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal on Desktop */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Đóng phóng to"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Sticky Bottom Bar on Mobile (<768px): Nhận báo giá qua Zalo + Phone + Heart (Tap targets >= 44px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#FEF9F2]/95 backdrop-blur-md border-t border-[#D2C4BA] p-3 px-4 flex items-center gap-2.5 shadow-2xl z-30">
        <button
          onClick={() => onToggleWishlist(product)}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition-colors ${
            isWishlisted
              ? 'bg-red-50 text-red-600 border-red-300'
              : 'bg-white text-[#4E453E] border-[#D2C4BA]'
          }`}
          title="Lưu yêu thích"
          aria-label="Lưu sản phẩm vào yêu thích"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        <a
          href={`tel:${settings.phone}`}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-white text-[#523D2A] border border-[#D2C4BA] rounded-xl"
          title="Gọi điện"
          aria-label="Gọi điện showroom"
        >
          <Phone className="w-5 h-5" />
        </a>

        <button
          onClick={handleZaloQuote}
          className="flex-1 min-h-[44px] py-3 px-4 bg-[#523D2A] active:bg-[#6B5440] text-[#FEF9F2] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
        >
          <MessageSquare className="w-4 h-4 text-[#F1E0C6]" />
          <span>Nhận Báo Giá Qua Zalo</span>
        </button>
      </div>
    </div>
  );
};
