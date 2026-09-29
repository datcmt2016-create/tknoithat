import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Search, Heart, User as UserIcon, Phone, MessageSquare, 
  X, ChevronRight, LogOut, Shield
} from 'lucide-react';
import { Product, StoreSettings, User } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  user: User | null;
  wishlistCount: number;
  onOpenMobileDrawer: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToShowroom: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
  onNavigateToHome: () => void;
  onNavigateToAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  user,
  wishlistCount,
  onOpenMobileDrawer,
  onNavigateToFavorites,
  onNavigateToShowroom,
  onOpenAuth,
  onLogout,
  onSelectProduct,
  allProducts,
  onNavigateToHome,
  onNavigateToAdmin,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
      setIsSearchFocused(false);
    }
  };

  const searchResults = searchQuery.trim()
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 bg-[#FEF9F2]/95 backdrop-blur-md border-b border-[#D2C4BA] shadow-2xs font-sans">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Trigger & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileDrawer}
            className="lg:hidden p-2 -ml-2 rounded-xl text-[#1D1B17] hover:bg-[#F2EDE6] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={onNavigateToHome}
            className="flex flex-col text-left select-none group min-h-[44px] justify-center"
          >
            <span className="font-serif font-normal text-2xl sm:text-3xl tracking-[0.18em] text-[#523D2A] group-hover:text-[#6B5440] transition-colors uppercase">
              {settings.name}
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#4E453E] font-medium hidden sm:block">
              Atelier Serenity • Japandi Living
            </span>
          </button>
        </div>

        {/* Center: Live Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-md relative hidden md:block">
          <form onSubmit={handleFormSubmit} className="relative">
            <button
              type="submit"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[#4E453E] hover:text-[#523D2A] min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Tìm theo tên tác phẩm, mã sản phẩm (VD: Mộc Miên, Roma...)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-10 pr-9 py-2 bg-white border border-[#D2C4BA] rounded-full text-xs text-[#1D1B17] placeholder:text-[#4E453E]/70 focus:outline-none focus:border-[#523D2A] focus:ring-1 focus:ring-[#523D2A] transition-all min-h-[40px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E453E] hover:text-[#1D1B17] p-1"
                aria-label="Xóa từ khóa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] shadow-2xl overflow-hidden z-50 divide-y divide-[#F2EDE6] animate-in fade-in duration-150">
              <div className="px-4 py-2 bg-[#F2EDE6] text-[10px] font-bold text-[#523D2A] uppercase tracking-wider flex justify-between">
                <span>Gợi ý tác phẩm</span>
                <span>{searchResults.length} kết quả</span>
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#4E453E]">
                  Không tìm thấy tác phẩm phù hợp với từ khóa.
                </div>
              ) : (
                <>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-[#F2EDE6] flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-11 h-11 object-cover rounded-lg border border-[#D2C4BA]"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-[#523D2A] font-bold">
                          {product.code}
                        </span>
                        <p className="text-xs font-medium text-[#1D1B17] truncate">{product.name}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#D2C4BA] shrink-0" />
                    </div>
                  ))}
                  {onSearchSubmit && (
                    <button
                      type="button"
                      onClick={() => {
                        onSearchSubmit(searchQuery.trim());
                        setIsSearchFocused(false);
                      }}
                      className="w-full py-2.5 px-4 bg-[#F2EDE6] hover:bg-[#F1E0C6] text-xs font-semibold text-[#523D2A] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Xem tất cả kết quả tìm kiếm cho "{searchQuery}"</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: About, Hotline, Favorites, Account */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* About CDHome (desktop; mobile uses the drawer link) */}
          <button
            onClick={onNavigateToShowroom}
            className="hidden lg:flex items-center px-4 py-2 rounded-full whitespace-nowrap bg-[#523D2A] text-xs font-semibold text-white hover:bg-[#6B5440] transition-colors min-h-[44px]"
          >
            Về CDHome
          </button>

          {/* Hotline Quick Call (desktop) */}
          <a
            href={`tel:${settings.phone}`}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap bg-[#F2EDE6] text-xs font-semibold text-[#523D2A] hover:bg-[#F1E0C6] transition-colors min-h-[44px]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="font-mono">{settings.phone}</span>
          </a>

          {/* Favorites Heart Icon with Live Count */}
          <button
            onClick={onNavigateToFavorites}
            className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#1D1B17] hover:text-[#523D2A] hover:bg-[#F2EDE6] transition-colors"
            title="Danh sách yêu thích"
            aria-label="Danh sách yêu thích"
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#523D2A] text-[#523D2A]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#523D2A] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          <div ref={userMenuRef} className="relative">
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-white border border-[#D2C4BA] hover:border-[#523D2A] transition-colors min-h-[44px]"
              >
                <span className="text-xs font-medium text-[#1D1B17] max-w-[100px] truncate hidden md:inline-block">
                  {user.username}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#523D2A] text-white flex items-center justify-center font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D2C4BA] bg-white text-xs font-semibold text-[#523D2A] hover:bg-[#F2EDE6] transition-colors min-h-[44px]"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* Dropdown: ONLY "Danh sách yêu thích", "Đăng xuất" (NO "Lịch sử tư vấn"!) */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-52 bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] shadow-xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-[#F2EDE6]">
                  <p className="text-xs font-bold text-[#1D1B17] truncate">{user.username}</p>
                  <p className="text-[10px] text-[#4E453E]">Thành viên lưu trữ</p>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigateToFavorites();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#1D1B17] hover:bg-[#F2EDE6] flex items-center justify-between min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#523D2A]" />
                    <span>Danh sách yêu thích</span>
                  </div>
                  <span className="font-mono text-[#523D2A] font-bold">{wishlistCount}</span>
                </button>

                <div className="border-t border-[#F2EDE6] my-1"></div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-700 hover:bg-red-50 flex items-center gap-2 min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin shortcut */}
          <button
            onClick={onNavigateToAdmin}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#4E453E] hover:text-[#523D2A] hover:bg-[#F2EDE6] transition-colors"
            title="Quản trị"
            aria-label="Cổng quản trị"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#4E453E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm sofa, bàn ăn, giường Mộc Miên..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-white border border-[#D2C4BA] rounded-full text-xs text-[#1D1B17] placeholder:text-[#4E453E]/70 focus:outline-none focus:border-[#523D2A] min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E453E] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
