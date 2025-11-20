/**
 * Small helper utilities around backend configuration.
 * Centralize the environment check so callers don't duplicate the same guard.
 */
export function ensureBackendConfigured(): void {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Backend not configured: NEXT_PUBLIC_API_BASE_URL is required');
  }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export default {
  ensureBackendConfigured,
  API_BASE_URL,
};
