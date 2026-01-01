"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { 
  ArrowLeft,
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchBookingsForStaff } from "../../../(business)/actions/backend";

// Custom color palette - sophisticated & unique
const COLORS = {
  completed: { 
    main: '#0d9488', // teal-600
    light: 'rgba(13, 148, 136, 0.12)',
    gradient: 'from-teal-500 to-cyan-400'
  },
  cancelled: { 
    main: '#dc2626', // red-600
    light: 'rgba(220, 38, 38, 0.12)',
    gradient: 'from-rose-500 to-pink-400'
  },
  noShow: { 
    main: '#d97706', // amber-600
    light: 'rgba(217, 119, 6, 0.12)',
    gradient: 'from-amber-500 to-orange-400'
  },
  upcoming: { 
    main: '#7c3aed', // violet-600
    light: 'rgba(124, 58, 237, 0.12)',
    gradient: 'from-violet-500 to-purple-400'
  },
  accent: {
    main: '#0891b2', // cyan-600
    light: 'rgba(8, 145, 178, 0.12)',
    gradient: 'from-cyan-500 to-sky-400'
  }
};

interface Booking {
  id: number;
  serviceName: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
}

interface MonthlyData {
  month: string;
  completed: number;
  cancelled: number;
  noShow: number;
  upcoming: number;
  total: number;
}

