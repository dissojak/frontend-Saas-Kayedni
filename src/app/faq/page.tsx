'use client';

import React, { useState } from 'react';
import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'business'>('client');

  const clientFAQs = [
    {
      q: 'Is Kayedni really free for clients?',
      a: 'Yes, absolutely! As a client, you can browse, search, and book appointments with local professionals completely free of charge. There are no hidden fees or subscriptions for booking services.'
    },
    {
      q: 'Do I need to create an account to book?',
      a: 'You can browse services and start booking without an account, but you’ll need to log in or create an account to complete the checkout, manage your bookings, and leave reviews.'
    },
    {
      q: 'How do I cancel or reschedule an appointment?',
      a: 'You can easily manage your appointments from your "My Bookings" dashboard. Simply select the appointment you wish to change and follow the prompts.'
    },
    {
      q: 'Can I leave reviews for businesses?',
      a: 'Yes! We encourage you to share your experience. Verified reviews help other users find the best professionals.'
    }
  ];

  const businessFAQs = [
    {
      q: 'What are the pricing options for businesses?',
      a: 'We offer a flexible premium model for businesses. You will have full access to all features, including advanced analytics, automated reminders, and marketing tools.'
    },
    {
      q: 'Do you offer a free trial?',
      a: 'Yes! We understand you want to try before you commit. New businesses can choose between a 14-day free full-access trial OR get 50% off for the first 3 months. You can select the offer that best suits your needs when you sign up.'
    },
    {
      q: 'Can I switch my plan later?',
      a: 'Absolutely. You can upgrade or adjust your plan at any time from your business dashboard settings.'
    },
    {
      q: 'How do I get paid?',
      a: 'Clients pay you directly when the service happens. Kayedni does not handle payments. We simply help manage your bookings and scheduling, so you stay in full control of your revenue. Payment processing through Kayedni may be added in the future.'
    }
  ];

  const faqs = activeTab === 'client' ? clientFAQs : businessFAQs;

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Header Section */}
        <section className="relative py-20 bg-muted/30 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about using Kayedni, whether you're booking a service or growing your business.
            </p>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Toggle Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-muted p-1 rounded-full border border-border">
                <button
                  onClick={() => setActiveTab('client')}
                  className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'client'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  For Clients
                </button>
                <button
                  onClick={() => setActiveTab('business')}
                  className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'business'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  For Businesses
                </button>
              </div>
            </div>

            {/* Vision / Info Card */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                 
                 {activeTab === 'client' ? (
                   <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full mb-6">
                        <CheckCircle2 className="h-8 w-8" />
                     </div>
                     <h2 className="text-3xl font-bold mb-4">100% Free for Clients</h2>
                     <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                       We believe finding the right service shouldn't cost you a dime. Enjoy unlimited access to our platform, compare professionals, and book instantly without any booking fees.
                     </p>
                     <Button size="lg" className="rounded-full px-8" asChild>
                       <Link href="/search">Start Booking Now</Link>
                     </Button>
                   </div>
                 ) : (
                   <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="inline-flex items-center justify-center p-3 bg-brand-purple/10 text-brand-purple rounded-full mb-6">
                        <SparklesIcon className="h-8 w-8" />
                     </div>
                     <h2 className="text-3xl font-bold mb-4">Powerful Tools to Grow Your Business</h2>
                     <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                       Unlock premium features designed to streamline your operations and boost revenue.
                     </p>
                     <div className="max-w-2xl mx-auto mb-6 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                       <strong className="text-foreground">Payment flow:</strong> Clients are not charged by Kayedni — payments are handled via our integrated payment partners and deposited directly to your business account. Kayedni does not hold client funds, so your revenue remains under your control.
                     </div>
                     
                     {/* Business Offer Highlights */}
                     <div className="grid md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mb-8">
                        <div className="bg-background/50 border border-primary/20 rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 text-sm">1</div>
                            <div>
                              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">14-Day Free Trial</h3>
                              <p className="text-sm text-muted-foreground">Test drive all premium features with zero commitment.</p>
                              <p className="text-xs text-muted-foreground mt-2">Mutually exclusive: choosing this trial excludes the 50% off 3-month offer.</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-background/50 border border-secondary/20 rounded-xl p-5 hover:border-brand-secondary/50 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-4">
                            <div className="h-8 w-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary font-bold shrink-0 text-sm">2</div>
                            <div>
                              <h3 className="font-bold text-foreground mb-1 group-hover:text-brand-secondary transition-colors">50% Off First 3 Months</h3>
                              <p className="text-sm text-muted-foreground">Save big when you're ready to commit to growth.</p>
                              <p className="text-xs text-muted-foreground mt-2">Mutually exclusive: selecting this 50% offer means you cannot also take the 14-day free trial.</p>
                            </div>
                          </div>
                        </div>
                     </div>
                     
                    <div className="text-sm text-muted-foreground mb-8 bg-muted/50 inline-block px-4 py-2 rounded-lg">
                      New businesses can choose <strong>one</strong> of these exclusive introductory offers upon signup — they are mutually exclusive. If you select the 14-day free trial, you will not be eligible for the 50% off for the first 3 months, and vice versa.
                    </div>
                     
                     <div className="flex justify-center">
                        <Button size="lg" className="rounded-full px-8"  asChild >
                          <Link href="/business/register">List Your Business</Link>
                        </Button>
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Questions List */}
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((item, idx) => (
                <details key={`${activeTab}-${idx}`} className="group p-6 rounded-2xl bg-card border border-border/50 cursor-pointer hover:border-primary/30 transition-all duration-300 open:shadow-md animate-in fade-in slide-in-from-bottom-2">
                  <summary className="flex items-center justify-between font-bold text-lg text-foreground list-none focus:outline-none">
                    {item.q}
                    <span className="text-2xl text-muted-foreground group-open:rotate-180 transition-transform duration-300">+</span>
                  </summary>
                  <div className="mt-4 text-muted-foreground leading-relaxed">
                      {item.a}
                  </div>
                </details>
              ))}
            </div>

             {/* Support Contact */}
             <div className="text-center mt-20 mb-12">
               <p className="text-muted-foreground">
                 Still have questions? <Link href="/contact" className="text-primary font-semibold hover:underline">Contact our support team</Link>
               </p>
             </div>

          </div>
        </section>
      </div>
    </Layout>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
