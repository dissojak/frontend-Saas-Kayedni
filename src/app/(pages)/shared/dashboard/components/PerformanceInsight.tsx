import React from 'react';
import { Activity } from 'lucide-react';

interface PerformanceInsightProps {
  completionRate: number;
}

export function PerformanceInsight({ completionRate }: PerformanceInsightProps) {
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
          <h3 className="font-bold text-white text-lg mb-2">Performance Insight</h3>
          {completionRate >= 90 ? (
            <p className="text-slate-300 leading-relaxed">
              <span className="text-2xl mr-2">🎉</span>
              <span className="font-semibold text-teal-400">{completionRate}%</span> completion rate is outstanding! 
              You&apos;re delivering exceptional service quality. Keep up the amazing work!
            </p>
          ) : completionRate >= 70 ? (
            <p className="text-slate-300 leading-relaxed">
              <span className="text-2xl mr-2">👍</span>
              Your <span className="font-semibold text-cyan-400">{completionRate}%</span> completion rate is solid. 
              Focus on reducing no-shows by sending reminders to boost it even higher.
            </p>
          ) : (
            <p className="text-slate-300 leading-relaxed">
              <span className="text-2xl mr-2">💡</span>
              Your completion rate is <span className="font-semibold text-amber-400">{completionRate}%</span>. 
              Consider following up with clients before appointments to reduce cancellations and no-shows.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
