"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { useTracking } from "@global/hooks/useTracking";
import {
  Play,
  MoveRight,
  Scissors,
  CheckCircle,
} from "lucide-react";

// For headings, if you want it to look exactly like the image (serif),
// you could use a serif font. But assuming Anton is what the user 
// specifically wanted imported for the display font:
const displayFont = localFont({
  src: "../../../../../public/fonts/Anton/Anton-Regular.ttf",
  variable: "--font-barber-display",
});

const bodyFont = localFont({
  src: "../../../../../public/fonts/Nunito/nunito/Nunito-Regular.ttf",
  variable: "--font-barber-body",
});

export default function BarberPage() {
  const { trackEvent } = useTracking();
  const [activeCard, setActiveCard] = useState(1); // Middle card active by default

  useEffect(() => {
    trackEvent("slice_landing_view", { slice: "barber", source: "route" });
  }, [trackEvent]);

  return (
    <Layout>

        {/* HERO SECTION */}
        <main className="mx-auto max-w-[1300px] px-6 pb-24 pt-8 md:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            
            {/* Left Content */}
            <div className="flex flex-col pr-4">
              <h1 className="font-[var(--font-barber-display)] text-[3.8rem] leading-[1.05] uppercase tracking-wide md:text-[4.5rem] lg:text-[5.5rem]">
                RUN YOUR BARBERSHOP <br /> EFFORTLESSLY!
              </h1>
              
              <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-10">
                <button className="flex items-center gap-3 font-bold text-sm hover:opacity-80 transition-opacity">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1d086] text-[#1a1a1a]">
                    <Play className="h-4 w-4 ml-1" fill="currentColor" />
                  </div>
                  Watch Demo
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <img src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Client" className="h-11 w-11 rounded-full border-[3px] border-[#fdfbf6] object-cover" />
                    <img src="https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Client" className="h-11 w-11 rounded-full border-[3px] border-[#fdfbf6] object-cover" />
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#fdfbf6] bg-[#f1d086] text-lg font-bold text-[#1a1a1a]">
                      +
                    </div>
                  </div>
                  <div className="text-[11px] font-bold uppercase leading-[1.3] text-[#4a4a4a]">
                    Trusted by 50+<br />Barbershops
                  </div>
                </div>

                <div className="ml-auto hidden md:block opacity-70">
                  <MoveRight className="h-7 w-16 stroke-[1]" />
                </div>
              </div>

              {/* Bottom Left Image */}
              <div className="mt-12 relative h-[320px] w-full overflow-hidden rounded-[32px]">
                <Image
                  src="/assets/barber/salonl7jama.webp"
                  alt="salon of barbers"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Portrait Image */}
            <div className="relative h-[550px] w-full overflow-hidden rounded-[32px] lg:h-[680px]">
              <Image
                src="/assets/barber/carizma.webp"
                alt="Professional barber"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* B2B STATS STRIP */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 px-8 py-10 rounded-[24px] bg-[#1a1a1a] text-[#f1d086] text-center shadow-xl">
            <div>
              <p className="font-[var(--font-barber-display)] text-4xl mb-1">32%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">Revenue Increase</p>
            </div>
            <div>
              <p className="font-[var(--font-barber-display)] text-4xl mb-1">90%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">Less No-Shows</p>
            </div>
            <div>
              <p className="font-[var(--font-barber-display)] text-4xl mb-1">24/7</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">Automated Booking</p>
            </div>
            <div>
              <p className="font-[var(--font-barber-display)] text-4xl mb-1">Unlimited</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">Staff & Locations</p>
            </div>
          </div>

          {/* WHAT WE PROVIDE SECTION */}
          <div className="mt-20 relative">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              
              {/* Left Square-ish Image */}
              <div className="relative h-[450px] w-full overflow-hidden rounded-[32px] lg:w-[90%]">
                <div className="absolute left-6 top-6 z-10 rounded-full bg-[#f1d086] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#1a1a1a]">
                  9AM - 9PM, Mon-Sat
                </div>
                <Image
                  src="/assets/barber/le7ya.webp"
                  alt="bear cut service"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Text Content */}
              <div className="flex flex-col justify-center pb-24 lg:pb-0 lg:pl-10">
                <h2 className="font-[var(--font-barber-display)] text-[2.8rem] leading-[1.05] tracking-wide md:text-[3.5rem]">
                  Built Specifically <br className="hidden md:block" /> For Barbershops
                </h2>
                <p className="mt-6 max-w-[500px] text-[13px] leading-relaxed text-[#666]">
                  Kayedni provides the ultimate software for your barbershop. Manage appointments seamlessly, process payments effortlessly, and keep your chairs full with our automated marketing tools. Focus on what you do best: giving great haircuts.
                </p>
              </div>
            </div>

            {/* Floating Dark Green Card */}
            <div className="relative mt-8 rounded-[24px] bg-[#5f720f] p-8 sm:p-12 lg:absolute lg:-bottom-12 lg:right-0 lg:mt-0 lg:w-[65%] xl:right-10">
              <div className="flex flex-col sm:flex-row justify-between gap-8 divide-y divide-[#6f821f] sm:divide-x sm:divide-y-0 text-[#fdfbf6]">
                
                <div className="flex flex-col gap-4 sm:px-6 flex-1 pt-4 sm:pt-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1d086] text-[#5f720f]">
                    {/* <Settings2 className="h-5 w-5" /> */}
                    <Image src="/Icons/shaving_Icon.svg" alt="Scissors Icon" width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] mb-2">Smart Booking</h3>
                    <p className="text-[12px] leading-relaxed text-[#d4dfae]">
                      Let clients book 24/7 online without interrupting your cuts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:px-6 flex-1 pt-8 sm:pt-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1d086] text-[#5f720f]">
                    <Image src="/Icons/shavingMachine.svg" alt="Beard Trimming Icon" width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] mb-2">Staff & Payroll</h3>
                    <p className="text-[12px] leading-relaxed text-[#d4dfae]">
                      Calculate commissions automatically, manage tips, and organize shift schedules.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:px-6 flex-1 pt-8 sm:pt-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1d086] text-[#5f720f]">
                    <Scissors className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] mb-2">Client Retention</h3>
                    <p className="text-[12px] leading-relaxed text-[#d4dfae]">
                      Automated SMS reminders and marketing campaigns to bring clients back.
                    </p>
                  </div>
                </div>

              </div>
              
              {/* Decorative cutout on the right side - purely visual */}
              <div className="hidden lg:block absolute -right-4 top-1/2 -mt-4 h-8 w-8 rounded-full bg-[#fdfbf6]" />
            </div>
          </div>

          {/* COMPLETE RELAXATION SECTION */}
          <div className="mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <h2 className="font-[var(--font-barber-display)] text-[2.8rem] leading-[1.05] tracking-wide md:text-[3.5rem] max-w-[600px]">
                Everything You Need To Scale Your Business
              </h2>
              <p className="max-w-[350px] text-[13px] text-[#666] leading-relaxed mt-4 md:mt-0 pb-2">
                Replace 5 different tools with one seamless barbershop operating system. From chair rentals to commission splits, we handle the heavy lifting.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              
              <div className="flex flex-col justify-between rounded-[20px] bg-[#f1d086] p-6 text-[#1a1a1a] hover:-translate-y-1 transition-transform">
                <div>
                  <h3 className="text-xl font-bold leading-[1.2]">Client Retention & Marketing</h3>
                  <p className="text-[12px] font-medium leading-relaxed opacity-80 mt-3">
                    Automated SMS reminders and Telegram campaigns to fill your slow days and bring back lost clients effortlessly.
                  </p>
                </div>
                <div className="mt-6 flex justify-end"><Image src="/Icons/shaving.png" alt="Marketing Icon" width={48} height={48} className="opacity-90" /></div>
              </div>

              <div className="flex flex-col justify-between rounded-[20px] bg-[#f1d086] p-6 text-[#1a1a1a] hover:-translate-y-1 transition-transform">
                <div>
                  <h3 className="text-xl font-bold leading-[1.2]">Business <br /> Analytics</h3>
                  <p className="text-[12px] font-medium leading-relaxed opacity-80 mt-3">
                    Track your highest earning days, most requested barbers, and overall revenue growth directly from your dashboard.
                  </p>
                </div>
                <div className="mt-6 flex justify-end"><Image src="/Icons/Scissors.png" alt="Analytics Icon" width={48} height={48} className="opacity-90" /></div>
              </div>

              <div className="flex flex-col justify-between rounded-[20px] bg-[#f1d086] p-6 text-[#1a1a1a] hover:-translate-y-1 transition-transform">
                <div>
                  <h3 className="text-xl font-bold leading-[1.2]">Team <br /> Management</h3>
                  <p className="text-[12px] font-medium leading-relaxed opacity-80 mt-3">
                    Handle payroll logic, manage tiered commissions, tracking tips, and organize staff schedules in one single place.
                  </p>
                </div>
                <div className="mt-6 flex justify-end"><Image src="/Icons/razor.png" alt="Team Icon" width={48} height={48} className="opacity-90" /></div>
              </div>

              <div className="flex flex-col justify-between rounded-[20px] bg-[#f1d086] p-6 text-[#1a1a1a] hover:-translate-y-1 transition-transform">
                <div>
                  <h3 className="text-xl font-bold leading-[1.2]">Smart <br /> Waitlist</h3>
                  <p className="text-[12px] font-medium leading-relaxed opacity-80 mt-3">
                    Maximize your schedule by automatically filling last-minute cancellations and keeping chairs occupied 100% of the time.
                  </p>
                </div>
                <div className="mt-6 flex justify-end"><Image src="/Icons/razor_Classic.png" alt="Waitlist Icon" width={48} height={48} className="opacity-90" /></div>
              </div>

            </div>
          </div>

          {/* DASHBOARD HIGHLIGHT / B2B */}
          <div className="mt-20 rounded-[32px] bg-[#fdfbf6] border border-[#e5e5e5] p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f1d086]/30 px-3 py-1 mb-6 text-[12px] font-bold text-[#b49040]">
                  <CheckCircle className="h-3.5 w-3.5" /> Made for Owners & Staff
                </div>
                <h2 className="font-[var(--font-barber-display)] text-[2.8rem] leading-[1.05] tracking-wide md:text-[3.5rem] text-[#1a1a1a]">
                  Total Control Over Your Shop
                </h2>
                <ul className="mt-8 space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#5f720f] text-[#f1d086]">✓</div>
                    <div>
                      <h4 className="font-bold text-[#1a1a1a] text-sm">Online Brand Presence</h4>
                      <p className="text-xs text-[#666] mt-1">Stand out with a beautifully branded booking page that showcases your shop's portfolio and services.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#5f720f] text-[#f1d086]">✓</div>
                    <div>
                      <h4 className="font-bold text-[#1a1a1a] text-sm">Flexible Commissions</h4>
                      <p className="text-xs text-[#666] mt-1">Automate logic for booth renters or commissioned staff effortlessly.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#5f720f] text-[#f1d086]">✓</div>
                    <div>
                      <h4 className="font-bold text-[#1a1a1a] text-sm">Instant Sync</h4>
                      <p className="text-xs text-[#666] mt-1">Your calendar syncs across all platforms instantly, eliminating double bookings entirely.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative h-[300px] md:h-[400px] w-full rounded-[24px] overflow-hidden shadow-2xl">
                <Image src="/assets/barber/LogoL7ajema.webp" alt="Barbershop Management" fill className="object-cover object-top" />
              </div>
            </div>
          </div>

          {/* VISUAL SHOWCASE: MOBILE MANAGEMENT */}
          <div className="mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <h2 className="font-[var(--font-barber-display)] text-[2.8rem] leading-[1.05] tracking-wide md:text-[3.5rem] max-w-[600px]">
                Run Your Shop From Your Pocket
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Live Schedule', desc: 'Check your daily bookings at a glance between cuts.', img: '/assets/barber/7asra.webp' },
                { title: 'Instant Updates', desc: 'Get notified instantly when a client books or cancels.', img: '/assets/barber/matriel.webp' },
                { title: 'Earnings Tracking', desc: 'Review your daily, weekly, and monthly revenue on the go.', img: '/assets/barber/ghasla.webp' }
              ].map((card, idx) => (
                <button
                  type="button"
                  key={card.title}
                  onMouseEnter={() => setActiveCard(idx)}
                  onFocus={() => setActiveCard(idx)}
                  onTouchStart={() => setActiveCard(idx)}
                  className={`group relative h-[300px] md:h-[450px] w-full rounded-[24px] overflow-hidden transition-colors duration-500 cursor-pointer text-left ${activeCard === idx ? 'bg-[#5f720f]' : 'bg-[#1a1a1a]'}`}
                >
                  <Image 
                    src={card.img} 
                    alt={card.title} 
                    fill 
                    className={`object-cover mix-blend-overlay transition-opacity duration-500 ${activeCard === idx ? 'opacity-60' : 'opacity-40'}`}
                  />
                  <div className={`absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t transition-all duration-500 ${activeCard === idx ? 'from-black/80 to-transparent' : 'from-black/90 via-black/40 to-transparent'}`}>
                    <h3 className={`text-[#f1d086] font-bold text-xl mb-2 transition-transform duration-500 ${activeCard === idx ? 'translate-y-0' : 'translate-y-2'}`}>{card.title}</h3>
                    <p className={`text-white/80 text-sm transition-all duration-500 ${activeCard === idx ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>{card.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* VISUAL SHOWCASE: BARBER GALLERY */}
          <div className="mt-20 overflow-hidden relative rounded-[32px] bg-[#1a1a1a] h-[400px] md:h-[500px] flex items-center justify-center">
            <Image 
              src="/assets/barber/ch3ar.webp" 
              alt="Barbershop Atmosphere" 
              fill 
              className="object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <h2 className="font-[var(--font-barber-display)] text-[4rem] md:text-[6rem] leading-[1] text-white tracking-wide uppercase mb-4 drop-shadow-2xl">
                Your Craft. <br /> <span className="text-[#f1d086]">Our System.</span>
              </h2>
              <div className="flex gap-4 mt-6">
                <span className="px-5 py-2.5 rounded-full bg-[#f1d086] text-[#1a1a1a] font-bold text-sm">Zero Setup Fees</span>
                <span className="px-5 py-2.5 rounded-full bg-white/10 text-white backdrop-blur border border-white/20 font-bold text-sm">Start in 5 Mins</span>
              </div>
            </div>
          </div>

          {/* COMPACT CTA SECTION */}
          <div className="mt-20 mb-8 rounded-[32px] bg-[#1a1a1a] text-[#fdfbf6] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#5f720f] blur-[100px] opacity-50 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#f1d086] blur-[100px] opacity-20 pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-[var(--font-barber-display)] text-[3rem] md:text-[4rem] leading-[1] uppercase tracking-wide mb-6">
                Upgrade Your Shop Today
              </h2>
              <p className="text-[#a0a0a0] mb-10 text-sm max-w-xl mx-auto leading-relaxed">
                Join the next generation of barbershop owners taking back their time and increasing their margins. Set up your workspace in minutes.
              </p>
              <Button asChild className="h-14 px-10 rounded-full bg-[#f1d086] text-[#1a1a1a] font-bold text-sm hover:bg-[#e0bc68] transition-all hover:scale-105">
                <Link href="/register?type=business&category=barber">
                  Create Your Free Account
                </Link>
              </Button>
            </div>
          </div>
        </main>
    </Layout>
  );
}
