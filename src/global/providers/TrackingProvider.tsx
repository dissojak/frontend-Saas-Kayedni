"use client";

import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { sendGA4Event } from "@/ga";
import { getOrCreateAnonymousId } from "@global/utils/anonymousId";

// GA4-forwarded event types — only key conversion/engagement events go to GA4
const GA4_FORWARDED_EVENTS = new Set([
  "page_view", "business_view", "booking_started", "booking_completed",
  "booking_abandoned", "search_query", "login", "signup", "logout",
  "review_submitted", "category_browsed",
  "testimonial_section_view", "testimonial_business_click",
  "login_failed", "signup_failed", "signup_validation_error",
  "forgot_password_requested", "forgot_password_failed",
  "reset_password_completed", "reset_password_failed",
]);

// Branded logging utilities
const KAYEDNI_BANNER = `
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║          📍 kayedni Tracking System              ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
`;

const COMPACT_BANNER = "🔷 kayedni Tracking";

const trackingConsole = {
  init: () => {
    if (typeof window !== "undefined") {
      console.log("%c" + KAYEDNI_BANNER, "color: #10b981; font-weight: bold");
      console.log(
        "%c✓ Tracking System Ready",
        "color: #10b981; font-weight: bold; font-size: 12px"
      );
    }
  },
  warn: (message: string, data?: any) => {
    if (typeof window !== "undefined") {
      console.warn(
        `%c${COMPACT_BANNER} [WARN]%c ${message}`,
        "color: #f59e0b; font-weight: bold; font-size: 11px",
        "color: #d97706; font-size: 11px"
      );
      if (data) console.log(data);
    }
  },
  error: (message: string, data?: any) => {
    if (typeof window !== "undefined") {
      console.error(
        `%c${COMPACT_BANNER} [ERROR]%c ${message}`,
        "color: #ef4444; font-weight: bold; font-size: 11px",
        "color: #dc2626; font-size: 11px"
      );
      if (data) console.error(data);
    }
  },
};

// Types
export type EventType =
  | "page_view"
  | "click"
  | "search"
  | "search_query"
  | "business_view"
  | "business_impression"
  | "service_view"
  | "booking_started"
  | "booking_completed"
  | "booking_abandoned"
  | "review_submitted"
  | "review_read"
  | "category_browsed"
  | "scroll_depth"
  | "time_on_page"
  | "filter_used"
  | "sort_used"
  | "outbound_click"
  | "click_phone"
  | "click_location"
  | "favorite_action"
  | "login"
  | "signup"
  | "logout"
  | "profile_update"
  | "testimonial_section_view"
  | "testimonial_business_click"
  | "login_attempt"
  | "login_failed"
  | "signup_validation_error"
  | "signup_failed"
  | "forgot_password_requested"
  | "forgot_password_failed"
  | "reset_password_completed"
  | "reset_password_failed";

/**
 * Tracking event payload — server-side fingerprinting means we no longer send
 * userAgent, ipAddress, browser, os, or deviceType from the client.
 */
