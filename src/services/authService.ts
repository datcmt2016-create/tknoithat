import { INITIAL_USERS } from '../data/initialData';
import { User } from '../types';
import { storage } from './storage';
import { hashPassword, randomSalt, safeEqual } from '../utils/hash';

const USERS_KEY = 'cdhome_users_v2';
const CURRENT_USER_KEY = 'cdhome_current_user_v2';
const ADMIN_AUTH_KEY = 'cdhome_admin_authenticated_v2';
const CREDENTIALS_KEY = 'cdhome_credentials_v1';
const ADMIN_CREDENTIALS_KEY = 'cdhome_admin_credentials_v1';

export const MAX_LOGIN_ATTEMPTS = 5;
const ADMIN_LOCK_MINUTES = 15;
const MIN_USER_PASSWORD = 6;
const MIN_ADMIN_PASSWORD = 8;

// Mật khẩu ban đầu của tài khoản mẫu (chỉ dùng để tạo mã băm lần đầu)
const SEED_USER_PASSWORDS: Record<string, string> = {
  'usr-001': 'admin123',
  'usr-002': 'villa2025'
};
const DEFAULT_ADMIN_EMAIL = 'admin@cdhome.vn';
const DEFAULT_ADMIN_PASSWORD = 'cdhome2025';

interface UserCredential {
  salt: string;
  hash: string;
  failedAttempts: number;
  locked: boolean;
}

interface AdminCredential {
  email: string;
  salt: string;
  hash: string;
  failedAttempts: number;
  lockedUntil: number | null;
  isDefaultPassword: boolean;
}

export interface UserSecurityStatus {
  hasPassword: boolean;
  failedAttempts: number;
  locked: boolean;
}

type AuthResult = { success: boolean; user?: User; error?: string };
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

const makeCredential = (password: string): UserCredential => {
  const salt = randomSalt();
  return { salt, hash: hashPassword(password, salt), failedAttempts: 0, locked: false };
};

const lockedMessage = () =>
  `Tài khoản đã bị khóa do nhập sai mật khẩu ${MAX_LOGIN_ATTEMPTS} lần. Vui lòng liên hệ cửa hàng để được quản trị viên cấp lại mật khẩu.`;

