import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 integration.
 * Loads the gtag.js script and initializes GA4 with the measurement ID.
 * Does nothing if NEXT_PUBLIC_GA_MEASUREMENT_ID is not set.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

/**
 * Helper to send custom events to GA4 from anywhere in the app.
 * Safe to call even if GA4 is not loaded — silently no-ops.
 */
export function sendGA4Event(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (
    typeof globalThis.window !== "undefined" &&
    (globalThis.window as any).gtag
  ) {
    (globalThis.window as any).gtag("event", eventName, params);
  }
}
