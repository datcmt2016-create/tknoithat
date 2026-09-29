import React, { useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, MessageSquare, ExternalLink, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';
import { contactUtils } from '../utils/contact';

interface ShowroomPageProps {
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
}

export const ShowroomPage: React.FC<ShowroomPageProps> = ({ settings, onShowToast }) => {
  useEffect(() => {
    document.title = 'Showroom Thảo Điền | CDHome Atelier';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBookVisit = () => {
    contactUtils.copyAndOpenZalo(settings, null, 'Chào CDHome, tôi muốn đặt lịch ghé thăm showroom Thảo Điền.', onShowToast);
  };

  return (
    <div className="font-sans pb-16 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative bg-[#523D2A] text-[#FEF9F2] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80"
            alt="Showroom Thảo Điền"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#F1E0C6] font-semibold">
            Không Gian Tĩnh Lặng & Trải Nghiệm Thực Tế
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white">
            Showroom CDHome Thảo Điền
          </h1>
          <p className="text-sm sm:text-base text-[#D2C4BA] max-w-2xl mx-auto font-light leading-relaxed">
            Một chốn dừng chân giữa lòng Thảo Điền, nơi hội tụ những tác phẩm nội thất gỗ tự nhiên theo triết lý Japandi, tôn vinh nghệ thuật sống chậm và tĩnh tại.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleBookVisit}
              className="px-6 py-3.5 bg-[#FEF9F2] text-[#523D2A] hover:bg-[#F1E0C6] rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-[#523D2A]" />
              <span>Đặt Lịch Ghé Thăm Qua Zalo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Showroom Details & Photography Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#523D2A] font-bold">
              Triết Lý Atelier Serenity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B17]">
              Nghệ Thuật Chế Tác Từ Đam Mê Thuần Khiết
            </h2>
            <p className="text-xs sm:text-sm text-[#4E453E] leading-relaxed font-light text-justify">
              Được thành lập bởi những kiến trúc sư và nghệ nhân tâm huyết, CDHome tin rằng mỗi căn nhà là một chốn tịnh dưỡng linh thiêng. Chúng tôi không chạy theo xu hướng sản xuất công nghiệp hàng loạt; từng đường mộng ghép, bề mặt lau dầu tự nhiên và độ uốn của gỗ đều được gia công tỉ mỉ để đạt được tỷ lệ vàng thị giác.
            </p>
            <p className="text-xs sm:text-sm text-[#4E453E] leading-relaxed font-light text-justify">
              Tại showroom Thảo Điền, quý khách có thể thả mình trên chiếc sofa Roma Grand, chạm tay vào thớ gỗ sồi Bắc Mỹ của giường Mộc Miên hay thử độ mát lạnh của phiến đá Carrara tự nhiên.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
              alt="Góc đọc sách Thảo Điền"
              className="rounded-2xl border border-[#D2C4BA] aspect-[4/5] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
              alt="Bàn ăn Calacatta"
              className="rounded-2xl border border-[#D2C4BA] aspect-[4/5] object-cover mt-6"
            />
          </div>
        </div>

        {/* Location & Contact Information */}
        <div className="bg-[#F2EDE6] rounded-3xl p-8 sm:p-12 border border-[#D2C4BA]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#523D2A] font-semibold text-sm">
                <MapPin className="w-5 h-5" />
                <span>Địa Chỉ Trưng Bày</span>
              </div>
              <p className="text-xs text-[#1D1B17] font-medium leading-relaxed">
                {settings.address}
              </p>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#523D2A] hover:underline font-semibold pt-1 min-h-[44px]"
              >
                <span>Xem đường đi trên Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#523D2A] font-semibold text-sm">
                <Clock className="w-5 h-5" />
                <span>Thời Gian Đón Tiếp</span>
              </div>
              <p className="text-xs text-[#1D1B17] font-medium">
                {settings.openingHours}
              </p>
              <p className="text-[11px] text-[#4E453E] font-light">
                Quý khách vui lòng nhắn trước qua Zalo để CDHome chuẩn bị trà mộc và đỗ xe thuận tiện.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#523D2A] font-semibold text-sm">
                <Phone className="w-5 h-5" />
                <span>Hotline & Hỗ Trợ 24/7</span>
              </div>
              <a href={`tel:${settings.phone}`} className="block font-mono text-base font-bold text-[#523D2A] hover:underline">
                {settings.phone}
              </a>
              <p className="text-xs text-[#4E453E] font-light">
                Email: {settings.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
