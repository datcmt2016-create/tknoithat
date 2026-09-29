import React from 'react';
import { 
  LayoutDashboard, Package, Layers, Users, Settings, 
  Store, ArrowLeft, ShieldCheck, LogOut, ExternalLink
} from 'lucide-react';
import { Category, Product, StoreSettings, User } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminProductForm } from './AdminProductForm';
import { AdminCategories } from './AdminCategories';
import { AdminUsers } from './AdminUsers';
import { AdminSettings } from './AdminSettings';

interface AdminLayoutProps {
  products: Product[];
  categories: Category[];
  users: User[];
  settings: StoreSettings;
  adminSubRoute: string; // '', 'san-pham', 'san-pham/moi', 'danh-muc', 'nguoi-dung', 'cai-dat'
  onNavigateAdminRoute: (route: string) => void;
  onBackToStore: () => void;
  onSaveProduct: (product: Product) => void;
  onDuplicateProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onToggleVisible: (product: Product) => void;
  onToggleFeatured: (product: Product) => void;
  onBulkUpdateVisibility: (ids: string[], isVisible: boolean) => void;
  onBulkDelete: (ids: string[]) => void;
  onPreviewProduct: (product: Product) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (categories: Category[]) => void;
  onToggleUserStatus: (userId: string) => void;
  onSaveSettings: (settings: StoreSettings) => void;
  onLogoutAdmin: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  products,
  categories,
  users,
  settings,
  adminSubRoute,
  onNavigateAdminRoute,
  onBackToStore,
  onSaveProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onToggleVisible,
  onToggleFeatured,
  onBulkUpdateVisibility,
  onBulkDelete,
  onPreviewProduct,
  onSaveCategory,
  onDeleteCategory,
  onReorderCategories,
  onToggleUserStatus,
  onSaveSettings,
  onLogoutAdmin,
  onShowToast
}) => {
  // Check if editing or creating a product
  const isEditingOrCreating =
    adminSubRoute.startsWith('san-pham/moi') ||
    (adminSubRoute.startsWith('san-pham/') && adminSubRoute !== 'san-pham');

  const editingProductId =
    isEditingOrCreating && adminSubRoute !== 'san-pham/moi'
      ? adminSubRoute.replace('san-pham/', '')
      : null;

  const currentEditingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#F2EDE6] text-[#1D1B17] flex flex-col font-sans antialiased">
      {/* Admin Topbar */}
      <header className="bg-[#523D2A] text-[#FEF9F2] sticky top-0 z-30 border-b border-[#3D2C1E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FEF9F2] text-xs font-semibold transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-[#F1E0C6]" />
              <span>Xem Showroom</span>
            </button>
            <div className="h-5 w-px bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F1E0C6]" />
              <span className="font-serif font-normal text-base tracking-wider uppercase text-white">
                CDHome Quản Trị
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-700/80 text-white text-xs font-medium transition-colors min-h-[44px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar (Desktop-first) */}
        {!isEditingOrCreating && (
          <aside className="w-full md:w-60 flex-shrink-0">
            <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-3 shadow-xs sticky top-22 space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#4E453E]">
                Mục Quản Trị
              </div>

              {/* 1. Tổng quan */}
              <button
                onClick={() => onNavigateAdminRoute('')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  adminSubRoute === ''
                    ? 'bg-[#523D2A] text-white shadow-xs'
                    : 'text-[#4E453E] hover:bg-[#F2EDE6]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#F1E0C6]" />
                <span>Tổng Quan</span>
              </button>

              {/* 2. Sản phẩm */}
              <button
                onClick={() => onNavigateAdminRoute('san-pham')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  adminSubRoute === 'san-pham'
                    ? 'bg-[#523D2A] text-white shadow-xs'
                    : 'text-[#4E453E] hover:bg-[#F2EDE6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#F1E0C6]" />
                  <span>Sản Phẩm</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-inherit">
                  {products.length}
                </span>
              </button>

              {/* 3. Danh mục */}
              <button
                onClick={() => onNavigateAdminRoute('danh-muc')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  adminSubRoute === 'danh-muc'
                    ? 'bg-[#523D2A] text-white shadow-xs'
                    : 'text-[#4E453E] hover:bg-[#F2EDE6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#F1E0C6]" />
                  <span>Danh Mục</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-inherit">
                  {categories.length}
                </span>
              </button>

              {/* 4. Người dùng */}
              <button
                onClick={() => onNavigateAdminRoute('nguoi-dung')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  adminSubRoute === 'nguoi-dung'
                    ? 'bg-[#523D2A] text-white shadow-xs'
                    : 'text-[#4E453E] hover:bg-[#F2EDE6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#F1E0C6]" />
                  <span>Người Dùng</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-inherit">
                  {users.length}
                </span>
              </button>

              {/* 5. Cài đặt cửa hàng */}
              <button
                onClick={() => onNavigateAdminRoute('cai-dat')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  adminSubRoute === 'cai-dat'
                    ? 'bg-[#523D2A] text-white shadow-xs'
                    : 'text-[#4E453E] hover:bg-[#F2EDE6]'
                }`}
              >
                <Settings className="w-4 h-4 text-[#F1E0C6]" />
                <span>Cài Đặt Cửa Hàng</span>
              </button>

              <div className="pt-2 my-2 border-t border-[#D2C4BA]/50"></div>

              {/* 6. Xem Storefront */}
              <button
                onClick={onBackToStore}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#4E453E] hover:bg-[#F2EDE6] hover:text-[#1D1B17] transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-[#523D2A]" />
                  <span>Xem Storefront</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#D2C4BA]" />
              </button>

              {/* 7. Đăng xuất */}
              <button
                onClick={onLogoutAdmin}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition-all min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        )}

        {/* Dynamic Content */}
        <main className="flex-1 min-w-0">
          {isEditingOrCreating ? (
            <AdminProductForm
              product={currentEditingProduct}
              categories={categories}
              allProducts={products}
              onSave={(updated) => {
                onSaveProduct(updated);
                onNavigateAdminRoute('san-pham');
              }}
              onCancel={() => onNavigateAdminRoute('san-pham')}
              onPreview={onPreviewProduct}
            />
          ) : adminSubRoute === 'san-pham' ? (
            <AdminProducts
              products={products}
              categories={categories}
              onAddNew={() => onNavigateAdminRoute('san-pham/moi')}
              onEdit={(p) => onNavigateAdminRoute(`san-pham/${p.id}`)}
              onDuplicate={onDuplicateProduct}
              onDelete={onDeleteProduct}
              onToggleVisible={onToggleVisible}
              onToggleFeatured={onToggleFeatured}
              onBulkUpdateVisibility={onBulkUpdateVisibility}
              onBulkDelete={onBulkDelete}
              onPreview={onPreviewProduct}
            />
          ) : adminSubRoute === 'danh-muc' ? (
            <AdminCategories
              categories={categories}
              products={products}
              onSaveCategory={onSaveCategory}
              onDeleteCategory={onDeleteCategory}
              onReorderCategories={onReorderCategories}
              onShowToast={onShowToast}
            />
          ) : adminSubRoute === 'nguoi-dung' ? (
            <AdminUsers
              users={users}
              products={products}
              onToggleUserStatus={onToggleUserStatus}
              onPreviewProduct={onPreviewProduct}
              onShowToast={onShowToast}
            />
          ) : adminSubRoute === 'cai-dat' ? (
            <AdminSettings
              settings={settings}
              onSaveSettings={onSaveSettings}
              onShowToast={onShowToast}
            />
          ) : (
            <AdminOverview
              products={products}
              categories={categories}
              users={users}
              onSelectProduct={onPreviewProduct}
              onNavigateToProducts={() => onNavigateAdminRoute('san-pham')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
