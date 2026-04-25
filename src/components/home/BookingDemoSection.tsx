"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale } from "@global/hooks/useLocale";
import { homeT } from "@global/lib/i18n/home";

const handleIntersection = (entries: IntersectionObserverEntry[], video: HTMLVideoElement) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
};

export default function BookingDemoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer to handle Play/Pause on scroll
    const observer = new IntersectionObserver((entries) => handleIntersection(entries, video), {
      threshold: 0.3,
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const features = [
    homeT(locale, "booking_demo_feature_telegram"),
    homeT(locale, "booking_demo_feature_reviews"),
    homeT(locale, "booking_demo_feature_247"),
  ];

  return (
    <section className="py-16 md:pb-32 bg-[#FAFAFA] dark:bg-slate-950 relative overflow-hidden font-sans">
      <div className="container px-4 md:px-8 mx-auto relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-semibold text-sm mb-8 tracking-wide shadow-sm shadow-primary/5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span>{homeT(locale, "booking_demo_badge")}</span>
            </div>

            <h2 className="text-[2.5rem] md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15] mb-6">
              {homeT(locale, "booking_demo_title")}
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-light">
              {homeT(locale, "booking_demo_description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="xl"
                className="rounded-full shadow-xl shadow-primary/25 transition-all hover:-translate-y-1 font-semibold"
                onClick={() => router.push("/search")}
              >
                {isArabic ? (
                  <>
                    {homeT(locale, "booking_demo_cta")}
                    <ChevronRight className="w-5 h-5 mr-2 -scale-x-100" />
                  </>
                ) : (
                  <>
                    {homeT(locale, "booking_demo_cta")}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-x-8 gap-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 text-gray-600 dark:text-gray-400 text-sm font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary/80" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div
            className="relative w-full mt-16 md:mt-24 lg:mt-0 flex justify-center lg:justify-end pl-0 sm:pl-8 lg:pl-12"
            ref={containerRef}
          >
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Browser Mockup (Video) */}
            <div className="relative w-full max-w-[550px] aspect-[16/10] rounded-xl md:rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] z-20 bg-white dark:bg-slate-900 ring-1 ring-gray-900/10 dark:ring-slate-700/50 flex flex-col overflow-hidden md:right-12 bottom-12">
              {/* Fake browser top bar */}
              <div className="h-6 md:h-8 bg-gray-50/90 dark:bg-slate-800/90 backdrop-blur border-b border-gray-200/60 dark:border-slate-700/60 flex items-center px-3 z-30 shrink-0">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-400" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-400" />
                </div>
              </div>

              <div className="flex-1 w-full bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                <video
                  ref={videoRef}
                  src="/videos/Guide.webm"
                  className="w-full h-full object-cover object-top"
                  playsInline
                  loop
                  muted
                />
              </div>
            </div>

            {/* Left Floating Card (Staff/Service) */}
            <div className="hidden sm:block absolute -left-2 lg:-left-12 bottom-[5%] lg:bottom-[-8%] w-[140px] md:w-[160px] lg:w-[190px] rounded-[1.8rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-slate-800 z-30 hover:-translate-y-2 transition-transform duration-500 bg-white dark:bg-slate-900 ring-1 ring-black/5 dark:ring-slate-700/50">
              {/* Mobile fake notch */}
              <div className="absolute top-0 inset-x-0 h-4 bg-white dark:bg-slate-900 rounded-b-2xl w-[50%] mx-auto z-40 flex items-center justify-center">
                <div className="w-6 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mt-0.5" />
              </div>
              <Image
                src="/videos/kayedni-mobile-booking-staff&service_selection.png"
                alt={homeT(locale, "booking_demo_alt_staff_service")}
                width={190}
                height={411}
                className="w-full h-auto rounded-[1.2rem] ring-1 ring-gray-900/5 dark:ring-slate-700/50"
                unoptimized
              />
            </div>

            {/* Right Floating Card (Date Selection) */}
            <div className="hidden sm:block absolute -right-4 lg:-right-16 top-[5%] lg:top-[-25%] w-[150px] md:w-[170px] lg:w-[200px] rounded-[1.8rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-slate-800 z-30 hover:-translate-y-3 transition-transform duration-500 bg-white dark:bg-slate-900 ring-1 ring-black/5 dark:ring-slate-700/50">
              {/* Mobile fake notch */}
              <div className="absolute top-0 inset-x-0 h-4 bg-white dark:bg-slate-900 rounded-b-2xl w-[50%] mx-auto z-40 flex items-center justify-center">
                <div className="w-6 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mt-0.5" />
              </div>
              <Image
                src="/videos/kayedni-mobile-booking-date_selection.png"
                alt={homeT(locale, "booking_demo_alt_date_time")}
                width={200}
                height={433}
                className="w-full h-auto rounded-[1.2rem] ring-1 ring-gray-900/5 dark:ring-slate-700/50"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
