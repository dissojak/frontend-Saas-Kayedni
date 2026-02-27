import { useContext } from "react";
import { TrackingContext, TrackingContextType } from "@global/providers/TrackingProvider";

/**
 * Hook to access tracking functionality within components
 * Provides methods to track events and page views
 *
 * IMPORTANT: This hook will NOT crash if used outside TrackingProvider.
 * Instead, it returns a no-op stub and logs a warning. Tracking is always safe.
 *
 * @returns TrackingContextType with trackEvent, trackPageView, and flushEvents methods
 *
 * @example
 * const { trackEvent, trackPageView } = useTracking();
 * trackEvent("click", { elementId: "button-submit" });
 * trackPageView("/checkout");
 */
export function useTracking(): TrackingContextType {
  const context = useContext(TrackingContext);

  if (!context) {
    // Never crash the app - return no-op stub
    if (typeof window !== "undefined") {
      console.warn(
        "[kayedni Tracking] useTracking called outside TrackingProvider - tracking disabled for this component. " +
        "Ensure TrackingProvider wraps your component tree in providers/index.tsx"
      );
    }

    // Return no-op stub that safely does nothing
    return {
      sessionId: null,
      trackEvent: () => {
        // Silent no-op
      },
      trackPageView: () => {
        // Silent no-op
      },
      flushEvents: async () => {
        // Silent no-op
      },
    };
  }

  return context;
}

export default useTracking;
