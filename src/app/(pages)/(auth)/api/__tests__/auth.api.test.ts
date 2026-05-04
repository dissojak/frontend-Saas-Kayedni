import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateInviteKeyAPI } from '../auth.api';

describe('validateInviteKeyAPI', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns valid response when backend returns valid=true', async () => {
    const mockResp = { valid: true, message: 'ok' };
    globalThis.fetch = vi.fn(() => Promise.resolve(new Response(JSON.stringify(mockResp), { status: 200 }))) as any;

    const res = await validateInviteKeyAPI('123456');
    expect(res.status).toBe(200);
    expect(res.data).toEqual(mockResp);
  });

  it('throws when fetch fails', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('network'))) as any;
    await expect(validateInviteKeyAPI('000000')).rejects.toThrow('network');
  });
});
