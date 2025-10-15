'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import { Card, CardContent } from '@components/ui/card';
import CategoryCard from '../components/home/CategoryCard';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchBusinesses, fetchCategories } from './(pages)/(business)/actions/backend';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/60 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Book Services with Confidence
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Find and book appointments with local professionals - from barbers to tutors, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => router.push('/businesses')}
              >
                Find Services
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-primary hover:bg-white/80 hover:text-primary"
                  onClick={() => router.push('/register')}
                >
                  Create an Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <Card key={business.id} className="overflow-hidden card-hover">
                <div className="h-48 overflow-hidden relative">
                  <Image
                    src={business.image}
                    alt={business.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    priority={true}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{business.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{business.category}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium mr-1">{business.rating}</span>
                      <span className="text-gray-500">({business.reviewCount})</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => router.push(`/business/${business.id}`)}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" onClick={() => router.push('/businesses')}>
              View All Businesses
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-3">1. Find</h3>
              <p className="text-gray-600">Discover local businesses and services that match your needs.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold mb-3">2. Book</h3>
              <p className="text-gray-600">Schedule appointments at times that work best for you.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-3">3. Enjoy</h3>
              <p className="text-gray-600">Experience great service and leave reviews for others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to streamline your booking experience?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of businesses and clients already using BookSphere.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={() => router.push('/register')}
              >
                Sign Up Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-primary hover:bg-white/80 hover:text-primary"
                onClick={() => router.push('/business/register')}
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