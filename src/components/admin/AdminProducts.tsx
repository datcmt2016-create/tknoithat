import React, { useState } from 'react';
import { 
  Plus, Search, Edit3, Copy, Trash2, Eye, EyeOff, Star, 
  Archive, CheckSquare, Square, Filter, ArrowUpDown
} from 'lucide-react';
import { Category, Product } from '../../types';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onAddNew: () => void;
  onEdit: (product: Product) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisible: (product: Product) => void;
  onToggleFeatured: (product: Product) => void;
  onBulkUpdateVisibility: (ids: string[], isVisible: boolean) => void;
  onBulkDelete: (ids: string[]) => void;
  onPreview: (product: Product) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onAddNew,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleVisible,
  onToggleFeatured,
  onBulkUpdateVisibility,
  onBulkDelete,
  onPreview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'visible' | 'archived'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCat =
      selectedCat === 'all' ||
      p.categoryId === selectedCat ||
      p.subCategoryId === selectedCat;

    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'visible'
        ? p.isVisible
        : !p.isVisible;

    return matchSearch && matchCat && matchStatus;
  });

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || catId;
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Chuyển ${selectedIds.length} tác phẩm đã chọn vào kho lưu trữ (ẩn khỏi showroom)?`)) {
      onBulkUpdateVisibility(selectedIds, false);
      setSelectedIds([]);
    }
  };

  const handleBulkPublish = () => {
    if (selectedIds.length === 0) return;
    onBulkUpdateVisibility(selectedIds, true);
    setSelectedIds([]);
  };

  const handleBulkDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Bạn có chắc muốn XÓA VĨNH VIỄN ${selectedIds.length} tác phẩm này?`)) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Top Filter and Action Bar */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#4E453E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên tác phẩm, mã code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
          >
            <option value="all">Tất cả danh mục ({products.length})</option>
            {categories
              .filter((c) => c.parentId === null)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="visible">Đang hiển thị</option>
            <option value="archived">Trong kho lưu trữ (Ẩn)</option>
          </select>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2.5 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tác Phẩm Mới</span>
        </button>
      </div>

      {/* Bulk actions bar if items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-[#F2EDE6] border border-[#D2C4BA] rounded-xl p-3 px-4 flex items-center justify-between text-xs text-[#1D1B17] animate-in fade-in duration-150">
          <span>Đã chọn <strong className="font-mono text-[#523D2A]">{selectedIds.length}</strong> tác phẩm</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              className="px-3 py-1.5 bg-white border border-[#D2C4BA] rounded-lg text-xs font-medium hover:bg-[#FEF9F2] flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-700" />
              <span>Hiển thị</span>
            </button>
            <button
              onClick={handleBulkArchive}
              className="px-3 py-1.5 bg-white border border-[#D2C4BA] rounded-lg text-xs font-medium hover:bg-[#FEF9F2] flex items-center gap-1 text-[#4E453E]"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Chuyển vào kho lưu trữ (Ẩn)</span>
            </button>
            <button
              onClick={handleBulkDeleteSelected}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4E453E]">
            <thead className="bg-[#F2EDE6] text-[#1D1B17] uppercase text-[10px] font-bold tracking-wider border-b border-[#D2C4BA]">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="accent-[#523D2A] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Tác phẩm & Quy cách</th>
                <th className="py-3.5 px-4">Mã Code</th>
                <th className="py-3.5 px-4">Danh mục</th>
                <th className="py-3.5 px-4 text-center">Tiêu biểu</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE6]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#4E453E]">
                    Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const firstDim = p.items?.[0]?.dimensions;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-[#F2EDE6]/40 transition-colors ${
                        isSelected ? 'bg-[#F1E0C6]/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(p.id)}
                          className="accent-[#523D2A] cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg border border-[#D2C4BA] shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-[#1D1B17] truncate">{p.name}</p>
                            {firstDim && (
                              <p className="text-[10px] text-[#4E453E] font-mono">
                                D{firstDim.length} x R{firstDim.width} x C{firstDim.height} cm
                              </p>
                            )}
                            <p className="text-[10px] text-[#4E453E]/80 line-clamp-1">{p.shortDescription}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#523D2A]">
                        {p.code}
                      </td>

                      <td className="py-3 px-4 font-medium text-[#1D1B17]">
                        {getCategoryName(p.categoryId)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleFeatured(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.isFeatured
                              ? 'text-amber-600 bg-amber-50'
                              : 'text-[#D2C4BA] hover:text-[#523D2A]'
                          }`}
                          title={p.isFeatured ? 'Bỏ tiêu biểu' : 'Đặt làm tiêu biểu'}
                        >
                          <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleVisible(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                            p.isVisible
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border-stone-300'
                          }`}
                          title="Bấm để bật/tắt hiển thị trên showroom"
                        >
                          {p.isVisible ? 'Hiển thị' : 'Lưu trữ (Ẩn)'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onPreview(p)}
                            className="p-1.5 text-[#4E453E] hover:text-[#1D1B17] hover:bg-[#F2EDE6] rounded-lg transition-colors"
                            title="Xem trên trang khách"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDuplicate(p.id)}
                            className="p-1.5 text-[#4E453E] hover:text-[#523D2A] hover:bg-[#F2EDE6] rounded-lg transition-colors"
                            title="Nhân bản (Duplicate)"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(p)}
                            className="p-1.5 text-[#4E453E] hover:text-[#523D2A] hover:bg-[#F2EDE6] rounded-lg transition-colors"
                            title="Chỉnh sửa chi tiết"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn xóa tác phẩm "${p.name}"?`)) {
                                onDelete(p.id);
                              }
                            }}
                            className="p-1.5 text-[#4E453E] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F2EDE6] border-t border-[#D2C4BA] text-xs text-[#4E453E] flex justify-between items-center">
          <span>Tổng số: <strong className="font-mono text-[#1D1B17]">{filteredProducts.length}</strong> tác phẩm</span>
          <span className="text-[11px]">Chuyển vào kho lưu trữ sẽ ẩn sản phẩm khỏi khách duyệt</span>
        </div>
      </div>
    </div>
  );
};
