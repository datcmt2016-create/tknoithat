import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit3, Trash2, Layers, Check, X, GripVertical, 
  ChevronRight, ChevronDown, Eye, CornerDownRight, ArrowUp, ArrowDown,
  Sparkles, Image as ImageIcon, AlertCircle
} from 'lucide-react';
import { Category, Product } from '../../types';
import { dataService } from '../../services/dataService';
import { slugifyVietnamese } from '../../utils/slugify';

interface AdminCategoriesProps {
  categories: Category[];
  products: Product[];
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (updatedList: Category[]) => void;
  onShowToast: (msg: string) => void;
}

const PRESET_IMAGES = [
  { label: 'Phòng Ngủ', url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Phòng Khách', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Phòng Ăn', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Phòng Làm Việc', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tủ Kệ', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80' }
];

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  products,
  onSaveCategory,
  onDeleteCategory,
  onReorderCategories,
  onShowToast
}) => {
  // Side panel state
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [formParentId, setFormParentId] = useState<string>('null');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsVisible, setFormIsVisible] = useState(true);

  // Drag and drop state
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);

  // Expanded categories in tree
  const [expandedCatIds, setExpandedCatIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((c) => {
      if (c.parentId === null) initial[c.id] = true;
    });
    return initial;
  });

  const toggleExpand = (catId: string) => {
    setExpandedCatIds((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Top level categories
  const topLevelCategories = useMemo(() => {
    return categories
      .filter((c) => c.parentId === null)
      .sort((a, b) => a.order - b.order);
  }, [categories]);

  // Product counts calculation
  const getProductCount = (catId: string) => {
    return products.filter(
      (p) => p.categoryId === catId || p.subCategoryId === catId
    ).length;
  };

  // Open Form for Adding New
  const handleAddNew = (parentId: string | null = null) => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setIsSlugManual(false);
    setFormParentId(parentId || 'null');
    setFormImage(PRESET_IMAGES[0].url);
    setFormDescription('');
    setFormIsVisible(true);
    setIsSidePanelOpen(true);
  };

  // Open Form for Editing
  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setIsSlugManual(true);
    setFormParentId(cat.parentId || 'null');
    setFormImage(cat.image);
    setFormDescription(cat.description || '');
    setFormIsVisible(cat.isVisible);
    setIsSidePanelOpen(true);
  };

  // Name change auto-generates slug
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!isSlugManual) {
      setFormSlug(slugifyVietnamese(val));
    }
  };

  // Save Category Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      onShowToast('Vui lòng nhập tên danh mục');
      return;
    }

    const finalSlug = formSlug.trim() || slugifyVietnamese(formName);
    const parentIdVal = formParentId === 'null' ? null : formParentId;

    if (editingCategory) {
      const updated: Category = {
        ...editingCategory,
        name: formName.trim(),
        slug: finalSlug,
        parentId: parentIdVal,
        image: formImage.trim() || PRESET_IMAGES[0].url,
        description: formDescription.trim(),
        isVisible: formIsVisible
      };
      onSaveCategory(updated);
      onShowToast(`Đã cập nhật danh mục "${updated.name}"`);
    } else {
      // Calculate order
      const siblings = categories.filter((c) => c.parentId === parentIdVal);
      const maxOrder = siblings.reduce((max, c) => Math.max(max, c.order), 0);

      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        slug: finalSlug,
        parentId: parentIdVal,
        image: formImage.trim() || PRESET_IMAGES[0].url,
        description: formDescription.trim(),
        order: maxOrder + 1,
        isVisible: formIsVisible
      };
      onSaveCategory(newCat);
      onShowToast(`Đã thêm danh mục mới "${newCat.name}"`);
    }

    setIsSidePanelOpen(false);
  };

  // Delete Category with Check
  const handleDelete = (cat: Category) => {
    const check = dataService.canDeleteCategory(cat.id);
    if (!check.canDelete) {
      alert(check.reason);
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"? Thao tác này không thể hoàn tác.`)) {
      onDeleteCategory(cat.id);
      onShowToast(`Đã xóa danh mục "${cat.name}"`);
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = (cat: Category) => {
    const updated = { ...cat, isVisible: !cat.isVisible };
    onSaveCategory(updated);
    onShowToast(
      updated.isVisible
        ? `Đã hiển thị danh mục "${cat.name}"`
        : `Đã ẩn danh mục "${cat.name}" khỏi showroom`
    );
  };

  // Reordering helpers
  const moveCategory = (catId: string, direction: 'up' | 'down') => {
    const target = categories.find((c) => c.id === catId);
    if (!target) return;

    const siblings = categories
      .filter((c) => c.parentId === target.parentId)
      .sort((a, b) => a.order - b.order);

    const idx = siblings.findIndex((c) => c.id === catId);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const prev = siblings[idx - 1];
      const targetOrder = prev.order;
      const prevOrder = target.order;

      const updated = categories.map((c) => {
        if (c.id === target.id) return { ...c, order: targetOrder };
        if (c.id === prev.id) return { ...c, order: prevOrder };
        return c;
      });

      onReorderCategories(updated);
    } else if (direction === 'down' && idx < siblings.length - 1) {
      const next = siblings[idx + 1];
      const targetOrder = next.order;
      const nextOrder = target.order;

      const updated = categories.map((c) => {
        if (c.id === target.id) return { ...c, order: targetOrder };
        if (c.id === next.id) return { ...c, order: nextOrder };
        return c;
      });

      onReorderCategories(updated);
    }
  };

  // Drag and Drop
  const handleDragStart = (catId: string) => {
    setDraggedCatId(catId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetCatId: string) => {
    if (!draggedCatId || draggedCatId === targetCatId) {
      setDraggedCatId(null);
      return;
    }

    const dragged = categories.find((c) => c.id === draggedCatId);
    const target = categories.find((c) => c.id === targetCatId);
    if (!dragged || !target || dragged.parentId !== target.parentId) {
      setDraggedCatId(null);
      return;
    }

    const siblings = categories
      .filter((c) => c.parentId === dragged.parentId)
      .sort((a, b) => a.order - b.order);

    const draggedIdx = siblings.findIndex((c) => c.id === draggedCatId);
    const targetIdx = siblings.findIndex((c) => c.id === targetCatId);

    const reorderedSiblings = [...siblings];
    const [removed] = reorderedSiblings.splice(draggedIdx, 1);
    reorderedSiblings.splice(targetIdx, 0, removed);

    // Reassign order
    const updated = categories.map((c) => {
      const foundIdx = reorderedSiblings.findIndex((s) => s.id === c.id);
      if (foundIdx !== -1) {
        return { ...c, order: foundIdx + 1 };
      }
      return c;
    });

    onReorderCategories(updated);
    setDraggedCatId(null);
    onShowToast('Đã sắp xếp lại thứ tự danh mục');
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200 relative">
      {/* Top Header & Actions Bar */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#523D2A] text-[#FEF9F2] flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#F1E0C6]" />
          </div>
          <div>
            <h1 className="font-serif text-lg text-[#1D1B17]">Quản Lý Cấu Trúc Danh Mục</h1>
            <p className="text-xs text-[#4E453E]">
              Cây phân cấp 2 cấp độ (Danh mục chính & Danh mục con). Kéo thả để sắp xếp thứ tự hiển thị.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAddNew(null)}
          className="px-4 py-2.5 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Categories Tree Table */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4E453E]">
            <thead className="bg-[#F2EDE6] text-[#1D1B17] uppercase text-[10px] font-bold tracking-wider border-b border-[#D2C4BA]">
              <tr>
                <th className="py-3 px-3 w-14 text-center">Thứ tự</th>
                <th className="py-3 px-4 w-16">Ảnh</th>
                <th className="py-3 px-4">Tên danh mục</th>
                <th className="py-3 px-4">Đường dẫn (Slug)</th>
                <th className="py-3 px-4 text-center">Số tác phẩm</th>
                <th className="py-3 px-4 text-center">Hiển thị</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE6]">
              {topLevelCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#4E453E]">
                    Chưa có danh mục nào. Hãy bấm "Thêm Danh Mục Mới" để bắt đầu.
                  </td>
                </tr>
              ) : (
                topLevelCategories.map((topCat, topIdx) => {
                  const subCats = categories
                    .filter((c) => c.parentId === topCat.id)
                    .sort((a, b) => a.order - b.order);
                  const isExpanded = !!expandedCatIds[topCat.id];
                  const productCount = getProductCount(topCat.id);

                  return (
                    <React.Fragment key={topCat.id}>
                      {/* Top Level Category Row */}
                      <tr
                        draggable
                        onDragStart={() => handleDragStart(topCat.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(topCat.id)}
                        className={`hover:bg-[#F2EDE6]/40 transition-colors bg-white/70 ${
                          draggedCatId === topCat.id ? 'opacity-40 bg-[#F1E0C6]/50' : ''
                        }`}
                      >
                        {/* Drag Handle & Reorder */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-0.5">
                            <span
                              className="cursor-grab active:cursor-grabbing text-[#D2C4BA] hover:text-[#523D2A] p-1"
                              title="Kéo thả để sắp xếp"
                            >
                              <GripVertical className="w-4 h-4" />
                            </span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => moveCategory(topCat.id, 'up')}
                                disabled={topIdx === 0}
                                className="text-[#4E453E] hover:text-[#523D2A] disabled:opacity-20 p-0.5"
                                title="Di chuyển lên"
                              >
                                <ArrowUp className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => moveCategory(topCat.id, 'down')}
                                disabled={topIdx === topLevelCategories.length - 1}
                                className="text-[#4E453E] hover:text-[#523D2A] disabled:opacity-20 p-0.5"
                                title="Di chuyển xuống"
                              >
                                <ArrowDown className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Image */}
                        <td className="py-3 px-4">
                          <img
                            src={topCat.image}
                            alt={topCat.name}
                            className="w-12 h-12 object-cover rounded-xl border border-[#D2C4BA] shadow-2xs shrink-0"
                          />
                        </td>

                        {/* Name & Tree Toggle */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {subCats.length > 0 && (
                              <button
                                onClick={() => toggleExpand(topCat.id)}
                                className="p-1 rounded-md hover:bg-[#F2EDE6] text-[#523D2A] transition-transform"
                                title={isExpanded ? 'Thu gọn danh mục con' : 'Mở rộng danh mục con'}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-sm font-semibold text-[#1D1B17]">
                                  {topCat.name}
                                </span>
                                <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-[#F1E0C6] text-[#523D2A] rounded-full border border-[#D2C4BA]/50">
                                  Danh mục chính
                                </span>
                              </div>
                              {topCat.description && (
                                <p className="text-[11px] text-[#4E453E]/80 line-clamp-1 mt-0.5">
                                  {topCat.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-3 px-4 font-mono font-bold text-[#523D2A] text-xs">
                          /{topCat.slug}
                        </td>

                        {/* Product Count */}
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono text-xs px-2.5 py-1 bg-[#F2EDE6] rounded-full text-[#1D1B17] font-semibold border border-[#D2C4BA]">
                            {productCount}
                          </span>
                        </td>

                        {/* Visibility */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleVisibility(topCat)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                              topCat.isVisible
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-stone-100 text-stone-600 border-stone-300'
                            }`}
                          >
                            {topCat.isVisible ? 'Hiển thị' : 'Lưu trữ (Ẩn)'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleAddNew(topCat.id)}
                              className="px-2 py-1 text-[11px] text-[#523D2A] hover:bg-[#F2EDE6] rounded-lg transition-colors flex items-center gap-1 font-medium"
                              title="Thêm danh mục con"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Thêm con</span>
                            </button>
                            <button
                              onClick={() => handleEdit(topCat)}
                              className="p-1.5 text-[#4E453E] hover:text-[#523D2A] hover:bg-[#F2EDE6] rounded-lg transition-colors"
                              title="Chỉnh sửa danh mục"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(topCat)}
                              className="p-1.5 text-[#4E453E] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa danh mục"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Sub-categories Rows */}
                      {isExpanded &&
                        subCats.map((subCat, subIdx) => {
                          const subProductCount = getProductCount(subCat.id);

                          return (
                            <tr
                              key={subCat.id}
                              draggable
                              onDragStart={() => handleDragStart(subCat.id)}
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop(subCat.id)}
                              className={`bg-[#FEF9F2]/60 hover:bg-[#F2EDE6]/50 transition-colors ${
                                draggedCatId === subCat.id ? 'opacity-40 bg-[#F1E0C6]/50' : ''
                              }`}
                            >
                              {/* Drag Subcategory */}
                              <td className="py-2.5 px-3 text-center pl-6">
                                <div className="flex items-center justify-center gap-0.5">
                                  <span
                                    className="cursor-grab active:cursor-grabbing text-[#D2C4BA] hover:text-[#523D2A] p-1"
                                    title="Kéo thả để sắp xếp"
                                  >
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </span>
                                  <div className="flex flex-col">
                                    <button
                                      onClick={() => moveCategory(subCat.id, 'up')}
                                      disabled={subIdx === 0}
                                      className="text-[#4E453E] hover:text-[#523D2A] disabled:opacity-20 p-0.5"
                                    >
                                      <ArrowUp className="w-2 h-2" />
                                    </button>
                                    <button
                                      onClick={() => moveCategory(subCat.id, 'down')}
                                      disabled={subIdx === subCats.length - 1}
                                      className="text-[#4E453E] hover:text-[#523D2A] disabled:opacity-20 p-0.5"
                                    >
                                      <ArrowDown className="w-2 h-2" />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Subcategory Image */}
                              <td className="py-2.5 px-4">
                                <img
                                  src={subCat.image}
                                  alt={subCat.name}
                                  className="w-10 h-10 object-cover rounded-lg border border-[#D2C4BA] shrink-0"
                                />
                              </td>

                              {/* Subcategory Name with tree branch */}
                              <td className="py-2.5 px-4 pl-8">
                                <div className="flex items-center gap-2">
                                  <CornerDownRight className="w-3.5 h-3.5 text-[#523D2A] shrink-0" />
                                  <div>
                                    <span className="font-medium text-xs text-[#1D1B17]">
                                      {subCat.name}
                                    </span>
                                    {subCat.description && (
                                      <p className="text-[10px] text-[#4E453E]/70 line-clamp-1">
                                        {subCat.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Slug */}
                              <td className="py-2.5 px-4 font-mono text-[#4E453E] text-[11px]">
                                /{subCat.slug}
                              </td>

                              {/* Product Count */}
                              <td className="py-2.5 px-4 text-center">
                                <span className="font-mono text-xs px-2 py-0.5 bg-white rounded-full text-[#1D1B17] font-medium border border-[#D2C4BA]">
                                  {subProductCount}
                                </span>
                              </td>

                              {/* Visibility */}
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  onClick={() => handleToggleVisibility(subCat)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                                    subCat.isVisible
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : 'bg-stone-100 text-stone-600 border-stone-300'
                                  }`}
                                >
                                  {subCat.isVisible ? 'Hiển thị' : 'Lưu trữ (Ẩn)'}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleEdit(subCat)}
                                    className="p-1.5 text-[#4E453E] hover:text-[#523D2A] hover:bg-[#F2EDE6] rounded-lg transition-colors"
                                    title="Chỉnh sửa danh mục con"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(subCat)}
                                    className="p-1.5 text-[#4E453E] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa danh mục con"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F2EDE6] border-t border-[#D2C4BA] text-xs text-[#4E453E] flex flex-wrap justify-between items-center gap-2">
          <span>
            Tổng cộng: <strong className="font-mono text-[#1D1B17]">{categories.length}</strong> danh mục ({topLevelCategories.length} danh mục chính, {categories.length - topLevelCategories.length} danh mục con)
          </span>
          <span className="text-[11px] text-[#523D2A]">
            * Hệ thống ngăn chặn xóa danh mục khi vẫn còn tác phẩm hoặc danh mục con trực thuộc.
          </span>
        </div>
      </div>

      {/* Right-side Sliding Panel Form */}
      {isSidePanelOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-[#FEF9F2] h-full shadow-2xl border-l border-[#D2C4BA] flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#523D2A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#F1E0C6]" />
                <h2 className="font-serif text-lg font-normal text-white">
                  {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
                </h2>
              </div>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Tên danh mục */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1B17] block">
                  Tên danh mục <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phòng Tịnh Dưỡng, Giường Gỗ Tự Nhiên..."
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                />
              </div>

              {/* Slug (auto from name) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1D1B17]">
                    Đường dẫn (Slug) <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugManual(false);
                      setFormSlug(slugifyVietnamese(formName));
                    }}
                    className="text-[10px] text-[#523D2A] hover:underline"
                  >
                    Tạo lại từ tên
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#4E453E]">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => {
                      setIsSlugManual(true);
                      setFormSlug(e.target.value);
                    }}
                    className="w-full pl-6 pr-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs font-mono text-[#523D2A] focus:outline-none focus:border-[#523D2A]"
                  />
                </div>
              </div>

              {/* Danh mục cha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1B17] block">
                  Danh mục cha
                </label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
                >
                  <option value="null">Không (Là Danh mục gốc - Top level)</option>
                  {topLevelCategories
                    .filter((c) => !editingCategory || c.id !== editingCategory.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        Thuộc: {c.name}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-[#4E453E]">
                  Chọn danh mục cha để tạo cấu trúc danh mục con phân cấp 2 cấp độ.
                </p>
              </div>

              {/* Ảnh đại diện */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1B17] block">
                  Ảnh đại diện danh mục (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                />

                {/* Preset image suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#4E453E]">Chọn nhanh ảnh mẫu:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className="px-2.5 py-1 bg-white border border-[#D2C4BA] hover:border-[#523D2A] rounded-lg text-[10px] text-[#1D1B17]"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {formImage && (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#D2C4BA] mt-2">
                    <img
                      src={formImage}
                      alt="Xem trước ảnh"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Mô tả */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1B17] block">
                  Mô tả không gian / danh mục
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả phong cách kiến trúc, cảm hứng thiết kế..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                />
              </div>

              {/* Hiển thị */}
              <div className="pt-2 flex items-center justify-between p-3 bg-white border border-[#D2C4BA] rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-[#1D1B17] block">
                    Trạng thái hiển thị
                  </span>
                  <span className="text-[10px] text-[#4E453E]">
                    Cho phép hiển thị trên thanh điều hướng và trang chủ showroom
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsVisible}
                    onChange={(e) => setFormIsVisible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#523D2A]"></div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#D2C4BA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(false)}
                  className="px-4 py-2.5 bg-white border border-[#D2C4BA] hover:bg-[#F2EDE6] text-xs font-medium text-[#1D1B17] rounded-xl min-h-[44px]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#523D2A] hover:bg-[#6B5440] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-xs min-h-[44px]"
                >
                  {editingCategory ? 'Lưu Thay Đổi' : 'Tạo Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
