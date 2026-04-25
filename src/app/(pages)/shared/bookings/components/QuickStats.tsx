import React from 'react';
import { useLocale } from '@global/hooks/useLocale';
import { businessBookingsT } from '@/(pages)/(business)/business/bookings/i18n';
import type { QuickStatsProps } from '../types/QuickStatsProps';

export const QuickStats: React.FC<QuickStatsProps> = ({
  todayCount,
  upcomingCount,
  completedCount
}) => {
  const { locale } = useLocale();

  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-2xl px-5 py-3">
        <p className="text-2xl sm:text-3xl font-bold text-primary">{todayCount}</p>
        <p className="text-xs text-primary/70 font-medium">{businessBookingsT(locale, 'quick_today')}</p>
      </div>
      <div className="bg-card border border-border rounded-2xl px-5 py-3">
        <p className="text-2xl sm:text-3xl font-bold text-foreground">{upcomingCount}</p>
        <p className="text-xs text-muted-foreground font-medium">{businessBookingsT(locale, 'quick_all_upcoming')}</p>
      </div>
      <div className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-5 py-3">
        <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">{businessBookingsT(locale, 'quick_completed')}</p>
      </div>
    </div>
  );
};
