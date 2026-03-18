"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import CategoryCard from "../components/home/CategoryCard";
import SearchResults from "../components/home/SearchResults";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { fetchBusinesses, fetchCategories } from "./(pages)/(business)/actions/backend";
import type { Business } from "./(pages)/(business)/businesses/types/business";
import { useSearch } from "@global/hooks/useSearch";
import { useTracking } from "@global/hooks/useTracking";
import TimeOnPageTracker from "@components/tracking/TimeOnPageTracker";
import ScrollDepthTracker from "@components/tracking/ScrollDepthTracker";
import {
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  Search,
  Calendar,
  CheckCircle,
  Shield,
  RefreshCw,
  Smartphone,
  Bell,
  CreditCard,
  BarChart,
  Globe,
  MapPin,
  Loader2,
  Star,
} from "lucide-react";
import { Input } from "@components/ui/input";
import { createBusinessSlug } from "@global/lib/businessSlug";
import { apiGet } from "./(pages)/(auth)/api/client";
import BookingDemoSection from "@components/home/BookingDemoSection";

interface Testimonial {
  clientName: string;
  serviceComment?: string;
  businessComment?: string;
  serviceRating?: number;
  businessRating?: number;
  serviceName?: string;
  businessName?: string;
  businessId?: number;
}

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { trackEvent } = useTracking();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Service categories (default fallback)
  const defaultCategories = [
    {
      id: "barber",
      name: "Barbers & Salons",
      icon: "✂️",
      count: 248,
      color: "bg-primary/5 text-primary",
    },
    {
      id: "education",
      name: "Coaching & Tutoring",
      icon: "📚",
      count: 157,
      color: "bg-brand-orange/10 text-brand-orange",
    },
    {
      id: "gaming",
      name: "Gaming Lounges",
      icon: "🎮",
      count: 92,
      color: "bg-brand-teal/10 text-brand-teal",
    },
    {
      id: "fitness",
      name: "Fitness & Wellness",
      icon: "💪",
      count: 203,
      color: "bg-brand-pink/10 text-brand-pink",
    },
    {
      id: "spa",
      name: "Spa & Massage",
      icon: "💆‍♀️",
      count: 185,
      color: "bg-primary/10 text-primary",
    },
    {
      id: "therapy",
      name: "Therapy & Counseling",
      icon: "🧠",
      count: 167,
      color: "bg-brand-orange/5 text-brand-orange",
    },
  ];

  const [categories, setCategories] = useState(defaultCategories);

  // Featured businesses (default fallback)
  const [featuredBusinesses, setFeaturedBusinesses] = useState(() => [
    {
      id: "biz-1",
      name: "Style Studio",
      category: "Barber",
      rating: 4.8,
      reviewCount: 128,
      location: "Downtown",
      image:
        "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "biz-2",
      name: "Tech Tutors",
      category: "Education",
      rating: 4.9,
      reviewCount: 93,
      location: "Online",
      image:
        "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "biz-3",
      name: "GameZone",
      category: "Gaming",
      rating: 4.7,
      reviewCount: 85,
      location: "West Mall",
      image:
        "https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=600&auto=format&fit=crop",
    },
  ]);

  const [loading, setLoading] = useState(true);

  // Testimonials state with default fallback
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      clientName: "Sarah Johnson",
      serviceComment:
        "The platform transformed how I manage appointments. My revenue increased by 40% in the first month alone.",
      serviceRating: 5,
      businessName: "Style Studio",
    },
    {
      clientName: "Mike Chen",
      businessComment:
        "Finally, a booking platform that actually works! Easy to find services, fast booking, and reliable reminders.",
      businessRating: 5,
      serviceName: "Tech Support",
    },
    {
      clientName: "Emma Davis",
      serviceComment:
        "The best tool for managing my schedule. My clients love the instant confirmations and I love the automated admin.",
      serviceRating: 5,
      businessName: "GameZone",
    },
  ]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const testimonialsSectionRef = useRef<HTMLElement | null>(null);
  const testimonialsImpressedRef = useRef(false);

  // Search functionality with real-time typeahead
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    location: searchLocation,
    setLocation: setSearchLocation,
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    hasSearched,
    search: performSearch,
    searchWithParams,
    clearResults,
    // Real-time search handlers
    handleQueryChange,
    handleLocationChange,
    isTyping,
  } = useSearch();

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchCategories(), fetchBusinesses()])
      .then(([cats, businesses]) => {
        if (!mounted) return;
        if (Array.isArray(cats) && cats.length > 0) {
          const mapped = cats
            .filter((c) => c !== "All")
            .map((c) => ({
              id: String(c).toLowerCase(),
              name: String(c),
              icon: "📌",
              count: 0,
              color: "bg-primary/5 text-primary",
            }));
          // REAL BACKEND WILL HAVE THIS UNCOMMENTED
          // if (mapped.length) setCategories(mapped);
        }

        if (Array.isArray(businesses) && businesses.length > 0) {
          const mapped = businesses.slice(0, 3).map((b: Business) => ({
            id: b.id,
            name: b.name,
            category: b.category ?? "Unknown",
            rating: typeof b.rating === "string" ? Number(b.rating) || 0 : b.rating ?? 0,
            reviewCount: b.reviewCount ?? 0,
            location: b.location ?? "City Center",
            image: b.logo ?? "/assets/placeholder.svg",
          }));
          setFeaturedBusinesses(mapped);
        }
      })
      .catch((err) => console.error("Failed to load dummy data", err))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-scroll logic for desktop when typing search
  useEffect(() => {
    // Only proceed if search query exists and results are being fetched or shown
    // And user is roughly at the top of the page
    if (
      searchQuery.length > 1 &&
      (searchResults.length > 0 || searchLoading) &&
      window.scrollY < 200
    ) {
      const isDesktop = window.innerWidth >= 768; // Simple check for mobile/tablet
      const container = searchContainerRef.current;

      if (isDesktop && container) {
        const rect = container.getBoundingClientRect();
        // Ideally want the search bar around 15% from top to give room for results
        const desiredTop = window.innerHeight * 0.15;

        if (rect.top > desiredTop) {
          window.scrollTo({
            top: window.scrollY + (rect.top - desiredTop),
            behavior: "smooth",
          });
        }
      }
    }
  }, [searchQuery, searchResults, searchLoading]);

  // Fetch real testimonials from backend
  useEffect(() => {
    let mounted = true;
    setTestimonialsLoading(true);
    apiGet<Testimonial[]>("/v1/ratings/recent?limit=6", false)
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length >= 3) {
          setTestimonials(data.slice(0, 6));
        }
      })
      .catch(() => {
        // silently fall back to default testimonials on error
      })
      .finally(() => mounted && setTestimonialsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Track testimonials section impression (once, when it first enters the viewport)
  useEffect(() => {
    const el = testimonialsSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !testimonialsImpressedRef.current) {
          testimonialsImpressedRef.current = true;
          trackEvent("testimonial_section_view", {
            section: "home_testimonials",
            page: "home",
            count: testimonials.slice(0, 3).length,
            source: testimonialsLoading ? "loading" : "loaded",
            has_real_data: testimonials.some((t) => t.businessId != null),
            businesses_shown: testimonials
              .slice(0, 3)
              .map((t) => t.businessName)
              .filter(Boolean),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trackEvent, testimonials, testimonialsLoading]);

  return (
    <Layout>
      {/* Tracking Components */}
      <TimeOnPageTracker pageName="home" />
      <ScrollDepthTracker pageName="home" />

      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-background">
        {/* Animated background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="auth-bg opacity-30 dark:opacity-20 pointer-events-none">
            <div className="auth-sphere auth-sphere-1" />
            <div className="auth-sphere auth-sphere-2" />
            <div className="auth-sphere auth-sphere-3" />
            <div className="auth-glow" />
            <div className="auth-grid" />
            <div className="auth-noise" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-16">
          <div className="max-w-5xl mx-auto text-center text-foreground">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-background/50 backdrop-blur-md shadow-sm mb-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                <span className="text-primary font-bold">New:</span> The future of booking is here
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
              Book Services with{" "}
              <span className="text-primary relative whitespace-nowrap">
                Confidence
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-brand-orange/40 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-10 fade-in duration-700 delay-200 leading-relaxed">
              Find and book appointments with local professionals instantly. From barbers to tutors,
              all in one seamless platform.
            </p>

            {/* Search Form */}
            <div
              ref={searchContainerRef}
              className="max-w-4xl mx-auto mb-16 animate-in slide-in-from-bottom-12 fade-in duration-700 delay-300"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-brand-purple to-brand-teal rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-card rounded-2xl p-4 md:p-6 border border-border/50 shadow-2xl">
                  {/* Search Input Group */}
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-[1.5]">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
                      <Input
                        type="text"
                        className="pl-12 h-14 bg-background/50 border-input/60 text-foreground focus-visible:ring-primary text-base shadow-sm hover:bg-background transition-colors"
                        placeholder="What service are you looking for?"
                        value={searchQuery}
                        onChange={(e) => handleQueryChange(e.target.value)}
                      />
                    </div>
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
                      <Input
                        type="text"
                        className="pl-12 h-14 bg-background/50 border-input/60 text-foreground focus-visible:ring-primary text-base shadow-sm hover:bg-background transition-colors"
                        placeholder="Location"
                        value={searchLocation}
                        onChange={(e) => handleLocationChange(e.target.value)}
                      />
                    </div>
                    <Button
                      size="lg"
                      className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                      disabled={searchLoading}
                      onClick={() => {
                        trackEvent("search_query", {
                          query: searchQuery,
                          location: searchLocation,
                          source: "home_search_form",
                        });
                        const params = new URLSearchParams();
                        if (searchQuery) params.set("q", searchQuery);
                        if (searchLocation) params.set("location", searchLocation);
                        router.push(`/search?${params.toString()}`);
                      }}
                    >
                      {searchLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
                    </Button>
                  </div>

                  {/* Live search hint */}
                  {searchQuery.length > 0 && searchQuery.length < 2 && (
                    <p className="mt-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-1 text-left px-2">
                      Type at least 2 characters to search...
                    </p>
                  )}

                  {/* Quick Tags */}
                  <div className="mt-4 flex flex-wrap gap-2 items-center justify-center md:justify-start px-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                      Popular:
                    </span>
                    {["Barber", "Yoga", "Massage", "Dentist"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          trackEvent("search_query", { query: tag, source: "home_quick_search" });
                          handleQueryChange(tag);
                          // We don't auto-navigate, just fill the search
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all text-secondary-foreground font-medium"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Search Results Dropdown */}
                  <div className="absolute top-full left-0 right-0 z-50 mt-2">
                    <SearchResults
                      results={searchResults}
                      loading={searchLoading}
                      error={searchError ?? null}
                      hasSearched={hasSearched}
                      onClose={clearResults}
                      searchQuery={searchQuery}
                      searchLocation={searchLocation}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20 animate-in slide-in-from-bottom-14 fade-in duration-700 delay-500">
              <span className="text-muted-foreground font-medium">Own a business?</span>
              <Button
                size="lg"
                variant="default"
                className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white shadow-lg shadow-brand-purple-600/20 transition-all hover:-translate-y-1 h-12 px-8 rounded-full font-semibold group"
                onClick={() => {
                  trackEvent("click", { element: "hero_for_business", section: "hero" });
                  router.push("/business-solutions");
                }}
              >
                Bookify for Business
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits Section - EARLY VALUE PROP */}
      {/* <section className="py-24 bg-muted/50 relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Save Time</h3>
                <p className="text-muted-foreground leading-relaxed">Book appointments in seconds without phone calls or waiting. Manage everything in one place.</p>
                </div>
                
                <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="h-14 w-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7 text-brand-teal" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Quality Vetted</h3>
                <p className="text-muted-foreground leading-relaxed">All businesses verified with real reviews and ratings. Trust who you book with.</p>
                </div>
                
                <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="h-14 w-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-brand-orange" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Grow Your Business</h3>
                <p className="text-muted-foreground leading-relaxed">Reach more customers with our powerful booking platform. Integrated tools for success.</p>
                </div>
                </div>
                </div>
                </section> */}

      {/* Search Showcase Section */}
      {/* <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Find & Book Instantly</h2>
            <p className="text-xl text-muted-foreground">Search thousands of services near you with our smart search.</p>
          </div>

        </div>
      </section> */}

      {/* Featured Professionals - IMMEDIATE PROOF */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Top Professionals Ready to Help
            </h2>
            <p className="text-xl text-muted-foreground">
              Browse verified, highly-rated service providers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => {
              const handleClick = () => {
                trackEvent("business_view", {
                  businessId: String(business.id),
                  businessName: business.name,
                  source: "home_featured",
                });
                router.push(
                  `/business/${createBusinessSlug(business.name, String(business.id))}`,
                );
              };

              return (
                <button
                  key={business.id}
                  type="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClick();
                    }
                  }}
                  onClick={handleClick}
                  className="group h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col text-left"
                >
                  <div className="h-64 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={business.image || "/assets/placeholder-business.jpg"}
                      alt={business.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:from-black/100 group-hover:via-black/60 group-hover:opacity-100 transition-all duration-500" />

                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-white/50 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white/20 text-slate-900 dark:text-white flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span className="truncate max-w-[120px]">{(business as Business).location || "Near by"}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <div className="bg-white/60 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white/20 text-slate-900 dark:text-white flex items-center gap-1">
                        <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                        {Number(business.rating || 0).toFixed(1)}
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider transition-colors shadow-sm">
                          {business.category}
                        </span>
                        {(business as any).reviewCount > 0 && (
                          <span className="text-white/90 text-xs font-medium drop-shadow-md">
                            • {(business as any).reviewCount} reviews
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold leading-tight group-hover:text-white transition-colors drop-shadow-lg">
                        {business.name}
                      </h3>
                    </div>
                  </div>                </button>
              );
            })}
          </div>
          <div className="mt-16 text-center">
            <Button
              variant="skeuo"
              size="xl"
              onClick={() => {
                trackEvent("click", { element: "browse_all_professionals", section: "featured" });
                router.push("/businesses");
              }}
            >
              Browse All Professionals <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Demo Section */}
      <BookingDemoSection />

      {/* Testimonials Section - SOCIAL PROOF */}
      <section
        ref={testimonialsSectionRef}
        className="py-24 bg-primary text-primary-foreground relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-foreground/20 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Loved by Thousands</h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Real stories from our happy customers and businesses who use platform daily.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsLoading
              ? new Array(3).fill(null).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 animate-pulse"
                  >
                    <div className="flex gap-1 mb-4">
                      {new Array(5).fill(null).map((__, i) => (
                        <div key={`star-${i}`} className="h-5 w-5 rounded bg-white/20" />
                      ))}
                    </div>
                    <div className="h-20 bg-white/10 rounded mb-6" />
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white/20" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-white/20 rounded" />
                        <div className="h-3 w-16 bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              : testimonials.slice(0, 3).map((testimonial, idx) => {
                  const comment = testimonial.serviceComment || testimonial.businessComment || "";
                  const rating = testimonial.serviceRating ?? testimonial.businessRating ?? 5;
                  const bizName = testimonial.businessName;
                  const bizId = testimonial.businessId;
                  const bizSlug =
                    bizName && bizId ? createBusinessSlug(bizName, String(bizId)) : null;
                  const role = bizName ? `Customer · ${bizName}` : "Customer";
                  const cardContent = (
                    <>
                      <div className="flex gap-1 mb-4 flex-shrink-0">
                        {new Array(5).fill(null).map((__, i) => (
                          <Star
                            key={`star-${i}`}
                            className={`h-5 w-5 ${i < rating ? "text-white fill-white" : "text-white/40"}`}
                          />
                        ))}
                      </div>
                      <p className="text-lg text-white/90 mb-6 italic leading-relaxed flex-grow">
                        "{comment}"
                      </p>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                          {testimonial.clientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{testimonial.clientName}</p>
                          <p
                            className={`text-sm ${bizSlug ? "text-white/90 underline underline-offset-2" : "text-white/70"}`}
                          >
                            {role}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                  const baseClass =
                    "flex flex-col h-full p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg";
                  const handleClick = () => {
                    trackEvent("testimonial_business_click", {
                      businessId: String(bizId),
                      businessName: bizName,
                      ratingScore: rating,
                      source: "home_testimonials",
                    });
                    router.push(`/business/${bizSlug}`);
                  };
                  return bizSlug ? (
                    <button
                      key={`testimonial-${idx}`}
                      type="button"
                      className={`${baseClass} cursor-pointer hover:-translate-y-1 text-left w-full`}
                      onClick={handleClick}
                    >
                      {cardContent}
                    </button>
                  ) : (
                    <div key={`testimonial-${idx}`} className={baseClass}>
                      {cardContent}
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Success Stories / Metrics Section - BUILD CREDIBILITY */}
      {/* <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Real Results, Real Growth</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Join thousands of businesses transforming their operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { value: '34%', label: 'Average Revenue Increase', color: 'from-green-400 to-emerald-600' },
              { value: '89%', label: 'Time Saved on Admin', color: 'from-blue-400 to-cyan-600' },
              { value: '92%', label: 'Customer Satisfaction', color: 'from-purple-400 to-pink-600' },
              { value: '15m', label: 'Setup Time', color: 'from-orange-400 to-red-600' },
            ].map((stat, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-card border border-border/50 text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent ${stat.color} drop-shadow-sm`}>
                  {stat.value}
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* How It Works Section - REDUCE FRICTION */}
      {/* <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Get Started in 3 Steps</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">It's incredibly simple to start booking or selling.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"> */}
      {/* Connector line - Desktop */}
      {/* <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

            <div className="relative text-center group">
              <div className="bg-card h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 relative z-10">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Search & Browse</h3>
              <p className="text-muted-foreground">Find the perfect service provider in seconds with smart filters.</p>
            </div>
            <div className="relative text-center group">
              <div className="bg-card h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 relative z-10">
                <Calendar className="h-10 w-10 text-brand-teal" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Book in Seconds</h3>
              <p className="text-muted-foreground">Pick your preferred time slot and get instant confirmation.</p>
            </div>
            <div className="relative text-center group">
              <div className="bg-card h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 relative z-10">
                <CheckCircle className="h-10 w-10 text-brand-orange" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Enjoy & Review</h3>
              <p className="text-muted-foreground">Experience great service and share your feedback with others.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Trust & Security Section - ADDRESS CONCERNS */}
      {/* <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Trusted & Secure</h2>
              <p className="text-xl text-muted-foreground">Your safety and privacy are our top priority.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-card border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Bank-Level Security</h3>
                <p className="text-muted-foreground text-sm">All data protected with military-grade encryption.</p>
              </div>
              <div className="text-center p-8 bg-card border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                <div className="h-16 w-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-8 w-8 text-brand-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Verified Professionals</h3>
                <p className="text-muted-foreground text-sm">Background checks and identity verification required.</p>
              </div>
              <div className="text-center p-8 bg-card border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                <div className="h-16 w-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <RefreshCw className="h-8 w-8 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Money-Back Guarantee</h3>
                <p className="text-muted-foreground text-sm">Not satisfied? We'll refund your booking.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border flex items-center gap-4">
              <Shield className="h-6 w-6 text-primary shrink-0" />
              <p className="text-muted-foreground text-sm">
                <span className="font-bold text-foreground">Compliance:</span> GDPR & SOC 2 Type II certified. Your privacy is protected by international standards.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Advanced Features Section - SHOW THE PRODUCT */}
      {/* <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Packed with Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to succeed, from day one.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Bell, title: 'Smart Notifications', desc: 'Never miss a booking with push notifications and reminders.', color: 'text-primary' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Multiple payment options with instant settlements.', color: 'text-brand-purple' },
              { icon: BarChart, title: 'Real-Time Analytics', desc: 'Track revenue, bookings, and customer insights.', color: 'text-brand-blue' },
              { icon: Globe, title: 'Multi-Language Support', desc: 'Reach global customers in their preferred language.', color: 'text-brand-teal' },
              { icon: RefreshCw, title: 'No-Show Reduction', desc: 'Automated reminders reduce cancellations by 40%.', color: 'text-brand-orange' },
              { icon: Smartphone, title: 'Mobile-First App', desc: 'iOS & Android apps with 4.8★ ratings.', color: 'text-pink-500' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:shadow-lg flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-background border border-border shadow-sm group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Browse Categories Section - EXPLORE OPTIONS */}
      {/* <section className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-primary/5 rounded-full mb-4">
              <span className="text-sm font-bold text-primary px-3 uppercase tracking-wider">Discover</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Explore Services by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">From beauty to wellness to education - find exactly what you need.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors group">
              View All Categories 
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              </div>
              </div>
              </section> */}

      {/* Mobile App Promotion Section - EXTRA CHANNEL */}
      <section className="py-24 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 dark:from-primary/30 via-slate-100 dark:via-slate-950 to-slate-100 dark:to-slate-950" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 items-center">
            <div className="max-w-xl pl-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-200 dark:bg-white/10 text-sm font-semibold mb-8 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white backdrop-blur-sm shadow-xl">
                📱 Mobile App
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                Manage Bookings <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-blue">
                  On-the-Go
                </span>
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-10 leading-relaxed">
                Experience the full power of kayedni in your pocket. Get push notifications, instant
                booking management, and real-time analytics wherever you are.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button className="h-16 px-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-lg shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center text-left">
                    <div className="mr-3">
                     
                    </div>
                    <div>
                      <div className="text-xs font-medium opacity-60">Download on the</div>
                      <div className="text-sm font-bold">App Store</div>
                    </div>
                  </div>
                </Button>
                <Button className="h-16 px-8 rounded-xl bg-slate-200 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-800 font-bold text-lg shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center text-left">
                    <svg className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.6 21.8c-.3 0-.5-.1-.7-.2-.3-.2-.5-.5-.5-.9V3.3c0-.4.2-.7.5-.9.2-.1.4-.2.7-.2.2 0 .5.1.7.2l15.6 8.8c.4.2.6.6.6 1.1s-.2.9-.6 1.1L4.3 22c-.2.1-.4.2-.7.2z" />
                    </svg>
                    <div>
                      <div className="text-xs font-medium opacity-60">GET IT ON</div>
                      <div className="text-sm font-bold">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-slate-300 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">4.9</span>
                    <Star className="h-6 w-6 text-brand-orange fill-brand-orange" />
                  </div>
                  <p className="text-slate-700 dark:text-slate-400 text-sm font-medium">App Store Rating</p>
                </div>
                <div className="h-10 w-px bg-slate-300 dark:bg-white/10" />
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">2M+</div>
                  <p className="text-slate-700 dark:text-slate-400 text-sm font-medium">Downloads</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block pr-10">
              {/* Abstract Phone Mockup Presentation */}
              <div className="relative mx-auto w-[320px] h-[640px] transform rotate-[-6deg] hover:rotate-0 transition-all duration-700 z-10">
                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[3rem] border-8 border-slate-300 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                  {/* Top Bar */}
                  <div className="h-7 w-40 bg-slate-300 dark:bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />

                  {/* Screen Content Mockup */}
                  <div className="flex-1 bg-white dark:bg-slate-900 pt-10 px-6 pb-6 flex flex-col relative overflow-hidden">
                    {/* Abstract UI Elements */}
                    <div className="flex justify-between items-center mb-8">
                      <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-800" />
                      <div className="h-4 w-20 rounded-full bg-slate-300 dark:bg-slate-800" />
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-brand-blue/20 border border-slate-300 dark:border-white/5 p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-slate-900/[0.05] dark:bg-grid-white/[0.05]" />
                        <div className="h-4 w-24 bg-slate-400 dark:bg-white/10 rounded mb-2" />
                        <div className="h-8 w-16 bg-slate-300 dark:bg-white/20 rounded" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800/50 border border-slate-300 dark:border-white/5 flex items-center p-3 gap-3"
                        >
                          <div className="h-12 w-12 rounded-lg bg-slate-300 dark:bg-slate-700/50" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 rounded bg-slate-400 dark:bg-slate-700/50" />
                            <div className="h-2 w-16 rounded bg-slate-300 dark:bg-slate-700/30" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Floating Action Button */}
                    <div className="absolute bottom-8 right-6 h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <div className="h-6 w-6 bg-white rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Glow behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - LEAD CAPTURE */}
      {/* <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-primary/5 rounded-3xl p-8 md:p-16 text-center border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Get Exclusive Tips & Updates</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">Learn booking strategies and be first to access new features.</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                <Input
                    type="email"
                    placeholder="Your email address"
                    className="h-12 bg-background border-input"
                />
                <Button className="h-12 px-8 font-semibold" variant="skeuo-primary">
                    Subscribe
                </Button>
                </div>
                <p className="text-sm text-muted-foreground">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Final CTA Section - STRONG CLOSE */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-foreground tracking-tight">
              Join Thousands Booking Smarter
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Get started free today. No credit card required. Scale your business with kayedni.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                variant="skeuo-primary"
                size="xl"
                className="group rounded-full px-8 hover:bg-primary/90"
                onClick={() => {
                  trackEvent("click", { element: "cta_start_booking", section: "final_cta" });
                  router.push("/register");
                }}
              >
                Start Booking Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="skeuo"
                size="xl"
                className="rounded-full px-8 bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => router.push("/register?type=business")}
              >
                Register Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
}
