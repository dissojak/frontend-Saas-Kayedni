import { forgotPasswordAPI } from '../../api/auth.api';
import type { ForgotPasswordPayload } from '../types';

export async function callBackendForgotPassword(
  payload: ForgotPasswordPayload
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const result = await forgotPasswordAPI(payload);
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
