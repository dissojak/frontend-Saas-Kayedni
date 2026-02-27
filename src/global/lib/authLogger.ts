/**
 * authLogger.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fire-and-forget utility for sending detailed auth security logs to the
 * dedicated `/api/auth-logs` endpoint (stored in a separate `auth_logs`
 * MongoDB collection, separate from the analytics `events` collection).
 *
 * Key design decisions:
 *  - Never throws — this must NEVER crash or block the auth flow.
 *  - IP is captured server-side via `req.ip` (trust proxy is enabled on Express).
 *  - sessionId links these logs to analytics events for cross-collection queries.
 */

const AUTH_LOG_URL = `${
  process.env.NEXT_PUBLIC_TRACKING_SERVICE_URL || "http://localhost:4000"
}/api/auth-logs`;

const API_KEY = process.env.NEXT_PUBLIC_TRACKING_API_KEY || "";
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

// ─── UA parser (mirrors server-side parseUA, avoids round-trip) ───────────────

function parseUAClient(ua: string): { browser: string; os: string; deviceType: string } {
  if (!ua) return { browser: "unknown", os: "unknown", deviceType: "desktop" };

  const isTablet = /ipad|tablet|(android(?!.*mobile))/i.test(ua);
  const isMobile = !isTablet && /mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua);

  // UA-based browser detection (order matters — Edge/Opera/Brave must come before Chrome)
  let browser = "unknown";
  if (/edg\//i.test(ua))             browser = "Edge";
  else if (/opr\//i.test(ua))        browser = "Opera";
  // Note: Brave has the same UA as Chrome — detected separately via navigator.brave below
  else if (/chrome\//i.test(ua))     browser = "Chrome";
  else if (/firefox\//i.test(ua))    browser = "Firefox";
  else if (/safari\//i.test(ua))     browser = "Safari";
  else if (/msie|trident/i.test(ua)) browser = "IE";
  else if (/curl/i.test(ua))         browser = "curl";
  else if (/python/i.test(ua))       browser = "python-bot";
  else if (/go-http/i.test(ua))      browser = "go-bot";
  else if (/java\//i.test(ua))       browser = "java-bot";

  let os = "unknown";
  if (/windows nt 10/i.test(ua))    os = "Windows 10/11";
  else if (/windows/i.test(ua))     os = "Windows";
  else if (/mac os x/i.test(ua))    os = "macOS";
  else if (/android/i.test(ua))     os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua))       os = "Linux";

  return {
    browser,
    os,
    deviceType: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
  };
}

/**
 * Brave is Chromium-based and has an identical UA to Chrome.
 * The only reliable client-side detection is navigator.brave.isBrave() (async Promise).
 * Returns "Brave" if confirmed, otherwise returns the UA-parsed browser name.
 */
async function resolveBrowser(uaParsed: string): Promise<string> {
  if (uaParsed === "Chrome") {
    try {
      const nav = navigator as typeof navigator & { brave?: { isBrave: () => Promise<boolean> } };
      if (nav.brave && typeof nav.brave.isBrave === "function") {
        const isBrave = await nav.brave.isBrave();
        if (isBrave) return "Brave";
      }
    } catch {
      // navigator.brave exists in some Chromium builds but may throw — ignore
    }
  }
  return uaParsed;
}

// ─── Core function ────────────────────────────────────────────────────────────

/**
 * Log an auth security event to the dedicated `auth_logs` collection.
 *
 * Usage:
 * ```ts
 * logAuthEvent({ action: 'login_failed', success: false, failReason: 'invalid_credentials', failStage: 'api', email, role });
 * ```
 */
export function logAuthEvent(payload: AuthLogPayload): void {
  // SSR guard — sessionStorage and navigator are not available on the server
  if (typeof window === "undefined") return;

  // Run everything async internally so Brave detection (async) doesn't block the caller
  (async () => {
    try {
      const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY) ?? undefined;
      const ua = navigator.userAgent;
      const { browser: uaBrowser, os, deviceType } = parseUAClient(ua);
      // Brave has identical UA to Chrome — needs async navigator.brave.isBrave() check
      const browser = await resolveBrowser(uaBrowser);

      const body: Record<string, any> = {
        ...payload,
        sessionId,
        userAgent: ua,
        browser,
        os,
        deviceType,
        // IP is intentionally NOT sent from the client — Express reads req.ip server-side
      };

      await fetch(AUTH_LOG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(body),
      });
    } catch {
      // Silently swallow all errors — this must never affect the auth flow
    }
  })();
}
