import React, { useState } from 'react';
import { X, Heart, Lock, User as UserIcon, AlertCircle, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  redirectReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  redirectReason = 'Đăng nhập để lưu tác phẩm vào danh sách yêu thích của bạn'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setUsername('');
      setPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const res = authService.login(username, password);
        if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Đăng nhập không thành công.');
        }
      } else {
        const res = authService.register(username, password);
        if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Đăng ký không thành công.');
        }
      }
      setLoading(false);
    }, 200);
  };

  const handleDemoUser = () => {
    const res = authService.login('hoanganh_decor', 'admin123');
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full md:max-w-md bg-[#FEF9F2] rounded-t-3xl md:rounded-2xl border-t md:border border-[#D2C4BA] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="md:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-[#D2C4BA] rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="bg-[#523D2A] text-[#FEF9F2] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#D2C4BA] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-[#F1E0C6]">
            <Heart className="w-4 h-4 fill-current text-[#F1E0C6]" />
            <span className="text-[11px] uppercase tracking-widest font-medium">Bộ Sưu Tập Yêu Thích</span>
          </div>

          <h3 className="font-serif text-2xl font-normal text-white">
            {mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
          </h3>
          <p className="text-xs text-[#D2C4BA] mt-1 leading-relaxed">
            {redirectReason}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-[#D2C4BA] bg-[#F2EDE6]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              mode === 'login'
                ? 'bg-[#FEF9F2] text-[#523D2A] border-b-2 border-[#523D2A]'
                : 'text-[#4E453E] hover:text-[#1D1B17]'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              mode === 'register'
                ? 'bg-[#FEF9F2] text-[#523D2A] border-b-2 border-[#523D2A]'
                : 'text-[#4E453E] hover:text-[#1D1B17]'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#4E453E] mb-1.5">
              Tên đăng nhập (username)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoCapitalize="none"
                placeholder="Ví dụ: hoanganh_decor"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-sm text-[#1D1B17] focus:outline-none focus:border-[#523D2A] focus:ring-1 focus:ring-[#523D2A]"
              />
            </div>
            <p className="text-[10px] text-[#4E453E]/80 mt-1">
              Từ 3 đến 20 ký tự (chữ thường a-z, chữ số 0-9 và gạch dưới _)
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4E453E] mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-sm text-[#1D1B17] focus:outline-none focus:border-[#523D2A] focus:ring-1 focus:ring-[#523D2A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#523D2A] hover:bg-[#6B5440] text-[#FEF9F2] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng Nhập Ngay' : 'Hoàn Tất Đăng Ký'}
          </button>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-[#D2C4BA] text-center">
            <p className="text-[11px] text-[#4E453E] mb-1.5">
              Thử nhanh không cần đăng ký?
            </p>
            <button
              type="button"
              onClick={handleDemoUser}
              className="text-xs font-medium text-[#523D2A] hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6B5440]" />
              <span>Đăng nhập tài khoản mẫu: hoanganh_decor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
