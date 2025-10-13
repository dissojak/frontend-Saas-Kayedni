import { AuthResponse } from '../../types';
import type { RegisterPayload } from '../types';

/**
 * Placeholder for backend registration call. If you have a backend, replace
 * the implementation to POST to your API. For now it fakes a successful response.
 */
export async function callBackendRegister(payload: RegisterPayload): Promise<AuthResponse> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400));
  console.log('Simulated backend response');

  // Basic client-side validation example
  if (!payload.email || !payload.password || !payload.name) {
    return { success: false, message: 'Missing required fields' };
  }

  // If there's no backend, return a fake success and user object
  return {
    success: true,
    message: 'Registered (fake)',
    user: {
      id: Date.now().toString(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  };
}
