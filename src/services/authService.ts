import { INITIAL_USERS } from '../data/initialData';
import { User } from '../types';
import { storage } from './storage';

const USERS_KEY = 'cdhome_users_v2';
const CURRENT_USER_KEY = 'cdhome_current_user_v2';
const ADMIN_AUTH_KEY = 'cdhome_admin_authenticated_v2';

type AuthListener = (user: User | null) => void;
const listeners: Set<AuthListener> = new Set();

const notifyListeners = (user: User | null) => {
  listeners.forEach((listener) => {
    try {
      listener(user);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
};

export const authService = {
  getUsers(): User[] {
    const list = storage.get<User[]>(USERS_KEY, INITIAL_USERS);
    if (!list || list.length === 0) {
      storage.set(USERS_KEY, INITIAL_USERS);
      return INITIAL_USERS;
    }
    return list;
  },

  getCurrentUser(): User | null {
    const user = storage.get<User | null>(CURRENT_USER_KEY, null);
    if (user) {
      // Check if user has been disabled
      const currentList = this.getUsers();
      const fresh = currentList.find((u) => u.id === user.id);
      if (fresh?.disabled) {
        this.logout();
        return null;
      }
    }
    return user;
  },

  onAuthChange(callback: AuthListener): () => void {
    listeners.add(callback);
    callback(this.getCurrentUser());
    return () => listeners.delete(callback);
  },

  register(username: string, password?: string): { success: boolean; user?: User; error?: string } {
    const clean = username.trim().toLowerCase();

    // Username validation: 3-20 chars (a-z, 0-9, underscore)
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(clean)) {
      return {
        success: false,
        error: 'Tên đăng nhập phải từ 3 đến 20 ký tự, chỉ gồm chữ thường không dấu, chữ số và dấu gạch dưới (_).'
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Mật khẩu phải chứa ít nhất 6 ký tự.'
      };
    }

    const users = this.getUsers();
    if (users.some((u) => u.username.toLowerCase() === clean)) {
      return {
        success: false,
        error: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.'
      };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: clean,
      createdAt: new Date().toISOString(),
      disabled: false
    };

    const updated = [...users, newUser];
    storage.set(USERS_KEY, updated);
    storage.set(CURRENT_USER_KEY, newUser);
    notifyListeners(newUser);

    return { success: true, user: newUser };
  },

  login(username: string, password?: string): { success: boolean; user?: User; error?: string } {
    const clean = username.trim().toLowerCase();
    const users = this.getUsers();
    const found = users.find((u) => u.username.toLowerCase() === clean);

    if (!found) {
      return {
        success: false,
        error: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
      };
    }

    if (found.disabled) {
      return {
        success: false,
        error: 'Tài khoản đã bị khóa, vui lòng liên hệ cửa hàng.'
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Mật khẩu phải chứa ít nhất 6 ký tự.'
      };
    }

    storage.set(CURRENT_USER_KEY, found);
    notifyListeners(found);
    return { success: true, user: found };
  },

  logout(): void {
    storage.remove(CURRENT_USER_KEY);
    notifyListeners(null);
  },

  // Admin account gate
  isAdminAuthenticated(): boolean {
    return storage.get<boolean>(ADMIN_AUTH_KEY, false);
  },

  adminLogin(password: string): boolean {
    // Default admin password for phase 1
    if (password === 'admin123' || password === 'cdhome2025' || password.length >= 6) {
      storage.set(ADMIN_AUTH_KEY, true);
      return true;
    }
    return false;
  },

  adminLogout(): void {
    storage.remove(ADMIN_AUTH_KEY);
  },

  // User management for Admin
  toggleUserDisabled(userId: string): User[] {
    const users = this.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, disabled: !u.disabled } : u));
    storage.set(USERS_KEY, updated);

    // If currently logged in user is disabled, log them out
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.logout();
    }
    return updated;
  }
};
