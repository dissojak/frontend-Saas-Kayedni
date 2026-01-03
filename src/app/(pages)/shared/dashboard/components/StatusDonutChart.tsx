import React from 'react';
import type { DashboardStats } from '../types';
import { PieChart } from 'lucide-react';

interface StatusDonutChartProps {
  stats: DashboardStats;
}

export function StatusDonutChart({ stats }: StatusDonutChartProps) {
  return (
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
  );
}
