"use client";

import React from 'react';
import { Calendar, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import { StaffStats } from "../../../app/(pages)/(staff)/staff/dashboard/types";
import { useLocale } from '@global/hooks/useLocale';
import { staffT } from '@/(pages)/(staff)/staff/i18n';

interface StaffQuickStatsProps {
  stats: StaffStats;
  completionRate: number;
}

export function StaffQuickStats({ stats, completionRate }: StaffQuickStatsProps) {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${isArabic ? 'text-right' : ''}`}>
      {/* Total Bookings */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-bl-full"></div>
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <TrendingUp className="w-4 h-4 text-teal-500" />
        </div>
        <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.totalBookings || 0}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{staffT(locale, 'quick_stats_total_bookings')}</p>
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
        <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.completedBookings || 0}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{staffT(locale, 'quick_stats_completed')}</p>
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
          {(stats.pendingBookings || 0) + (stats.confirmedBookings || 0)}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{staffT(locale, 'quick_stats_upcoming')}</p>
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
          {(stats.noShowBookings || 0) + (stats.cancelledBookings || 0)}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{staffT(locale, 'quick_stats_no_show_cancelled')}</p>
      </div>
    </div>
  );
}
