"use client";

import { useTracking } from "@global/hooks/useTracking";
import { useEffect, useRef } from "react";

interface ScrollDepthTrackerProps {
  containerSelector?: string;
  pageName?: string;
}

/**
 * Invisible component that tracks scroll depth on a page
 * Reports at 25%, 50%, 75%, and 100% scroll positions
 *
 * @example
 * export default function SearchPage() {
 *   return (
 *     <>
 *       <ScrollDepthTracker pageName="search" />
 *       <main>...results...</main>
 *     </>
 *   );
 * }
 */
export function ScrollDepthTracker({
  containerSelector = "main",
  pageName,
}: ScrollDepthTrackerProps) {
  const { trackEvent } = useTracking();
  const maxDepthRef = useRef(0);
  const reportedDepthsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container as HTMLElement;
      const scrollableHeight = scrollHeight - clientHeight;

      if (scrollableHeight <= 0) return;

      const depth = Math.round((scrollTop / scrollableHeight) * 100);

      if (depth > maxDepthRef.current) {
        maxDepthRef.current = depth;

        // Report at 25%, 50%, 75%, 100%
        [25, 50, 75, 100].forEach((milestone) => {
          if (depth >= milestone && !reportedDepthsRef.current.has(milestone)) {
            reportedDepthsRef.current.add(milestone);
            trackEvent("scroll_depth", {
              depth: milestone,
              maxDepth: maxDepthRef.current,
              pathname: window.location.pathname,
              pageName: pageName || window.location.pathname,
            });
          }
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () =>
      container.removeEventListener("scroll", handleScroll);
  }, [trackEvent, containerSelector, pageName]);

  return null; // Invisible tracking component
}

export default ScrollDepthTracker;
