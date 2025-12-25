import type { User } from './types';

export const STORAGE_KEY = 'user';
export const TOKEN_KEY = 'accessToken';

export function loadStoredUser(): User | null {
  try {
    if (typeof window === 'undefined') return null;
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) as User : null;
  } catch {
    return null;
  }
}

export function loadStoredToken(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeUser(u: User | null) {
  try {
    if (typeof window === 'undefined') return;
    
    if (!u) {
      localStorage.removeItem(STORAGE_KEY);
      // Also clear tokens when logging out
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  } catch (error) {
    console.error('Error storing user:', error);
  }
}

// Note: makeFakeUser removed — the application now requires backend-provided user data.
// If you need a dev-only fallback, implement it explicitly in a development-only file.

/**
 * Normalize a user object received from the backend into the frontend `User` shape.
 * If the backend does not provide an avatar, fall back to the generated avatar URL.
 */
export function buildUserFromDb(dbUser: Partial<User> & { id?: string | number; avatar?: string | null } & Record<string, any>) {
  console.log("user :",dbUser);
  const name = dbUser.name ?? dbUser.email?.split('@')[0] ?? 'User';
  const email = dbUser.email ?? '';
  const phone = dbUser.phone ?? dbUser.phoneNumber ?? '';
  const role = (dbUser.role ?? 'CLIENT') as unknown as User['role'];
  const id = dbUser.id === undefined ? `local-${email.split('@')[0]}` : String(dbUser.id);
  const avatar = dbUser.avatar ? String(dbUser.avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  return {
    id,
    name,
    email,
    phone,
    role,
    avatar,
  } as User;
}
