"use client";

import React from 'react';
import { Button } from "@components/ui/button";
import { LogOut } from "lucide-react";
import { useLocale } from '@global/hooks/useLocale';
import { staffT } from '@/(pages)/(staff)/staff/i18n';

interface LeaveBusinessSectionProps {
  businessName?: string;
  onLeaveClick: () => void;
}

export function LeaveBusinessSection({ businessName, onLeaveClick }: LeaveBusinessSectionProps) {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-rose-200/50 dark:border-rose-900/30 rounded-2xl p-6 ${isArabic ? 'text-right' : ''}`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/5 to-transparent rounded-bl-full"></div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center shrink-0">
            <LogOut className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{staffT(locale, 'leave_section_title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {staffT(locale, 'leave_section_desc', {
                business: businessName || staffT(locale, 'leave_section_default_business'),
              })}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-rose-300 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-400 shrink-0 rounded-xl px-5"
          onClick={onLeaveClick}
        >
          <LogOut className={`w-4 h-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {staffT(locale, 'leave_section_button')}
        </Button>
      </div>
    </div>
  );
}
