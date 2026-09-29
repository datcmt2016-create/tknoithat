import React, { useState } from 'react';
import { 
  Settings, Save, Store, Phone, MapPin, Layout, 
  Check, RotateCcw, Image as ImageIcon, ExternalLink, Sparkles 
} from 'lucide-react';
import { StoreSettings } from '../../types';

interface AdminSettingsProps {
  settings: StoreSettings;
  onSaveSettings: (updated: StoreSettings) => void;
  onShowToast: (msg: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  onShowToast
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onShowToast('Đã lưu cài đặt cửa hàng thành công! Thông tin đã cập nhật ngay trên showroom.');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục lại cài đặt ban đầu của phiên làm việc này?')) {
      setFormData(settings);
      setIsSaved(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans animate-in fade-in duration-200 pb-20">
      {/* Top Header & Sticky Save Bar */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs sticky top-20 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#523D2A] text-white flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#F1E0C6]" />
          </div>
          <div>
            <h1 className="font-serif text-lg text-[#1D1B17]">Cài Đặt Cửa Hàng & Showroom</h1>
            <p className="text-xs text-[#4E453E]">
              Tùy chỉnh thông tin liên hệ, địa chỉ showroom và nội dung hiển thị trang chủ.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-[#D2C4BA] hover:bg-[#F2EDE6] text-xs font-medium text-[#4E453E] rounded-xl flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#523D2A] hover:bg-[#6B5440] text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-2 transition-all min-h-[44px]"
          >
            {isSaved ? <Check className="w-4 h-4 text-[#F1E0C6]" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Đã Lưu Thành Công' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: Thông tin cửa hàng */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EDE6]">
          <Store className="w-5 h-5 text-[#523D2A]" />
          <h2 className="font-serif text-base text-[#1D1B17] font-semibold">
            Thông Tin Cửa Hàng
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Tên thương hiệu showroom <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Email liên hệ & tiếp nhận yêu cầu <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Logo thương hiệu / Nhận diện (URL ảnh hoặc ký tự biểu trưng)
            </label>
            <input
              type="text"
              value={formData.logo}
              onChange={(e) => handleChange('logo', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Liên hệ */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EDE6]">
          <Phone className="w-5 h-5 text-[#523D2A]" />
          <h2 className="font-serif text-base text-[#1D1B17] font-semibold">
            Kênh Liên Hệ & Tư Vấn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Điện thoại Hotline <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs font-mono text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Số điện thoại Zalo nhận báo giá <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.zaloPhone}
              onChange={(e) => handleChange('zaloPhone', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs font-mono text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Đường dẫn Facebook Fanpage
            </label>
            <input
              type="url"
              value={formData.facebookPageUrl}
              onChange={(e) => handleChange('facebookPageUrl', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Showroom */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EDE6]">
          <MapPin className="w-5 h-5 text-[#523D2A]" />
          <h2 className="font-serif text-base text-[#1D1B17] font-semibold">
            Không Gian Showroom
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Địa chỉ showroom chính <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1B17] block">
                Giờ mở cửa đón khách <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1B17] block">
                Đường dẫn bản đồ Google Maps
              </label>
              <input
                type="url"
                value={formData.mapsUrl}
                onChange={(e) => handleChange('mapsUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Trang chủ */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EDE6]">
          <Layout className="w-5 h-5 text-[#523D2A]" />
          <h2 className="font-serif text-base text-[#1D1B17] font-semibold">
            Nội Dung Trang Chủ Showroom
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Ảnh bìa Hero Trang Chủ (URL) <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.heroImage}
              onChange={(e) => handleChange('heroImage', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
            {formData.heroImage && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-[#D2C4BA] mt-2">
                <img
                  src={formData.heroImage}
                  alt="Xem trước hero"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1B17] block">
                Tiêu đề Hero chính <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.heroHeadline}
                onChange={(e) => handleChange('heroHeadline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs font-serif text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1B17] block">
                Tagline phụ đề Hero <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.heroTagline}
                onChange={(e) => handleChange('heroTagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1B17] block">
              Câu trích dẫn triết lý thương hiệu (Brand Quote)
            </label>
            <textarea
              rows={2}
              value={formData.bandQuote}
              onChange={(e) => handleChange('bandQuote', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs italic text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          {/* Banner bộ sưu tập theo mùa */}
          <div className="pt-3 border-t border-[#F2EDE6] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#523D2A]">
              Banner Giới Thiệu Bộ Sưu Tập
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1B17] block">
                Ảnh Banner Bộ Sưu Tập (URL)
              </label>
              <input
                type="url"
                value={formData.seasonalBannerImage}
                onChange={(e) => handleChange('seasonalBannerImage', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1B17] block">
                  Tiêu đề Banner
                </label>
                <input
                  type="text"
                  value={formData.seasonalBannerTitle}
                  onChange={(e) => handleChange('seasonalBannerTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1B17] block">
                  Đoạn văn mô tả Banner
                </label>
                <input
                  type="text"
                  value={formData.seasonalBannerText}
                  onChange={(e) => handleChange('seasonalBannerText', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
