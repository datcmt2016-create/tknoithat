import React, { useState } from 'react';
import { KeyRound, AlertCircle, Check } from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminPasswordCardProps {
  onShowToast: (msg: string) => void;
}

export const AdminPasswordCard: React.FC<AdminPasswordCardProps> = ({ onShowToast }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState(() => authService.isAdminDefaultPassword());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    const res = authService.changeAdminPassword(current, next);
    if (!res.success) {
      setError(res.error || 'Không đổi được mật khẩu.');
      return;
    }
    setCurrent('');
    setNext('');
    setConfirm('');
    setIsDefault(false);
    onShowToast('Đã đổi mật khẩu quản trị. Lần đăng nhập sau hãy dùng mật khẩu mới.');
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]';

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-6 shadow-xs space-y-4 font-sans"
    >
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EDE6]">
        <KeyRound className="w-5 h-5 text-[#523D2A]" />
        <h2 className="font-serif text-base text-[#1D1B17] font-semibold">Mật Khẩu Quản Trị</h2>
      </div>

      {isDefault ? (
        <p className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
          Bạn đang dùng mật khẩu mặc định. Hãy đặt mật khẩu mới (tối thiểu 8 ký tự, có cả chữ và số).
        </p>
      ) : (
        <p className="text-xs text-[#4E453E] flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          Đã đặt mật khẩu riêng. Nhập sai 5 lần, cổng quản trị sẽ tạm khóa 15 phút.
        </p>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="admin-current-password" className="text-xs font-semibold text-[#1D1B17] block">
            Mật khẩu hiện tại
          </label>
          <input id="admin-current-password" type="password" required autoComplete="current-password"
            value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-new-password" className="text-xs font-semibold text-[#1D1B17] block">
            Mật khẩu mới
          </label>
          <input id="admin-new-password" type="password" required autoComplete="new-password" minLength={8}
            value={next} onChange={(e) => setNext(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-confirm-password" className="text-xs font-semibold text-[#1D1B17] block">
            Nhập lại mật khẩu mới
          </label>
          <input id="admin-confirm-password" type="password" required autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl bg-[#523D2A] hover:bg-[#6B5440] text-white text-xs font-semibold min-h-[44px]"
      >
        Đổi mật khẩu quản trị
      </button>
    </form>
  );
};
