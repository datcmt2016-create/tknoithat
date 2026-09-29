import React, { useState } from 'react';
import { 
  X, ChevronDown, ChevronRight, Phone, MessageSquare, 
  MapPin, Heart, User as UserIcon, LogOut, ArrowRight, Shield
} from 'lucide-react';
import { Category, StoreSettings, User } from '../types';
import { contactUtils } from '../utils/contact';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categoryTree: { category: Category; subcategories: Category[] }[];
  currentCategorySlug?: string;
  currentSubCategorySlug?: string;
  onSelectCategory: (categorySlug: string, subCategorySlug?: string) => void;
  settings: StoreSettings;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToShowroom: () => void;
  onNavigateToAdmin: () => void;
  wishlistCount: number;
  onShowToast: (msg: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  categoryTree,
  currentCategorySlug,
  currentSubCategorySlug,
  onSelectCategory,
  settings,
  user,
  onOpenAuth,
  onLogout,
  onNavigateToFavorites,
  onNavigateToShowroom,
  onNavigateToAdmin,
  wishlistCount,
  onShowToast
}) => {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(categoryTree[0]?.category.id || null);

  if (!isOpen) return null;

  const toggleCategoryGroup = (catId: string) => {
    // One group open at a time
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
  };

  const handleBookVisitZalo = () => {
    contactUtils.copyAndOpenZalo(settings, null, 'Chào CDHome, tôi muốn đặt lịch ghé thăm showroom CDHome.', onShowToast);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-200">
      <div 
        className="w-4/5 max-w-sm h-full bg-[#FEF9F2] border-r border-[#D2C4BA] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#D2C4BA] bg-[#523D2A] text-[#FEF9F2] flex items-center justify-between">
          <div>
            <div className="font-serif tracking-widest text-lg font-bold text-[#F1E0C6]">
              CDHOME
            </div>
            <div className="text-[10px] tracking-wider uppercase text-[#D2C4BA]">
              Atelier Serenity • CDHome
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#D2C4BA] hover:text-white hover:bg-white/10"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Bar */}
        <div className="px-5 py-3.5 bg-[#F2EDE6] border-b border-[#D2C4BA] flex items-center justify-between text-xs">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#523D2A] text-[#FEF9F2] flex items-center justify-center font-bold text-xs">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-medium text-[#1D1B17] truncate">{user.username}</p>
                <p className="text-[10px] text-[#4E453E]">Đã đăng nhập</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#4E453E]" />
              <span className="text-[#4E453E]">Khách vãng lai</span>
            </div>
          )}

          {user ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="text-[#4E453E] hover:text-red-700 transition-colors flex items-center gap-1 text-xs min-h-[44px] px-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="text-[#523D2A] font-semibold hover:underline min-h-[44px] px-2 flex items-center"
            >
              Đăng nhập
            </button>
          )}
        </div>

        {/* Quick Links: Yêu thích & Showroom */}
        <div className="px-4 py-2 border-b border-[#D2C4BA] space-y-1.5">
          <button
            onClick={() => {
              onClose();
              onNavigateToFavorites();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#D2C4BA] text-xs font-medium text-[#1D1B17] hover:bg-[#F2EDE6] transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-[#523D2A] fill-[#523D2A]/15" />
              <span>Danh sách yêu thích</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#523D2A] text-white text-[11px] font-bold">
              {wishlistCount}
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateToShowroom();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#1D1B17] hover:bg-[#F2EDE6] transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#523D2A]" />
              <span>Showroom CDHome</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#4E453E]" />
          </button>
        </div>

        {/* Category Accordion (One group open at a time) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#4E453E]">
            Danh mục sản phẩm
          </div>

          {/* All products */}
          <button
            onClick={() => {
              onSelectCategory('');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-colors min-h-[44px] ${
              !currentCategorySlug
                ? 'bg-[#523D2A] text-white'
                : 'text-[#1D1B17] hover:bg-[#F2EDE6]'
            }`}
          >
            <span>Tất cả sản phẩm</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Category Tree */}
          {categoryTree.map(({ category, subcategories }) => {
            const isGroupOpen = openCategoryId === category.id;
            const isCategoryActive =
              currentCategorySlug === category.slug && !currentSubCategorySlug;

            return (
              <div key={category.id} className="rounded-xl overflow-hidden">
                <div
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer min-h-[44px] ${
                    isCategoryActive
                      ? 'bg-[#F1E0C6] text-[#523D2A] font-bold'
                      : 'text-[#1D1B17] hover:bg-[#F2EDE6]'
                  }`}
                  onClick={() => {
                    toggleCategoryGroup(category.id);
                    onSelectCategory(category.slug);
                    onClose();
                  }}
                >
                  <span className="text-xs">{category.name}</span>
                  {subcategories.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryGroup(category.id);
                      }}
                      className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#4E453E] hover:text-[#1D1B17]"
                      aria-label="Xem chủng loại con"
                    >
                      {isGroupOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories Accordion Content */}
                {isGroupOpen && subcategories.length > 0 && (
                  <div className="pl-6 pr-2 py-1 space-y-0.5 bg-[#FEF9F2]/80 border-l-2 border-[#D2C4BA] ml-3 my-1">
                    {subcategories.map((sub) => {
                      const isSubActive = currentSubCategorySlug === sub.slug;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            onSelectCategory(category.slug, sub.slug);
                            onClose();
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors min-h-[44px] flex items-center ${
                            isSubActive
                              ? 'text-[#523D2A] font-bold bg-[#F1E0C6]'
                              : 'text-[#4E453E] hover:text-[#1D1B17] hover:bg-[#F2EDE6]'
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer & Actions */}
        <div className="p-4 border-t border-[#D2C4BA] bg-[#F2EDE6] space-y-3">
          <button
            onClick={handleBookVisitZalo}
            className="w-full py-3 bg-[#523D2A] hover:bg-[#6B5440] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Đặt lịch qua Zalo</span>
          </button>

          <div className="flex items-center justify-between text-xs text-[#4E453E]">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-[#1D1B17] min-h-[44px] px-1">
              <Phone className="w-3.5 h-3.5 text-[#523D2A]" />
              <span>{settings.phone}</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onNavigateToAdmin();
              }}
              className="flex items-center gap-1 text-[#4E453E] hover:text-[#1D1B17] min-h-[44px] px-1"
            >
              <Shield className="w-3.5 h-3.5 text-[#523D2A]" />
              <span>Quản trị</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
