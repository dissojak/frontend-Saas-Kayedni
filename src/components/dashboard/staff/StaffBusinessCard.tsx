"use client";

import React from 'react';
import { Badge } from "@components/ui/badge";
import { Building2, Star, MapPin, Phone, Mail, Briefcase, Users } from "lucide-react";
import { BusinessInfo } from "../../../app/(pages)/shared/dashboard/types";
import { useLocale } from '@global/hooks/useLocale';
import { staffT } from '@/(pages)/(staff)/staff/i18n';

interface StaffBusinessCardProps {
  business: BusinessInfo;
  servicesCount: number;
  staffCount: number;
}

export function StaffBusinessCard({ business, servicesCount, staffCount }: StaffBusinessCardProps) {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white shadow-2xl ${isArabic ? 'text-right' : ''}`}
    >
      {/* Decorative gradient blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-500/30 via-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-violet-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Business Logo/Avatar */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/30">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
                {business.logo && !business.logo.includes('placeholder') ? (
                  <img src={business.logo} alt={business.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 sm:w-14 sm:h-14 text-teal-400" />
                )}
              </div>
            </div>
            
            {/* Rating Badge */}
            {business.rating !== null && business.rating !== undefined && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-lg text-white">
                  {typeof business.rating === 'number' ? business.rating.toFixed(1) : business.rating}
                </span>
                {business.reviewCount !== undefined && business.reviewCount > 0 && (
                  <span className="text-slate-400 text-sm">({business.reviewCount})</span>
                )}
              </div>
            )}
          </div>
          
          {/* Business Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-teal-400 text-sm font-medium uppercase tracking-wider">{staffT(locale, 'business_card_you_work_at')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
              {business.name}
            </h2>
            
            {business.category && (
              <Badge className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/30 mb-4 px-3 py-1">
                {business.category}
              </Badge>
            )}
            
            {/* Description */}
            {business.description && (
              <p className="text-slate-400 text-sm mb-4 max-w-xl line-clamp-2">
                {business.description}
              </p>
            )}
            
            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {business.location && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{staffT(locale, 'business_card_location')}</p>
                    <p className="text-sm text-white truncate">{business.location}</p>
                  </div>
                </div>
              )}
              {business.phone && (
                <a 
                  href={`tel:${business.phone}`} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{staffT(locale, 'business_card_phone')}</p>
                    <p className="text-sm text-white group-hover:text-teal-400 transition-colors">{business.phone}</p>
                  </div>
                </a>
              )}
              {business.email && (
                <a 
                  href={`mailto:${business.email}`} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group sm:col-span-2 lg:col-span-1"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{staffT(locale, 'business_card_email')}</p>
                    <p className="text-sm text-white group-hover:text-violet-400 transition-colors truncate">{business.email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Business Stats Row */}
            <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{servicesCount}</p>
                  <p className="text-xs text-slate-400">{staffT(locale, 'business_card_services')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{staffCount}</p>
                  <p className="text-xs text-slate-400">{staffT(locale, 'business_card_team_members')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
