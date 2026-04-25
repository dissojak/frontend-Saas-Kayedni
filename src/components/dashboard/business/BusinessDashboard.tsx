"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { useLocale } from '@global/hooks/useLocale';
import { 
  Calendar, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  BarChart3,
  CheckCircle,
  XCircle,
  CalendarDays,
  Briefcase,
  Sparkles
} from "lucide-react";
import { fetchBookingsForBusiness, fetchStaffByBusinessId, fetchServicesByBusinessId } from "../../../app/(pages)/(business)/actions/backend";
import { Booking } from "../../../app/(pages)/shared/dashboard/types";
import { useDashboardStats } from "../../../app/(pages)/shared/dashboard/hooks";
import { 
  StatsCards, 
  MonthlyBarChart, 
  StatusDonutChart, 
  TopServicesChart, 
  PerformanceInsight 
} from "../../../app/(pages)/shared/dashboard/components";
import { dashboardStatusT, dashboardT } from '@/(pages)/shared/dashboard/i18n';

const DATE_LOCALE_MAP = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar-TN',
} as const;

function getBookingStatusClass(status: string): string {
  if (status === 'CONFIRMED') {
    return 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400';
  }

  if (status === 'PENDING') {
    return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400';
  }

  if (status === 'COMPLETED') {
    return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400';
  }

  return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400';
}

