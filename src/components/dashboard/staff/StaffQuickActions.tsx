"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Clock, BarChart3, ArrowRight } from "lucide-react";
import { useLocale } from '@global/hooks/useLocale';
import { staffT } from '@/(pages)/(staff)/staff/i18n';

interface StaffQuickActionsProps {
  completionRate: number;
  totalBookings: number;
  showingCharts?: boolean;
  onToggleCharts?: () => void;
}

export function StaffQuickActions({ completionRate, totalBookings, showingCharts = false, onToggleCharts }: StaffQuickActionsProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isArabic ? 'text-right' : ''}`}>
      {/* View Bookings */}
      <button
        onClick={() => router.push('/staff/bookings')}
        className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-cyan-300/50 dark:hover:border-cyan-700/50"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
          <CalendarDays className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{staffT(locale, 'quick_actions_bookings_title')}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{staffT(locale, 'quick_actions_bookings_desc')}</p>
        <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-semibold">
          <span>{staffT(locale, 'quick_actions_go_to_bookings')}</span>
          <ArrowRight
            className={`w-4 h-4 ${isArabic ? 'mr-1.5 rotate-180 group-hover:-translate-x-1.5' : 'ml-1.5 group-hover:translate-x-1.5'} transition-transform`}
          />
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
        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{staffT(locale, 'quick_actions_schedule_title')}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{staffT(locale, 'quick_actions_schedule_desc')}</p>
        <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-semibold">
          <span>{staffT(locale, 'quick_actions_view_schedule')}</span>
          <ArrowRight
            className={`w-4 h-4 ${isArabic ? 'mr-1.5 rotate-180 group-hover:-translate-x-1.5' : 'ml-1.5 group-hover:translate-x-1.5'} transition-transform`}
          />
        </div>
      </button>

      {/* Stats Overview / Toggle Charts */}
      <button
        onClick={() => onToggleCharts ? onToggleCharts() : router.push('/staff/stats')}
        className="group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 text-left hover:shadow-xl transition-all hover:border-violet-300/50 dark:hover:border-violet-700/50 sm:col-span-2 lg:col-span-1"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{staffT(locale, 'quick_actions_performance_title')}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {staffT(locale, 'quick_actions_performance_desc', {
            rate: completionRate,
            total: totalBookings,
          })}
        </p>
        <div className="flex items-center text-violet-600 dark:text-violet-400 text-sm font-semibold">
          <span>{showingCharts ? staffT(locale, 'quick_actions_hide_charts') : staffT(locale, 'quick_actions_view_charts')}</span>
          <ArrowRight
            className={`w-4 h-4 ${isArabic ? 'mr-1.5 rotate-180 group-hover:-translate-x-1.5' : 'ml-1.5 group-hover:translate-x-1.5'} transition-transform`}
          />
        </div>
      </button>
    </div>
  );
}
