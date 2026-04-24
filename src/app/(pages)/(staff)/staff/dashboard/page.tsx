"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@components/ui/alert-dialog";
import { 
  Building2, 
  AlertTriangle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Scissors,
  Users,
  ClipboardList,
  CalendarDays,
  ArrowRight,
  Activity,
  Settings
} from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@global/hooks/use-toast";
import { useLocale } from '@global/hooks/useLocale';
import { fetchStaffStats, staffResignFromBusiness, fetchBusinessById, fetchBusinessImages, fetchServicesByBusinessId, fetchStaffByBusinessId, fetchCurrentStaffInfo, fetchBookingsForStaff } from "../../../(business)/actions/backend";
import { Booking, BusinessImage, BusinessInfo } from "../../../shared/dashboard/types";
import { useDashboardStats } from "../../../shared/dashboard/hooks";
import { formatLastUpdatedLabel } from "../../../shared/dashboard/utils";
import { 
  StatsCards, 
  MonthlyBarChart, 
  StatusDonutChart, 
  TopServicesChart, 
  PerformanceInsight 
} from "../../../shared/dashboard/components";
import { StaffStats } from "./types";
import { staffT } from '../i18n';
import { createBusinessSlug } from '@global/lib/businessSlug';

export default function StaffWorkspacePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [businessImages, setBusinessImages] = useState<BusinessImage[]>([]);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resignDialogOpen, setResignDialogOpen] = useState(false);
  const [resigning, setResigning] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const userId = user?.id;
  const userBusinessId = user?.businessId;

  // Use shared dashboard hook for analytics
  const { stats: dashboardStats, monthlyData, serviceBreakdown, maxMonthlyTotal, maxServiceCount } = useDashboardStats(bookings);

  const loadData = useCallback(async () => {
    if (!userId || !token) return;

    try {
      setLoading(true);
      
      // Load stats
      const statsData = await fetchStaffStats(userId, token);
      setStats(statsData);

      console.log('Staff Dashboard - User ID:', userId);
      console.log('Staff Dashboard - BusinessId from user:', userBusinessId);

      // Try to get businessId from user object first, then fallback to API
      let businessId = userBusinessId;
      
      if (!businessId) {
        console.log('No businessId on user, fetching from /staff/me endpoint...');
        const staffInfo = await fetchCurrentStaffInfo(token);
        console.log('Staff info from API:', staffInfo);
        
        if (staffInfo?.hasBusiness && staffInfo?.businessId) {
          businessId = String(staffInfo.businessId);
          console.log('Got businessId from API:', businessId);
        }
      }

      // Load business info if we have a businessId
      if (businessId) {
        console.log('Fetching business data for ID:', businessId);
        const [businessData, images, services, staff, bookingsData] = await Promise.all([
          fetchBusinessById(businessId),
          fetchBusinessImages(businessId),
          fetchServicesByBusinessId(businessId, token),
          fetchStaffByBusinessId(businessId, token),
          fetchBookingsForStaff(userId, undefined, undefined, token)
        ]);
        
        console.log('Business data received:', businessData);
        console.log('Images received:', images);
        console.log('Services received:', services);
        console.log('Staff received:', staff);
        console.log('Bookings received:', bookingsData);
        
        if (businessData) {
          setBusiness(businessData);
        }
        if (images && images.length > 0) {
          setBusinessImages(images);
        }
        if (services) {
          setServicesCount(services.length);
        }
        if (staff) {
          setStaffCount(staff.length);
        }
        if (bookingsData) {
          setBookings(bookingsData);
        }
      } else {
        console.log('No businessId found - staff may not be linked to a business');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, userBusinessId, token]);

  useEffect(() => {
    if (userId && token) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [userId, token, loadData]);

  const handleResign = async () => {
    if (!user?.id) {
      toast({
        variant: "error",
        title: staffT(locale, 'toast_error_title'),
        description: staffT(locale, 'toast_error_user_not_found'),
      });
      return;
    }

    // Get token and businessId
    const authToken = token || localStorage.getItem('token') || localStorage.getItem('accessToken');
    let businessId = user.businessId || business?.id;

    if (!authToken) {
      toast({
        variant: "error",
        title: staffT(locale, 'toast_auth_required_title'),
        description: staffT(locale, 'toast_auth_required_desc'),
      });
      return;
    }

    if (!businessId) {
      toast({
        variant: "error",
        title: staffT(locale, 'toast_no_business_title'),
        description: staffT(locale, 'toast_no_business_desc'),
      });
      return;
    }

    try {
      setResigning(true);
      const response = await staffResignFromBusiness(String(businessId), String(user.id), authToken);
      
      // Show success toast
      toast({
        variant: "success",
        title: staffT(locale, 'toast_success_resigned_title'),
        description: response.message || staffT(locale, 'toast_success_resigned_desc'),
      });
      
      // Wait a moment for the toast to show, then log out and redirect
      setTimeout(() => {
        logout();
        router.push('/');
      }, 1500);
    } catch (error: any) {
      console.error('Error resigning from business:', error);
      toast({
        variant: "error",
        title: staffT(locale, 'toast_failed_resign_title'),
        description: error.message || staffT(locale, 'toast_failed_resign_desc'),
      });
      setResigning(false);
    } finally {
      setResignDialogOpen(false);
    }
  };

  const completionRate = stats && stats.totalBookings > 0 
    ? Math.round((stats.completedBookings / stats.totalBookings) * 100) 
    : 0;
  const totalBookings = stats?.totalBookings ?? 0;
  const completedBookings = stats?.completedBookings ?? 0;
  const upcomingBookings = (stats?.pendingBookings ?? 0) + (stats?.confirmedBookings ?? 0);
  const previewImages = businessImages.slice(0, 3);
  const lastUpdatedLabel = formatLastUpdatedLabel(business?.updatedAt ?? business?.createdAt) || 'Last updated recently';

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">{staffT(locale, 'dashboard_loading_workspace')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`min-h-screen bg-[#f8f9fa] ${isArabic ? 'text-right' : ''}`}
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6">
          
          {/* Debug: No business linked message */}
          {!business && !loading && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">{staffT(locale, 'dashboard_no_business_title')}</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    {staffT(locale, 'dashboard_no_business_desc')}
                  </p>
                  {user?.businessId && (
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                      {staffT(locale, 'dashboard_business_id_found', { id: user.businessId })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {business && (
            <>
              <div className="flex justify-center">
                <div className="w-full max-w-[660px] rounded-full border border-white/10 bg-[#191c1de6] px-7 py-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-[0.12em] uppercase">
                    <div className="flex items-center gap-2 text-white/95">
                      <span className="h-2 w-2 rounded-full bg-lime-400" />
                      <span>{`My Workspace : ${business.name}`}</span>
                    </div>
                    <span className="h-5 w-px bg-white/20" />
                    <button
                      type="button"
                      onClick={() => setResignDialogOpen(true)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Leave Business
                    </button>
                    <span className="h-5 w-px bg-white/20" />
                    <div className="flex items-center gap-2 text-lime-400">
                      <Users className="h-3.5 w-3.5" />
                      <span>{`${staffCount} Team Members`}</span>
                    </div>
                    <span className="ml-auto h-2.5 w-2.5 rounded-full bg-zinc-200/70" />
                  </div>
                </div>
              </div>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                  <div className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-[0_20px_30px_rgba(0,0,0,0.05)] backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <img
                        src={business.logo || businessImages[0]?.imageUrl || '/favicon.ico'}
                        alt={business.name}
                        className="h-20 w-20 rounded-2xl border-2 border-white object-cover shadow-lg"
                      />
                      <div>
                        <span className="rounded-full bg-[#caf082] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#344b00]">
                          Workspace
                        </span>
                        <h2 className="mt-1 text-[38px] leading-[1.05] font-bold text-[#191C1D]">{business.name}</h2>
                        <p className="text-sm text-[#44493A]">{business.email || staffT(locale, 'business_card_email')}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between rounded-xl border border-white/40 bg-[#f3f4f5] p-4">
                      <div className="flex items-center gap-2 text-[#191C1D]">
                        <Building2 className="h-4 w-4 text-[#344B00]" />
                        <span>{staffT(locale, 'dashboard_badge_staff_member')}</span>
                      </div>
                      <span className="rounded-full bg-[#ecfccb] px-2 py-0.5 text-xs font-bold text-[#3f6212]">Active</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#344b00]/10 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#476500] shadow-[0_0_20px_rgba(71,101,0,0.15)]">
                          <Scissors className="h-10 w-10 text-[#BCE276]" />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-3">
                            <h3 className="text-4xl font-bold tracking-tight text-[#344B00]">{business.name}</h3>
                            <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#344B00]">
                              Premium Lounge
                            </span>
                          </div>
                          <p className="max-w-lg text-sm leading-6 text-[#44493A]">{business.description || staffT(locale, 'business_card_you_work_at')}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm font-semibold text-[#44493A]">
                            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#344B00]" />{business.location || staffT(locale, 'business_card_location')}</span>
                            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#344B00]" />{business.phone || staffT(locale, 'business_card_phone')}</span>
                          </div>
                        </div>
                      </div>
                        <Button
                          onClick={() => router.push('/staff/bookings')}
                          className="h-11 rounded-xl bg-[#476500] px-6 text-white hover:bg-[#3d5700]"
                        >
                          Start Working
                        </Button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-8">
                  <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                    <img
                      src={businessImages[activeImageIndex]?.imageUrl || businessImages[0]?.imageUrl || business.logo || '/favicon.ico'}
                      alt={`${business.name} cover`}
                      className="h-[420px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    {businessImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev === 0 ? businessImages.length - 1 : prev - 1))}
                          className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#476500] bg-white/10 text-[#476500] backdrop-blur-sm"
                        >
                          {isArabic ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveImageIndex((prev) => (prev === businessImages.length - 1 ? 0 : prev + 1))}
                          className="absolute right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#476500] bg-white/10 text-[#476500] backdrop-blur-sm"
                        >
                          {isArabic ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>
                      </>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                      <div>
                        <h4 className="text-4xl font-medium text-white">Visual Identity</h4>
                        <p className="text-sm text-white/80">{lastUpdatedLabel}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push(`/business/${createBusinessSlug(business.name, business.id)}`)}
                        className="rounded-full border border-white/30 bg-white/20 px-5 py-2 text-base text-white backdrop-blur-md"
                      >
                        view Public Page
                      </button>
                    </div>
                  </div>

                  {previewImages.length > 1 && (
                    <div className="grid grid-cols-3 gap-4">
                      {previewImages.map((img, index) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          className="overflow-hidden rounded-2xl border-2 border-white shadow-sm"
                        >
                          <img
                            src={img.imageUrl}
                            alt={staffT(locale, 'dashboard_thumbnail_alt', { index: index + 1 })}
                            className="h-36 w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <aside className="space-y-4 lg:col-span-4">
                  <div className="space-y-3">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-violet-100 p-3"><ClipboardList className="h-5 w-5 text-violet-600" /></div>
                          <div>
                            <p className="text-sm text-[#44493A]">{staffT(locale, 'quick_stats_total_bookings')}</p>
                            <p className="text-3xl font-bold text-[#191C1D]">{totalBookings}</p>
                          </div>
                        </div>
                        <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-600">+{completionRate}%</span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-lime-100 p-3"><Activity className="h-5 w-5 text-lime-700" /></div>
                          <div>
                            <p className="text-sm text-[#44493A]">{staffT(locale, 'quick_stats_completed')}</p>
                            <p className="text-3xl font-bold text-[#191C1D]">{completedBookings}</p>
                          </div>
                        </div>
                        <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">{completionRate}% rate</span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-amber-100 p-3"><CalendarDays className="h-5 w-5 text-amber-700" /></div>
                          <div>
                            <p className="text-sm text-[#44493A]">{staffT(locale, 'quick_stats_upcoming')}</p>
                            <p className="text-3xl font-bold text-[#191C1D]">{upcomingBookings}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-amber-700" />
                      </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                    <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-[#191C1D]">
                      <Settings className="h-5 w-5 text-[#344B00]" />
                      Management
                    </h3>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => router.push('/staff/services')}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/50 bg-white/80 px-4 py-4 shadow-[0_20px_30px_rgba(0,0,0,0.05)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-[#caf082] p-3"><Scissors className="h-5 w-5 text-[#344B00]" /></div>
                          <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm font-medium text-[#191C1D]">{staffT(locale, 'services_section_my_services')}</p>
                            <p className="text-xs text-zinc-500">{`${servicesCount} Active options`}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push('/staff/schedule')}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/50 bg-white/80 px-4 py-4 shadow-[0_20px_30px_rgba(0,0,0,0.05)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-violet-100 p-3"><CalendarDays className="h-5 w-5 text-violet-600" /></div>
                          <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm font-medium text-[#191C1D]">{staffT(locale, 'quick_actions_schedule_title')}</p>
                            <p className="text-xs text-zinc-500">Mon - Sat Available</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push('/staff/bookings')}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/50 bg-white/80 px-4 py-4 shadow-[0_20px_30px_rgba(0,0,0,0.05)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-amber-100 p-3"><ClipboardList className="h-5 w-5 text-amber-700" /></div>
                          <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm font-medium text-[#191C1D]">{staffT(locale, 'quick_actions_bookings_title')}</p>
                            <p className="text-xs text-zinc-500">Manage appointments</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                  </div>
                </aside>
              </section>
            </>
          )}

          {/* Analytics Section - Using Shared Dashboard Components */}
          {showCharts && bookings.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  {staffT(locale, 'dashboard_analytics_title')}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCharts(false)}
                  className="rounded-xl"
                >
                  {staffT(locale, 'dashboard_hide_charts')}
                </Button>
              </div>

              <StatsCards stats={dashboardStats} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyBarChart 
                  monthlyData={monthlyData} 
                  maxMonthlyTotal={maxMonthlyTotal}
                />
                <StatusDonutChart stats={dashboardStats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopServicesChart 
                  serviceBreakdown={serviceBreakdown} 
                  maxServiceCount={maxServiceCount}
                />
                <PerformanceInsight completionRate={completionRate} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Resign Confirmation Dialog */}
      <AlertDialog open={resignDialogOpen} onOpenChange={setResignDialogOpen}>
        <AlertDialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
          {/* Colored Header Banner */}
          <div className="relative pt-8 pb-6 px-6 bg-gradient-to-br from-red-500 to-red-600">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            {/* Icon */}
            <div className="relative flex justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <LogOut className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Title in Header */}
            <h2 className="text-white text-xl sm:text-2xl font-bold text-center mt-4">
              {staffT(locale, 'resign_dialog_title', {
                business: business?.name || staffT(locale, 'resign_dialog_default_business'),
              })}
            </h2>
          </div>
          
          {/* Content Area */}
          <div className="p-6 bg-card">
            {/* Warning Message */}
            <div className="flex items-start gap-3 p-3 rounded-lg mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium mb-1">{staffT(locale, 'resign_dialog_warning_title')}</p>
                <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400">
                  <li>{staffT(locale, 'resign_dialog_warning_remove_access')}</li>
                  <li>{staffT(locale, 'resign_dialog_warning_convert_client')}</li>
                  <li>{staffT(locale, 'resign_dialog_warning_logout')}</li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center mb-6">
              {staffT(locale, 'resign_dialog_hint')}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <AlertDialogCancel className="flex-1 h-12 px-6 rounded-xl font-semibold bg-muted hover:bg-muted/80 border-0">
                {staffT(locale, 'resign_dialog_stay')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResign}
                disabled={resigning}
                className="flex-1 h-12 px-6 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                {resigning ? (
                  <>
                    <div className={`w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ${isArabic ? 'ml-2' : 'mr-2'}`}></div>
                    {staffT(locale, 'resign_dialog_leaving')}
                  </>
                ) : (
                  <>
                    <LogOut className={`w-4 h-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {staffT(locale, 'resign_dialog_confirm_leave')}
                  </>
                )}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