export interface TrackingEvent {
  userId?: string | null;
  anonymousId?: string;
  sessionId: string;
  eventType: EventType;
  page: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface TrackingContextType {
  sessionId: string | null;
  trackEvent: (
    eventType: EventType,
    properties?: Record<string, any>
  ) => void;
  trackPageView: (page?: string) => void;
  flushEvents: () => Promise<void>;
}

export const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

interface TrackingProviderProps {
  children: React.ReactNode;
  batchSize?: number;
  flushInterval?: number;
  trackingServiceUrl?: string;
}

const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds
const TRACKING_SERVICE_URL = process.env.NEXT_PUBLIC_TRACKING_SERVICE_URL || "http://localhost:4000";
const SESSION_STORAGE_KEY = "kayedni_session_id";
const ANONYMOUS_USER_KEY = "kayedni_anonymous_id";

// Module-level flag — survives HMR (prevents double banner on hot reload)
let __trackingLoggerInitialized = false;

/**
 * Generates a UUID v4 for anonymous user identification
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Heartbeat ────────────────────────────────────────────────────────────────
// Keeps the session alive on the server (prevents premature expiry on long
// browsing sessions). Calls PATCH /api/session/:sessionId/activity every 45s.

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

function startHeartbeat(sessionId: string, trackingServiceUrl: string) {
  stopHeartbeat();
  heartbeatTimer = setInterval(async () => {
    try {
      await fetch(`${trackingServiceUrl}/api/session/${sessionId}/activity`, {
        method: "PATCH",
        headers: { "x-api-key": process.env.NEXT_PUBLIC_TRACKING_API_KEY || "" },
      });
    } catch {
      // non-fatal — session will still be usable
    }
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({
  children,
  batchSize = BATCH_SIZE,
  flushInterval = FLUSH_INTERVAL,
  trackingServiceUrl = TRACKING_SERVICE_URL,
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const eventQueueRef = useRef<TrackingEvent[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const prevUserIdRef = useRef<string | null | undefined>(undefined); // undefined = not yet initialized
  const lastTrackedPageRef = useRef<string | null>(null); // for auto page_view dedup

  // Keep sessionId ref in sync with state (for reliable use in cleanup/sendBeacon)
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Initialize logger once (module-level flag survives HMR, prevents double banner)
  useEffect(() => {
    if (!__trackingLoggerInitialized) {
      __trackingLoggerInitialized = true;
      trackingConsole.init();
    }
  }, []);

  // Initialize session and anonymous ID
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUserId = user?.id || null;
    const previousUserId = prevUserIdRef.current;
    prevUserIdRef.current = currentUserId;

    // Detect genuine login transition:
    // - previousUserId is undefined on first render (not a transition)
    // - previousUserId !== currentUserId means user.id actually changed
    // - currentUserId !== null means user is now logged in
    const userJustLoggedIn =
      previousUserId !== undefined &&
      previousUserId !== currentUserId &&
      currentUserId !== null;

    // Generate or retrieve anonymous ID (shared utility, persisted in localStorage)
    const anonId = getOrCreateAnonymousId();
    setAnonymousId(anonId);

    // Try to get existing session from storage
    let sId = sessionStorage.getItem(SESSION_STORAGE_KEY);

    // Create a new session only when:
    // 1. No session exists yet (first visit / sessionStorage cleared)
    // 2. User just logged in (transition from anonymous → authenticated)
    if (!sId || userJustLoggedIn) {
      // End old session on login transition (fire-and-forget via sendBeacon)
      if (sId && userJustLoggedIn) {
        try {
          navigator.sendBeacon(
            `${trackingServiceUrl}/api/session/${sId}/end`,
            new Blob([JSON.stringify({ apiKey: process.env.NEXT_PUBLIC_TRACKING_API_KEY || "" })], { type: "text/plain" })
          );
        } catch {
          // Silently fail — never crash the app
        }
      }

      const newSessionId = generateUUID();
      sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
      sId = newSessionId;

      // Start new session on backend
      startSessionOnBackend(newSessionId, anonId);
    }

    // Start heartbeat for the active session
    startHeartbeat(sId, trackingServiceUrl);

    setSessionId(sId);
  }, [user?.id]);

  // Cleanup timer + flush on unmount — NEVER end the session here
  // (React Strict Mode and HMR both unmount/remount, which would prematurely kill sessions)
  // Session ending is handled ONLY by: visibilitychange listener OR login transition above
  useEffect(() => {
    return () => {
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      // Flush remaining events via sendBeacon (reliable during unmount, unlike fetch)
      if (eventQueueRef.current.length > 0) {
        try {
          navigator.sendBeacon(
            `${trackingServiceUrl}/api/track/batch`,
            new Blob(
              [JSON.stringify({ events: eventQueueRef.current, apiKey: process.env.NEXT_PUBLIC_TRACKING_API_KEY || "" })],
              { type: "text/plain" }
            )
          );
          eventQueueRef.current = [];
        } catch {
          // Silently fail — never crash the app
        }
      }
    };
  }, [sessionId, trackingServiceUrl]);

  // Setup beforeunload listener for reliable flushing on tab close
  useEffect(() => {
    if (typeof window === "undefined" || !sessionId) return;

    const handleBeforeUnload = () => {
      const beaconApiKey = process.env.NEXT_PUBLIC_TRACKING_API_KEY || "";

      // Flush events using sendBeacon (text/plain avoids CORS preflight)
      if (eventQueueRef.current.length > 0) {
        navigator.sendBeacon(
          `${trackingServiceUrl}/api/track/batch`,
          new Blob(
            [JSON.stringify({ events: eventQueueRef.current, apiKey: beaconApiKey })],
            { type: "text/plain" }
          )
        );
      }

      // End session using sendBeacon
      navigator.sendBeacon(
        `${trackingServiceUrl}/api/session/${sessionId}/end`,
        new Blob([JSON.stringify({ apiKey: beaconApiKey })], { type: "text/plain" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionId, trackingServiceUrl]);

  // ─── Auto page_view tracking on route changes ───────────────────────
  // Fires whenever Next.js pathname changes AND we have a valid session.
  // Uses a composite key (session + path) so a new session re-tracks the current page.
  useEffect(() => {
    if (!sessionId || !pathname) return;

    const key = `${sessionId}:${pathname}`;
    if (lastTrackedPageRef.current === key) return;
    lastTrackedPageRef.current = key;

    // Build and queue the event directly (trackEvent may not be stable yet)
    const event: TrackingEvent = {
      userId: user?.id ? String(user.id) : null,
      anonymousId: anonymousId || undefined,
      sessionId,
      eventType: "page_view",
      page: pathname,
      properties: { pathname, auto: true },
      timestamp: Date.now(),
    };

    eventQueueRef.current.push(event);

    // Schedule a flush if timer is not already running
    if (!flushTimerRef.current) {
      flushTimerRef.current = setTimeout(() => {
        flushTimerRef.current = null;
        // inline flush via fetch (not sendBeacon — this is a normal navigation, not unload)
        if (eventQueueRef.current.length === 0) return;
        const toSend = [...eventQueueRef.current];
        eventQueueRef.current = [];
        fetch(`${trackingServiceUrl}/api/track/batch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_TRACKING_API_KEY || "",
          },
          body: JSON.stringify({ events: toSend }),
        }).catch(() => {
          // Silently fail — never crash the app
        });
      }, 1000) as unknown as NodeJS.Timeout; // flush 1s after last route change (debounce)
    }
  }, [pathname, sessionId, user?.id, anonymousId, trackingServiceUrl]);

  /**
   * Start a new session on the backend.
   * Only sends: sessionId, userId, anonymousId, entryPage.
   * Server extracts device info, IP, referrer, language from HTTP headers automatically.
   */
  const startSessionOnBackend = useCallback(
    async (sId: string, anonId: string) => {
      try {
        const payload = {
          sessionId: sId,
          userId: user?.id ? String(user.id) : null,
          anonymousId: anonId,
          entryPage: typeof window !== "undefined" ? window.location.pathname : "/",
          // Server extracts: browser, os, deviceType, ipAddress, referrer, userAgent
        };

        await fetch(`${trackingServiceUrl}/api/session/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_TRACKING_API_KEY || "",
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        trackingConsole.warn("Failed to start tracking session", error);
      }
    },
    [user?.id, trackingServiceUrl]
  );

  const flushEvents = useCallback(async () => {
    if (eventQueueRef.current.length === 0) {
      return;
    }

    const eventsToSend = [...eventQueueRef.current];
    eventQueueRef.current = [];

    try {
      const response = await fetch(`${trackingServiceUrl}/api/track/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_TRACKING_API_KEY || "",
        },
        body: JSON.stringify({
          // No top-level userAgent or ipAddress — server handles these
          events: eventsToSend,
        }),
      });

      if (!response.ok) {
        trackingConsole.warn(
          `Failed to send tracking events: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      trackingConsole.warn("Failed to send tracking events", error);
      // Re-queue events if failed (optional: add retry logic here)
    }
  }, [trackingServiceUrl]);

  const scheduleFlushing = useCallback(() => {
    if (flushTimerRef.current) {
      clearInterval(flushTimerRef.current);
    }

    flushTimerRef.current = setInterval(() => {
      flushEvents();
    }, flushInterval);
  }, [flushInterval, flushEvents]);

  const trackEvent = useCallback(
    (eventType: EventType, properties?: Record<string, any>) => {
      if (!sessionId) return;

      const event: TrackingEvent = {
        userId: user?.id ? String(user.id) : null,
        anonymousId: anonymousId || undefined,
        sessionId,
        eventType,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        properties: properties || {},
        // No userAgent or ipAddress — server extracts these from HTTP headers
        timestamp: Date.now(),
      };

      eventQueueRef.current.push(event);

      // Forward key events to Google Analytics 4 (if loaded)
      if (GA4_FORWARDED_EVENTS.has(eventType)) {
        sendGA4Event(eventType, {
          ...properties,
          custom_session_id: sessionId,
        });
      }

      // Flush if batch size reached
      if (eventQueueRef.current.length >= batchSize) {
        flushEvents();
      } else {
        // Schedule flushing if not already scheduled
        if (!flushTimerRef.current) {
          scheduleFlushing();
        }
      }
    },
    [sessionId, user?.id, anonymousId, batchSize, flushEvents, scheduleFlushing]
  );

  const trackPageView = useCallback(
    (page?: string) => {
      const pathname = page || (typeof window !== "undefined" ? window.location.pathname : "/");
      trackEvent("page_view", { pathname });
    },
    [trackEvent]
  );

  const value: TrackingContextType = useMemo(() => ({
    sessionId,
    trackEvent,
    trackPageView,
    flushEvents,
  }), [sessionId, trackEvent, trackPageView, flushEvents]);

  return (
    <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>
  );
};

/**
 * Error Boundary wrapper for TrackingProvider
 * Catches any errors in the tracking system and renders children safely
 */
class TrackingProviderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    trackingConsole.error(
      "TrackingProvider crashed - rendering app without tracking",
      error,
    );
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render children without tracking context - never crash the app
      return this.props.children;
    }

    return this.props.children;
  }
}

/**
 * Wrapped TrackingProvider with error boundary protection
 */
export const TrackingProviderWithErrorBoundary: React.FC<TrackingProviderProps> = (
  props
) => {
  return (
    <TrackingProviderErrorBoundary>
      <TrackingProvider {...props} />
    </TrackingProviderErrorBoundary>
  );
};

// Export both versions - error-bounded version is default and recommended
export default TrackingProviderWithErrorBoundary;
