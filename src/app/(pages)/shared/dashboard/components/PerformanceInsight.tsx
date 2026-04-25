import React from 'react';
import { Activity } from 'lucide-react';
import { useLocale } from '@global/hooks/useLocale';
import { dashboardT } from '../i18n';

interface PerformanceInsightProps {
  completionRate: number;
}

export function PerformanceInsight({ completionRate }: Readonly<PerformanceInsightProps>) {
  const { locale } = useLocale();
  let insightKey: 'dashboard_insight_high' | 'dashboard_insight_mid' | 'dashboard_insight_low' =
    'dashboard_insight_low';

  if (completionRate >= 90) {
    insightKey = 'dashboard_insight_high';
  } else if (completionRate >= 70) {
    insightKey = 'dashboard_insight_mid';
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 dark:from-slate-900 dark:via-slate-950 dark:to-black rounded-2xl p-6 shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/30">
          <Activity className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg mb-2">{dashboardT(locale, 'dashboard_insight_title')}</h3>
          <p className="text-slate-300 leading-relaxed">
            {dashboardT(locale, insightKey, { rate: completionRate })}
          </p>
        </div>
      </div>
    </div>
  );
}
