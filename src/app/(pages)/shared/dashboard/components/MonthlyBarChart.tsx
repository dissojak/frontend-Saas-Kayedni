import React from 'react';
import type { MonthlyData } from '../types';
import { BarChart3 } from 'lucide-react';

interface MonthlyBarChartProps {
  monthlyData: MonthlyData[];
  maxMonthlyTotal: number;
}

export function MonthlyBarChart({ monthlyData, maxMonthlyTotal }: MonthlyBarChartProps) {
  // Don't render if no data
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white">Monthly Bookings</h3>
        </div>
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
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
  );
}
