import React from 'react';
import type { QuickStatsProps } from '../types/QuickStatsProps';

export const QuickStats: React.FC<QuickStatsProps> = ({
  todayCount,
  upcomingCount,
  completedCount
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-2xl px-5 py-3">
        <p className="text-2xl sm:text-3xl font-bold text-primary">{todayCount}</p>
        <p className="text-xs text-primary/70 font-medium">Today</p>
      </div>
      <div className="bg-card border border-border rounded-2xl px-5 py-3">
        <p className="text-2xl sm:text-3xl font-bold text-foreground">{upcomingCount}</p>
        <p className="text-xs text-muted-foreground font-medium">All Upcoming</p>
      </div>
      <div className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-5 py-3">
        <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">Completed</p>
      </div>
    </div>
  );
};
