import React, { useState } from 'react';
import { Heart, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { contactUtils } from '../utils/contact';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent, product: Product) => void;
  onSelectProduct: (product: Product) => void;
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  settings,
  onShowToast
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Formatted dimensions
  const primaryItem = product.items?.[0];
  const dims = primaryItem?.dimensions;
  const dimensionString = dims
    ? `D${dims.length} x R${dims.width} x C${dims.height} cm`
    : null;

  const mainImg = product.images[product.mainImageIndex] || product.images[0];
  const hoverImg =
    product.hoverImageIndex !== undefined && product.images[product.hoverImageIndex]
      ? product.images[product.hoverImageIndex]
      : mainImg;

  const handleZaloQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    contactUtils.copyAndOpenZalo(settings, product, undefined, onShowToast);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#6B5440] transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-[#F2EDE6] overflow-hidden">
        <img
          src={isHovered ? hoverImg : mainImg}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-all duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-[#523D2A]/90 backdrop-blur-xs text-[#FEF9F2] text-[10px] font-medium tracking-wide">
              Mới
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-[#F1E0C6] text-[#523D2A] text-[10px] font-semibold border border-[#D2C4BA]/50">
              Tiêu biểu
            </span>
          )}
        </div>

        {/* Heart Wishlist Button (Min 44x44px tap target) */}
        <button
          onClick={(e) => onToggleWishlist(e, product)}
          className={`absolute top-2 right-2 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted
              ? 'text-red-600 bg-white/95 shadow-md scale-105'
              : 'text-[#4E453E] bg-[#FEF9F2]/80 hover:text-red-500 hover:bg-white shadow-xs backdrop-blur-xs'
          }`}
          title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Lưu vào yêu thích'}
          aria-label="Lưu sản phẩm"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Quick Zalo Hover Button */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-between pointer-events-auto">
          <span className="text-[11px] text-[#FEF9F2] font-medium">Báo giá & Mẫu gỗ</span>
          <button
            onClick={handleZaloQuote}
            className="px-3 py-1.5 rounded-lg bg-[#523D2A] hover:bg-[#6B5440] text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-transform active:scale-95"
            title="Nhận báo giá qua Zalo"
          >
            <span>Nhận báo giá qua Zalo</span>
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Code & Dimensions */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#523D2A]">
              {product.code}
            </span>
            {dimensionString && (
              <span className="text-[10px] text-[#4E453E] font-mono hidden sm:inline-block">
                {dimensionString}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-sm sm:text-base font-normal text-[#1D1B17] group-hover:text-[#523D2A] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-[11px] text-[#4E453E] line-clamp-1 mt-1 leading-normal font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Bottom Card Action (NO price) */}
        <div className="pt-3 mt-3 border-t border-[#F2EDE6] flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-[#4E453E] group-hover:text-[#523D2A] flex items-center gap-1">
            <span>Chi tiết quy cách</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>

          <span className="text-[10px] text-[#523D2A] font-semibold bg-[#F2EDE6] px-2 py-0.5 rounded-full border border-[#D2C4BA]/60">
            Tư vấn báo giá
          </span>
        </div>
      </div>
    </div>
  );
};
