"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@components/ui/button";
import { Scissors, Eye, Plus, ArrowRight } from "lucide-react";
import { useLocale } from '@global/hooks/useLocale';
import { staffT } from '@/(pages)/(staff)/staff/i18n';

interface StaffServicesSectionProps {
  servicesCount: number;
}

export function StaffServicesSection({ servicesCount }: StaffServicesSectionProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6 shadow-lg ${isArabic ? 'text-right' : ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">{staffT(locale, 'services_section_title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{staffT(locale, 'services_section_subtitle')}</p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/staff/services/create')}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 rounded-xl"
        >
          <Plus className={`w-4 h-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
          {staffT(locale, 'services_section_create_service')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* View All Business Services */}
        <button
          onClick={() => router.push('/staff/services')}
          className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-left hover:shadow-lg transition-all hover:border-cyan-300/50 dark:hover:border-cyan-700/50"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-3 shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-white mb-1">{staffT(locale, 'services_section_all_services')}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            {staffT(locale, 'services_section_all_services_desc', { count: servicesCount })}
          </p>
          <div className="flex items-center text-cyan-600 dark:text-cyan-400 text-xs font-medium">
            <span>{staffT(locale, 'services_section_browse')}</span>
            <ArrowRight
              className={`w-3 h-3 ${isArabic ? 'mr-1 rotate-180 group-hover:-translate-x-1' : 'ml-1 group-hover:translate-x-1'} transition-transform`}
            />
          </div>
        </button>

        {/* My Services */}
        <button
          onClick={() => router.push('/staff/services/my-services')}
          className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-left hover:shadow-lg transition-all hover:border-emerald-300/50 dark:hover:border-emerald-700/50"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-white mb-1">{staffT(locale, 'services_section_my_services')}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{staffT(locale, 'services_section_my_services_desc')}</p>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span>{staffT(locale, 'services_section_view_edit')}</span>
            <ArrowRight
              className={`w-3 h-3 ${isArabic ? 'mr-1 rotate-180 group-hover:-translate-x-1' : 'ml-1 group-hover:translate-x-1'} transition-transform`}
            />
          </div>
        </button>

        {/* Create New Service */}
        <button
          onClick={() => router.push('/staff/services/create')}
          className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-left hover:shadow-lg transition-all hover:border-violet-300/50 dark:hover:border-violet-700/50"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-3 shadow-md shadow-violet-500/20 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-white mb-1">{staffT(locale, 'services_section_new_service')}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{staffT(locale, 'services_section_new_service_desc')}</p>
          <div className="flex items-center text-violet-600 dark:text-violet-400 text-xs font-medium">
            <span>{staffT(locale, 'services_section_create')}</span>
            <ArrowRight
              className={`w-3 h-3 ${isArabic ? 'mr-1 rotate-180 group-hover:-translate-x-1' : 'ml-1 group-hover:translate-x-1'} transition-transform`}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
