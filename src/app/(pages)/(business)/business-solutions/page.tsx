'use client';

import React from 'react';
import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/button';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';

export default function BusinessSolutions() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950">
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

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur mb-6">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">Enterprise Booking Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-amber-200 via-white to-amber-100 bg-clip-text text-transparent">
              Scale Your Business with Smart Booking
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto">
              Streamline appointments, boost revenue, and delight customers. Trusted by hundreds of service businesses.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {!isAuthenticated && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 transition-all group"
                  onClick={() => router.push('/register')}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-black hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Pricing
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">34%</div>
                <p className="text-white/70">Avg Revenue Increase</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">500+</div>
                <p className="text-white/70">Active Businesses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">4.9★</div>
                <p className="text-white/70">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Common Problems We Solve</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Running a service business is complex. kayedni simplifies it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { problem: 'Missed Calls & No-Shows', solution: 'Automated reminders reduce no-shows by 40%' },
              { problem: 'Manual Scheduling Chaos', solution: 'Real-time calendar sync across all channels' },
              { problem: 'Lost Revenue Opportunities', solution: 'Multi-booking capacity optimization' },
              { problem: 'Poor Customer Experience', solution: 'Instant confirmations & easy rescheduling' },
              { problem: 'No Business Insights', solution: 'Real-time analytics & revenue tracking' },
              { problem: 'Payment Collection Issues', solution: 'Secure payments with instant settlement' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-amber-500/50 transition-all group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <span className="text-2xl">❌</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 dark:text-white">{item.problem}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features for Business */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Powerful Features Built for Growth</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to run a modern booking business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📅', title: 'Smart Scheduling', desc: 'Real-time availability, automatic buffers, staff management, and timezone handling.' },
              { icon: '💰', title: 'Revenue Optimization', desc: 'Dynamic pricing, bulk bookings, package deals, and instant payment processing.' },
              { icon: '📊', title: 'Advanced Analytics', desc: 'Revenue tracking, customer insights, no-show metrics, and performance reporting.' },
              { icon: '📱', title: 'Multi-Channel Presence', desc: 'kayedni widget for your website, white-label option, and mobile app integration.' },
              { icon: '🔔', title: 'Smart Notifications', desc: 'SMS & email reminders, appointment confirmations, and cancellation alerts.' },
              { icon: '🔗', title: 'Integrations', desc: 'Stripe, PayPal, Google Calendar, Slack, Zapier, and 100+ more tools.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Real ROI You Can Count On</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">See measurable results within the first month.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { metric: '+34%', benefit: 'Average Revenue Increase', desc: 'More bookings, reduced no-shows, higher capacity utilization' },
                { metric: '89%', benefit: 'Admin Time Saved', desc: 'Automation handles scheduling, reminders, and confirmations' },
                { metric: '-40%', benefit: 'No-Show Reduction', desc: 'Automatic reminders dramatically improve attendance rates' },
                { metric: '4.9★', benefit: 'Customer Satisfaction', desc: 'Instant booking, easy rescheduling, professional experience' },
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700">
                  <div className="text-5xl md:text-6xl font-bold text-amber-600 mb-3">{item.metric}</div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">{item.benefit}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Pay only for what you use. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '$29', period: '/month', desc: 'Perfect for solo entrepreneurs', highlight: false, features: ['Up to 100 bookings/month', 'Basic scheduling', 'Email reminders', 'Mobile app', 'Customer support'] },
              { name: 'Professional', price: '$79', period: '/month', desc: 'For growing businesses', highlight: true, features: ['Unlimited bookings', 'Staff management (5)', 'SMS + Email reminders', 'Analytics dashboard', 'Integrations', 'Custom branding', 'Priority support', 'API access'] },
              { name: 'Enterprise', price: 'Custom', period: 'pricing', desc: 'For large operations', highlight: false, features: ['Unlimited everything', 'Unlimited staff', 'White-label solution', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'Advanced reporting'] },
            ].map((plan, idx) => (
              <div key={idx} className={`rounded-2xl border transition-all p-8 ${plan.highlight ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 shadow-xl scale-105' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                {plan.highlight && <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold mb-4">Most Popular</div>}
                <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">{plan.period}</span>
                </div>
                <Button className={`w-full mb-6 ${plan.highlight ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold' : 'border-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}>
                  Get Started
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-3 dark:text-white">All plans include:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['24/7 customer support', 'Free SSL & security', 'Automatic backups', 'Mobile app access', 'Basic analytics', 'Email reminders'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Trusted by Service Businesses</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">From salons to consultants, everyone's seeing results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah's Beauty Salon", business: 'Hair & Beauty', story: 'kayedni helped us double our bookings in 3 months. The automated reminders alone reduced our no-shows by 50%.', metric: '+92% Revenue' },
              { name: 'Dr. James Consulting', business: 'Professional Services', story: 'As a consultant, my time is money. kayedni freed up 10+ hours per week. Best investment ever.', metric: '+40% Capacity' },
              { name: 'Zen Fitness Studio', business: 'Fitness & Wellness', story: "Our members love the app. We're now at 95% capacity, and our staff finally has breathing room.", metric: '+3 New Staff' },
            ].map((story, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 border border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">{story.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{story.business}</p>
                  </div>
                  <span className="text-3xl font-bold text-amber-600">{story.metric}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{story.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">For business owners like you.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'How long does setup take?', a: 'Most businesses are up and running in under 15 minutes. Onboarding support included.' },
              { q: 'Can I integrate with my website?', a: 'Yes! Embed our booking widget on your site with 1 click, or use our white-label solution.' },
              { q: 'What if I need a feature?', a: 'Contact our support team. Many features were customer-requested. We listen to our users.' },
              { q: 'Is there a long-term contract?', a: 'No. Month-to-month billing. Cancel anytime. Most customers stay for years.' },
              { q: 'How do I migrate my existing bookings?', a: 'We help with data migration. Our team ensures a smooth transition with zero downtime.' },
              { q: 'What about payment security?', a: 'PCI DSS Level 1 compliant. Bank-grade encryption. Your data is safer than your bank.' },
            ].map((item, idx) => (
              <details key={idx} className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-amber-500/50 transition-all">
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

      {/* Final CTA */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Ready to Scale Your Business?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join 500+ service businesses already using kayedni to grow revenue and delight customers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!isAuthenticated && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30"
                  onClick={() => router.push('/register')}
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                onClick={() => window.location.href = 'mailto:sales@kayedni.com'}
              >
                Talk to Sales
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              No credit card required. Setup takes 15 minutes.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
