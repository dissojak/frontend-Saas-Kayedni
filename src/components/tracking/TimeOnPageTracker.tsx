"use client";

import { useTracking } from "@global/hooks/useTracking";
import { useEffect, useRef } from "react";

interface TimeOnPageTrackerProps {
  pageName?: string;
  minDuration?: number; // Minimum duration to track (ms)
}

/**
 * Invisible component that tracks time user spends on a page
 * Place at the top level of a page to track engagement
 *
 * @example
 * export default function SearchPage() {
 *   return (
 *     <>
 *       <TimeOnPageTracker pageName="search" />
 *       ...page content...
 *     </>
 *   );
 * }
 */
export function TimeOnPageTracker({
  pageName,
  minDuration = 1000,
}: TimeOnPageTrackerProps) {
  const { trackEvent } = useTracking();
  const startTimeRef = useRef<number>(Date.now());
  const pagePathRef = useRef<string>(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    return () => {
      const duration = Date.now() - startTimeRef.current;

      // Only track if duration exceeds minimum
      if (duration > minDuration) {
        trackEvent("time_on_page", {
          pathname: pagePathRef.current,
          pageName: pageName || pagePathRef.current,
          duration,
          durationSeconds: Math.round(duration / 1000),
        });
      }
    };
  }, [trackEvent, minDuration]);

  return null; // Invisible tracking component
}

export default TimeOnPageTracker;
