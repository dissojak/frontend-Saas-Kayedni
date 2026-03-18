import React from "react";

const BookingWarningStyles: React.FC = () => (
  <style jsx global>{`
    .booking-warning-card {
      position: relative;
      border-radius: 0.75rem;
      overflow: hidden;
      isolation: isolate;
      --warn-bg: #fffbeb;
      --warn-text: #78350f;
      --warn-border-1: #f59e0b;
      --warn-border-2: #fbbf24;
      --warn-border-3: #fb923c;
      --warn-glow: rgba(245, 158, 11, 0.35);
      border: 1px solid color-mix(in oklab, var(--warn-border-1) 35%, transparent);
      transition: box-shadow 1s ease-out, transform 1s ease-out;
    }

    .booking-warning-card::before {
      content: "";
      position: absolute;
      left: -85%;
      top: -120%;
      width: 70%;
      height: 340%;
      background: linear-gradient(
        110deg,
        transparent 10%,
        color-mix(in oklab, var(--warn-border-2) 55%, transparent) 35%,
        color-mix(in oklab, var(--warn-border-1) 85%, transparent) 50%,
        color-mix(in oklab, var(--warn-border-3) 65%, transparent) 62%,
        transparent 90%
      );
      filter: blur(10px);
      animation: bookingWarnBeam 3.2s linear infinite;
      opacity: 0.55;
      z-index: 0;
      transition: opacity 620ms ease-out, filter 1.5s ease-out;
    }

    .booking-warning-card::after {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: calc(0.75rem - 1px);
      background:
        radial-gradient(circle at 8% 6%, color-mix(in oklab, var(--warn-border-2) 22%, transparent), transparent 42%),
        radial-gradient(circle at 92% 94%, color-mix(in oklab, var(--warn-border-1) 16%, transparent), transparent 48%),
        var(--warn-bg);
      z-index: 1;
    }

    .booking-warning-card > :global(*) {
      position: relative;
      z-index: 2;
    }

    .booking-warning-card__content {
      position: relative;
      z-index: 2;
      color: var(--warn-text);
      text-shadow: 0 0 0.01px currentColor;
    }

    .booking-warning-card--soon {
      --warn-bg: #fffbeb;
      --warn-text: #78350f;
      --warn-border-1: #f59e0b;
      --warn-border-2: #fbbf24;
      --warn-border-3: #fb923c;
      --warn-glow: rgba(245, 158, 11, 0.34);
    }

    .booking-warning-card--critical {
      --warn-bg: #fef2f2;
      --warn-text: #7a1e12;
      --warn-border-1: #7a1e12;
      --warn-border-2: #9f2618;
      --warn-border-3: #c2410c;
      --warn-glow: rgba(122, 30, 18, 0.42);
    }

    .booking-warning-card--active::before,
    .booking-warning-card:hover::before,
    .booking-warning-card:focus-within::before {
      animation-duration: 0.9s;
      opacity: 0.95;
      filter: blur(8px) saturate(1.2);
    }

    .booking-warning-card--active {
      transform: translateY(-1px);
      box-shadow:
        0 0 0 1px color-mix(in oklab, var(--warn-border-2) 55%, transparent),
        0 0 20px var(--warn-glow),
        inset 0 0 24px color-mix(in oklab, var(--warn-border-1) 18%, transparent);
    }

    .booking-warning-card:hover,
    .booking-warning-card:focus-within {
      box-shadow:
        0 0 0 1px color-mix(in oklab, var(--warn-border-2) 42%, transparent),
        0 0 14px color-mix(in oklab, var(--warn-glow) 70%, transparent);
    }

    @keyframes bookingWarnBeam {
      0% {
        transform: translateX(-8%) rotate(8deg);
      }
      50% {
        transform: translateX(170%) rotate(8deg);
      }
      100% {
        transform: translateX(340%) rotate(8deg);
      }
    }
  `}</style>
);

export default BookingWarningStyles;
