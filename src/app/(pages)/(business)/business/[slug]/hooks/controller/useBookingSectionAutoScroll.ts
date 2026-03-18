"use client";

import { useEffect } from "react";

export const useBookingSectionAutoScroll = (isBookingMode: boolean) => {
  useEffect(() => {
    if (!isBookingMode) return;

    const timer = setTimeout(() => {
      const bookingSection = document.getElementById("booking-section");

      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isBookingMode]);
};
