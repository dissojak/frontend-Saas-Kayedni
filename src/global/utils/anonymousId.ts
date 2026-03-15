/**
 * anonymousId.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates and persists a stable anonymous user ID in localStorage.
 * This ID survives page reloads and is used to link anonymous browsing sessions
 * before a user authenticates.
 */

const ANONYMOUS_ID_KEY = "kayedni_anon_id";

/**
 * Returns the existing anonymous ID from localStorage, or creates and persists
 * a new UUID v4 if none exists.
 */
export function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : generateUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

/**
 * Clears the stored anonymous ID (e.g. on explicit user data reset).
 */
export function clearAnonymousId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ANONYMOUS_ID_KEY);
  }
}

/**
 * Fallback UUID v4 generator for environments without crypto.randomUUID().
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
