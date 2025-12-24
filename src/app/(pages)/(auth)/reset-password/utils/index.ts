import { resetPasswordAPI } from '../../api/auth.api';
import type { ResetPasswordPayload } from '../types';

export async function callBackendResetPassword(
  payload: ResetPasswordPayload
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const result = await resetPasswordAPI(payload);
    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
