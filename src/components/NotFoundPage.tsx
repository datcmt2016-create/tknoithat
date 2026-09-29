import React, { useEffect } from 'react';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

interface NotFoundPageProps {
  onBackToHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToHome }) => {
  useEffect(() => {
    document.title = '404 - Không Tìm Thấy Trang | CDHome Atelier';
  }, []);

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden font-sans">
      {/* Calm Full-Bleed Photo Background */}
      <img
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
        alt="CDHome Atelier Calm Interior"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-[0.95]"
      />

      {/* Atmospheric Warm Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B17]/90 via-[#523D2A]/60 to-[#1D1B17]/70 backdrop-blur-[2px]"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-lg mx-auto px-6 py-12 text-center text-[#FEF9F2] space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F1E0C6] text-xs uppercase tracking-widest font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lỗi 404 • Không Gian Tĩnh Lặng</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-wide leading-tight">
            Không tìm thấy trang
          </h1>

          <p className="text-xs sm:text-sm text-[#D2C4BA] leading-relaxed max-w-md mx-auto font-light">
            Không gian nội thất hoặc liên kết bạn đang tìm kiếm không tồn tại, đã được chuyển dời hoặc tên đường dẫn chưa chính xác.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#FEF9F2] hover:bg-white text-[#523D2A] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Home className="w-4 h-4 text-[#523D2A]" />
            <span>Về Trang Chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
