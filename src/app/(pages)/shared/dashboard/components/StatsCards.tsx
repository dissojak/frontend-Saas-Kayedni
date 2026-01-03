import React from 'react';
import type { DashboardStats } from '../types';
import { CheckCircle, XCircle, Target, Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
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
  );
}
