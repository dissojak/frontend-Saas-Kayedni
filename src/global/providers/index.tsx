"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@components/ui/toaster";
import { Toaster as Sonner } from "@components/ui/sonner";
import { TooltipProvider } from "@components/ui/tooltip";
import { AuthProvider } from "@/(pages)/(auth)/context/AuthContext";
import { BookingProvider } from "@/(pages)/(booking)/context/BookingContext";
import TrackingProvider from "@global/providers/TrackingProvider";
import SliceThemeProvider from "@global/providers/SliceThemeProvider";

const queryClient = new QueryClient();

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <SliceThemeProvider>
            <TrackingProvider>
              <BookingProvider>{children}</BookingProvider>
            </TrackingProvider>
          </SliceThemeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Providers;
