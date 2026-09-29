import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Sparkles, Layers, MessageSquare, Phone } from 'lucide-react';
import { Category, StoreSettings } from '../types';
import { contactUtils } from '../utils/contact';

interface SidebarProps {
  categoryTree: { category: Category; subcategories: Category[] }[];
  currentCategorySlug?: string;
  currentSubCategorySlug?: string;
  onSelectCategory: (categorySlug: string, subCategorySlug?: string) => void;
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
  materialTags: string[];
  selectedMaterialTags: string[];
  onToggleMaterialTag: (tag: string) => void;
  styleTags: string[];
  selectedStyleTags: string[];
  onToggleStyleTag: (tag: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categoryTree,
  currentCategorySlug,
  currentSubCategorySlug,
  onSelectCategory,
  settings,
  onShowToast,
  materialTags,
  selectedMaterialTags,
  onToggleMaterialTag,
  styleTags,
  selectedStyleTags,
  onToggleStyleTag
}) => {
  // One group open at a time: initialize with active category or first category
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(() => {
    if (currentCategorySlug) {
      const match = categoryTree.find(
        (t) =>
          t.category.slug === currentCategorySlug ||
          t.subcategories.some((s) => s.slug === currentCategorySlug)
      );
      if (match) return match.category.id;
    }
    return categoryTree[0]?.category.id || null;
  });

  const toggleCategoryGroup = (catId: string) => {
    // One group open at a time
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
  };

  const handleBookVisitZalo = () => {
    contactUtils.copyAndOpenZalo(settings, null, 'Chào CDHome, tôi muốn đặt lịch ghé thăm showroom CDHome để xem các bộ sưu tập nội thất.', onShowToast);
  };

  return (
    <aside className="w-68 xl:w-72 flex-shrink-0 flex flex-col gap-6 select-none font-sans">
      {/* Category Accordion */}
      <div className="bg-[#FEF9F2] border border-[#D2C4BA] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F2EDE6]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#523D2A]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17]">
              Danh Mục Không Gian
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4E453E] bg-[#F2EDE6] px-2 py-0.5 rounded border border-[#D2C4BA]">
            {categoryTree.length} bộ sưu tập
          </span>
        </div>

        {/* All Products Link */}
        <button
          onClick={() => onSelectCategory('')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mb-1 ${
            !currentCategorySlug
              ? 'bg-[#523D2A] text-[#FEF9F2] shadow-xs'
              : 'text-[#4E453E] hover:bg-[#F2EDE6]'
          }`}
        >
          <span>Tất cả sản phẩm</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        {/* Category Accordion List (One open at a time) */}
        <div className="space-y-1">
          {categoryTree.map(({ category, subcategories }) => {
            const isGroupOpen = openCategoryId === category.id;
            const isCategoryActive =
              currentCategorySlug === category.slug && !currentSubCategorySlug;

            return (
              <div key={category.id} className="rounded-xl overflow-hidden">
                <div
                  onClick={() => {
                    toggleCategoryGroup(category.id);
                    onSelectCategory(category.slug);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isCategoryActive
                      ? 'bg-[#F1E0C6] text-[#523D2A] font-bold'
                      : 'text-[#1D1B17] hover:bg-[#F2EDE6]'
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {subcategories.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategoryGroup(category.id);
                        }}
                        className="p-1 text-[#4E453E] hover:text-[#1D1B17]"
                        aria-label="Mở rộng danh mục con"
                      >
                        {isGroupOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories list */}
                {isGroupOpen && subcategories.length > 0 && (
                  <div className="ml-3 pl-3 my-1 border-l-2 border-[#D2C4BA] space-y-0.5 py-0.5">
                    {subcategories.map((sub) => {
                      const isSubActive = currentSubCategorySlug === sub.slug;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onSelectCategory(category.slug, sub.slug)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                            isSubActive
                              ? 'text-[#523D2A] font-bold bg-[#F1E0C6]/70'
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
      </div>

      {/* Material & Style Filters (Quiet Luxury) */}
      <div className="bg-[#FEF9F2] border border-[#D2C4BA] rounded-2xl p-4 shadow-xs space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17] mb-2 pb-1.5 border-b border-[#F2EDE6]">
            Chất Liệu Chế Tác
          </h3>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {materialTags.slice(0, 6).map((tag) => {
              const active = selectedMaterialTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleMaterialTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                    active
                      ? 'bg-[#523D2A] text-white border-[#523D2A]'
                      : 'bg-white text-[#4E453E] border-[#D2C4BA] hover:bg-[#F2EDE6]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17] mb-2 pb-1.5 border-b border-[#F2EDE6]">
            Phong Cách
          </h3>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {styleTags.map((tag) => {
              const active = selectedStyleTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleStyleTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                    active
                      ? 'bg-[#523D2A] text-white border-[#523D2A]'
                      : 'bg-white text-[#4E453E] border-[#D2C4BA] hover:bg-[#F2EDE6]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Showroom Visit Box (Using "Đặt lịch qua Zalo", NO booking forms) */}
      <div className="bg-[#F2EDE6] border border-[#D2C4BA] rounded-2xl p-5 shadow-xs relative overflow-hidden">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#523D2A] font-bold block mb-1">
          Showroom CDHome
        </span>
        <h4 className="font-serif text-base font-normal text-[#1D1B17] mb-2">
          Ghé Thăm & Trải Nghiệm Thực Tế
        </h4>
        <p className="text-xs text-[#4E453E] leading-relaxed mb-4">
          CDHome chào đón bạn đến không gian trưng bày để cảm nhận chất gỗ sồi tự nhiên và đường nét tĩnh lặng.
        </p>
        <button
          onClick={handleBookVisitZalo}
          className="w-full py-2.5 px-3 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Đặt lịch qua Zalo</span>
        </button>
        <div className="mt-3 pt-3 border-t border-[#D2C4BA] text-[11px] text-[#4E453E] flex items-center justify-between">
          <span>Hotline trực:</span>
          <a href={`tel:${settings.phone}`} className="font-mono font-bold text-[#523D2A] hover:underline">
            {settings.phone}
          </a>
        </div>
      </div>
    </aside>
  );
};
