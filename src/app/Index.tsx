'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import CategoryCard from '../components/home/CategoryCard';
import SearchResults from '../components/home/SearchResults';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchBusinesses, fetchCategories } from './(pages)/(business)/actions/backend';
import { useSearch } from '@global/hooks/useSearch';
import { useTracking } from '@global/hooks/useTracking';
import TimeOnPageTracker from '@components/tracking/TimeOnPageTracker';
import ScrollDepthTracker from '@components/tracking/ScrollDepthTracker';
import { ArrowRight, Clock, Users, TrendingUp, Sparkles, Search } from 'lucide-react';
import { createBusinessSlug } from '@global/lib/businessSlug';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { trackEvent } = useTracking();

  // Service categories (default fallback)
  const defaultCategories = [
    { id: 'barber', name: 'Barbers & Salons', icon: '✂️', count: 248, color: 'bg-blue-50' },
    { id: 'education', name: 'Coaching & Tutoring', icon: '📚', count: 157, color: 'bg-green-50' },
    { id: 'gaming', name: 'Gaming Lounges', icon: '🎮', count: 92, color: 'bg-yellow-50' },
    { id: 'fitness', name: 'Fitness & Wellness', icon: '💪', count: 203, color: 'bg-red-50' },
    { id: 'spa', name: 'Spa & Massage', icon: '💆‍♀️', count: 185, color: 'bg-purple-50' },
    { id: 'therapy', name: 'Therapy & Counseling', icon: '🧠', count: 167, color: 'bg-pink-50' },
  ];

  const [categories, setCategories] = useState(defaultCategories);

  // Featured businesses (default fallback)
  const [featuredBusinesses, setFeaturedBusinesses] = useState(() => [
    {
      id: 'biz-1',
      name: 'Style Studio',
      category: 'Barber',
      rating: 4.8,
      reviewCount: 128,
      image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'biz-2',
      name: 'Tech Tutors',
      category: 'Education',
      rating: 4.9,
      reviewCount: 93,
      image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'biz-3',
      name: 'GameZone',
      category: 'Gaming',
      rating: 4.7,
      reviewCount: 85,
      image: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=600&auto=format&fit=crop',
    },
  ]);

  const [loading, setLoading] = useState(true);

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
          const mapped = cats.filter((c) => c !== 'All').map((c) => ({ id: String(c).toLowerCase(), name: String(c), icon: '📌', count: 0, color: 'bg-gray-50' }));
          // REAL BACKEND WILL HAVE THIS UNCOMMENTED
          // if (mapped.length) setCategories(mapped);
        }

        if (Array.isArray(businesses) && businesses.length > 0) {
          const mapped = businesses.slice(0, 3).map((b: any) => ({ id: b.id, name: b.name, category: b.category ?? 'Unknown', rating: b.rating ?? 0, reviewCount: (b as any).reviewCount ?? 0, image: b.logo ?? '/assets/placeholder.svg' }));
          setFeaturedBusinesses(mapped);
        }
      })
      .catch((err) => console.error('Failed to load dummy data', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <Layout>
      {/* Tracking Components */}
      <TimeOnPageTracker pageName="home" />
      <ScrollDepthTracker pageName="home" />

      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Animated background (same as auth pages) */}
        <div className="absolute inset-0 z-0">
          <div className="auth-bg">
            <div className="auth-sphere auth-sphere-1" />
            <div className="auth-sphere auth-sphere-2" />
            <div className="auth-sphere auth-sphere-3" />
            <div className="auth-glow" />
            <div className="auth-grid" />
            <div className="auth-noise" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur mb-6">
              <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-sm font-medium">The future of booking is here</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              Book Services with Confidence
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-2xl mx-auto">
              Find and book appointments with local professionals instantly. From barbers to tutors, all in one seamless platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition-all group"
                onClick={() => { trackEvent('click', { element: 'hero_find_services', section: 'hero' }); router.push('/businesses'); }}
              >
                Find Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 transition-all group"
                onClick={() => { trackEvent('click', { element: 'hero_for_business', section: 'hero' }); router.push('/business-solutions'); }}
              >
                For Business
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-black hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => { trackEvent('click', { element: 'hero_create_account', section: 'hero' }); router.push('/register'); }}
                >
                  Create Account
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">2K+</div>
                <p className="text-white/70">Active Businesses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">50K+</div>
                <p className="text-white/70">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">4.8★</div>
                <p className="text-white/70">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Benefits Section - EARLY VALUE PROP */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Save Time</h3>
              <p className="text-gray-600 dark:text-gray-300">Book appointments in seconds without phone calls or waiting.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 border border-purple-100 dark:border-slate-700">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Quality Vetted</h3>
              <p className="text-gray-600 dark:text-gray-300">All businesses verified with real reviews and ratings.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border border-green-100 dark:border-slate-700">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Grow Your Business</h3>
              <p className="text-gray-600 dark:text-gray-300">Reach more customers with our powerful booking platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Showcase Section - MOVE UP FOR QUICK ACCESS */}
      <section className="py-20 bg-gradient-to-b from-white dark:from-slate-950 to-gray-50 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Find & Book Instantly</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Search thousands of services near you.</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    trackEvent('search_query', { query: searchQuery, location: searchLocation, source: 'home_search_form' });
                    const params = new URLSearchParams();
                    if (searchQuery) params.set('q', searchQuery);
                    if (searchLocation) params.set('location', searchLocation);
                    router.push(`/search?${params.toString()}`);
                  }}
                  className="flex flex-col md:flex-row gap-4"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      placeholder="What service are you looking for?"
                      className="w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                    {/* Typing indicator */}
                    {isTyping && searchQuery.length >= 2 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      placeholder="Your location"
                      className="w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={searchLoading || isTyping}
                    className="px-8 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {(searchLoading || isTyping) ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </form>
                
                {/* Live search hint */}
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Type at least 2 characters to search...
                  </p>
                )}
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Quick Search:</span>
                  {['Barber', 'Yoga Classes', 'Car Wash', 'Restaurants'].map((tag) => (
                    <button 
                      key={tag} 
                      type="button"
                      onClick={() => {
                        trackEvent('search_query', { query: tag, source: 'home_quick_search' });
                        handleQueryChange(tag);
                        searchWithParams({ query: tag });
                      }}
                      className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Search Results Dropdown */}
                <SearchResults
                  results={searchResults}
                  loading={searchLoading}
                  error={searchError}
                  hasSearched={hasSearched}
                  onClose={clearResults}
                  searchQuery={searchQuery}
                  searchLocation={searchLocation}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals - IMMEDIATE PROOF */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Top Professionals Ready to Help</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Browse verified, highly-rated service providers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <div key={business.id} className="group h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-[var(--color-primary)]/50 transition-all hover:shadow-xl dark:hover:shadow-xl dark:hover:shadow-[var(--color-primary)]/10">
                <div className="h-48 overflow-hidden relative bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                  <Image
                    src={business.image}
                    alt={business.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    priority={true}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{business.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">{business.category}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold dark:text-white">{business.rating}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">({business.reviewCount})</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:shadow-lg transition-all" onClick={() => { trackEvent('business_view', { businessId: String(business.id), businessName: business.name, source: 'home_featured' }); router.push(`/business/${createBusinessSlug(business.name, String(business.id))}`); }}>
                    View & Book
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" onClick={() => { trackEvent('click', { element: 'browse_all_professionals', section: 'featured' }); router.push('/businesses'); }} className="border-2 dark:border-slate-700">
              Browse All Professionals <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - SOCIAL PROOF */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Thousands</h2>
            <p className="text-xl text-white/80">Real stories from our happy customers and businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Business Owner', content: 'Bookify transformed how I manage appointments. My revenue increased by 40% in the first month.', rating: 5 },
              { name: 'Mike Chen', role: 'Customer', content: 'Finally, a booking platform that actually works! Easy, fast, and reliable. Highly recommended.', rating: 5 },
              { name: 'Emma Davis', role: 'Service Professional', content: 'The best tool for managing my schedule. My clients love the instant confirmations.', rating: 5 },
            ].map((testimonial, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:border-white/40 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-white/90 mb-4">{testimonial.content}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories / Metrics Section - BUILD CREDIBILITY */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Real Results, Real Growth</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Join thousands transforming their business with Bookify.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { value: '34%', label: 'Average Revenue Increase', color: 'from-green-400 to-emerald-600' },
              { value: '89%', label: 'Time Saved on Admin', color: 'from-blue-400 to-cyan-600' },
              { value: '92%', label: 'Customer Satisfaction', color: 'from-purple-400 to-pink-600' },
              { value: '15m', label: 'Setup Time', color: 'from-orange-400 to-red-600' },
            ].map((stat, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-center hover:shadow-xl transition-all">
                <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - REDUCE FRICTION */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Get Started in 3 Steps</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">It's incredibly simple to start booking or selling.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative text-center group">
              <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)]/50 transition-all">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">Search & Browse</h3>
              <p className="text-gray-600 dark:text-gray-300">Find the perfect service provider in seconds with smart filters.</p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
            </div>
            <div className="relative text-center group">
              <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)]/50 transition-all">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">Book in Seconds</h3>
              <p className="text-gray-600 dark:text-gray-300">Pick your preferred time slot and get instant confirmation.</p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-1 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
            </div>
            <div className="relative text-center group">
              <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[var(--color-primary)]/20 group-hover:border-[var(--color-primary)]/50 transition-all">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">Enjoy & Review</h3>
              <p className="text-gray-600 dark:text-gray-300">Experience great service and share your feedback with others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section - ADDRESS CONCERNS */}
      <section className="py-20 bg-gradient-to-br from-blue-50 dark:from-slate-900 to-purple-50 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Trusted & Secure</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Your safety and privacy are our top priority.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">Bank-Level Security</h3>
                <p className="text-gray-600 dark:text-gray-300">All data protected with military-grade encryption.</p>
              </div>
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">Verified Professionals</h3>
                <p className="text-gray-600 dark:text-gray-300">Background checks and identity verification required.</p>
              </div>
              <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl">
                <div className="text-5xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">Money-Back Guarantee</h3>
                <p className="text-gray-600 dark:text-gray-300">Not satisfied? We'll refund your booking.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-[var(--color-primary)]">
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-bold dark:text-white">Compliance:</span> GDPR & SOC 2 Type II certified. Your privacy is protected by international standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section - SHOW THE PRODUCT */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Packed with Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to succeed, from day one.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: '🔔', title: 'Smart Notifications', desc: 'Never miss a booking with push notifications and reminders.' },
              { icon: '💳', title: 'Secure Payments', desc: 'Multiple payment options with instant settlements.' },
              { icon: '📊', title: 'Real-Time Analytics', desc: 'Track revenue, bookings, and customer insights.' },
              { icon: '🌐', title: 'Multi-Language Support', desc: 'Reach global customers in their preferred language.' },
              { icon: '🔄', title: 'No-Show Reduction', desc: 'Automated reminders reduce cancellations by 40%.' },
              { icon: '📱', title: 'Mobile-First App', desc: 'iOS & Android apps with 4.8★ ratings.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-[var(--color-primary)]/50 transition-all group hover:shadow-lg">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Categories Section - EXPLORE OPTIONS */}
      <section className="pb-40 bg-gradient-to-b from-white dark:from-slate-950 to-gray-50 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Explore Services by Category</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">From beauty to wellness to education - we've got it all.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Promotion Section - EXTRA CHANNEL */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Manage Bookings On-the-Go</h2>
              <p className="text-xl text-white/80 mb-6">Native iOS and Android apps with push notifications, instant booking, and full account control.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-slate-900 hover:bg-gray-100 font-semibold">
                  App Store
                </Button>
                <Button className="bg-gradient-to-r from-[#4285F4] to-[#EA4335] text-white hover:shadow-lg hover:shadow-[#4285F4]/50 transition-all font-semibold">
                  Google Play
                </Button>
              </div>
              <div className="mt-8 flex gap-6">
                <div>
                  <div className="text-3xl font-bold">4.8★</div>
                  <p className="text-white/70 text-sm">50K+ Reviews</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">2M+</div>
                  <p className="text-white/70 text-sm">Downloads</p>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="w-40 h-80 mx-auto bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl border-8 border-slate-700 shadow-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-5xl mb-2">📱</div>
                  <p className="text-sm">Available on iOS & Android</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - REMOVE OBJECTIONS */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Questions? We've Got Answers</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to know about Bookify.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Is Bookify really free to start?', a: 'Yes! Sign up free and start booking or selling instantly. Premium features are optional.' },
              { q: 'How is my payment information kept secure?', a: 'We use PCI DSS Level 1 compliance, end-to-end encryption, and partner with trusted payment processors.' },
              { q: 'Can I use Bookify if I already have a website?', a: 'Absolutely. Integrate Bookify widgets into your site or use our standalone platform.' },
              { q: 'What if I need customer support?', a: 'Our team is available 24/7 via chat, email, and phone to help you.' },
            ].map((item, idx) => (
              <details key={idx} className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-[var(--color-primary)]/50 transition-all">
                <summary className="flex items-center justify-between font-semibold dark:text-white">
                  {item.q}
                  <span className="text-2xl group-open:rotate-180 transition-transform dark:text-gray-400">+</span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - LEAD CAPTURE */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-accent)]/10 to-[var(--color-primary)]/10 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Get Exclusive Tips & Updates</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Learn booking strategies and be first to access new features.</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[var(--color-primary)]"
              />
              <Button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section - STRONG CLOSE */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Join Thousands Booking Smarter</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Get started free today. No credit card required. Scale your business with Bookify.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold shadow-lg"
                onClick={() => { trackEvent('click', { element: 'cta_start_booking', section: 'final_cta' }); router.push('/register'); }}
              >
                Start Booking Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 dark:border-slate-700"
                onClick={() => router.push('/business/register')}
              >
                List Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}