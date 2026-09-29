import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Heart, Lock, Unlock, X, ExternalLink, 
  Calendar, Shield, AlertTriangle, ArrowUpDown, ChevronRight, KeyRound, AlertCircle
} from 'lucide-react';
import { Product, User } from '../../types';
import { favoritesService } from '../../services/favoritesService';
import { authService, MAX_LOGIN_ATTEMPTS } from '../../services/authService';

interface AdminUsersProps {
  users: User[];
  products: Product[];
  onToggleUserStatus: (userId: string) => void;
  onPreviewProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  products,
  onToggleUserStatus,
  onPreviewProduct,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'favorites' | 'name_asc'>('newest');

  // Side panel for viewing user's favorites
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Password reset dialog (also unlocks accounts locked after too many wrong passwords)
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [securityVersion, setSecurityVersion] = useState(0);

  const securityMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof authService.getSecurityStatus>>();
    users.forEach((u) => map.set(u.id, authService.getSecurityStatus(u.id)));
    return map;
  }, [users, securityVersion]);

  const openReset = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setResetUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setResetError(null);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser) return;
    if (newPassword !== confirmPassword) {
      setResetError('Mật khẩu xác nhận không khớp');
      return;
    }
    const res = authService.adminResetUserPassword(resetUser.id, newPassword);
    if (!res.success) {
      setResetError(res.error || 'Không cấp được mật khẩu.');
      return;
    }
    onShowToast(`Đã cấp mật khẩu mới cho "${resetUser.username}". Hãy gửi mật khẩu này cho khách qua kênh riêng.`);
    setResetUser(null);
    setSecurityVersion((v) => v + 1);
  };

  const securityBadge = (userId: string) => {
    const s = securityMap.get(userId);
    if (!s) return null;
    if (s.locked) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-amber-50 text-amber-800 border-amber-300" title={`Nhập sai mật khẩu ${MAX_LOGIN_ATTEMPTS} lần`}>
          Khóa do sai mật khẩu
        </span>
      );
    }
    if (!s.hasPassword) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-stone-100 text-stone-700 border-stone-300">
          Chưa có mật khẩu
        </span>
      );
    }
    if (s.failedAttempts > 0) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-amber-50 text-amber-800 border-amber-200">
          Sai {s.failedAttempts}/{MAX_LOGIN_ATTEMPTS} lần
        </span>
      );
    }
    return null;
  };

  // Favorites cache for each user
  const userFavoritesMap = useMemo(() => {
    const map = new Map<string, string[]>();
    users.forEach((u) => {
      map.set(u.id, favoritesService.list(u.id));
    });
    return map;
  }, [users]);

  // Filtered & Sorted users
  const filteredUsers = useMemo(() => {
    let list = users.filter((u) => {
      const matchSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase());
      const isLocked = !!u.disabled;
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? !isLocked
          : isLocked;
      return matchSearch && matchStatus;
    });

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'favorites') {
      list.sort((a, b) => {
        const countA = (userFavoritesMap.get(a.id) || []).length;
        const countB = (userFavoritesMap.get(b.id) || []).length;
        return countB - countA;
      });
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => a.username.localeCompare(b.username, 'vi'));
    }

    return list;
  }, [users, searchTerm, statusFilter, sortBy, userFavoritesMap]);

  // Handle lock/unlock with confirmation
  const handleLockUnlock = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    const willLock = !user.disabled;
    const confirmMsg = willLock
      ? `Bạn có chắc chắn muốn KHÓA tài khoản "${user.username}"? Người dùng này sẽ không thể đăng nhập để lưu tác phẩm yêu thích.`
      : `Bạn có muốn MỞ KHÓA cho tài khoản "${user.username}"?`;

    if (window.confirm(confirmMsg)) {
      onToggleUserStatus(user.id);
      onShowToast(
        willLock
          ? `Đã khóa tài khoản "${user.username}"`
          : `Đã mở khóa tài khoản "${user.username}"`
      );
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, disabled: willLock });
      }
    }
  };

  // Products favored by currently selected user
  const selectedUserFavoriteProducts = useMemo(() => {
    if (!selectedUser) return [];
    const favIds = userFavoritesMap.get(selectedUser.id) || [];
    return products.filter((p) => favIds.includes(p.id));
  }, [selectedUser, userFavoritesMap, products]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200 relative">
      {/* Top Filter Bar */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#4E453E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên đăng nhập người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
          >
            <option value="all">Tất cả trạng thái ({users.length})</option>
            <option value="active">Hoạt động ({users.filter((u) => !u.disabled).length})</option>
            <option value="locked">Đã khóa ({users.filter((u) => u.disabled).length})</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-white border border-[#D2C4BA] rounded-xl text-xs text-[#1D1B17] focus:outline-none focus:border-[#523D2A] cursor-pointer"
          >
            <option value="newest">Ngày tạo: Mới nhất</option>
            <option value="oldest">Ngày tạo: Cũ nhất</option>
            <option value="favorites">Số lượt yêu thích nhiều nhất</option>
            <option value="name_asc">Tên đăng nhập: A-Z</option>
          </select>
        </div>

        <div className="text-xs text-[#4E453E]">
          <span>Nhấp vào hàng để xem bộ sưu tập yêu thích của người dùng</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4E453E]">
            <thead className="bg-[#F2EDE6] text-[#1D1B17] uppercase text-[10px] font-bold tracking-wider border-b border-[#D2C4BA]">
              <tr>
                <th className="py-3.5 px-5">Tên đăng nhập</th>
                <th className="py-3.5 px-4">Ngày tạo</th>
                <th className="py-3.5 px-4 text-center">Số lượt yêu thích</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE6]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#4E453E]">
                    Không tìm thấy người dùng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const favCount = (userFavoritesMap.get(u.id) || []).length;
                  const isSelected = selectedUser?.id === u.id;

                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`hover:bg-[#F2EDE6]/60 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#F1E0C6]/40' : ''
                      }`}
                    >
                      {/* Tên đăng nhập */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#523D2A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#1D1B17]">
                              {u.username}
                            </span>
                            <span className="block text-[10px] font-mono text-[#4E453E]">
                              ID: {u.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Ngày tạo */}
                      <td className="py-3.5 px-4 font-mono text-xs text-[#4E453E]">
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Số lượt yêu thích */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2EDE6] text-xs font-semibold text-[#523D2A] border border-[#D2C4BA]">
                          <Heart className="w-3.5 h-3.5 fill-current text-red-600" />
                          <span>{favCount}</span>
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                            u.disabled
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {u.disabled ? 'Đã khóa' : 'Hoạt động'}
                        </span>
                        {securityBadge(u.id) && <div className="mt-1.5">{securityBadge(u.id)}</div>}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => openReset(e, u)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border bg-white text-[#523D2A] border-[#D2C4BA] hover:bg-[#F2EDE6] transition-all whitespace-nowrap"
                            title="Cấp mật khẩu mới (mở khóa nếu bị khóa do sai mật khẩu)"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Cấp MK mới</span>
                          </button>
                          <button
                            onClick={(e) => handleLockUnlock(e, u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                              u.disabled
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                            }`}
                            title={u.disabled ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            {u.disabled ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Mở khóa</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Khóa</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#F2EDE6] border-t border-[#D2C4BA] text-xs text-[#4E453E] flex justify-between items-center">
          <span>Tổng số: <strong className="font-mono text-[#1D1B17]">{filteredUsers.length}</strong> người dùng</span>
          <span className="text-[11px]">Người dùng tạo tài khoản chỉ để lưu trữ tác phẩm yêu thích</span>
        </div>
      </div>

      {/* Dialog: set a new password for a customer */}
      {resetUser && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setResetUser(null)}>
          <form
            onSubmit={handleResetSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FEF9F2] rounded-2xl border border-[#D2C4BA] shadow-2xl p-6 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-label="Cấp mật khẩu mới"
          >
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-5 h-5 text-[#523D2A]" />
              <h3 className="font-serif text-lg text-[#1D1B17]">Cấp mật khẩu mới</h3>
            </div>
            <p className="text-xs text-[#4E453E]">
              Tài khoản <strong className="text-[#1D1B17]">{resetUser.username}</strong>. Mật khẩu mới thay thế mật khẩu cũ
              và mở khóa nếu tài khoản bị khóa do nhập sai {MAX_LOGIN_ATTEMPTS} lần.
            </p>
            {resetError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="reset-new-password" className="text-xs font-semibold text-[#1D1B17] block">Mật khẩu mới</label>
              <input id="reset-new-password" type="password" required minLength={6} autoComplete="new-password"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-sm focus:outline-none focus:border-[#523D2A]" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reset-confirm-password" className="text-xs font-semibold text-[#1D1B17] block">Nhập lại mật khẩu mới</label>
              <input id="reset-confirm-password" type="password" required autoComplete="new-password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4BA] rounded-xl text-sm focus:outline-none focus:border-[#523D2A]" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setResetUser(null)}
                className="px-4 py-2 rounded-xl border border-[#D2C4BA] text-xs font-semibold text-[#4E453E] hover:bg-[#F2EDE6] min-h-[40px]">
                Hủy
              </button>
              <button type="submit"
                className="px-4 py-2 rounded-xl bg-[#523D2A] hover:bg-[#6B5440] text-white text-xs font-semibold min-h-[40px]">
                Lưu mật khẩu mới
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Side Panel: User's Favorites Detail */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-[#FEF9F2] h-full shadow-2xl border-l border-[#D2C4BA] flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#523D2A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-white leading-tight">
                    {selectedUser.username}
                  </h3>
                  <span className="text-[11px] text-[#D2C4BA] font-mono">
                    Ngày tham gia: {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Meta Card */}
            <div className="p-4 bg-[#F2EDE6] border-b border-[#D2C4BA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    selectedUser.disabled
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {selectedUser.disabled ? 'Tài khoản đã khóa' : 'Đang hoạt động'}
                </span>
                {securityBadge(selectedUser.id)}
                <span className="text-xs text-[#4E453E] font-medium">
                  • {selectedUserFavoriteProducts.length} tác phẩm đã lưu
                </span>
              </div>

              <button
                onClick={(e) => handleLockUnlock(e, selectedUser)}
                className="text-xs text-[#523D2A] hover:underline font-semibold flex items-center gap-1"
              >
                {selectedUser.disabled ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Mở khóa</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Khóa tài khoản</span>
                  </>
                )}
              </button>
            </div>

            {/* Favorites List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F2EDE6]">
                <Heart className="w-4 h-4 text-red-600 fill-current" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1B17]">
                  Danh Sách Tác Phẩm Yêu Thích
                </h4>
              </div>

              {selectedUserFavoriteProducts.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#4E453E] space-y-2">
                  <Heart className="w-8 h-8 text-[#D2C4BA] mx-auto stroke-1" />
                  <p>Người dùng này chưa lưu tác phẩm nào trong bộ sưu tập.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedUserFavoriteProducts.map((p) => {
                    const primaryDim = p.items?.[0]?.dimensions;

                    return (
                      <div
                        key={p.id}
                        className="p-3 bg-white border border-[#D2C4BA] rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-[#523D2A] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded-lg border border-[#D2C4BA] shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-bold text-[#523D2A]">
                              {p.code}
                            </span>
                            <h5 className="font-serif text-xs font-medium text-[#1D1B17] truncate">
                              {p.name}
                            </h5>
                            {primaryDim && (
                              <p className="text-[10px] text-[#4E453E] font-mono">
                                D{primaryDim.length} x R{primaryDim.width} x C{primaryDim.height} cm
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onPreviewProduct(p)}
                          className="p-2 text-[#523D2A] hover:bg-[#F2EDE6] rounded-lg shrink-0 transition-colors"
                          title="Xem chi tiết sản phẩm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#F2EDE6] border-t border-[#D2C4BA] text-right">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-[#523D2A] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