export const authService = {
  getUsers(): User[] {
    const list = storage.get<User[]>(USERS_KEY, INITIAL_USERS);
    if (!list || list.length === 0) {
      storage.set(USERS_KEY, INITIAL_USERS);
      return INITIAL_USERS;
    }
    return list;
  },

  // --- Credentials (password hashes live apart from User objects so they never reach the UI) ---
  getCredentials(): Record<string, UserCredential> {
    const creds = storage.get<Record<string, UserCredential>>(CREDENTIALS_KEY, {});
    let changed = false;
    for (const [userId, password] of Object.entries(SEED_USER_PASSWORDS)) {
      if (!creds[userId]) {
        creds[userId] = makeCredential(password);
        changed = true;
      }
    }
    if (changed) storage.set(CREDENTIALS_KEY, creds);
    return creds;
  },

  saveCredential(userId: string, credential: UserCredential): void {
    const creds = this.getCredentials();
    creds[userId] = credential;
    storage.set(CREDENTIALS_KEY, creds);
  },

  getSecurityStatus(userId: string): UserSecurityStatus {
    const c = this.getCredentials()[userId];
    return { hasPassword: !!c, failedAttempts: c?.failedAttempts ?? 0, locked: !!c?.locked };
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

  register(username: string, password?: string): AuthResult {
    const clean = username.trim().toLowerCase();

    // Username validation: 3-20 chars (a-z, 0-9, underscore)
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(clean)) {
      return {
        success: false,
        error: 'Tên đăng nhập phải từ 3 đến 20 ký tự, chỉ gồm chữ thường không dấu, chữ số và dấu gạch dưới (_).'
      };
    }

    if (!password || password.length < MIN_USER_PASSWORD) {
      return {
        success: false,
        error: `Mật khẩu phải chứa ít nhất ${MIN_USER_PASSWORD} ký tự.`
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

    storage.set(USERS_KEY, [...users, newUser]);
    this.saveCredential(newUser.id, makeCredential(password));
    storage.set(CURRENT_USER_KEY, newUser);
    notifyListeners(newUser);

    return { success: true, user: newUser };
  },

  login(username: string, password?: string): AuthResult {
    const clean = username.trim().toLowerCase();
    const found = this.getUsers().find((u) => u.username.toLowerCase() === clean);

    if (!found) {
      return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' };
    }

    if (found.disabled) {
      return { success: false, error: 'Tài khoản đã bị khóa, vui lòng liên hệ cửa hàng.' };
    }

    const cred = this.getCredentials()[found.id];
    if (!cred) {
      // Accounts created before passwords were stored
      return {
        success: false,
        error: 'Tài khoản chưa được thiết lập mật khẩu. Vui lòng liên hệ cửa hàng để quản trị viên cấp mật khẩu.'
      };
    }

    if (cred.locked) {
      return { success: false, error: lockedMessage() };
    }

    if (!password || !safeEqual(hashPassword(password, cred.salt), cred.hash)) {
      const failedAttempts = cred.failedAttempts + 1;
      const locked = failedAttempts >= MAX_LOGIN_ATTEMPTS;
      this.saveCredential(found.id, { ...cred, failedAttempts, locked });
      if (locked) {
        return { success: false, error: lockedMessage() };
      }
      const left = MAX_LOGIN_ATTEMPTS - failedAttempts;
      return {
        success: false,
        error: `Mật khẩu không chính xác. Bạn còn ${left} lần thử trước khi tài khoản bị khóa.`
      };
    }

    if (cred.failedAttempts > 0) {
      this.saveCredential(found.id, { ...cred, failedAttempts: 0 });
    }
    storage.set(CURRENT_USER_KEY, found);
    notifyListeners(found);
    return { success: true, user: found };
  },

  logout(): void {
    storage.remove(CURRENT_USER_KEY);
    notifyListeners(null);
  },

  // Admin: set a new password for a customer; also unlocks an account locked by wrong attempts
  adminResetUserPassword(userId: string, newPassword: string): { success: boolean; error?: string } {
    if (!this.getUsers().some((u) => u.id === userId)) {
      return { success: false, error: 'Không tìm thấy tài khoản.' };
    }
    if (!newPassword || newPassword.length < MIN_USER_PASSWORD) {
      return { success: false, error: `Mật khẩu mới phải có ít nhất ${MIN_USER_PASSWORD} ký tự.` };
    }
    this.saveCredential(userId, makeCredential(newPassword));
    return { success: true };
  },

  // --- Admin account gate ---
  getAdminCredential(): AdminCredential {
    let cred = storage.get<AdminCredential | null>(ADMIN_CREDENTIALS_KEY, null);
    if (!cred) {
      const salt = randomSalt();
      cred = {
        email: DEFAULT_ADMIN_EMAIL,
        salt,
        hash: hashPassword(DEFAULT_ADMIN_PASSWORD, salt),
        failedAttempts: 0,
        lockedUntil: null,
        isDefaultPassword: true
      };
      storage.set(ADMIN_CREDENTIALS_KEY, cred);
    }
    return cred;
  },

  isAdminAuthenticated(): boolean {
    return storage.get<boolean>(ADMIN_AUTH_KEY, false);
  },

  isAdminDefaultPassword(): boolean {
    return this.getAdminCredential().isDefaultPassword;
  },

  adminLogin(email: string, password: string): { success: boolean; error?: string } {
    const cred = this.getAdminCredential();

    if (cred.lockedUntil && Date.now() < cred.lockedUntil) {
      const minutes = Math.ceil((cred.lockedUntil - Date.now()) / 60000);
      return {
        success: false,
        error: `Cổng quản trị tạm khóa do nhập sai ${MAX_LOGIN_ATTEMPTS} lần. Vui lòng thử lại sau ${minutes} phút.`
      };
    }

    const emailOk = email.trim().toLowerCase() === cred.email.toLowerCase();
    const passOk = safeEqual(hashPassword(password, cred.salt), cred.hash);

    if (!emailOk || !passOk) {
      const failedAttempts = (cred.lockedUntil ? 0 : cred.failedAttempts) + 1;
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        storage.set(ADMIN_CREDENTIALS_KEY, {
          ...cred,
          failedAttempts: 0,
          lockedUntil: Date.now() + ADMIN_LOCK_MINUTES * 60000
        });
        return {
          success: false,
          error: `Nhập sai ${MAX_LOGIN_ATTEMPTS} lần. Cổng quản trị bị tạm khóa ${ADMIN_LOCK_MINUTES} phút.`
        };
      }
      storage.set(ADMIN_CREDENTIALS_KEY, { ...cred, failedAttempts, lockedUntil: null });
      return {
        success: false,
        error: `Email hoặc mật khẩu quản trị không chính xác. Còn ${MAX_LOGIN_ATTEMPTS - failedAttempts} lần thử.`
      };
    }

    storage.set(ADMIN_CREDENTIALS_KEY, { ...cred, failedAttempts: 0, lockedUntil: null });
    storage.set(ADMIN_AUTH_KEY, true);
    return { success: true };
  },

  changeAdminPassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
    const cred = this.getAdminCredential();
    if (!safeEqual(hashPassword(currentPassword, cred.salt), cred.hash)) {
      return { success: false, error: 'Mật khẩu hiện tại không đúng.' };
    }
    if (!newPassword || newPassword.length < MIN_ADMIN_PASSWORD) {
      return { success: false, error: `Mật khẩu mới phải có ít nhất ${MIN_ADMIN_PASSWORD} ký tự.` };
    }
    if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return { success: false, error: 'Mật khẩu mới cần có cả chữ và số.' };
    }
    if (newPassword === currentPassword) {
      return { success: false, error: 'Mật khẩu mới phải khác mật khẩu hiện tại.' };
    }
    const salt = randomSalt();
    storage.set(ADMIN_CREDENTIALS_KEY, {
      ...cred,
      salt,
      hash: hashPassword(newPassword, salt),
      failedAttempts: 0,
      lockedUntil: null,
      isDefaultPassword: false
    });
    return { success: true };
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
