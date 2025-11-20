import type { User } from './types';
import { buildUserFromDb } from './utils';
import { apiPost } from '../../api/client';
import { ensureBackendConfigured } from '../../../../../global/lib/backend';

/**
 * Call backend login and return a normalized frontend User.
 * This function expects the backend to be available and to return a user id.
 */
export async function login(email: string, password: string, role: User['role']) {
  ensureBackendConfigured();
  const res = await apiPost('/auth/login', { email, password, role }, false);
  const candidate = res?.user ?? res?.data ?? res;
  const id = candidate?.id ?? candidate?.userId ?? candidate?.user_id ?? null;
  if (!candidate || !id) {
    throw new Error('Unexpected login response from backend');
  }
  return buildUserFromDb(candidate);
}

/**
 * Call backend register and return a normalized frontend User.
 */
export async function register(name: string, email: string, password: string, role: User['role']) {
  ensureBackendConfigured();
  const res = await apiPost('/auth/register', { name, email, password, role }, false);
  const candidate = res?.user ?? res?.data ?? res;
  const id = candidate?.id ?? candidate?.userId ?? candidate?.user_id ?? null;
  if (!candidate || !id) {
    throw new Error('Unexpected register response from backend');
  }
  return buildUserFromDb(candidate);
}
