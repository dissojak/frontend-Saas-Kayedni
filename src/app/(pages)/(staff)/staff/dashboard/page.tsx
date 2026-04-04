"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
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
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@global/hooks/use-toast";
import { fetchStaffStats, staffResignFromBusiness, fetchBusinessById, fetchBusinessImages, fetchServicesByBusinessId, fetchStaffByBusinessId, fetchCurrentStaffInfo, fetchBookingsForStaff } from "../../../(business)/actions/backend";
import { Booking, BusinessImage, BusinessInfo } from "../../../shared/dashboard/types";
import { useDashboardStats } from "../../../shared/dashboard/hooks";
import { 
  StatsCards, 
  MonthlyBarChart, 
  StatusDonutChart, 
  TopServicesChart, 
  PerformanceInsight 
} from "../../../shared/dashboard/components";
import { StaffStats } from "./types";
import { 
  StaffBusinessCard,
  StaffQuickStats,
  StaffQuickActions,
  StaffServicesSection,
  LeaveBusinessSection
} from "@components/dashboard/staff";

export default function StaffWorkspacePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
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

  // Use shared dashboard hook for analytics
  const { stats: dashboardStats, monthlyData, serviceBreakdown, maxMonthlyTotal, maxServiceCount } = useDashboardStats(bookings);

  useEffect(() => {
    if (user?.id && token) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user?.id, token]);

  const loadData = async () => {
    if (!user?.id || !token) return;

    try {
      setLoading(true);
      
      // Load stats
      const statsData = await fetchStaffStats(user.id, token);
      setStats(statsData);

      console.log('Staff Dashboard - User:', user);
      console.log('Staff Dashboard - BusinessId from user:', user.businessId);

      // Try to get businessId from user object first, then fallback to API
      let businessId = user.businessId;
      
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
          fetchBookingsForStaff(user.id, undefined, undefined, token)
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
  };

  const handleResign = async () => {
    if (!user?.id) {
      toast({
        variant: "error",
        title: "Error",
        description: "User information not found. Please try logging in again.",
      });
      return;
    }

    // Get token and businessId
    const authToken = token || localStorage.getItem('token') || localStorage.getItem('accessToken');
    let businessId = user.businessId || business?.id;

    if (!authToken) {
      toast({
        variant: "error",
        title: "Authentication required",
        description: "Please log in again to continue.",
      });
      return;
    }

    if (!businessId) {
      toast({
        variant: "error",
        title: "No business found",
        description: "You are not currently linked to any business.",
      });
      return;
    }

    try {
      setResigning(true);
      const response = await staffResignFromBusiness(String(businessId), String(user.id), authToken);
      
      // Show success toast
      toast({
        variant: "success",
        title: "Successfully resigned",
        description: response.message || "You have left the business. You will now be logged out.",
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
        title: "Failed to resign",
        description: error.message || "Unable to leave the business. Please try again.",
      });
      setResigning(false);
    } finally {
      setResignDialogOpen(false);
    }
  };

  const completionRate = stats && stats.totalBookings > 0 
    ? Math.round((stats.completedBookings / stats.totalBookings) * 100) 
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Loading your workspace...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                My Workspace
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'Staff'}!</p>
            </div>
            <Badge className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-teal-500 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50 px-4 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Staff Member
            </Badge>
          </div>

          {/* Debug: No business linked message */}
          {!business && !loading && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">No Business Linked</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Your account is not currently linked to a business. Please contact your employer or log out and log back in to refresh your account data.
                  </p>
                  {user?.businessId && (
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                      Business ID found: {user.businessId} (loading may have failed)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Business Card */}
          {business && (
            <StaffBusinessCard 
              business={business}
              servicesCount={servicesCount}
              staffCount={staffCount}
            />
          )}

          {/* Business Image Gallery */}
          {businessImages.length > 0 && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Business Gallery</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                  {activeImageIndex + 1} / {businessImages.length}
                </span>
              </div>
              
              {/* Main Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                <img 
                  src={businessImages[activeImageIndex]?.imageUrl} 
                  alt={`${business?.name} - ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {businessImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex(prev => prev === 0 ? businessImages.length - 1 : prev - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(prev => prev === businessImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              {businessImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {businessImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(index)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === activeImageIndex 
                          ? 'border-teal-500 ring-2 ring-teal-500/30' 
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <img 
                        src={img.imageUrl} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          {stats && <StaffQuickStats stats={stats} completionRate={completionRate} />}

          {/* Quick Actions */}
          <StaffQuickActions 
            completionRate={completionRate}
            totalBookings={stats?.totalBookings || 0}
            showingCharts={showCharts}
            onToggleCharts={() => setShowCharts(!showCharts)}
          />

          {/* Analytics Section - Using Shared Dashboard Components */}
          {showCharts && bookings.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowCharts(false)}
                  className="rounded-xl"
                >
                  Hide Charts
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

          {/* Services Management */}
          <StaffServicesSection servicesCount={servicesCount} />

          {/* Leave Business */}
          <LeaveBusinessSection
            businessName={business?.name}
            onLeaveClick={() => setResignDialogOpen(true)}
          />

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
              Leave {business?.name || 'Business'}?
            </h2>
          </div>
          
          {/* Content Area */}
          <div className="p-6 bg-card">
            {/* Warning Message */}
            <div className="flex items-start gap-3 p-3 rounded-lg mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium mb-1">This action will:</p>
                <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400">
                  <li>Remove your staff access to this business</li>
                  <li>Convert your account to a regular client</li>
                  <li>Log you out of your current session</li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center mb-6">
              You can still book services as a client after leaving.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <AlertDialogCancel className="flex-1 h-12 px-6 rounded-xl font-semibold bg-muted hover:bg-muted/80 border-0">
                No, Stay
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResign}
                disabled={resigning}
                className="flex-1 h-12 px-6 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                {resigning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Leaving...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Yes, Leave
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
