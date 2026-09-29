import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Store, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('admin@cdhome.vn');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const ok = authService.adminLogin(password);
      if (ok) {
        onLoginSuccess();
      } else {
        setError('Mật khẩu quản trị không chính xác (mặc định thử: admin123).');
      }
      setLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#F2EDE6] text-[#1D1B17] flex flex-col justify-center items-center p-4 font-sans antialiased">
      <div className="w-full max-w-md bg-[#FEF9F2] rounded-3xl border border-[#D2C4BA] shadow-xl overflow-hidden p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#523D2A] text-[#FEF9F2] flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-[#F1E0C6]" />
          </div>
          <h1 className="font-serif text-2xl font-normal text-[#1D1B17]">
            Cổng Quản Trị CDHome
          </h1>
          <p className="text-xs text-[#4E453E] font-light">
            Đăng nhập hệ thống quản lý danh mục và dữ liệu catalog
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#4E453E] mb-1.5">
              Email quản trị viên
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#4E453E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cdhome.vn"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4E453E] mb-1.5">
              Mật khẩu xác thực
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4E453E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
              />
            </div>
            <p className="text-[10px] text-[#4E453E] mt-1 font-mono">
              Gợi ý mật khẩu demo: admin123
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#523D2A] hover:bg-[#6B5440] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}</span>
            <ArrowRight className="w-4 h-4 text-[#F1E0C6]" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#D2C4BA] text-center">
          <button
            onClick={onBackToStore}
            className="text-xs text-[#523D2A] hover:underline flex items-center justify-center gap-1.5 mx-auto min-h-[44px]"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Quay lại Showroom Catalog</span>
          </button>
        </div>
      </div>
    </div>
  );
};
