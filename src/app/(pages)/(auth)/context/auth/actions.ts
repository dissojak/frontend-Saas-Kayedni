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
  // Backend login endpoint is at /api/v1/auth/login (server.servlet.context-path=/api)
  const res = await apiPost('/v1/auth/login', { email, password }, false);
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
  // Backend signup endpoint is at /api/v1/auth/signup
  const res = await apiPost('/v1/auth/signup', { name, email, password, role }, false);
  const candidate = res?.user ?? res?.data ?? res;
  const id = candidate?.id ?? candidate?.userId ?? candidate?.user_id ?? null;
  if (!candidate || !id) {
    throw new Error('Unexpected register response from backend');
  }
  return buildUserFromDb(candidate);
}
