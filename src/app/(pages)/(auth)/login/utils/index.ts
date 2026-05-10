import { AuthResponse, reverseRoleMapping } from "../../types";
import { LoginPayload } from "../types";
import { loginAPI, verifyTwoFactorLoginAPI } from "../../api/auth.api";
import { setAccessToken, setRefreshToken } from "../../utils/token.utils";
import { buildUserFromDb } from "../../context/auth/utils";

/**
 * Call backend login endpoint with proper role mapping
 */
export async function callBackendLogin(payload: LoginPayload): Promise<AuthResponse> {
  try {
    // Call the backend API (role is not needed for login, backend determines it)
    const backendResponse = await loginAPI({
      email: payload.email,
      password: payload.password,
    });

    if (backendResponse.requiresTwoFactor && backendResponse.twoFactorToken) {
      return {
        success: false,
        requiresTwoFactor: true,
        twoFactorToken: backendResponse.twoFactorToken,
        twoFactorMethods: backendResponse.twoFactorMethods,
        message: backendResponse.message || "Two-factor authentication required",
      };
    }

    // Check if account needs activation
    if (!backendResponse.token && backendResponse.message.includes("activate")) {
      return {
        success: false,
        message: backendResponse.message,
      };
    }

    // Check if login was successful
    if (backendResponse.token) {
      // Store tokens using token management utilities
      setAccessToken(backendResponse.token);
      if (backendResponse.refreshToken) {
        setRefreshToken(backendResponse.refreshToken);
      }

      // Map backend role to frontend role
      const frontendRole = reverseRoleMapping[backendResponse.role];

      return {
        success: true,
        message: backendResponse.message,
        accessToken: backendResponse.token,
        refreshToken: backendResponse.refreshToken,
        user: buildUserFromDb({
          userId: backendResponse.userId,
          name: backendResponse.name,
          email: backendResponse.email,
          phone: backendResponse.phone,
          avatarUrl: backendResponse.avatar,
          role: frontendRole,
          token: backendResponse.token,
          refreshToken: backendResponse.refreshToken || undefined,
          // Business owner fields from login response
          hasBusiness: backendResponse.hasBusiness,
          businessId:
            backendResponse.businessId != null ? String(backendResponse.businessId) : undefined,
          businessName: backendResponse.businessName ?? undefined,
          businessCategoryName: backendResponse.businessCategoryName ?? undefined,
          isAlsoStaff: backendResponse.isAlsoStaff,
          staffId: backendResponse.staffId != null ? String(backendResponse.staffId) : undefined,
        }),
      };
    }

    // Fallback error
    return {
      success: false,
      message: backendResponse.message || "Login failed",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred during login",
    };
  }
}

export async function callBackendTwoFactorLogin(payload: {
  twoFactorToken: string;
  code: string;
  method?: "APP" | "EMAIL" | "SMS" | "BACKUP_CODE";
}): Promise<AuthResponse> {
  try {
    const backendResponse = await verifyTwoFactorLoginAPI(payload);

    if (backendResponse.token) {
      setAccessToken(backendResponse.token);
      if (backendResponse.refreshToken) {
        setRefreshToken(backendResponse.refreshToken);
      }

      const frontendRole = reverseRoleMapping[backendResponse.role];

      return {
        success: true,
        message: backendResponse.message,
        accessToken: backendResponse.token,
        refreshToken: backendResponse.refreshToken,
        user: buildUserFromDb({
          userId: backendResponse.userId,
          name: backendResponse.name,
          email: backendResponse.email,
          phone: backendResponse.phone,
          avatarUrl: backendResponse.avatar,
          role: frontendRole,
          token: backendResponse.token,
          refreshToken: backendResponse.refreshToken || undefined,
          // Business owner fields from 2FA login response
          hasBusiness: backendResponse.hasBusiness,
          businessId:
            backendResponse.businessId != null ? String(backendResponse.businessId) : undefined,
          businessName: backendResponse.businessName ?? undefined,
          businessCategoryName: backendResponse.businessCategoryName ?? undefined,
          isAlsoStaff: backendResponse.isAlsoStaff,
          staffId: backendResponse.staffId != null ? String(backendResponse.staffId) : undefined,
        }),
      };
    }

    return {
      success: false,
      message: backendResponse.message || "Two-factor login failed",
    };
  } catch (error) {
    console.error("Two-factor login error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred during two-factor login",
    };
  }
}
