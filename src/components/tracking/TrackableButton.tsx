"use client";

import { useTracking } from "@global/hooks/useTracking";

interface TrackableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackEvent?: string;
  eventProperties?: Record<string, any>;
  elementId?: string;
  elementText?: string;
}

/**
 * Button component that automatically tracks clicks
 *
 * @example
 * <TrackableButton
 *   trackEvent="click"
 *   elementId="book-now"
 *   elementText="Book Now"
 *   onClick={handleBook}
 * >
 *   Book Now
 * </TrackableButton>
 */
export function TrackableButton({
  trackEvent: trackEventName = "click",
  eventProperties,
  elementId,
  elementText,
  onClick,
  children,
  ...props
}: TrackableButtonProps) {
  const { trackEvent } = useTracking();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the click
    trackEvent(trackEventName as any, {
      elementId: elementId || props.id,
      elementText: elementText || (children as string),
      ...eventProperties,
    });

    // Call original onClick
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export default TrackableButton;
