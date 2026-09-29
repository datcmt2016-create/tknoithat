import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { StoreSettings } from '../types';
import { contactUtils } from '../utils/contact';

interface FloatingContactProps {
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
  isMobileProductPage?: boolean;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  settings,
  onShowToast,
  isMobileProductPage = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Hidden on mobile product page (which has sticky bottom bar)
  if (isMobileProductPage) {
    return (
      <div className="hidden md:block fixed bottom-6 right-6 z-40 print:hidden font-sans">
        <FloatingContent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          settings={settings}
          onShowToast={onShowToast}
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden font-sans">
      <FloatingContent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        settings={settings}
        onShowToast={onShowToast}
      />
    </div>
  );
};

const FloatingContent: React.FC<{
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  settings: StoreSettings;
  onShowToast: (msg: string) => void;
}> = ({ isOpen, setIsOpen, settings, onShowToast }) => {
  const handleZalo = () => {
    contactUtils.copyAndOpenZalo(settings, null, undefined, onShowToast);
  };

  return (
    <div className="flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#523D2A] text-[#FEF9F2] rounded-full shadow-lg hover:scale-105 transition-all text-xs font-medium min-h-[44px]"
          >
            <span>Hotline: {settings.phone}</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </a>

          <button
            onClick={handleZalo}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-[#0068FF] text-white rounded-full shadow-lg hover:scale-105 transition-all text-xs font-semibold min-h-[44px]"
          >
            <span>Zalo Báo Giá</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
              Zalo
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 min-h-[44px] min-w-[44px] rounded-full bg-[#523D2A] text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none ring-4 ring-[#523D2A]/20"
        title="Liên hệ tư vấn"
        aria-label="Liên hệ showroom"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};