export default function BusinessDashboard() {
  const router = useRouter();
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [showCharts, setShowCharts] = useState(false);

  // Use shared dashboard hook for analytics
  const { stats, monthlyData, serviceBreakdown, maxMonthlyTotal, maxServiceCount } = useDashboardStats(bookings);

  useEffect(() => {
    console.log('[BusinessDashboard] Checking localStorage for user data...');
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    console.log('[BusinessDashboard] User data exists:', !!userData);
    console.log('[BusinessDashboard] Token exists:', !!token);
    
    if (!userData || !token) {
      console.error('[BusinessDashboard] Missing user data or token');
      setError(dashboardT(locale, 'dashboard_error_login_required'));
      setLoading(false);
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      console.log('[BusinessDashboard] Parsed user:', user);
      
      setUserName(user.name || dashboardT(locale, 'dashboard_owner_fallback'));
      
      // Check for businessId in user object
      if (user.businessId) {
        console.log('[BusinessDashboard] Found businessId:', user.businessId);
        setBusinessId(String(user.businessId));
      } else {
        console.warn('[BusinessDashboard] No businessId found in user object');
        setError(dashboardT(locale, 'dashboard_error_no_business'));
        setLoading(false);
      }
    } catch (e) {
      console.error('[BusinessDashboard] Error parsing user data:', e);
      setError(dashboardT(locale, 'dashboard_error_invalid_user'));
      setLoading(false);
    }
  }, [locale, router]);

  const loadDashboardData = useCallback(async () => {
    if (!businessId) {
      console.warn('[BusinessDashboard] loadDashboardData called without businessId');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || undefined;
      const from = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 6 months
      const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      console.log('[BusinessDashboard] Fetching data with params:', { businessId, from, to, hasToken: !!token });
      
      const [bookingsData, staff, services] = await Promise.all([
        fetchBookingsForBusiness(businessId, from, to, token),
        fetchStaffByBusinessId(businessId, token),
        fetchServicesByBusinessId(businessId, token),
      ]);

      console.log('[BusinessDashboard] Data fetched:', {
        bookingsCount: bookingsData.length,
        staffCount: staff.length,
        servicesCount: services.length,
      });

      // Transform and set bookings
      setBookings(bookingsData);
      setTotalStaff(staff.length);
      setTotalServices(services.length);
      setRecentBookings(bookingsData.slice(0, 5));
      
      console.log('[BusinessDashboard] Dashboard data loaded successfully');
    } catch (error) {
      console.error('[BusinessDashboard] Failed to load dashboard data:', error);
      setError(dashboardT(locale, 'dashboard_error_fetch_failed'));
    } finally {
      setLoading(false);
    }
  }, [businessId, locale]);

  useEffect(() => {
    if (businessId) {
      console.log('[BusinessDashboard] Loading dashboard data for business:', businessId);
      loadDashboardData();
    }
  }, [businessId, loadDashboardData]);

  const completionRate = stats && stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;
  const firstName = userName.split(' ')[0] || dashboardT(locale, 'dashboard_owner_fallback');
  const quickActionArrowClass = 'w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">{dashboardT(locale, 'dashboard_loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{dashboardT(locale, 'dashboard_error_title')}</h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
              {dashboardT(locale, 'dashboard_title_business')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {dashboardT(locale, 'dashboard_welcome_back', { name: firstName })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCharts(!showCharts)}
              variant={showCharts ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {showCharts
                ? dashboardT(locale, 'dashboard_toggle_hide_analytics')
                : dashboardT(locale, 'dashboard_toggle_show_analytics')}
            </Button>
            <Badge className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-500 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50 px-4 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {dashboardT(locale, 'dashboard_role_business_owner')}
            </Badge>
          </div>
        </div>

        {/* Quick Stats Grid - Glass Morphism Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Bookings */}
          <button
            type="button"
            className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 cursor-pointer hover:shadow-xl transition-shadow text-left"
            onClick={() => router.push('/business/bookings')}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-cyan-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{dashboardT(locale, 'dashboard_total_bookings')}</p>
          </button>

          {/* Completed */}
          <button
            type="button"
            className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 cursor-pointer hover:shadow-xl transition-shadow text-left"
            onClick={() => router.push('/business/bookings')}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-400/20 to-transparent rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/40 px-2.5 py-1 rounded-full">
                {completionRate}%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.completed}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{dashboardT(locale, 'dashboard_completed')}</p>
          </button>

          {/* Staff Members */}
          <button
            type="button"
            className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 cursor-pointer hover:shadow-xl transition-shadow text-left"
            onClick={() => router.push('/business/staff')}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-400/20 to-transparent rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalStaff}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{dashboardT(locale, 'dashboard_staff_members')}</p>
          </button>

          {/* Services */}
          <button
            type="button"
            className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40 cursor-pointer hover:shadow-xl transition-shadow text-left"
            onClick={() => router.push('/business/services')}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose-400/20 to-transparent rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Package className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalServices}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{dashboardT(locale, 'dashboard_services')}</p>
          </button>
        </div>

        {/* Revenue Card - Featured Style */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider">{dashboardT(locale, 'dashboard_total_revenue')}</p>
                  <p className="text-4xl sm:text-5xl font-bold mt-1">${stats.totalRevenue.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-white/90" />
                    <span className="text-sm text-white/90">
                    {dashboardT(locale, 'dashboard_revenue_from_completed', { count: stats.completed })}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => router.push('/business/bookings')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl px-6"
              >
                {isArabic ? (
                  <>
                    <ArrowRight className="w-4 h-4 ml-2" />
                    {dashboardT(locale, 'dashboard_view_details')}
                  </>
                ) : (
                  <>
                    {dashboardT(locale, 'dashboard_view_details')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Section - Togglable */}
        {showCharts && bookings.length > 0 && stats && monthlyData && serviceBreakdown && (
          <>
            {/* Performance Metrics using Shared Components */}
            <StatsCards stats={stats} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyBarChart 
                monthlyData={monthlyData} 
                maxMonthlyTotal={maxMonthlyTotal}
              />
              <StatusDonutChart stats={stats} />
            </div>

            {/* Top Services */}
            <TopServicesChart 
              serviceBreakdown={serviceBreakdown} 
              maxServiceCount={maxServiceCount}
            />

            {/* Performance Insight */}
            <PerformanceInsight completionRate={completionRate} />
          </>
        )}

        {/* Quick Actions - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Manage Bookings */}
          <button
            onClick={() => router.push('/business/bookings')}
            className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-cyan-300/50 dark:hover:border-cyan-700/50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{dashboardT(locale, 'dashboard_manage_bookings_title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{dashboardT(locale, 'dashboard_manage_bookings_desc')}</p>
            <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-semibold">
              {isArabic ? (
                <>
                  <ArrowRight className={quickActionArrowClass} />
                  <span>{dashboardT(locale, 'dashboard_manage_bookings_cta')}</span>
                </>
              ) : (
                <>
                  <span>{dashboardT(locale, 'dashboard_manage_bookings_cta')}</span>
                  <ArrowRight className={quickActionArrowClass} />
                </>
              )}
            </div>
          </button>

          {/* Manage Staff */}
          <button
            onClick={() => router.push('/business/staff')}
            className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-violet-300/50 dark:hover:border-violet-700/50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{dashboardT(locale, 'dashboard_manage_staff_title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{dashboardT(locale, 'dashboard_manage_staff_desc')}</p>
            <div className="flex items-center text-violet-600 dark:text-violet-400 text-sm font-semibold">
              {isArabic ? (
                <>
                  <ArrowRight className={quickActionArrowClass} />
                  <span>{dashboardT(locale, 'dashboard_manage_staff_cta')}</span>
                </>
              ) : (
                <>
                  <span>{dashboardT(locale, 'dashboard_manage_staff_cta')}</span>
                  <ArrowRight className={quickActionArrowClass} />
                </>
              )}
            </div>
          </button>

          {/* Manage Services */}
          <button
            onClick={() => router.push('/business/services')}
            className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-rose-300/50 dark:hover:border-rose-700/50 sm:col-span-2 lg:col-span-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{dashboardT(locale, 'dashboard_manage_services_title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{dashboardT(locale, 'dashboard_manage_services_desc')}</p>
            <div className="flex items-center text-rose-600 dark:text-rose-400 text-sm font-semibold">
              {isArabic ? (
                <>
                  <ArrowRight className={quickActionArrowClass} />
                  <span>{dashboardT(locale, 'dashboard_manage_services_cta')}</span>
                </>
              ) : (
                <>
                  <span>{dashboardT(locale, 'dashboard_manage_services_cta')}</span>
                  <ArrowRight className={quickActionArrowClass} />
                </>
              )}
            </div>
          </button>
        </div>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">{dashboardT(locale, 'dashboard_recent_bookings_title')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{dashboardT(locale, 'dashboard_recent_bookings_desc')}</p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/business/bookings')}
                variant="outline"
                className="rounded-xl"
              >
                {isArabic ? (
                  <>
                    <ArrowRight className="w-4 h-4 ml-2" />
                    {dashboardT(locale, 'dashboard_view_all')}
                  </>
                ) : (
                  <>
                    {dashboardT(locale, 'dashboard_view_all')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <button
                  type="button"
                  key={booking.id} 
                  className={`w-full flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-700/60 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${isArabic ? 'text-right' : 'text-left'}`}
                  onClick={() => router.push('/business/bookings')}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-white">{booking.serviceName}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      <span>{booking.clientName}</span>
                      <span className="mx-1">•</span>
                      <span dir="ltr">{new Date(booking.date).toLocaleDateString(DATE_LOCALE_MAP[locale])}</span>
                      <span className="mx-1">{dashboardT(locale, 'dashboard_at')}</span>
                      <span dir="ltr">{booking.startTime}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBookingStatusClass(booking.status)}`}>
                      {dashboardStatusT(locale, booking.status)}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-white">${booking.price.toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Bookings State */}
        {recentBookings.length === 0 && !loading && (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{dashboardT(locale, 'dashboard_no_bookings_title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {dashboardT(locale, 'dashboard_no_bookings_desc')}
            </p>
            <Button
              onClick={() => router.push('/business/bookings')}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/30 rounded-xl"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              {dashboardT(locale, 'dashboard_view_all_bookings')}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
