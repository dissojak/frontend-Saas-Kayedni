"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchBookingsForStaff } from "../../../(business)/actions/backend";

// Import shared components, types, and hooks
import type { Booking } from '../../../shared/dashboard/types';
import { useDashboardStats } from '../../../shared/dashboard/hooks';
import {
  StatsCards,
  MonthlyBarChart,
  StatusDonutChart,
  TopServicesChart,
  PerformanceInsight
} from '../../../shared/dashboard/components';

export default function StaffStatsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Use shared hook for all calculations
  const { stats, monthlyData, serviceBreakdown, maxMonthlyTotal, maxServiceCount } = useDashboardStats(bookings);

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

          {/* Overview Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyBarChart monthlyData={monthlyData} maxMonthlyTotal={maxMonthlyTotal} />
            <StatusDonutChart stats={stats} />
          </div>

          {/* Top Services */}
          <TopServicesChart serviceBreakdown={serviceBreakdown} maxServiceCount={maxServiceCount} />

          {/* Performance Insight */}
          <PerformanceInsight completionRate={stats.completionRate} />

        </div>
      </div>
    </Layout>
  );
}
