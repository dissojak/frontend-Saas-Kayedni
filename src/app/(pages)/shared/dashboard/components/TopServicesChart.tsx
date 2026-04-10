import React from 'react';
import type { ServiceBreakdown } from '../types';
import { Award } from 'lucide-react';
import { useLocale } from '@global/hooks/useLocale';
import { dashboardT } from '../i18n';

interface TopServicesChartProps {
  serviceBreakdown: ServiceBreakdown[];
  maxServiceCount: number;
}

export function TopServicesChart({ serviceBreakdown, maxServiceCount }: Readonly<TopServicesChartProps>) {
  const { locale } = useLocale();

  if (serviceBreakdown.length === 0) {
    return null;
  }

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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Award className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-white">{dashboardT(locale, 'dashboard_chart_top_services_completed')}</h3>
      </div>

      <div className="space-y-5">
        {serviceBreakdown.map((service, index) => (
          <div key={service.name} className="group">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg ${badgeColors[index]} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{service.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {dashboardT(locale, 'dashboard_chart_bookings_count', { count: service.count })}
              </span>
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
        ))}
      </div>
    </div>
  );
}
