import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Category } from '../types';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentCategorySlug?: string;
  subcategories: Category[];
  selectedSubcategorySlug?: string;
  onSelectCategory: (catSlug: string) => void;
  onSelectSubcategory: (subSlug: string) => void;
  materialTags: string[];
  selectedMaterialTags: string[];
  onToggleMaterialTag: (tag: string) => void;
  styleTags: string[];
  selectedStyleTags: string[];
  onToggleStyleTag: (tag: string) => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
  totalResults: number;
  onClearFilters: () => void;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  categories,
  currentCategorySlug,
  subcategories,
  selectedSubcategorySlug,
  onSelectCategory,
  onSelectSubcategory,
  materialTags,
  selectedMaterialTags,
  onToggleMaterialTag,
  styleTags,
  selectedStyleTags,
  onToggleStyleTag,
  sortBy,
  onSelectSortBy,
  totalResults,
  onClearFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full bg-[#FEF9F2] rounded-t-3xl border-t border-[#D2C4BA] shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#D2C4BA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#523D2A]" />
            <h3 className="font-serif text-lg font-medium text-[#1D1B17]">
              Bộ Lọc Bộ Sưu Tập
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearFilters}
              className="text-xs text-[#4E453E] hover:text-[#523D2A] flex items-center gap-1 min-h-[44px] px-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#4E453E] hover:text-[#1D1B17]"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Sắp xếp: Mới nhất, Nổi bật, Tên A-Z (No 'Lưu nhiều nhất') */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4E453E] mb-2.5">
              Sắp xếp theo
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'featured', label: 'Nổi bật' },
                { id: 'newest', label: 'Mới nhất' },
                { id: 'name_asc', label: 'Tên (A-Z)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectSortBy(item.id)}
                  className={`py-2.5 px-2 text-xs rounded-xl text-center transition-colors min-h-[44px] border ${
                    sortBy === item.id
                      ? 'bg-[#523D2A] text-white border-[#523D2A] font-semibold'
                      : 'bg-white text-[#4E453E] border-[#D2C4BA]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4E453E] mb-2.5">
              Không gian chính
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSelectCategory('')}
                className={`px-3 py-2 text-xs rounded-full border transition-all min-h-[44px] ${
                  !currentCategorySlug
                    ? 'bg-[#523D2A] text-white border-[#523D2A] font-semibold'
                    : 'bg-white text-[#4E453E] border-[#D2C4BA]'
                }`}
              >
                Tất cả không gian
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.slug)}
                  className={`px-3 py-2 text-xs rounded-full border transition-all min-h-[44px] ${
                    currentCategorySlug === c.slug
                      ? 'bg-[#523D2A] text-white border-[#523D2A] font-semibold'
                      : 'bg-white text-[#4E453E] border-[#D2C4BA]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories if category selected */}
          {subcategories.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4E453E] mb-2.5">
                Chủng loại chi tiết
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectSubcategory('')}
                  className={`px-3 py-2 text-xs rounded-xl border transition-all min-h-[44px] ${
                    !selectedSubcategorySlug
                      ? 'bg-[#523D2A] text-white border-[#523D2A] font-semibold'
                      : 'bg-white text-[#4E453E] border-[#D2C4BA]'
                  }`}
                >
                  Tất cả chủng loại
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubcategory(sub.slug)}
                    className={`px-3 py-2 text-xs rounded-xl border transition-all min-h-[44px] ${
                      selectedSubcategorySlug === sub.slug
                        ? 'bg-[#523D2A] text-white border-[#523D2A] font-semibold'
                        : 'bg-white text-[#4E453E] border-[#D2C4BA]'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4E453E] mb-2.5">
              Chất liệu chế tác
            </h4>
            <div className="flex flex-wrap gap-2">
              {materialTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onToggleMaterialTag(tag)}
                  className={`px-3 py-2 text-xs rounded-xl border transition-all min-h-[44px] ${
                    selectedMaterialTags.includes(tag)
                      ? 'bg-[#523D2A] text-white border-[#523D2A] font-semibold'
                      : 'bg-white text-[#4E453E] border-[#D2C4BA]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Style Tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4E453E] mb-2.5">
              Phong cách thiết kế
            </h4>
            <div className="flex flex-wrap gap-2">
              {styleTags.map((st) => (
                <button
                  key={st}
                  onClick={() => onToggleStyleTag(st)}
                  className={`px-3 py-2 text-xs rounded-xl border transition-all min-h-[44px] ${
                    selectedStyleTags.includes(st)
                      ? 'bg-[#523D2A] text-white border-[#523D2A] font-semibold'
                      : 'bg-white text-[#4E453E] border-[#D2C4BA]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D2C4BA] bg-[#F2EDE6]">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#523D2A] hover:bg-[#6B5440] text-white rounded-xl text-xs font-semibold uppercase tracking-wider min-h-[44px]"
          >
            Hiển thị kết quả ({totalResults} tác phẩm)
          </button>
        </div>
      </div>
    </div>
  );
};
