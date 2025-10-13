import type { User } from './types';

export const STORAGE_KEY = 'user';

export function loadStoredUser(): User | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) as User : null;
  } catch {
    return null;
  }
}

export function storeUser(u: User | null) {
  if (!u) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
}

export function makeFakeUser(name: string, email: string, role: User['role']) {
  return {
    id: `user-${Math.random().toString(36).substring(2, 9)}`,
    name,
    email,
    role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
  } as User;
}
