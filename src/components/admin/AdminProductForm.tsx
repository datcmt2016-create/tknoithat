import React, { useState, useEffect } from 'react';
import { 
  Save, Eye, ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, 
  Image as ImageIcon, Sparkles, Layers, Ruler, FileText, Check, Tag
} from 'lucide-react';
import { Category, Product, ProductItemDimension, ProductMaterial, ProductHighlight, ProductDetail, MaterialCard, ProductColor } from '../../types';

interface AdminProductFormProps {
  product: Product | null;
  categories: Category[];
  allProducts: Product[];
  onSave: (product: Product) => void;
  onCancel: () => void;
  onPreview: (product: Product) => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  categories,
  allProducts,
  onSave,
  onCancel,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'specs' | 'story' | 'related'>('basic');

  const [formData, setFormData] = useState<Product>(() => {
    if (product) return JSON.parse(JSON.stringify(product));
    const now = new Date().toISOString();
    return {
      id: `prod-${Date.now()}`,
      code: `CDH-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      slug: '',
      categoryId: categories[0]?.id || 'cat-sofa',
      subCategoryId: '',
      shortDescription: '',
      isVisible: true,
      isFeatured: false,
      isNew: true,
      createdAt: now,
      updatedAt: now,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
      ],
      mainImageIndex: 0,
      hoverImageIndex: undefined,
      colors: [{ name: 'Gỗ Tự Nhiên', hex: '#C2A385' }],
      materialTags: ['Gỗ sồi tự nhiên'],
      sizeTags: ['Tiêu chuẩn (1m6 - 2m)'],
      styleTags: ['Japandi'],
      items: [
        {
          name: 'Quy cách tiêu chuẩn',
          dimensions: { length: 200, width: 90, height: 75, note: '' }
        }
      ],
      materials: [
        { part: 'Khung chính', material: 'Gỗ Sồi nhập khẩu Bắc Mỹ tiêu chuẩn FAS' }
      ],
      highlights: [
        { title: 'Chế tác thủ công', text: 'Ghép mộng truyền thống tinh tế không lộ ốc vít.' }
      ],
      details: [],
      dimensionImages: [],
      materialCards: [],
      relatedProductIds: []
    };
  });

  // State for adding tags
  const [materialTagInput, setMaterialTagInput] = useState('');
  const [sizeTagInput, setSizeTagInput] = useState('');
  const [styleTagInput, setStyleTagInput] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Auto-generate slug from name if new
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug && product ? prev.slug : slug
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, dataUrl]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images,
        mainImageIndex: prev.mainImageIndex >= images.length ? 0 : prev.mainImageIndex
      };
    });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formData.images.length) return;

    const newImgs = [...formData.images];
    const temp = newImgs[index];
    newImgs[index] = newImgs[targetIdx];
    newImgs[targetIdx] = temp;

    setFormData((prev) => ({ ...prev, images: newImgs }));
  };

  // Tag Handlers
  const addMaterialTag = () => {
    if (materialTagInput.trim() && !formData.materialTags.includes(materialTagInput.trim())) {
      setFormData((prev) => ({ ...prev, materialTags: [...prev.materialTags, materialTagInput.trim()] }));
      setMaterialTagInput('');
    }
  };

  const addSizeTag = () => {
    if (sizeTagInput.trim() && !formData.sizeTags.includes(sizeTagInput.trim())) {
      setFormData((prev) => ({ ...prev, sizeTags: [...prev.sizeTags, sizeTagInput.trim()] }));
      setSizeTagInput('');
    }
  };

  const addStyleTag = () => {
    if (styleTagInput.trim() && !formData.styleTags.includes(styleTagInput.trim())) {
      setFormData((prev) => ({ ...prev, styleTags: [...prev.styleTags, styleTagInput.trim()] }));
      setStyleTagInput('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Vui lòng điền tên tác phẩm và mã sản phẩm.');
      return;
    }
    onSave(formData);
  };

  const topCategories = categories.filter((c) => c.parentId === null);
  const currentSubcategories = categories.filter((c) => c.parentId === formData.categoryId);

  return (
    <div className="space-y-6 font-sans pb-16 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#D2C4BA] text-[#4E453E] hover:text-[#1D1B17] hover:bg-[#F2EDE6]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-serif text-xl font-normal text-[#1D1B17]">
              {product ? `Chỉnh Sửa: ${product.name}` : 'Thêm Tác Phẩm Mới'}
            </h2>
            <p className="text-xs text-[#4E453E] font-mono">
              Mã: {formData.code || 'Chưa đặt mã'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(formData)}
            className="px-4 py-2.5 bg-white border border-[#D2C4BA] hover:bg-[#F2EDE6] text-xs font-semibold text-[#1D1B17] rounded-xl flex items-center gap-1.5 min-h-[44px]"
          >
            <Eye className="w-4 h-4 text-[#523D2A]" />
            <span>Xem Trước</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#523D2A] hover:bg-[#6B5440] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Tác Phẩm</span>
          </button>
        </div>
      </div>

      {/* 5 Imported Tabs */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] overflow-hidden shadow-xs">
        <div className="flex border-b border-[#D2C4BA] bg-[#F2EDE6] overflow-x-auto">
          {[
            { id: 'basic', label: '1. Thông tin cơ bản' },
            { id: 'images', label: '2. Hình ảnh' },
            { id: 'specs', label: '3. Thông số kỹ thuật' },
            { id: 'story', label: '4. Nội dung câu chuyện' },
            { id: 'related', label: '5. Sản phẩm liên quan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors min-h-[44px] ${
                activeTab === tab.id
                  ? 'bg-[#FEF9F2] text-[#523D2A] border-b-2 border-[#523D2A]'
                  : 'text-[#4E453E] hover:text-[#1D1B17]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* TAB 1: Thông tin cơ bản */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4E453E] mb-1">
                    Tên tác phẩm nội thất <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="VD: Giường Gỗ Tự Nhiên Mộc Miên"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E453E] mb-1">
                    Mã sản phẩm (Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="CDH-BD-01"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs font-mono text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4E453E] mb-1">
                    Đường dẫn URL (slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs font-mono text-[#1D1B17]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E453E] mb-1">
                    Danh mục không gian chính
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subCategoryId: '' })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                  >
                    {topCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4E453E] mb-1">
                    Chủng loại con
                  </label>
                  <select
                    value={formData.subCategoryId || ''}
                    onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                  >
                    <option value="">-- Chọn chủng loại --</option>
                    {currentSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4E453E] mb-1">
                  Mô tả ngắn gọn (Quiet Luxury tone)
                </label>
                <textarea
                  rows={3}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Mô tả tinh thần Japandi, cảm giác chạm và tỷ lệ thiết kế..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3 bg-white border border-[#D2C4BA] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 accent-[#523D2A]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#1D1B17] block">Hiển thị trên Showroom</span>
                    <span className="text-[10px] text-[#4E453E]">Bỏ chọn để lưu kho (Ẩn)</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white border border-[#D2C4BA] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#523D2A]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#1D1B17] block">Tác phẩm tiêu biểu</span>
                    <span className="text-[10px] text-[#4E453E]">Hiển thị ở trang chủ</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white border border-[#D2C4BA] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 accent-[#523D2A]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#1D1B17] block">Gắn nhãn Mới</span>
                    <span className="text-[10px] text-[#4E453E]">Sản phẩm mới ra mắt</span>
                  </div>
                </label>
              </div>

              {/* Colors */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-semibold text-[#1D1B17] block">Tùy chọn màu sắc & hoàn thiện:</span>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D2C4BA] rounded-xl text-xs">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex }}></span>
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, colors: formData.colors.filter((_, idx) => idx !== i) })}
                        className="text-[#4E453E] hover:text-red-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt('Nhập tên màu (VD: Gỗ Óc Chó, Da Bò Caramel):');
                      const hex = prompt('Nhập mã màu HEX (VD: #5C4433):') || '#5C4433';
                      if (name) {
                        setFormData({ ...formData, colors: [...formData.colors, { name, hex }] });
                      }
                    }}
                    className="px-3 py-1 border border-dashed border-[#523D2A] text-[#523D2A] rounded-xl text-xs hover:bg-[#F2EDE6]"
                  >
                    + Thêm màu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Hình ảnh */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="p-4 bg-white border border-[#D2C4BA] rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Dán URL hình ảnh Unsplash hoặc CDN (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#FEF9F2] border border-[#D2C4BA] rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 bg-[#523D2A] text-white rounded-xl text-xs font-semibold hover:bg-[#6B5440]"
                  >
                    Thêm URL
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2 text-xs text-[#4E453E]">
                  <span>Hoặc tải ảnh từ máy tính (Data URL):</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-[#4E453E] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#F2EDE6] file:text-[#523D2A] cursor-pointer"
                  />
                </div>
              </div>

              {/* Image Grid with main and hover index, reorder */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#D2C4BA] overflow-hidden p-2 space-y-2">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F2EDE6]">
                      <img src={url} alt={`Ảnh ${idx}`} className="w-full h-full object-cover" />
                      {formData.mainImageIndex === idx && (
                        <span className="absolute top-1 left-1 bg-[#523D2A] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          Ảnh Chính
                        </span>
                      )}
                      {formData.hoverImageIndex === idx && (
                        <span className="absolute top-1 right-1 bg-[#6B5440] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          Ảnh Hover
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] gap-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, mainImageIndex: idx })}
                        className={`px-2 py-1 rounded text-[10px] font-medium ${
                          formData.mainImageIndex === idx
                            ? 'bg-[#523D2A] text-white'
                            : 'bg-[#F2EDE6] text-[#1D1B17] hover:bg-[#E5DDD0]'
                        }`}
                      >
                        Chính
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, hoverImageIndex: idx })}
                        className={`px-2 py-1 rounded text-[10px] font-medium ${
                          formData.hoverImageIndex === idx
                            ? 'bg-[#6B5440] text-white'
                            : 'bg-[#F2EDE6] text-[#1D1B17] hover:bg-[#E5DDD0]'
                        }`}
                      >
                        Hover
                      </button>

                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-[#4E453E] hover:text-[#1D1B17] disabled:opacity-30"
                          title="Lên trước"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'down')}
                          disabled={idx === formData.images.length - 1}
                          className="p-1 text-[#4E453E] hover:text-[#1D1B17] disabled:opacity-30"
                          title="Xuống sau"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lifestyle Image URL */}
              <div>
                <label className="block text-xs font-medium text-[#4E453E] mb-1">
                  URL ảnh không gian thực tế (Lifestyle Image)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.lifestyleImage || ''}
                  onChange={(e) => setFormData({ ...formData, lifestyleImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Thông số kỹ thuật */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {/* Items Dimensions Repeatable Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#D2C4BA] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17]">
                    Kích Thước Chi Tiết (cm)
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        items: [
                          ...formData.items,
                          { name: 'Kích thước mới', dimensions: { length: 200, width: 90, height: 75, note: '' } }
                        ]
                      })
                    }
                    className="text-xs text-[#523D2A] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm kích thước</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((item, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-[#D2C4BA] grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Tên quy cách (VD: Giường King)"
                        value={item.name}
                        onChange={(e) => {
                          const items = [...formData.items];
                          items[i].name = e.target.value;
                          setFormData({ ...formData, items });
                        }}
                        className="sm:col-span-2 px-2.5 py-1.5 border border-[#D2C4BA] rounded-lg text-xs"
                      />
                      <div className="flex gap-1 items-center sm:col-span-2">
                        <input
                          type="text"
                          placeholder="D (cm)"
                          value={item.dimensions.length}
                          onChange={(e) => {
                            const items = [...formData.items];
                            items[i].dimensions.length = e.target.value;
                            setFormData({ ...formData, items });
                          }}
                          className="w-16 px-2 py-1.5 border border-[#D2C4BA] rounded-lg text-xs font-mono"
                        />
                        <span>x</span>
                        <input
                          type="text"
                          placeholder="R (cm)"
                          value={item.dimensions.width}
                          onChange={(e) => {
                            const items = [...formData.items];
                            items[i].dimensions.width = e.target.value;
                            setFormData({ ...formData, items });
                          }}
                          className="w-16 px-2 py-1.5 border border-[#D2C4BA] rounded-lg text-xs font-mono"
                        />
                        <span>x</span>
                        <input
                          type="text"
                          placeholder="C (cm)"
                          value={item.dimensions.height}
                          onChange={(e) => {
                            const items = [...formData.items];
                            items[i].dimensions.height = e.target.value;
                            setFormData({ ...formData, items });
                          }}
                          className="w-16 px-2 py-1.5 border border-[#D2C4BA] rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              items: formData.items.filter((_, idx) => idx !== i)
                            })
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials Repeatable Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#D2C4BA] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17]">
                    Vật Liệu Cấu Thành Chi Tiết
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        materials: [...formData.materials, { part: 'Bộ phận', material: 'Vật liệu' }]
                      })
                    }
                    className="text-xs text-[#523D2A] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm dòng vật liệu</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.materials.map((m, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Bộ phận (VD: Khung sườn)"
                        value={m.part}
                        onChange={(e) => {
                          const mats = [...formData.materials];
                          mats[i].part = e.target.value;
                          setFormData({ ...formData, materials: mats });
                        }}
                        className="w-1/3 px-3 py-1.5 bg-white border border-[#D2C4BA] rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Chi tiết vật liệu (VD: Gỗ Sồi Bắc Mỹ tiêu chuẩn FAS)"
                        value={m.material}
                        onChange={(e) => {
                          const mats = [...formData.materials];
                          mats[i].material = e.target.value;
                          setFormData({ ...formData, materials: mats });
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D2C4BA] rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            materials: formData.materials.filter((_, idx) => idx !== i)
                          })
                        }
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag Inputs: MaterialTags, SizeTags, StyleTags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#D2C4BA]">
                {/* Material tags */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1D1B17]">Tags Vật Liệu:</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Thêm tag vật liệu"
                      value={materialTagInput}
                      onChange={(e) => setMaterialTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMaterialTag(); } }}
                      className="flex-1 px-2.5 py-1 bg-white border border-[#D2C4BA] rounded-lg text-xs"
                    />
                    <button type="button" onClick={addMaterialTag} className="px-2.5 py-1 bg-[#523D2A] text-white rounded-lg text-xs">
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.materialTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white border border-[#D2C4BA] rounded text-[11px] flex items-center gap-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => setFormData({ ...formData, materialTags: formData.materialTags.filter((t) => t !== tag) })} className="text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Size tags */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1D1B17]">Tags Kích Thước:</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Thêm tag kích thước"
                      value={sizeTagInput}
                      onChange={(e) => setSizeTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSizeTag(); } }}
                      className="flex-1 px-2.5 py-1 bg-white border border-[#D2C4BA] rounded-lg text-xs"
                    />
                    <button type="button" onClick={addSizeTag} className="px-2.5 py-1 bg-[#523D2A] text-white rounded-lg text-xs">
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.sizeTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white border border-[#D2C4BA] rounded text-[11px] flex items-center gap-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => setFormData({ ...formData, sizeTags: formData.sizeTags.filter((t) => t !== tag) })} className="text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Style tags */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1D1B17]">Tags Phong Cách:</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Thêm tag phong cách"
                      value={styleTagInput}
                      onChange={(e) => setStyleTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStyleTag(); } }}
                      className="flex-1 px-2.5 py-1 bg-white border border-[#D2C4BA] rounded-lg text-xs"
                    />
                    <button type="button" onClick={addStyleTag} className="px-2.5 py-1 bg-[#523D2A] text-white rounded-lg text-xs">
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.styleTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white border border-[#D2C4BA] rounded text-[11px] flex items-center gap-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => setFormData({ ...formData, styleTags: formData.styleTags.filter((t) => t !== tag) })} className="text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Nội dung câu chuyện */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              {/* Highlights */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#D2C4BA] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17]">
                    Điểm Nhấn Chế Tác (Highlights)
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        highlights: [
                          ...formData.highlights,
                          { title: 'Điểm nhấn mới', text: 'Mô tả chi tiết kỹ thuật thủ công.' }
                        ]
                      })
                    }
                    className="text-xs text-[#523D2A] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm điểm nhấn</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.highlights.map((h, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-[#D2C4BA] space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          placeholder="Tiêu đề điểm nhấn"
                          value={h.title}
                          onChange={(e) => {
                            const high = [...formData.highlights];
                            high[i].title = e.target.value;
                            setFormData({ ...formData, highlights: high });
                          }}
                          className="w-2/3 px-2.5 py-1 font-semibold text-xs border border-[#D2C4BA] rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              highlights: formData.highlights.filter((_, idx) => idx !== i)
                            })
                          }
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Nội dung chi tiết..."
                        value={h.text}
                        onChange={(e) => {
                          const high = [...formData.highlights];
                          high[i].text = e.target.value;
                          setFormData({ ...formData, highlights: high });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#D2C4BA] rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Sản phẩm liên quan */}
          {activeTab === 'related' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17]">
                Chọn Tác Phẩm Liên Quan ({formData.relatedProductIds.length} đã chọn)
              </h4>
              <p className="text-xs text-[#4E453E]">
                Nếu không chọn thủ công, hệ thống sẽ tự động lấy 4 sản phẩm cùng chủng loại con.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2 bg-[#F2EDE6] rounded-xl border border-[#D2C4BA]">
                {allProducts
                  .filter((p) => p.id !== formData.id)
                  .map((other) => {
                    const isChecked = formData.relatedProductIds.includes(other.id);
                    return (
                      <label
                        key={other.id}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-white border-[#523D2A] text-[#523D2A]'
                            : 'bg-[#FEF9F2] border-[#D2C4BA] text-[#1D1B17]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                relatedProductIds: [...formData.relatedProductIds, other.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                relatedProductIds: formData.relatedProductIds.filter((id) => id !== other.id)
                              });
                            }
                          }}
                          className="accent-[#523D2A]"
                        />
                        <img src={other.images[0]} alt={other.name} className="w-9 h-9 object-cover rounded" />
                        <div className="min-w-0 text-xs truncate">
                          <span className="font-mono text-[10px] text-[#523D2A] block">{other.code}</span>
                          <span className="font-medium truncate">{other.name}</span>
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
