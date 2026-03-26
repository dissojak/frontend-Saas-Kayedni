/**
 * authLogger.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fire-and-forget utility for sending detailed auth security logs to the
 * dedicated `/api/auth-logs` endpoint (stored in a separate `auth_logs`
 * MongoDB collection, separate from the analytics `events` collection).
 *
 * Key design decisions:
 *  - Never throws — this must NEVER crash or block the auth flow.
 *  - Server-side request fingerprinting: browser, os, deviceType, ipAddress,
 *    userAgent are all extracted server-side from HTTP headers (req.context).
 *  - sessionId links these logs to analytics events for cross-collection queries.
 */

const AUTH_LOG_URL = "/api/track/auth-logs";
const SESSION_STORAGE_KEY = "kayedni_session_id";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthLogAction =
  | "login_attempt"
  | "login_success"
  | "login_failed"
  | "signup_attempt"
  | "signup_success"
  | "signup_failed"
  | "signup_validation_error"
  | "forgot_password_requested"
  | "forgot_password_failed"
  | "reset_password_success"
  | "reset_password_failed"
  | "logout";

export interface AuthLogPayload {
  /** The specific auth action that occurred */
  action: AuthLogAction;
  /**
   * Whether the action was successful.
   * Leave undefined for attempt events (outcome is not yet known when the log fires).
   */
  success?: boolean | null;
  /** Human-readable reason for failure (null on success) */
  failReason?: string | null;
  /** Which stage the failure occurred at */
  failStage?: "validation" | "api" | "network_error" | null;
  /** User email (may be partial / typed value — included for brute-force tracking) */
  email?: string | null;
  /** User role selected at time of action */
  role?: string | null;
  /** Resolved user ID (only available after successful login/registration) */
  userId?: string | null;
  /** Any extra contextual data */
  metadata?: Record<string, any>;
}

// ─── Core function ────────────────────────────────────────────────────────────

/**
 * Log an auth security event to the dedicated `auth_logs` collection.
 *
 * Server-side fingerprinting means we do NOT send browser, os, deviceType,
 * userAgent, or ipAddress from the client — the server fills these from
 * HTTP headers automatically via req.context.
 *
 * Usage:
 * ```ts
 * logAuthEvent({ action: 'login_failed', success: false, failReason: 'invalid_credentials', failStage: 'api', email, role });
 * ```
 */
export function logAuthEvent(payload: AuthLogPayload): void {
  // SSR guard — sessionStorage is not available on the server
  if (typeof window === "undefined") return;

  (async () => {
    try {
      const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY) ?? null;

      const body: Record<string, any> = {
        action: payload.action,
        success: payload.success ?? null,
        failReason: payload.failReason ?? null,
        failStage: payload.failStage ?? null,
        email: payload.email ?? null,
        userId: payload.userId ?? null,
        sessionId,
        metadata: payload.metadata ?? {},
        // DO NOT send: browser, os, deviceType, userAgent, ipAddress
        // Server fills these from HTTP headers automatically (req.context)
      };

      await fetch(AUTH_LOG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch {
      // Silently swallow all errors — this must never affect the auth flow
    }
  })();
}
