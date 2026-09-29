import React, { useState, useEffect, useRef } from 'react';
import {
  DraftingCompass, Sparkles, Layers, Sofa, ChevronDown, ZoomIn, ZoomOut, X,
  Maximize2, Home, Check, Ruler
} from 'lucide-react';
import { Product } from '../types';
import { DynamicBlueprint } from './DynamicBlueprint';

type SpecKey = 'dimensions' | 'design' | 'materials' | 'usage';

interface ProductSpecsProps {
  product: Product;
  /** Increment to scroll to the specs and open the Dimensions section */
  focusDimensionsRequest?: number;
}

const toParagraphs = (text?: string) =>
  (text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ product, focusDimensionsRequest = 0 }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const hasDimensions = product.items.length > 0 || product.dimensionImages.length > 0;
  const hasDesign = !!product.designPhilosophy?.trim();
  const hasMaterials = product.materials.length > 0 || product.materialCards.length > 0;
  const hasUsage = !!product.usageDescription?.trim() || !!product.suitability;

  const sections: { key: SpecKey; label: string; hint: string; icon: React.ElementType; show: boolean }[] = [
    { key: 'dimensions', label: 'Kích thước & Bản vẽ', hint: 'Quy cách, bản vẽ 3 góc nhìn', icon: DraftingCompass, show: hasDimensions },
    { key: 'design', label: 'Thiết kế', hint: 'Triết lý & phong cách', icon: Sparkles, show: hasDesign },
    { key: 'materials', label: 'Vật liệu', hint: 'Cấu thành từng bộ phận', icon: Layers, show: hasMaterials },
    { key: 'usage', label: 'Công dụng & Độ phù hợp', hint: 'Không gian & cách phối', icon: Sofa, show: hasUsage }
  ];
  const visible = sections.filter((s) => s.show);

  const [activeTab, setActiveTab] = useState<SpecKey | undefined>(visible[0]?.key);
  const [openItems, setOpenItems] = useState<SpecKey[]>(visible[0] ? [visible[0].key] : []);

  // "Xem bản vẽ" shortcut from the quick dimensions box
  useEffect(() => {
    if (!focusDimensionsRequest || !hasDimensions) return;
    setActiveTab('dimensions');
    setOpenItems((prev) => (prev.includes('dimensions') ? prev : [...prev, 'dimensions']));
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focusDimensionsRequest]);

  // Lightbox: Esc to close, lock page scroll
  useEffect(() => {
    if (!zoomSrc) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoomSrc(null);
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomSrc]);

  if (visible.length === 0) return null;

  const openZoom = (src: string) => {
    setZoomLevel(1);
    setZoomSrc(src);
  };

  const toggleItem = (key: SpecKey) =>
    setOpenItems((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  // --- Panels ---
  const hasBlueprints = product.items.length > 0;
  const hasStatic = product.dimensionImages.length > 0;
  const renderDimensions = () => (
    <div className={`grid grid-cols-1 gap-6 ${hasBlueprints ? 'lg:grid-cols-5' : ''}`}>
      {hasBlueprints && (
        <div className="lg:col-span-3 space-y-4 min-w-0">
          {product.items.map((item, i) => (
            <DynamicBlueprint
              key={i}
              name={product.name}
              itemName={item.name}
              code={product.code}
              categoryId={product.categoryId}
              length={item.dimensions.length}
              width={item.dimensions.width}
              height={item.dimensions.height}
              className="border border-[#D2C4BA] rounded-2xl overflow-hidden"
            />
          ))}
          <p className="text-[11px] text-[#4E453E] font-light">
            Bản vẽ được dựng tự động từ kích thước từng phiên bản, tỷ lệ minh họa (D = Dài, R = Rộng, C = Cao, đơn vị cm).
          </p>
        </div>
      )}

      {hasStatic && (
        <div className={`space-y-3 ${hasBlueprints ? 'lg:col-span-5' : ''}`}>
          {hasBlueprints && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#523D2A]">Bản vẽ chi tiết từ xưởng</p>
          )}
          {product.dimensionImages.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => openZoom(src)}
              className="group relative block w-full rounded-2xl overflow-hidden border border-[#D2C4BA] bg-[#FEF9F2] cursor-zoom-in"
              aria-label={`Phóng to bản vẽ kỹ thuật ${i + 1}`}
            >
              <img src={src} alt={`Bản vẽ kích thước ${product.name} ${i + 1}`} className="w-full h-auto block" loading="lazy" />
              <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#523D2A]/90 text-[#FEF9F2] text-[11px] font-semibold shadow-sm group-hover:bg-[#523D2A] transition-colors">
                <Maximize2 className="w-3 h-3" />
                <span>Phóng to bản vẽ</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {product.items.length > 0 && (
        <div className={`space-y-3 ${hasBlueprints ? 'lg:col-span-2' : ''}`}>
          {product.items.map((item, i) => (
            <div key={i} className="rounded-2xl border border-[#D2C4BA] bg-[#FEF9F2] p-4 space-y-3">
              <p className="text-sm font-semibold text-[#1D1B17]">{item.name}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Dài', value: item.dimensions.length },
                  { label: 'Rộng', value: item.dimensions.width },
                  { label: 'Cao', value: item.dimensions.height }
                ].map((d) => (
                  <div key={d.label} className="rounded-xl bg-white border border-[#F2EDE6] py-2.5">
                    <p className="text-[10px] uppercase tracking-wider text-[#4E453E]">{d.label}</p>
                    <p className="font-mono text-base font-bold text-[#523D2A] leading-tight">
                      {d.value}
                      <span className="text-[10px] font-normal text-[#4E453E] ml-0.5">cm</span>
                    </p>
                  </div>
                ))}
              </div>
              {item.dimensions.note && (
                <p className="text-xs text-[#4E453E] flex items-start gap-1.5">
                  <Ruler className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#523D2A]" />
                  <span>{item.dimensions.note}</span>
                </p>
              )}
            </div>
          ))}
          <p className="text-[11px] text-[#4E453E] font-light">
            Nhận tùy biến kích thước theo mặt bằng thực tế, sai số chế tác ±1 cm.
          </p>
        </div>
      )}
    </div>
  );

  const renderDesign = () => (
    <div className="space-y-5 max-w-3xl">
      {toParagraphs(product.designPhilosophy).map((p, i) => (
        <p
          key={i}
          className={`leading-relaxed text-[#1D1B17] ${
            i === 0 ? 'font-serif text-lg sm:text-xl text-[#523D2A]' : 'text-sm font-light'
          }`}
        >
          {p}
        </p>
      ))}
      {product.styleTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {product.styleTags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-[#F1E0C6] border border-[#D2C4BA] text-[11px] font-semibold text-[#523D2A]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-5">
      {product.materials.length > 0 && (
        <div className="rounded-2xl border border-[#D2C4BA] overflow-hidden divide-y divide-[#F2EDE6] bg-white">
          {product.materials.map((m, i) => (
            <div key={i} className="grid grid-cols-[2rem_1fr] sm:grid-cols-[2.5rem_12rem_1fr] gap-x-3 gap-y-1 p-4 text-xs items-baseline">
              <span className="font-mono text-[#D2C4BA] font-bold row-span-2 sm:row-span-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-semibold text-[#523D2A] uppercase tracking-wide text-[11px]">{m.part}</span>
              <span className="text-[#1D1B17] font-light leading-relaxed">{m.material}</span>
            </div>
          ))}
        </div>
      )}
      {product.materialCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.materialCards.map((c, i) => (
            <div key={i} className="rounded-2xl bg-[#F2EDE6] border border-[#D2C4BA] p-4 space-y-1.5">
              <p className="font-serif text-base text-[#523D2A]">{c.name}</p>
              <p className="text-xs text-[#4E453E] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUsage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
      {product.usageDescription && (
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#523D2A]">Công dụng & Tính năng</p>
          {toParagraphs(product.usageDescription).map((p, i) => (
            <p key={i} className="text-sm text-[#1D1B17] font-light leading-relaxed">{p}</p>
          ))}
        </div>
      )}
      {product.suitability && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F1E0C6] border border-[#D2C4BA] p-4 flex gap-3">
            <Home className="w-5 h-5 text-[#523D2A] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1D1B17] leading-relaxed">{product.suitability.summary}</p>
          </div>
          {[
            { title: 'Không gian phù hợp', list: product.suitability.spaces },
            { title: 'Gợi ý phối hợp', list: product.suitability.pairings }
          ]
            .filter((g) => g.list.length > 0)
            .map((g) => (
              <div key={g.title} className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#523D2A]">{g.title}</p>
                <ul className="space-y-2">
                  {g.list.map((line, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#1D1B17] leading-relaxed">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#523D2A] text-[#FEF9F2] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderPanel = (key: SpecKey) =>
    key === 'dimensions' ? renderDimensions()
      : key === 'design' ? renderDesign()
      : key === 'materials' ? renderMaterials()
      : renderUsage();

  const current = visible.find((s) => s.key === activeTab) ?? visible[0];

  return (
    <section ref={sectionRef} id="thong-so" className="mt-16 pt-12 border-t border-[#D2C4BA] space-y-6 scroll-mt-28">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#523D2A] font-semibold">
          Technical Specs & Details
        </span>
        <h2 className="font-serif text-2xl text-[#1D1B17] mt-0.5">Thông Số & Chi Tiết Tác Phẩm</h2>
      </div>

      {/* Desktop / tablet: Tabs */}
      <div className="hidden md:block space-y-5">
        <div
          role="tablist"
          aria-label="Thông số tác phẩm"
          className="grid gap-1.5 p-1.5 rounded-2xl bg-[#F2EDE6] border border-[#D2C4BA]"
          style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}
        >
          {visible.map((s) => {
            const Icon = s.icon;
            const active = s.key === current.key;
            return (
              <button
                key={s.key}
                role="tab"
                id={`spec-tab-${s.key}`}
                aria-selected={active}
                aria-controls={`spec-panel-${s.key}`}
                onClick={() => setActiveTab(s.key)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-200 min-h-[48px] ${
                  active
                    ? 'bg-white text-[#523D2A] shadow-sm ring-1 ring-[#D2C4BA]'
                    : 'text-[#4E453E] hover:text-[#523D2A] hover:bg-white/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div
          key={current.key}
          role="tabpanel"
          id={`spec-panel-${current.key}`}
          aria-labelledby={`spec-tab-${current.key}`}
          className="spec-fade-in bg-white rounded-3xl border border-[#D2C4BA] p-6 lg:p-8"
        >
          {renderPanel(current.key)}
        </div>
      </div>

      {/* Mobile: Accordion */}
      <div className="md:hidden space-y-3">
        {visible.map((s) => {
          const Icon = s.icon;
          const open = openItems.includes(s.key);
          return (
            <div key={s.key} className={`rounded-2xl border bg-white transition-colors ${open ? 'border-[#523D2A]/40' : 'border-[#D2C4BA]'}`}>
              <button
                type="button"
                onClick={() => toggleItem(s.key)}
                aria-expanded={open}
                aria-controls={`spec-acc-${s.key}`}
                className="w-full flex items-center gap-3 p-4 text-left min-h-[56px]"
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-[#523D2A] text-[#FEF9F2]' : 'bg-[#F2EDE6] text-[#523D2A]'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-[#1D1B17]">{s.label}</span>
                  <span className="block text-[11px] text-[#4E453E]">{s.hint}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#4E453E] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
              </button>
              <div
                id={`spec-acc-${s.key}`}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden min-w-0">
                  <div className="px-4 pb-5 pt-1">{renderPanel(s.key)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawing lightbox: zoom + pan (scroll / swipe) */}
      {zoomSrc && (
        <div
          className="fixed inset-0 z-50 bg-[#1D1B17]/95 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Bản vẽ kỹ thuật"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-[#FEF9F2]">
            <span className="text-xs font-semibold truncate">Bản vẽ kỹ thuật · {product.code}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}
                disabled={zoomLevel === 1}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
                aria-label="Thu nhỏ"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="font-mono text-xs w-9 text-center">{zoomLevel}x</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 1))}
                disabled={zoomLevel === 3}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
                aria-label="Phóng to"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomSrc(null)}
                className="ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Đóng bản vẽ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto overscroll-contain px-4 pb-6" onClick={(e) => e.target === e.currentTarget && setZoomSrc(null)}>
            <div className="min-h-full flex items-center" style={{ width: `${zoomLevel * 100}%` }}>
              <img
                src={zoomSrc}
                alt={`Bản vẽ kỹ thuật ${product.name}`}
                className="w-full max-w-none h-auto rounded-xl bg-[#FEF9F2] shadow-2xl mx-auto"
                style={zoomLevel === 1 ? { maxWidth: '1100px' } : undefined}
              />
            </div>
          </div>
          <p className="md:hidden text-center text-[11px] text-[#D2C4BA] pb-4">Dùng nút +/− để phóng to, vuốt để di chuyển bản vẽ</p>
        </div>
      )}
    </section>
  );
};
