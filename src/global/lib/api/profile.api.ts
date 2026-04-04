import { apiGet, apiPatch, apiPost, apiRequest } from '@/(pages)/(auth)/api/client';

export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  status?: string;
  avatarUrl?: string;
  hasBusiness?: boolean;
  businessId?: number | null;
  businessName?: string | null;
  businessCategoryName?: string | null;
}

export interface UpdateProfilePayload {
  name: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ProfileImageResponse {
  url: string;
  publicId: string;
}

export async function fetchProfile(): Promise<UserProfile> {
  return apiGet('/v1/users/me', true);
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  return apiPatch('/v1/users/me', payload, true);
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiPost('/v1/users/me/change-password', payload, true);
}

export async function uploadProfileImage(file: File): Promise<ProfileImageResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest<ProfileImageResponse>('/v1/users/me/avatar', {
    method: 'POST',
    body: formData,
    requiresAuth: true,
  });
}
