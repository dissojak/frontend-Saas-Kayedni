const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1').replace(/\/+$/, '');
const INVITE_KEYS_BASE_URL = `${API_BASE_URL}/admin/invite-keys`;

export type AdminInviteKeyStatus = 'ACTIVE' | 'USED' | 'REVOKED' | 'EXPIRED';

export interface AdminInviteKey {
  id: number;
  rawToken: string;
  status: AdminInviteKeyStatus;
  createdAt: string;
  expiresAt?: string | null;
  usedAt?: string | null;
  usedByUserId?: number | null;
  assignedEmail?: string | null;
}

type ApiErrorShape = {
  message?: string;
  error?: string;
};

function getAuthToken(): string {
  const currentWindow = globalThis.window;
  if (!currentWindow) {
    return '';
  }

  return currentWindow.localStorage.getItem('accessToken') ?? '';
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: T | ApiErrorShape | string | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as T | ApiErrorShape;
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data !== null && 'message' in data && data.message) ||
      (typeof data === 'object' && data !== null && 'error' in data && data.error) ||
      (typeof data === 'string' && data) ||
      `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data as T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken()}`,
  };

  if (init.headers) {
    Object.assign(requestHeaders, init.headers as Record<string, string>);
  }

  const response = await fetch(`${INVITE_KEYS_BASE_URL}${path}`, {
    ...init,
    headers: requestHeaders,
  });

  return parseResponse<T>(response);
}

export async function fetchInviteKeys(status?: AdminInviteKeyStatus | 'ALL'): Promise<AdminInviteKey[]> {
  const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : '';
  return request<AdminInviteKey[]>(query, { method: 'GET' });
}

export async function generateInviteKeys(count: number): Promise<string[]> {
  return request<string[]>(`/generate?count=${encodeURIComponent(String(count))}`, { method: 'POST' });
}

export async function revokeInviteKey(id: number): Promise<void> {
  await request<void>(`/${id}/revoke`, { method: 'POST' });
}