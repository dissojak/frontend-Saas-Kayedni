import { AuthResponse } from '../../types';
import { LoginPayload } from '../types';

export async function callBackendLogin(payload: LoginPayload): Promise<AuthResponse> {
  const backend = process.env.NEXT_PUBLIC_AUTH_URL || '';
  if (!backend) {
    return { success: false, message: 'no-backend' };
  }

  const res = await fetch(backend + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (!res.ok) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const j = await res.json();
      return { success: false, message: j?.message || j?.error || JSON.stringify(j) };
    }
    const text = await res.text();
    return { success: false, message: text || 'Login failed' };
  }

  const json = await res.json().catch(() => null);
  return { success: true, user: json } as AuthResponse;
}
