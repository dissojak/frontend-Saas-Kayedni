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
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Star,
  LogOut,
  CalendarDays,
  BarChart3,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Scissors,
  Plus,
  Settings,
  Eye
} from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchStaffStats, staffResignFromBusiness, fetchBusinessById, fetchBusinessImages, fetchServicesByBusinessId, fetchStaffByBusinessId, fetchCurrentStaffInfo } from "../../../(business)/actions/backend";

interface StaffStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
}

interface BusinessImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

interface BusinessInfo {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  category?: string;
  location?: string;
  phone?: string;
  email?: string;
  rating?: number | string | null;
  reviewCount?: number;
}

export default function StaffWorkspacePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [businessImages, setBusinessImages] = useState<BusinessImage[]>([]);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resignDialogOpen, setResignDialogOpen] = useState(false);
  const [resigning, setResigning] = useState(false);

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
        const [businessData, images, services, staff] = await Promise.all([
          fetchBusinessById(businessId),
          fetchBusinessImages(businessId),
          fetchServicesByBusinessId(businessId, token),
          fetchStaffByBusinessId(businessId, token)
        ]);
        
        console.log('Business data received:', businessData);
        console.log('Images received:', images);
        console.log('Services received:', services);
        console.log('Staff received:', staff);
        
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
    if (!user?.id || !user?.businessId || !token) return;

    try {
      setResigning(true);
      await staffResignFromBusiness(user.businessId, user.id, token);
      
      // Log out and redirect to home after resignation
      logout();
      router.push('/');
    } catch (error) {
      console.error('Error resigning from business:', error);
      alert('Failed to resign. Please try again.');
    } finally {
      setResigning(false);
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

          {/* Business Card - Premium Hero Style with Glass Morphism */}
          {business && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-2xl">
              {/* Decorative gradient blurs */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-500/30 via-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-violet-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Business Logo/Avatar */}
                  <div className="flex flex-col items-center lg:items-start gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/30">
                      <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
                        {business.logo && !business.logo.includes('placeholder') ? (
                          <img src={business.logo} alt={business.name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          <Building2 className="w-12 h-12 sm:w-14 sm:h-14 text-teal-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Rating Badge */}
                    {business.rating !== null && business.rating !== undefined && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-lg text-white">
                          {typeof business.rating === 'number' ? business.rating.toFixed(1) : business.rating}
                        </span>
                        {business.reviewCount !== undefined && business.reviewCount > 0 && (
                          <span className="text-slate-400 text-sm">({business.reviewCount})</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Business Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-teal-400 text-sm font-medium uppercase tracking-wider">You work at</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                      {business.name}
                    </h2>
                    
                    {business.category && (
                      <Badge className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30 mb-4 px-3 py-1">
                        {business.category}
                      </Badge>
                    )}
                    
                    {/* Description */}
                    {business.description && (
                      <p className="text-slate-400 text-sm mb-4 max-w-xl line-clamp-2">
                        {business.description}
                      </p>
                    )}
                    
                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      {business.location && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                            <p className="text-sm text-white truncate">{business.location}</p>
                          </div>
                        </div>
                      )}
                      {business.phone && (
                        <a 
                          href={`tel:${business.phone}`} 
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
                            <p className="text-sm text-white group-hover:text-teal-400 transition-colors">{business.phone}</p>
                          </div>
                        </a>
                      )}
                      {business.email && (
                        <a 
                          href={`mailto:${business.email}`} 
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group sm:col-span-2 lg:col-span-1"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                            <p className="text-sm text-white group-hover:text-violet-400 transition-colors truncate">{business.email}</p>
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Business Stats Row */}
                    <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">{servicesCount}</p>
                          <p className="text-xs text-slate-400">Services</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">{staffCount}</p>
                          <p className="text-xs text-slate-400">Staff Members</p>
                        </div>
                      </div>
                      {business.reviewCount !== undefined && business.reviewCount > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-white">{business.reviewCount}</p>
                            <p className="text-xs text-slate-400">Reviews</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

          {/* Quick Stats Grid - Glass Morphism Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Bookings */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.totalBookings || 0}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Bookings</p>
            </div>

            {/* Completed */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/40 px-2.5 py-1 rounded-full">
                  {completionRate}%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.completedBookings || 0}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            </div>

            {/* Upcoming (Pending + Confirmed) */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {(stats?.pendingBookings || 0) + (stats?.confirmedBookings || 0)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming</p>
            </div>

            {/* No Shows / Cancelled */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {(stats?.noShowBookings || 0) + (stats?.cancelledBookings || 0)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">No Show / Cancelled</p>
            </div>
          </div>

          {/* Quick Actions - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* View Bookings */}
            <button
              onClick={() => router.push('/staff/bookings')}
              className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-cyan-300/50 dark:hover:border-cyan-700/50"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">My Bookings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">View and manage all your appointments</p>
              <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-semibold">
                <span>Go to bookings</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>

            {/* View Schedule */}
            <button
              onClick={() => router.push('/staff/schedule')}
              className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-teal-300/50 dark:hover:border-teal-700/50"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">My Schedule</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Manage your availability and working hours</p>
              <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-semibold">
                <span>View schedule</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>

            {/* Stats Overview */}
            <button
              onClick={() => router.push('/staff/stats')}
              className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-violet-300/50 dark:hover:border-violet-700/50 sm:col-span-2 lg:col-span-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">Performance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {completionRate}% completion rate • {stats?.totalBookings || 0} total bookings
              </p>
              <div className="flex items-center text-violet-600 dark:text-violet-400 text-sm font-semibold">
                <span>View charts</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Services Management Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Services Management</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage services you provide</p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/staff/services/create')}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Service
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* View All Business Services */}
              <button
                onClick={() => router.push('/staff/services')}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-left hover:shadow-lg transition-all hover:border-cyan-300/50 dark:hover:border-cyan-700/50"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-3 shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-white mb-1">All Services</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">View all {servicesCount} business services</p>
                <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-xs font-medium">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* My Services */}
              <button
                onClick={() => router.push('/staff/services/my-services')}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-left hover:shadow-lg transition-all hover:border-emerald-300/50 dark:hover:border-emerald-700/50"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-white mb-1">My Services</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Services you currently provide</p>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <span>View & Edit</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Create New Service */}
              <button
                onClick={() => router.push('/staff/services/create')}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-left hover:shadow-lg transition-all hover:border-violet-300/50 dark:hover:border-violet-700/50"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-3 shadow-md shadow-violet-500/20 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-white mb-1">New Service</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Create a custom service</p>
                <div className="flex items-center text-violet-600 dark:text-violet-400 text-xs font-medium">
                  <span>Create</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          {/* Leave Business Section - Subtle Warning Style */}
          <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-rose-200/50 dark:border-rose-900/30 rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/5 to-transparent rounded-bl-full"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center shrink-0">
                  <LogOut className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Leave This Business</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    If you wish to leave {business?.name || 'this business'}, you can resign from your staff position. 
                    You&apos;ll become a regular client.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-rose-300 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-400 shrink-0 rounded-xl px-5"
                onClick={() => setResignDialogOpen(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Business
              </Button>
            </div>
          </div>

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
