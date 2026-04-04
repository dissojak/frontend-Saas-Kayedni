"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { useTracking } from "@global/hooks/useTracking";

const displayFont = localFont({
  src: "../../../../../public/fonts/Zain/Zain-Bold.ttf",
  variable: "--font-beauty-display",
});

const bodyFont = localFont({
  src: "../../../../../public/fonts/Nunito/nunito/Nunito-Regular.ttf",
  variable: "--font-beauty-body",
});

export default function BeautyPage() {
  const { trackEvent } = useTracking();

  useEffect(() => {
    trackEvent("slice_landing_view", { slice: "beauty", source: "route" });
  }, [trackEvent]);

  return (
    <Layout>
      <main className={`${displayFont.variable} ${bodyFont.variable} font-[var(--font-beauty-body)] bg-gradient-to-b from-[#ffe4f0] via-[#fff5fc] to-[#fffcfd] dark:from-[#2a0a1f] dark:via-[#1a0514] dark:to-[#12020d] text-[#2d1b2e] dark:text-slate-100 overflow-hidden leading-relaxed`}>
        
        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-[1200px] px-6 pt-20 pb-16 lg:pt-32">
          {/* Decorative Blur Orbs */}
          <div className="absolute left-10 top-0 h-64 w-64 rounded-full bg-[#ffb3d9] dark:bg-[#E23D80] blur-3xl opacity-40 dark:opacity-20 pointer-events-none" />
          <div className="absolute right-20 top-20 h-80 w-80 rounded-full bg-[#fddcf1] dark:bg-[#8B1E4A] blur-3xl opacity-60 dark:opacity-20 pointer-events-none" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center">
            
            {/* Title side */}
            <div className="flex flex-col relative z-20">
              <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-6 shadow-sm border border-[#ffe4f0]/50 dark:border-white/10 sm:ml-12 lg:ml-20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E23D80] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E23D80]"></span>
                </span>
                <span className="text-xs font-bold text-[#4a154b] dark:text-[#f8b4d9] tracking-wide uppercase">Trusted by 50+ Beauty Centre</span>
              </div>
              <h1 className="font-[var(--font-beauty-display)] text-[5rem] sm:text-[7rem] lg:text-[8rem] leading-[0.9] text-[#4a154b] dark:text-white tracking-tight drop-shadow-[0_2px_4px_rgba(226,61,128,0.1)]">
                Beauty <br />
                <span className="text-[#E23D80] dark:text-[#ffb3d9] ml-0 sm:ml-12 lg:ml-20 block">Business</span>
              </h1>
              <p className="mt-8 text-lg text-slate-700 dark:text-slate-300 max-w-[400px] font-medium ml-0 sm:ml-12 lg:ml-24">
                The all-in-one clinic and salon management software. Streamline your bookings, automate your marketing, and command your revenue with elegance.
              </p>
              <div className="mt-10 ml-0 sm:ml-12 lg:ml-24 flex items-center gap-4">
                 <Button className="bg-gradient-to-r from-[#EB77A6] to-[#E23D80] hover:from-[#E23D80] hover:to-[#c8316f] dark:from-[#c8316f] dark:hover:to-[#a82459] dark:to-[#E23D80] text-white rounded-full px-8 py-6 text-sm shadow-[0_10px_20px_-10px_rgba(226,61,128,0.6)] dark:shadow-none transition-all hover:-translate-y-1">
                  Start 14-Day Free Trial
                </Button>
              </div>
            </div>

            {/* Images side */}
            <div className="relative h-[550px] w-full mt-12 lg:mt-0">
              {/* Image 1 (Vertical) */}
              <div className="absolute left-0 top-10 w-[240px] h-[340px] sm:w-[280px] sm:h-[380px] z-10 overflow-hidden rounded-3xl shadow-xl border-[6px] border-white/60 dark:border-white/10">
                <Image
                  src="/assets/beauty&hairstyling/makeup3rousa.webp"
                  alt="Makeup artist at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-white dark:border-white/20">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#4a154b] dark:text-white">New Booking</p>
                          <p className="text-[8px] text-slate-500 dark:text-slate-300">Balayage & Cut - 185 DT </p>
                        </div>
                     </div>
                     <span className="text-[10px] font-bold text-[#E23D80] dark:text-[#ffb3d9]">Just Now</span>
                  </div>
                </div>
              </div>

              {/* Image 2 (Square/Portrait, overlaps) */}
              <div className="absolute right-0 sm:right-10 top-32 lg:top-10 w-[280px] h-[380px] sm:w-[350px] sm:h-[450px] z-20 overflow-hidden rounded-[2.5rem] shadow-2xl border-[6px] border-white/80 dark:border-white/10">
                <Image
                  src="/assets/beauty&hairstyling/professionalhairstylist.webp"
                  alt="Beauty professional"
                  fill
                  className="object-cover object-top"
                />
                
                {/* Floating Badge (Dashboard Stat inside image) */}
                <div className="absolute top-6 left-6 z-30 bg-white/95 dark:bg-black/60 backdrop-blur-md py-4 px-5 rounded-2xl shadow-[0_10px_25px_rgba(226,61,128,0.2)] dark:shadow-none border border-[#ffe4f0] dark:border-white/10 w-[calc(100%-48px)]">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Today's Revenue</p>
                      <p className="text-xl font-[var(--font-beauty-display)] text-[#4a154b] dark:text-white mt-1">240.00 DT</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 font-bold text-[10px] px-2 py-1 rounded-md flex items-center justify-center">
                      +14%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS STRIP */}
        <section className="relative z-20 mx-auto max-w-[1200px] px-6 py-12 mb-12 hidden md:block">
          <div className="flex flex-wrap items-center justify-between gap-8 border-y-2 border-[#E23D80]/10 dark:border-[#E23D80]/20 py-10">
            <div className="flex items-center gap-4 max-w-[240px]">
              <div className="flex -space-x-3">
                <img src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Client" className="h-10 w-10 rounded-full border-2 border-white dark:border-[#1a0514] object-cover" />
                <img src="https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Client" className="h-10 w-10 rounded-full border-2 border-white dark:border-[#1a0514] object-cover" />
                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Client" className="h-10 w-10 rounded-full border-2 border-white dark:border-[#1a0514] object-cover" />
              </div>
              <p className="ml-6 text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">30+ thriving partner salons trust our platform.</p>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-[var(--font-beauty-display)] text-[#E23D80] dark:text-[#ffb3d9] mb-1">24/7</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E23D80]/70 dark:text-[#ffb3d9]/70">Online Booking</p>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-[var(--font-beauty-display)] text-[#E23D80] dark:text-[#ffb3d9] mb-1">85%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E23D80]/70 dark:text-[#ffb3d9]/70">Less No-Shows</p>
            </div>

            <div className="text-center">
              <p className="text-4xl font-[var(--font-beauty-display)] text-[#E23D80] dark:text-[#ffb3d9] mb-1">100%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E23D80]/70 dark:text-[#ffb3d9]/70">Customizable</p>
            </div>
          </div>
        </section>

        {/* ZIG-ZAG SECTIONS */}
        <section className="mx-auto max-w-[1000px] px-6 py-16">
          
          {/* Row 1 */}
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center mb-24 md:mb-32">
            <div className="relative h-[280px] md:h-[380px] w-full rounded-[2rem] overflow-hidden shadow-xl">
              <Image
                src="/assets/beauty&hairstyling/makeupMariage.webp"
                alt="Makeup for wedding"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-[420px] ml-auto">
              <h2 className="font-[var(--font-beauty-display)] text-5xl sm:text-6xl text-[#4a154b] dark:text-[#ffe4f0] mb-6">
                Your Digital Receptionist
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                Say goodbye to phone tags and direct messages. Kayedni gives you a stunning scheduling page where clients can reserve slots, select add-on services, and receive instant confirmations, even when you're busy with another client.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-[#EB77A6] to-[#E23D80] hover:from-[#E23D80] hover:to-[#c8316f] dark:from-[#c8316f] dark:to-[#E23D80] shadow-[0_8px_20px_-6px_rgba(226,61,128,0.4)] dark:shadow-none text-white rounded-full px-8 py-6 text-sm transition-all hover:-translate-y-1">
                  <Link href="/register?type=business&category=beauty%26hairstyling">Create Account</Link>
                </Button>
                <Button variant="outline" className="border-[#E23D80]/30 text-[#E23D80] hover:bg-[#fff0f6] dark:hover:bg-white/5 dark:text-[#ffb3d9] dark:border-white/20 rounded-full px-8 py-6 text-sm transition-all hover:border-[#E23D80]">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center mb-24 md:mb-32">
            <div className="max-w-[420px] order-2 lg:order-1">
              <h2 className="font-[var(--font-beauty-display)] text-5xl sm:text-6xl text-[#4a154b] dark:text-[#ffe4f0] mb-6">
                Precision & Care in Your Operations
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                Whether you're tracking color formulas for returning clients or analyzing your most profitable services, every tool is designed to provide actionable business intelligence. We put clarity and control back in your hands.
              </p>
              <Button className="bg-[#fddcf1] dark:bg-[#E23D80]/20 text-[#E23D80] dark:text-[#ffb3d9] hover:bg-[#ffcadd] dark:hover:bg-[#E23D80]/40 rounded-full shadow-sm px-8 py-6 text-sm font-bold transition-all hover:-translate-y-1">
                Go To Features
              </Button>
            </div>
            <div className="relative h-[280px] md:h-[380px] w-full rounded-[2rem] overflow-hidden shadow-xl order-1 lg:order-2">
              <Image
                src="/assets/beauty&hairstyling/makeup.webp"
                alt="Makeup"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center mb-24 md:mb-32">
            <div className="relative h-[280px] md:h-[380px] w-full rounded-[2rem] overflow-hidden shadow-xl">
              <Image
                src="/assets/beauty&hairstyling/duo.webp"
                alt="Long lasting beauty"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-[420px] ml-auto">
              <h2 className="font-[var(--font-beauty-display)] text-5xl sm:text-6xl text-[#4a154b] dark:text-[#ffe4f0] mb-6 tracking-tight">
                Long-Lasting Growth & Loyalty
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                A healthy bottom line is just as important as beautiful client transformations. That's why we focus on automated marketing tools like SMS reminders and promo campaigns that strengthen client retention and keep your schedule packed.
              </p>
              <Button className="bg-gradient-to-r from-[#EB77A6] to-[#E23D80] hover:from-[#E23D80] hover:to-[#c8316f] dark:from-[#c8316f] dark:to-[#E23D80] shadow-[0_8px_20px_-6px_rgba(226,61,128,0.4)] dark:shadow-none text-white rounded-full px-8 py-6 text-sm transition-all hover:-translate-y-1">
                Explore my software
              </Button>
            </div>
          </div>
        </section>

        {/* SERVICES / FEATURES CARDS */}
        <section className="relative pb-24 pt-20">          
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fff5fc] to-white dark:from-transparent dark:via-[#4a154b]/10 dark:to-transparent pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-[1100px] px-6 text-center">
            <h2 className="font-[var(--font-beauty-display)] text-5xl md:text-6xl text-[#4a154b] dark:text-[#ffe4f0] mb-4">Platform Features</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-16 text-sm">
              Discover a range of premium SaaS tools designed to enhance, protect, and automate your daily salon operations. We handle the admin, so you can handle the artistry.
            </p>

            <div className="grid sm:grid-cols-3 gap-8 text-left">
              
              {/* Card 1 */}
              <div className="group relative bg-[#fffcfd] dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(226,61,128,0.15)] dark:shadow-none border border-[#ffe4ed] dark:border-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-auto md:h-[450px]">
                <div className="absolute top-0 right-0 p-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E23D80] dark:text-[#ffb3d9] bg-[#fff0f6] dark:bg-[#E23D80]/20 px-4 py-1.5 rounded-full">Core</span>
                </div>
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-[#ffe4f0] to-[#ffcadd] dark:from-[#E23D80]/20 dark:to-[#E23D80]/40 flex items-center justify-center mb-8 shadow-inner dark:shadow-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-[#E23D80] dark:stroke-[#ffb3d9]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                </div>
                <h3 className="font-[var(--font-beauty-display)] text-3xl text-[#4a154b] dark:text-[#ffe4f0] mb-4">Smart Scheduling</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-grow">
                  An elegant, custom-branded booking link for your clients. Eliminate text back-and-forth, handle complex gap-booking, and completely sync availability with your calendar.
                </p>
                <div className="flex items-center justify-between border-t border-[#fff0f6] dark:border-white/10 pt-6 mt-auto">
                  <Button className="bg-[#fddcf1] dark:bg-[#E23D80]/20 text-[#E23D80] dark:text-[#ffb3d9] hover:bg-[#E23D80] hover:text-white rounded-full px-6 text-xs shadow-sm transition-all">View Demo</Button>
                  <Link href="#" className="text-xs font-bold text-[#E23D80]/70 dark:text-[#ffb3d9]/70 hover:text-[#E23D80] transition-colors">Read more</Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-[#fffcfd] dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(226,61,128,0.15)] dark:shadow-none border border-[#ffe4ed] dark:border-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-auto md:h-[450px]">
                <div className="absolute top-0 right-0 p-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E23D80] dark:text-[#ffb3d9] bg-[#fff0f6] dark:bg-[#E23D80]/20 px-4 py-1.5 rounded-full">Growth</span>
                </div>
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-[#ffe4f0] to-[#ffcadd] dark:from-[#E23D80]/20 dark:to-[#E23D80]/40 flex items-center justify-center mb-8 shadow-inner dark:shadow-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-[#E23D80] dark:stroke-[#ffb3d9]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="font-[var(--font-beauty-display)] text-3xl text-[#4a154b] dark:text-[#ffe4f0] mb-4">Client CRM</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-grow">
                  Detailed client profiles, visit history, and formula notes. Deliver VIP experiences and send targeted SMS marketing blasts to keep chairs filled during slow seasons.
                </p>
                <div className="flex items-center justify-between border-t border-[#fff0f6] dark:border-white/10 pt-6 mt-auto">
                  <Button className="bg-[#fddcf1] dark:bg-[#E23D80]/20 text-[#E23D80] dark:text-[#ffb3d9] hover:bg-[#E23D80] hover:text-white rounded-full px-6 text-xs shadow-sm transition-all">Try CRM</Button>
                  <Link href="#" className="text-xs font-bold text-[#E23D80]/70 dark:text-[#ffb3d9]/70 hover:text-[#E23D80] transition-colors">Read more</Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-[#fffcfd] dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(226,61,128,0.15)] dark:shadow-none border border-[#ffe4ed] dark:border-white/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-auto md:h-[450px]">
                <div className="absolute top-0 right-0 p-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E23D80] dark:text-[#ffb3d9] bg-[#fff0f6] dark:bg-[#E23D80]/20 px-4 py-1.5 rounded-full">Scale</span>
                </div>
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-[#ffe4f0] to-[#ffcadd] dark:from-[#E23D80]/20 dark:to-[#E23D80]/40 flex items-center justify-center mb-8 shadow-inner dark:shadow-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-[#E23D80] dark:stroke-[#ffb3d9]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="font-[var(--font-beauty-display)] text-3xl text-[#4a154b] dark:text-[#ffe4f0] mb-4">Business Analytics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 flex-grow">
                  Track your most popular services, staff performance, and client retention rates. Make data-driven decisions to grow your salon's revenue without the guesswork.
                </p>
                <div className="flex items-center justify-between border-t border-[#fff0f6] dark:border-white/10 pt-6 mt-auto">
                  <Button className="bg-[#fddcf1] dark:bg-[#E23D80]/20 text-[#E23D80] dark:text-[#ffb3d9] hover:bg-[#E23D80] hover:text-white rounded-full px-6 text-xs shadow-sm transition-all">View Dashboard</Button>
                  <Link href="#" className="text-xs font-bold text-[#E23D80]/70 dark:text-[#ffb3d9]/70 hover:text-[#E23D80] transition-colors">Read more</Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MANAGEMENT SUITE BENTO GRID (NEW SECTION) */}
        <section className="mx-auto max-w-[1200px] px-6 py-24 border-t border-[#ffe4f0]/60 dark:border-white/10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-[var(--font-beauty-display)] text-5xl md:text-6xl text-[#4a154b] dark:text-[#ffe4f0] mb-4">The Complete Management Suite</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Kayedni replaces up to 5 different software tools. From managing staff shifts to tracking inventory, everything is built to scale your salon seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            
            {/* Bento Card 1: Staff */}
            <div className="bg-gradient-to-br from-[#e7ecf8] to-[#b7c3ea] dark:from-[#3f163b] dark:to-[#1a0520] rounded-[2rem] p-8 shadow-sm border border-[#e4ebd8] dark:border-white/5 md:col-span-2 lg:col-span-2 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between">
                <div className="w-12 h-12 bg-[#d3dbf2] dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-[#3f4070] dark:stroke-white" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                </div>
              </div>
              <h3 className="font-[var(--font-beauty-display)] text-3xl text-[#48488b] dark:text-white mb-2 tracking-tight">Staff Management</h3>
              <p className="text-xs text-[#48488b]/80 dark:text-white/70 max-w-[300px] leading-relaxed">
                Set individual working hours, manage shift swaps, and sync schedules. Let your team view their upcoming appointments straight from their phones via our Telegram and Email alerts.
              </p>
            </div>

            {/* Bento Card 2: Notifications */}
            <div className="bg-[#f5accd] dark:bg-[#701a35] rounded-[2rem] p-8 shadow-sm border border-[#f5ead0] dark:border-white/5 group hover:-translate-y-1 transition-all duration-300">
               <div className="w-12 h-12 bg-[#f9d1e4] dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-[#971d43] dark:stroke-white" strokeWidth="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
                </div>
              <h3 className="font-[var(--font-beauty-display)] text-3xl text-[#7e1d3b] dark:text-white mb-2 tracking-tight">Automated Telegram Notifications</h3>
              <p className="text-xs text-[#7e1d3b]/80 dark:text-white/70 leading-relaxed">
                Automated mailing and instant Telegram alerts for both your staff and your clients so no one ever misses an appointment.
              </p>
            </div>

            {/* Bento Card 3: Online Presence */}
            <div className="bg-[#f0f7ff] dark:bg-[#0f172a] rounded-[2rem] p-8 shadow-sm border border-[#e1ebf5] dark:border-white/5 group hover:-translate-y-1 transition-all duration-300">
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-[#1e3a8a] dark:stroke-blue-100" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
              <h3 className="font-[var(--font-beauty-display)] text-3xl text-blue-900 dark:text-blue-100 mb-2 tracking-tight">Online Presence</h3>
              <p className="text-xs text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                Stand out with a beautifully branded booking page that showcases your salon's portfolio, location, and services 24/7.
              </p>
            </div>

             {/* Bento Card 4: Customization */}
            <div className="bg-[#fff5fc] dark:bg-[#200514] rounded-[2rem] p-8 shadow-sm border border-[#fce9f5] dark:border-white/5 md:col-span-2 lg:col-span-2 group hover:-translate-y-1 transition-all duration-300">
               <div className="w-12 h-12 bg-[#ffe4f0] dark:bg-[#E23D80]/20 rounded-full flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-[#E23D80] dark:stroke-[#ffb3d9]" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
              <h3 className="font-[var(--font-beauty-display)] text-3xl text-[#4a154b] dark:text-[#ffb3d9] mb-2 tracking-tight">Coming Soon: Deep Customization</h3>
              <p className="text-xs text-[#E23D80]/80 dark:text-[#ffb3d9]/70 max-w-[400px] leading-relaxed">
                Soon, you will have complete control over your booking page layout, allowing you to inject your brand's unique colors, fonts, and vibe straight into Kayedni. More features are dropping every week!
              </p>
            </div>

          </div>
        </section>

        {/* WHY ME & TESTIMONIAL */}
        <section className="mx-auto max-w-[1000px] px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative h-[450px] md:h-[650px] w-full rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl lg:order-1">
              <Image
                src="/assets/beauty&hairstyling/duoKayedni.webp"
                alt="Creazy hair salon team"
                fill
                className="object-cover object-top"
              />
            </div>
            
            <div className="lg:order-2">
              <h2 className="font-[var(--font-beauty-display)] text-5xl md:text-6xl text-[#4a154b] dark:text-[#ffe4f0] mb-10">Why Kayedni?</h2>
              
              <div className="space-y-12">
                <div>
                  <h3 className="flex items-center text-lg text-[#4a154b] dark:text-white mb-2 font-serif">
                    <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#E23D80] to-[#EB77A6] mr-4 shadow-sm" />
                    Built For Teams & Solos
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs ml-8 leading-relaxed max-w-[280px]">
                    Manage multi-staff commissions and schedules, or optimize your workflow perfectly as an independent suite owner.
                  </p>
                </div>
                
                <div>
                  <h3 className="flex items-center text-lg text-[#4a154b] dark:text-white mb-2 font-serif">
                    <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#EB77A6] to-[#ffb3d9] dark:from-[#E23D80] dark:to-[#ffb3d9] mr-4 shadow-sm" />
                    Instant Notifications
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs ml-8 leading-relaxed max-w-[280px]">
                    Keep everyone in the loop with automated Telegram and Email notifications for both your staff scheduling and your returning clients.
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center text-lg text-[#4a154b] dark:text-white mb-2 font-serif">
                    <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#fddcf1] to-[#ffe4f0] dark:from-[#4a154b] dark:to-[#E23D80] mr-4 shadow-sm border border-[#E23D80]/20" />
                    Reliable Data & Support
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs ml-8 leading-relaxed max-w-[280px]">
                    Industry-leading uptime, secure cloud database backups, and human support agents ready to help whenever you need.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Testimonial block below */}
          <div className="mt-28 grid sm:grid-cols-2 gap-8 items-stretch">
            <div className="bg-[#fff0f6] dark:bg-white/5 rounded-[2rem] p-8 md:p-12 flex flex-col justify-center shadow-sm">
              <h3 className="font-[var(--font-beauty-display)] text-4xl text-[#4a154b] dark:text-[#ffe4f0] mb-6">Loved by Owners</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 font-medium italic">
                "I'm beyond impressed with the level of care and precision! My salon schedule has never looked this perfect, and the reporting tools give me clear insight into my true revenue. Kayedni completely removed the stress of admin tasks for me and my staff."
              </p>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-auto gap-4 md:gap-0">
                <p className="font-bold text-[#4a154b] dark:text-white text-md">Hanna May <span className="font-normal text-xs text-[#E23D80] dark:text-[#ffb3d9] block mt-1">Founder, The Hair Studio</span></p>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#E23D80] opacity-70 flex items-center justify-center text-white text-xs cursor-pointer shadow-md hover:opacity-100 transition-opacity">{'<'}</div>
                  <div className="h-8 w-8 rounded-full bg-[#E23D80] flex items-center justify-center text-white text-xs cursor-pointer shadow-md hover:bg-[#c8316f] transition-colors">{'>'}</div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[300px] sm:h-auto w-full rounded-[2rem] overflow-hidden shadow-md">
              <Image
                src="/assets/beauty&hairstyling/threeo.webp"
                alt="Salon team"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* INTEGRATIONS (NEW SECTION) */}
        <section className="bg-[#4a154b] dark:bg-[linear-gradient(135deg,#0d010d,#1a0416)] text-white py-20 px-6 mx-auto -mx-6 md:mx-4 md:rounded-[3rem] my-20 sm:my-32 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-10 h-32 md:h-64 w-32 md:w-64 bg-[#EB77A6] blur-3xl opacity-20 rounded-full" />
          <div className="absolute bottom-0 left-10 h-20 md:h-40 w-20 md:w-40 bg-[#E23D80] blur-3xl opacity-30 rounded-full" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-[var(--font-beauty-display)] text-5xl md:text-6xl mb-6 text-white">Works Where You Work</h2>
            <p className="text-white/70 text-sm max-w-[500px] mx-auto mb-16 leading-relaxed">
              We don't isolate your salon. Kayedni connects with the platforms you already rely on so that zero data gets lost in translation.
            </p>
            
            {/* Apps row */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/5 group-hover:bg-white/20 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <span className="text-xs font-bold text-white/50 tracking-widest uppercase">Calendar</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/5 group-hover:bg-white/20 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
                <span className="text-xs font-bold text-white/50 tracking-widest uppercase">Instagram</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/5 group-hover:bg-white/20 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21.5 2L2 11.5l6 2.5L20.5 4l-9 11.5v6.5l4-3 5.5 3L21.5 2z"/></svg>
                </div>
                <span className="text-xs font-bold text-white/50 tracking-widest uppercase">Telegram</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/5 group-hover:bg-white/20 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <span className="text-xs font-bold text-white/50 tracking-widest uppercase">Email Sync</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="mx-auto max-w-[800px] px-6 py-28 text-center border-t border-[#ffe4f0]/50 dark:border-white/10">
          <h2 className="font-[var(--font-beauty-display)] text-5xl sm:text-6xl text-[#4a154b] dark:text-[#ffe4f0] mb-6 tracking-tight">
            Simplify Your Salon Operations
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-[550px] mx-auto text-sm">
            Join the hundreds of successful hair stylists and salon owners who have upgraded their administration to Kayedni. Set up your salon profile today and see how effortless business growth can be.
          </p>
          <Button className="bg-gradient-to-r from-[#EB77A6] to-[#E23D80] hover:from-[#E23D80] hover:to-[#c8316f] dark:from-[#c8316f] dark:to-[#E23D80] text-white rounded-full px-12 py-7 text-sm shadow-[0_10px_30px_-10px_rgba(226,61,128,0.5)] dark:shadow-none transition-all hover:-translate-y-1">
            <Link href="/register?type=business&category=beauty%26hairstyling">Create Free Account</Link>
          </Button>
        </section>
      </main>
    </Layout>
  );
}