import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Category, Product, StoreSettings, User } from './types';
import { dataService } from './services/dataService';
import { authService } from './services/authService';
import { favoritesService } from './services/favoritesService';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ShowroomPage } from './components/ShowroomPage';
import { FavoritesPage } from './components/FavoritesPage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { NotFoundPage } from './components/NotFoundPage';
import { MobileDrawer } from './components/MobileDrawer';
import { FilterBottomSheet } from './components/FilterBottomSheet';
import { AuthModal } from './components/AuthModal';
import { FloatingContact } from './components/FloatingContact';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

export default function App() {
  // Routing State based on window.location.pathname / search / hash
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/')) return hash;
      const full = window.location.pathname + window.location.search;
      return full || '/';
    }
    return '/';
  });

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Listen to browser Back / Forward events
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/')) {
        setCurrentPath(hash);
      } else {
        const full = window.location.pathname + window.location.search;
        setCurrentPath(full || '/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Core Data
  const [categories, setCategories] = useState<Category[]>(() => dataService.getCategories(true));
  const [products, setProducts] = useState<Product[]>(() => dataService.getProducts(undefined, true));
  const [settings, setSettings] = useState<StoreSettings>(() => dataService.getSettings());
  const [users, setUsers] = useState<User[]>(() => authService.getUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const user = authService.getCurrentUser();
    return user ? favoritesService.list(user.id) : [];
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Auth changes listener
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setCurrentUser(user);
      if (user) {
        setFavoriteIds(favoritesService.list(user.id));
      } else {
        setFavoriteIds([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubcategorySlug, setSelectedSubcategorySlug] = useState<string>('');
  const [selectedMaterialTags, setSelectedMaterialTags] = useState<string[]>([]);
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Modals & Drawers
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authRedirectReason, setAuthRedirectReason] = useState<string>('');
  const [pendingFavoriteProduct, setPendingFavoriteProduct] = useState<Product | null>(null);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    authService.isAdminAuthenticated()
  );

  // Parse Current Route
  const routeInfo = useMemo<
    | { type: 'admin'; sub: string }
    | { type: 'showroom' }
    | { type: 'favorites' }
    | { type: 'search'; query: string }
    | { type: 'product'; slug: string }
    | { type: 'category'; slug: string }
    | { type: 'home' }
    | { type: 'not-found' }
  >(() => {
    const rawPath = currentPath || '/';
    const [pathPart, queryPart] = rawPath.split('?');
    const pathOnly = pathPart.replace(/\/$/, '') || '/';

    // Parse q param from queryPart or window.location.search
    let q = '';
    if (queryPart) {
      const sp = new URLSearchParams(queryPart);
      q = sp.get('q') || '';
    } else if (typeof window !== 'undefined' && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      q = sp.get('q') || '';
    }

    if (pathOnly.startsWith('/admin')) {
      const sub = pathOnly.replace(/^\/admin\/?/, '');
      return { type: 'admin', sub };
    }
    if (pathOnly === '/showroom') {
      return { type: 'showroom' };
    }
    if (pathOnly === '/yeu-thich') {
      return { type: 'favorites' };
    }
    if (pathOnly === '/tim-kiem') {
      return { type: 'search', query: q };
    }
    if (pathOnly.startsWith('/san-pham/')) {
      const slug = pathOnly.replace('/san-pham/', '');
      return { type: 'product', slug };
    }
    if (pathOnly.startsWith('/danh-muc/')) {
      const slug = pathOnly.replace('/danh-muc/', '');
      return { type: 'category', slug };
    }
    if (pathOnly === '/' || pathOnly === '') {
      return { type: 'home' };
    }
    return { type: 'not-found' };
  }, [currentPath]);

  // Sync search input if URL is /tim-kiem?q=...
  useEffect(() => {
    if (routeInfo.type === 'search') {
      setSearchQuery(routeInfo.query);
    }
  }, [routeInfo]);

  // Dynamic Page Titles
  useEffect(() => {
    if (routeInfo.type === 'home') {
      document.title = 'CDHome Atelier | Nội Thất Tinh Tế & Chế Tác Gỗ Tự Nhiên';
    } else if (routeInfo.type === 'showroom') {
      document.title = 'Showroom CDHome | CDHome Atelier';
    } else if (routeInfo.type === 'favorites') {
      document.title = 'Tác Phẩm Yêu Thích | CDHome Atelier';
    } else if (routeInfo.type === 'search') {
      document.title = `Tìm kiếm: "${routeInfo.query || ''}" | CDHome Atelier`;
    } else if (routeInfo.type === 'admin') {
      document.title = 'Hệ Thống Quản Trị | CDHome';
    } else if (routeInfo.type === 'not-found') {
      document.title = '404 - Không Tìm Thấy Trang | CDHome Atelier';
    }
  }, [routeInfo]);

  // Category Tree
  const categoryTree = useMemo(() => dataService.getCategoryTree(), [categories]);
  const visibleCategories = useMemo(
    () => categories.filter((c) => c.isVisible && c.parentId === null),
    [categories]
  );

  // All available tags
  const allMaterialTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.materialTags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [products]);

  const allStyleTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.styleTags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [products]);

  // Selected Category Object if on category route
  const currentCategoryObj = useMemo(() => {
    if (routeInfo.type === 'category') {
      return dataService.getCategoryBySlug(routeInfo.slug);
    }
    return undefined;
  }, [routeInfo]);

  // Subcategories of active category
  const currentSubcategories = useMemo(() => {
    if (!currentCategoryObj) return [];
    if (currentCategoryObj.parentId === null) {
      return categories.filter((c) => c.parentId === currentCategoryObj.id && c.isVisible);
    }
    return [];
  }, [currentCategoryObj, categories]);

  // Filtered Products for Catalog & Category pages
  const catalogProducts = useMemo(() => {
    const params = {
      categorySlug: routeInfo.type === 'category' ? routeInfo.slug : undefined,
      subCategorySlug: selectedSubcategorySlug || undefined,
      materialTags: selectedMaterialTags.length > 0 ? selectedMaterialTags : undefined,
      styleTags: selectedStyleTags.length > 0 ? selectedStyleTags : undefined,
      searchText: searchQuery || undefined,
      sort: sortBy as 'featured' | 'newest' | 'name_asc'
    };
    return dataService.getProducts(params, false);
  }, [routeInfo, selectedSubcategorySlug, selectedMaterialTags, selectedStyleTags, searchQuery, sortBy, products]);

  // Search Results List (specifically for /tim-kiem)
  const searchResultsList = useMemo(() => {
    const q = routeInfo.type === 'search' ? routeInfo.query : searchQuery;
    if (!q.trim()) return [];
    return dataService.getProducts(
      { searchText: q, sort: sortBy as 'featured' | 'newest' | 'name_asc' },
      false
    );
  }, [routeInfo, searchQuery, sortBy, products]);

  // Open Auth Modal Helper
  const handleOpenAuth = (mode: 'login' | 'register' = 'login', reason?: string) => {
    setAuthInitialMode(mode);
    setAuthRedirectReason(
      reason || (mode === 'register' ? 'Tạo tài khoản để lưu lại tác phẩm yêu thích.' : 'Đăng nhập để xem danh sách yêu thích.')
    );
    setIsAuthModalOpen(true);
  };

  // Wishlist / Favorites Toggle Handler
  const handleToggleWishlist = (product: Product) => {
    if (!currentUser) {
      setPendingFavoriteProduct(product);
      handleOpenAuth(
        'login',
        `Đăng nhập để lưu tác phẩm "${product.name}" vào danh sách yêu thích của bạn.`
      );
      return;
    }

    const isFav = favoritesService.isFavorite(currentUser.id, product.id);
    if (isFav) {
      favoritesService.remove(currentUser.id, product.id);
      setFavoriteIds(favoritesService.list(currentUser.id));
      showToast('Đã xóa khỏi danh sách yêu thích');
    } else {
      favoritesService.add(currentUser.id, product.id);
      setFavoriteIds(favoritesService.list(currentUser.id));
      showToast('Đã lưu vào danh sách yêu thích');
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (pendingFavoriteProduct) {
      favoritesService.add(user.id, pendingFavoriteProduct.id);
      setFavoriteIds(favoritesService.list(user.id));
      showToast('Đã lưu vào danh sách yêu thích');
      setPendingFavoriteProduct(null);
    } else {
      setFavoriteIds(favoritesService.list(user.id));
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setFavoriteIds([]);
    showToast('Đã đăng xuất tài khoản');
  };

  // Tag filter toggles
  const handleToggleMaterialTag = (tag: string) => {
    setSelectedMaterialTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleStyleTag = (tag: string) => {
    setSelectedStyleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedSubcategorySlug('');
    setSelectedMaterialTags([]);
    setSelectedStyleTags([]);
    setSearchQuery('');
    setSortBy('featured');
  };

  const handleSearchSubmit = (q: string) => {
    setSearchQuery(q);
    navigate(`/tim-kiem?q=${encodeURIComponent(q)}`);
  };

  // Admin Actions for Products
  const handleSaveProductAdmin = (prod: Product) => {
    dataService.saveProduct(prod);
    setProducts(dataService.getProducts(undefined, true));
    showToast(`Đã lưu tác phẩm "${prod.name}" thành công.`);
  };

  const handleDuplicateProductAdmin = (id: string) => {
    const copy = dataService.duplicateProduct(id);
    if (copy) {
      setProducts(dataService.getProducts(undefined, true));
      showToast(`Đã nhân bản thành công: ${copy.name}`);
    }
  };

  const handleDeleteProductAdmin = (id: string) => {
    dataService.deleteProduct(id);
    setProducts(dataService.getProducts(undefined, true));
    showToast('Đã xóa tác phẩm.');
  };

  const handleToggleVisibleAdmin = (prod: Product) => {
    dataService.saveProduct({ ...prod, isVisible: !prod.isVisible });
    setProducts(dataService.getProducts(undefined, true));
    showToast(
      prod.isVisible
        ? `Đã chuyển "${prod.name}" vào kho lưu trữ (Ẩn)`
        : `Đã hiển thị "${prod.name}" trên showroom`
    );
  };

  const handleToggleFeaturedAdmin = (prod: Product) => {
    dataService.saveProduct({ ...prod, isFeatured: !prod.isFeatured });
    setProducts(dataService.getProducts(undefined, true));
  };

  const handleBulkVisibilityAdmin = (ids: string[], isVisible: boolean) => {
    dataService.bulkUpdateVisibility(ids, isVisible);
    setProducts(dataService.getProducts(undefined, true));
    showToast(`Đã cập nhật trạng thái ${ids.length} tác phẩm.`);
  };

  const handleBulkDeleteAdmin = (ids: string[]) => {
    dataService.bulkDeleteProducts(ids);
    setProducts(dataService.getProducts(undefined, true));
    showToast(`Đã xóa ${ids.length} tác phẩm.`);
  };

  // Admin Actions for Categories
  const handleSaveCategoryAdmin = (cat: Category) => {
    dataService.saveCategory(cat);
    setCategories(dataService.getCategories(true));
  };

  const handleDeleteCategoryAdmin = (id: string) => {
    dataService.deleteCategory(id);
    setCategories(dataService.getCategories(true));
  };

  const handleReorderCategoriesAdmin = (cats: Category[]) => {
    dataService.updateCategoriesOrder(cats);
    setCategories(dataService.getCategories(true));
  };

  // Admin Actions for Users
  const handleToggleUserStatusAdmin = (userId: string) => {
    authService.toggleUserDisabled(userId);
    setUsers(authService.getUsers());
  };

  // Admin Actions for Store Settings
  const handleSaveSettingsAdmin = (newSettings: StoreSettings) => {
    dataService.updateSettings(newSettings);
    setSettings(dataService.getSettings());
  };

  // --- RENDER ADMIN ROUTE ---
  if (routeInfo.type === 'admin') {
    if (routeInfo.sub === 'login') {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            navigate('/admin');
          }}
          onBackToStore={() => navigate('/')}
        />
      );
    }

    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            navigate('/admin');
          }}
          onBackToStore={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        products={products}
        categories={categories}
        users={users}
        settings={settings}
        adminSubRoute={routeInfo.sub}
        onNavigateAdminRoute={(sub) => navigate(sub ? `/admin/${sub}` : '/admin')}
        onBackToStore={() => navigate('/')}
        onSaveProduct={handleSaveProductAdmin}
        onDuplicateProduct={handleDuplicateProductAdmin}
        onDeleteProduct={handleDeleteProductAdmin}
        onToggleVisible={handleToggleVisibleAdmin}
        onToggleFeatured={handleToggleFeaturedAdmin}
        onBulkUpdateVisibility={handleBulkVisibilityAdmin}
        onBulkDelete={handleBulkDeleteAdmin}
        onPreviewProduct={(p) => navigate(`/san-pham/${p.slug}`)}
        onSaveCategory={handleSaveCategoryAdmin}
        onDeleteCategory={handleDeleteCategoryAdmin}
        onReorderCategories={handleReorderCategoriesAdmin}
        onToggleUserStatus={handleToggleUserStatusAdmin}
        onSaveSettings={handleSaveSettingsAdmin}
        onLogoutAdmin={() => {
          authService.adminLogout();
          setIsAdminLoggedIn(false);
          navigate('/');
        }}
        onShowToast={showToast}
      />
    );
  }

  // --- RENDER STOREFRONT (Customer facing) ---
  const isProductPage = routeInfo.type === 'product';
  const activeProduct = isProductPage ? dataService.getProductBySlug(routeInfo.slug) : null;
  const relatedProducts = activeProduct ? dataService.getRelatedProducts(activeProduct) : [];

  return (
    <div className="min-h-screen bg-[#FEF9F2] text-[#1D1B17] flex flex-col font-sans selection:bg-[#F1E0C6] selection:text-[#523D2A] antialiased">
      {/* Navbar */}
      <Navbar
        settings={settings}
        user={currentUser}
        wishlistCount={favoriteIds.length}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        onNavigateToFavorites={() => navigate('/yeu-thich')}
        onNavigateToShowroom={() => navigate('/showroom')}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
        onLogout={handleLogout}
        onSelectProduct={(p) => navigate(`/san-pham/${p.slug}`)}
        allProducts={products.filter((p) => p.isVisible)}
        onNavigateToHome={() => navigate('/')}
        onNavigateToAdmin={() => navigate(isAdminLoggedIn ? '/admin' : '/admin/login')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content Body */}
      <div className="flex-1 w-full">
        {/* Route: 404 Page */}
        {routeInfo.type === 'not-found' ? (
          <NotFoundPage onBackToHome={() => navigate('/')} />
        ) : isProductPage && activeProduct ? (
          /* Route 1: Product Detail Page (/san-pham/:slug) */
          <ProductDetailPage
            product={activeProduct}
            relatedProducts={relatedProducts}
            settings={settings}
            user={currentUser}
            isWishlisted={favoriteIds.includes(activeProduct.id)}
            wishlistIds={favoriteIds}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={(p) => navigate(`/san-pham/${p.slug}`)}
            onBackToCatalog={() => navigate('/')}
            onShowToast={showToast}
          />
        ) : isProductPage && !activeProduct ? (
          /* Unmatched product slug -> 404 */
          <NotFoundPage onBackToHome={() => navigate('/')} />
        ) : routeInfo.type === 'showroom' ? (
          /* Route 2: Showroom Page (/showroom) */
          <ShowroomPage settings={settings} onShowToast={showToast} />
        ) : routeInfo.type === 'favorites' ? (
          /* Route 3: Favorites Page (/yeu-thich) on DESKTOP with the desktop left sidebar! */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex gap-8 items-start">
              {/* Desktop Left Sidebar */}
              <div className="hidden lg:block">
                <Sidebar
                  categoryTree={categoryTree}
                  currentCategorySlug=""
                  onSelectCategory={(catSlug) => navigate(catSlug ? `/danh-muc/${catSlug}` : '/')}
                  settings={settings}
                  onShowToast={showToast}
                  materialTags={allMaterialTags}
                  selectedMaterialTags={selectedMaterialTags}
                  onToggleMaterialTag={handleToggleMaterialTag}
                  styleTags={allStyleTags}
                  selectedStyleTags={selectedStyleTags}
                  onToggleStyleTag={handleToggleStyleTag}
                />
              </div>

              {/* Favorites Content */}
              <FavoritesPage
                favoriteProducts={products.filter((p) => favoriteIds.includes(p.id))}
                categories={categories}
                onRemoveFavorite={(id) => {
                  if (currentUser) {
                    favoritesService.remove(currentUser.id, id);
                    setFavoriteIds(favoritesService.list(currentUser.id));
                    showToast('Đã xóa khỏi danh sách yêu thích');
                  }
                }}
                onSelectProduct={(p) => navigate(`/san-pham/${p.slug}`)}
                onBackToCatalog={() => navigate('/')}
                onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
                settings={settings}
                user={currentUser}
                onShowToast={showToast}
              />
            </div>
          </div>
        ) : routeInfo.type === 'search' ? (
          /* Route 4: Search Results Page (/tim-kiem?q=...) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex gap-8 items-start">
              {/* Desktop Left Sidebar */}
              <div className="hidden lg:block">
                <Sidebar
                  categoryTree={categoryTree}
                  currentCategorySlug=""
                  onSelectCategory={(catSlug) => navigate(catSlug ? `/danh-muc/${catSlug}` : '/')}
                  settings={settings}
                  onShowToast={showToast}
                  materialTags={allMaterialTags}
                  selectedMaterialTags={selectedMaterialTags}
                  onToggleMaterialTag={handleToggleMaterialTag}
                  styleTags={allStyleTags}
                  selectedStyleTags={selectedStyleTags}
                  onToggleStyleTag={handleToggleStyleTag}
                />
              </div>

              {/* Search Results Grid */}
              <SearchResultsPage
                query={routeInfo.query}
                results={searchResultsList}
                categories={categories}
                wishlistIds={favoriteIds}
                onToggleWishlist={(_, p) => handleToggleWishlist(p)}
                onSelectProduct={(p) => navigate(`/san-pham/${p.slug}`)}
                onSelectCategory={(catSlug) => navigate(`/danh-muc/${catSlug}`)}
                settings={settings}
                onShowToast={showToast}
                sortBy={sortBy}
                onSelectSortBy={setSortBy}
              />
            </div>
          </div>
        ) : routeInfo.type === 'category' ? (
          /* Route 5: Category Page (/danh-muc/:slug) */
          !currentCategoryObj ? (
            <NotFoundPage onBackToHome={() => navigate('/')} />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="flex gap-8 items-start">
                {/* Desktop Left Sidebar */}
                <div className="hidden lg:block">
                  <Sidebar
                    categoryTree={categoryTree}
                    currentCategorySlug={routeInfo.slug}
                    currentSubCategorySlug={selectedSubcategorySlug}
                    onSelectCategory={(catSlug, subSlug) => {
                      setSelectedSubcategorySlug(subSlug || '');
                      if (catSlug) {
                        navigate(`/danh-muc/${catSlug}`);
                      } else {
                        navigate('/');
                      }
                    }}
                    settings={settings}
                    onShowToast={showToast}
                    materialTags={allMaterialTags}
                    selectedMaterialTags={selectedMaterialTags}
                    onToggleMaterialTag={handleToggleMaterialTag}
                    styleTags={allStyleTags}
                    selectedStyleTags={selectedStyleTags}
                    onToggleStyleTag={handleToggleStyleTag}
                  />
                </div>

                {/* Category Grid */}
                <ProductGrid
                  products={catalogProducts}
                  currentCategory={currentCategoryObj}
                  currentSubCategory={categories.find((c) => c.slug === selectedSubcategorySlug)}
                  subcategories={currentSubcategories}
                  selectedSubcategorySlug={selectedSubcategorySlug}
                  sortBy={sortBy}
                  searchQuery={searchQuery}
                  onSelectCategory={(catSlug, subSlug) => {
                    setSelectedSubcategorySlug(subSlug || '');
                    if (catSlug) {
                      navigate(`/danh-muc/${catSlug}`);
                    } else {
                      navigate('/');
                    }
                  }}
                  onSelectSubcategory={(subSlug) => setSelectedSubcategorySlug(subSlug)}
                  onSelectSortBy={setSortBy}
                  onClearFilters={handleClearFilters}
                  onOpenMobileFilters={() => setIsFilterBottomSheetOpen(true)}
                  onSelectProduct={(p) => navigate(`/san-pham/${p.slug}`)}
                  wishlistIds={favoriteIds}
                  onToggleWishlist={(_, p) => handleToggleWishlist(p)}
                  settings={settings}
                  onShowToast={showToast}
                />
              </div>
            </div>
          )
        ) : (
          /* Route 6: Homepage (/) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex gap-8 items-start">
              {/* Desktop Left Sidebar */}
              <div className="hidden lg:block">
                <Sidebar
                  categoryTree={categoryTree}
                  currentCategorySlug=""
                  onSelectCategory={(catSlug) => navigate(catSlug ? `/danh-muc/${catSlug}` : '/')}
                  settings={settings}
                  onShowToast={showToast}
                  materialTags={allMaterialTags}
                  selectedMaterialTags={selectedMaterialTags}
                  onToggleMaterialTag={handleToggleMaterialTag}
                  styleTags={allStyleTags}
                  selectedStyleTags={selectedStyleTags}
                  onToggleStyleTag={handleToggleStyleTag}
                />
              </div>

              {/* Homepage Showcase */}
              <div className="flex-1 min-w-0">
                <HomePage
                  categories={visibleCategories}
                  products={products.filter((p) => p.isVisible)}
                  settings={settings}
                  onSelectCategory={(catSlug) => navigate(`/danh-muc/${catSlug}`)}
                  onSelectProduct={(p) => navigate(`/san-pham/${p.slug}`)}
                  wishlistIds={favoriteIds}
                  onToggleWishlist={(_, p) => handleToggleWishlist(p)}
                  onShowToast={showToast}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigateToShowroom={() => navigate('/showroom')}
        onShowToast={showToast}
      />

      {/* Floating Action Contact Button (Hidden on mobile product page) */}
      <FloatingContact
        settings={settings}
        onShowToast={showToast}
        isMobileProductPage={isProductPage}
      />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        categoryTree={categoryTree}
        currentCategorySlug={routeInfo.type === 'category' ? routeInfo.slug : undefined}
        currentSubCategorySlug={selectedSubcategorySlug}
        onSelectCategory={(catSlug, subSlug) => {
          setSelectedSubcategorySlug(subSlug || '');
          if (catSlug) {
            navigate(`/danh-muc/${catSlug}`);
          } else {
            navigate('/');
          }
        }}
        settings={settings}
        user={currentUser}
        onOpenAuth={() => handleOpenAuth('login')}
        onLogout={handleLogout}
        onNavigateToFavorites={() => navigate('/yeu-thich')}
        onNavigateToShowroom={() => navigate('/showroom')}
        onNavigateToAdmin={() => navigate(isAdminLoggedIn ? '/admin' : '/admin/login')}
        wishlistCount={favoriteIds.length}
        onShowToast={showToast}
      />

      {/* Filter Bottom Sheet on Mobile */}
      <FilterBottomSheet
        isOpen={isFilterBottomSheetOpen}
        onClose={() => setIsFilterBottomSheetOpen(false)}
        categories={visibleCategories}
        currentCategorySlug={routeInfo.type === 'category' ? routeInfo.slug : undefined}
        subcategories={currentSubcategories}
        selectedSubcategorySlug={selectedSubcategorySlug}
        onSelectCategory={(catSlug) => {
          setSelectedSubcategorySlug('');
          navigate(catSlug ? `/danh-muc/${catSlug}` : '/');
        }}
        onSelectSubcategory={(subSlug) => setSelectedSubcategorySlug(subSlug)}
        materialTags={allMaterialTags}
        selectedMaterialTags={selectedMaterialTags}
        onToggleMaterialTag={handleToggleMaterialTag}
        styleTags={allStyleTags}
        selectedStyleTags={selectedStyleTags}
        onToggleStyleTag={handleToggleStyleTag}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        totalResults={catalogProducts.length}
        onClearFilters={handleClearFilters}
      />

      {/* Global Auth Modal (Desktop Modal / Mobile Bottom Sheet) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
        redirectReason={authRedirectReason}
      />

      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
