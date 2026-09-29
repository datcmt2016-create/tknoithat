import React from 'react';
import { MapPin, Phone, Mail, Clock, Shield, MessageSquare, ExternalLink } from 'lucide-react';
import { StoreSettings } from '../types';
import { contactUtils } from '../utils/contact';

interface FooterProps {
  settings: StoreSettings;
  onNavigateToAdmin: () => void;
  onNavigateToShowroom: () => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateToAdmin,
  onNavigateToShowroom,
  onShowToast
}) => {
  const handleBookVisit = () => {
    contactUtils.copyAndOpenZalo(settings, null, 'Chào CDHome, tôi muốn đặt lịch ghé thăm showroom Thảo Điền.', onShowToast);
  };

  return (
    <footer className="bg-[#1D1B17] text-[#D2C4BA] border-t border-[#332F2A] mt-20 font-sans">
      {/* Top Banner: Showroom invitation */}
      <div className="border-b border-[#2D2A26] bg-[#26221D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#F1E0C6] font-semibold">
              Trải Nghiệm Thực Tế
            </span>
            <h3 className="font-serif text-2xl text-white font-normal">
              Kính Mời Quý Khách Ghé Thăm Showroom Thảo Điền
            </h3>
            <p className="text-xs text-[#D2C4BA] max-w-xl font-light">
              Tận mắt chiêm ngưỡng vân gỗ tự nhiên, cảm nhận độ hoàn thiện và nhận tư vấn chuyên sâu từ kiến trúc sư CDHome.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleBookVisit}
              className="px-5 py-3 rounded-xl bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] text-xs font-semibold uppercase tracking-wider transition-all shadow-md min-h-[44px]"
            >
              Đặt Lịch Qua Zalo
            </button>
            <button
              onClick={onNavigateToShowroom}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#FEF9F2] text-xs font-semibold uppercase tracking-wider transition-all min-h-[44px]"
            >
              Xem Địa Chỉ Showroom
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="font-serif font-normal text-2xl tracking-[0.2em] text-[#F1E0C6] uppercase">
                {settings.name}
              </div>
              <div className="text-[10px] tracking-wider uppercase text-[#D2C4BA] mt-1 font-mono">
                Atelier Serenity • Japandi Living
              </div>
            </div>
            <p className="text-xs text-[#D2C4BA]/90 leading-relaxed font-light text-justify max-w-md">
              CDHome kiến tạo những không gian sống tĩnh tại, nơi mỗi món đồ nội thất đều được chế tác từ gỗ sồi và óc chó tự nhiên, kết hợp sự dung dị của văn hóa Nhật Bản và nét thanh lịch của thiết kế Bắc Âu.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs">
              <a
                href={settings.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D2C4BA] hover:text-white transition-colors min-h-[44px] flex items-center"
              >
                Facebook Page
              </a>
              <span>•</span>
              <a
                href={`https://zalo.me/${settings.zaloPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D2C4BA] hover:text-white transition-colors min-h-[44px] flex items-center"
              >
                Zalo Concierge
              </a>
            </div>
          </div>

          {/* Showroom Address */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Không Gian Trưng Bày Thảo Điền
            </h4>
            <div className="space-y-3 text-xs text-[#D2C4BA]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F1E0C6] shrink-0 mt-0.5" />
                <span className="font-light leading-relaxed">{settings.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F1E0C6] shrink-0" />
                <span className="font-light">Giờ đón khách: {settings.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Contact & Admin */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tư Vấn & Kết Nối
            </h4>
            <div className="space-y-2 text-xs text-[#D2C4BA]">
              <div>
                <span className="text-[10px] text-[#D2C4BA]/70 block">Hotline trực tiếp:</span>
                <a href={`tel:${settings.phone}`} className="font-mono text-base font-bold text-[#F1E0C6] hover:underline">
                  {settings.phone}
                </a>
              </div>
              <div>
                <span className="text-[10px] text-[#D2C4BA]/70 block">Email tư vấn bản vẽ:</span>
                <a href={`mailto:${settings.email}`} className="text-stone-300 hover:text-white">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2D2A26]">
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#26221D] border border-[#3A352F] text-[#D2C4BA] hover:text-white text-xs transition-colors min-h-[44px]"
              >
                <Shield className="w-3.5 h-3.5 text-[#F1E0C6]" />
                <span>Trang Quản Trị Hệ Thống (/admin)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#26221D] py-6 text-center text-xs text-[#D2C4BA]/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {settings.name}. Bản quyền thuộc về CDHome Atelier Việt Nam.</p>
          <p className="text-[11px] font-light">Showroom Catalog • Chế tác theo yêu cầu kiến trúc sư</p>
        </div>
      </div>
    </footer>
  );
};