export default function StaffStatsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id && token) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user?.id, token]);

  const loadBookings = async () => {
    if (!user?.id || !token) return;

    try {
      setLoading(true);
      const data = await fetchBookingsForStaff(user.id, undefined, undefined, token);
      if (Array.isArray(data)) {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
    const noShow = bookings.filter(b => b.status === 'NO_SHOW').length;
    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const total = bookings.length;

    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + (b.price || 0), 0);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const cancellationRate = total > 0 ? Math.round(((cancelled + noShow) / total) * 100) : 0;

    return {
      completed,
      cancelled,
      noShow,
      pending,
      confirmed,
      total,
      totalRevenue,
      completionRate,
      cancellationRate,
      upcoming: pending + confirmed
    };
  }, [bookings]);

  // Calculate monthly data for the last 6 months
  const monthlyData = useMemo(() => {
    const months: MonthlyData[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const month = date.getMonth();

      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
      });

      months.push({
        month: monthName,
        completed: monthBookings.filter(b => b.status === 'COMPLETED').length,
        cancelled: monthBookings.filter(b => b.status === 'CANCELLED').length,
        noShow: monthBookings.filter(b => b.status === 'NO_SHOW').length,
        upcoming: monthBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length,
        total: monthBookings.length
      });
    }

    return months;
  }, [bookings]);

  // Get max value for chart scaling
  const maxMonthlyTotal = Math.max(...monthlyData.map(m => m.total), 1);

  // Calculate service breakdown
  const serviceBreakdown = useMemo(() => {
    const services: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.status === 'COMPLETED') {
        services[b.serviceName] = (services[b.serviceName] || 0) + 1;
      }
    });
    
    return Object.entries(services)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings]);

  const maxServiceCount = Math.max(...serviceBreakdown.map(s => s.count), 1);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your stats...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100/50 dark:from-slate-950 dark:via-background dark:to-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/staff/dashboard')}
                className="rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  Performance Stats
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Your booking analytics and insights</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-teal-500 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50 px-4 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Analytics
            </Badge>
          </div>

          {/* Overview Stats Cards - Glass Morphism Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Completion Rate */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Target className="w-5 h-5 text-white" />
                </div>
                {stats.completionRate >= 80 ? (
                  <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Great!</span>
                  </div>
                ) : (
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.completionRate}%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completion Rate</p>
            </div>

            {/* Total Revenue */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
            </div>

            {/* Total Completed */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.completed}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            </div>

            {/* Cancellation Rate */}
            <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-400/20 to-transparent rounded-bl-full"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.cancellationRate}%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cancellation Rate</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Monthly Bookings Bar Chart - Modern Style */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Monthly Bookings</h3>
              </div>
              
              <div className="space-y-4">
                {monthlyData.map((month, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium w-12">{month.month}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{month.total}</span>
                    </div>
                    <div className="h-9 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl overflow-hidden flex relative group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/60 transition-colors">
                      {/* Completed - Teal gradient */}
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-700 ease-out relative"
                        style={{ width: `${(month.completed / maxMonthlyTotal) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20"></div>
                      </div>
                      {/* Cancelled - Rose gradient */}
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-700 ease-out relative"
                        style={{ width: `${(month.cancelled / maxMonthlyTotal) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20"></div>
                      </div>
                      {/* No Show - Amber gradient */}
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700 ease-out relative"
                        style={{ width: `${(month.noShow / maxMonthlyTotal) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20"></div>
                      </div>
                      {/* Upcoming - Violet gradient */}
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700 ease-out relative"
                        style={{ width: `${(month.upcoming / maxMonthlyTotal) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend - Pill Style */}
              <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-800/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-400"></div>
                  <span className="text-xs font-medium text-teal-700 dark:text-teal-400">Completed</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-400"></div>
                  <span className="text-xs font-medium text-rose-700 dark:text-rose-400">Cancelled</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400"></div>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">No Show</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200/50 dark:border-violet-800/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-400"></div>
                  <span className="text-xs font-medium text-violet-700 dark:text-violet-400">Upcoming</span>
                </div>
              </div>
            </div>

            {/* Status Distribution - Radial Style */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Status Distribution</h3>
              </div>

              {/* Visual Donut Chart - Enhanced */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-52 h-52">
                  {/* Decorative rings */}
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-slate-200/40 dark:border-slate-700/40"></div>
                  
                  {/* SVG Donut Chart */}
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                    {/* Background circle with subtle gradient */}
                    <defs>
                      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                      <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                      <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-slate-100 dark:text-slate-800"
                    />
                    {/* Completed segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#tealGrad)"
                      strokeWidth="10"
                      strokeDasharray={`${(stats.completed / Math.max(stats.total, 1)) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      filter="url(#glow)"
                    />
                    {/* Cancelled segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#roseGrad)"
                      strokeWidth="10"
                      strokeDasharray={`${(stats.cancelled / Math.max(stats.total, 1)) * 251.2} 251.2`}
                      strokeDashoffset={`${-(stats.completed / Math.max(stats.total, 1)) * 251.2}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      filter="url(#glow)"
                    />
                    {/* No Show segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#amberGrad)"
                      strokeWidth="10"
                      strokeDasharray={`${(stats.noShow / Math.max(stats.total, 1)) * 251.2} 251.2`}
                      strokeDashoffset={`${-((stats.completed + stats.cancelled) / Math.max(stats.total, 1)) * 251.2}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      filter="url(#glow)"
                    />
                    {/* Upcoming segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#violetGrad)"
                      strokeWidth="10"
                      strokeDasharray={`${(stats.upcoming / Math.max(stats.total, 1)) * 251.2} 251.2`}
                      strokeDashoffset={`${-((stats.completed + stats.cancelled + stats.noShow) / Math.max(stats.total, 1)) * 251.2}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      filter="url(#glow)"
                    />
                  </svg>
                  
                  {/* Center content - enhanced */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">{stats.total}</span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</span>
                  </div>
                </div>
              </div>

              {/* Stats breakdown - Card style */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 rounded-xl border border-teal-100 dark:border-teal-900/50 group hover:shadow-md transition-shadow">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30"></div>
                  <div>
                    <p className="text-base font-bold text-slate-800 dark:text-white">{stats.completed}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 rounded-xl border border-violet-100 dark:border-violet-900/50 group hover:shadow-md transition-shadow">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30"></div>
                  <div>
                    <p className="text-base font-bold text-slate-800 dark:text-white">{stats.upcoming}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Upcoming</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 rounded-xl border border-rose-100 dark:border-rose-900/50 group hover:shadow-md transition-shadow">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30"></div>
                  <div>
                    <p className="text-base font-bold text-slate-800 dark:text-white">{stats.cancelled}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Cancelled</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-xl border border-amber-100 dark:border-amber-900/50 group hover:shadow-md transition-shadow">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 shadow-lg shadow-amber-500/30"></div>
                  <div>
                    <p className="text-base font-bold text-slate-800 dark:text-white">{stats.noShow}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">No Show</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Services - Enhanced */}
          {serviceBreakdown.length > 0 && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">Top Services (Completed)</h3>
              </div>

              <div className="space-y-5">
                {serviceBreakdown.map((service, index) => {
                  // Different gradient for each rank
                  const gradients = [
                    'from-teal-500 via-cyan-500 to-sky-500',
                    'from-violet-500 via-purple-500 to-fuchsia-500',
                    'from-amber-500 via-orange-500 to-red-400',
                    'from-rose-500 via-pink-500 to-fuchsia-400',
                    'from-cyan-500 via-sky-500 to-blue-500'
                  ];
                  const badgeColors = [
                    'bg-gradient-to-br from-teal-500 to-cyan-500 shadow-teal-500/40',
                    'bg-gradient-to-br from-violet-500 to-purple-500 shadow-violet-500/40',
                    'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/40',
                    'bg-gradient-to-br from-rose-500 to-pink-500 shadow-rose-500/40',
                    'bg-gradient-to-br from-cyan-500 to-sky-500 shadow-cyan-500/40'
                  ];
                  
                  return (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-lg ${badgeColors[index]} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{service.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{service.count} bookings</span>
                      </div>
                      <div className="h-3 bg-slate-100/80 dark:bg-slate-800/60 rounded-full overflow-hidden group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/60 transition-colors">
                        <div 
                          className={`h-full bg-gradient-to-r ${gradients[index]} rounded-full transition-all duration-700 ease-out relative`}
                          style={{ width: `${(service.count / maxServiceCount) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/30 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Performance Insight - Enhanced */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 dark:from-slate-900 dark:via-slate-950 dark:to-black rounded-2xl p-6 shadow-xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/30">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Performance Insight</h3>
                {stats.completionRate >= 90 ? (
                  <p className="text-slate-300 leading-relaxed">
                    <span className="text-2xl mr-2">🎉</span>
                    <span className="font-semibold text-teal-400">{stats.completionRate}%</span> completion rate is outstanding! 
                    You&apos;re delivering exceptional service quality. Keep up the amazing work!
                  </p>
                ) : stats.completionRate >= 70 ? (
                  <p className="text-slate-300 leading-relaxed">
                    <span className="text-2xl mr-2">👍</span>
                    Your <span className="font-semibold text-cyan-400">{stats.completionRate}%</span> completion rate is solid. 
                    Focus on reducing no-shows by sending reminders to boost it even higher.
                  </p>
                ) : (
                  <p className="text-slate-300 leading-relaxed">
                    <span className="text-2xl mr-2">💡</span>
                    Your completion rate is <span className="font-semibold text-amber-400">{stats.completionRate}%</span>. 
                    Consider following up with clients before appointments to reduce cancellations and no-shows.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
