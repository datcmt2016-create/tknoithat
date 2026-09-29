import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1D1B17] text-[#FEF9F2] border border-[#523D2A] rounded-full shadow-2xl text-xs sm:text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 text-[#F1E0C6] shrink-0" />
        <span className="leading-snug">{message}</span>
        <button
          onClick={onClose}
          className="p-1 text-[#D2C4BA] hover:text-white rounded-full transition-colors ml-1"
          aria-label="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
