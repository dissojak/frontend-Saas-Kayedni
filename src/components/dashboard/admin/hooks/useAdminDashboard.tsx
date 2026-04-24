"use client";

import { useMemo } from 'react';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { useLocale } from '@global/hooks/useLocale';
import { adminLocaleTag, adminT } from '../i18n';

export default function useAdminDashboard() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const localeTag = adminLocaleTag(locale);

  const systemStats = useMemo(() => [
    {
      name: adminT(locale, 'stat_active_users'),
      value: '5,832',
      change: adminT(locale, 'change_from_last_month', { value: 12 }),
    },
    {
      name: adminT(locale, 'stat_businesses'),
      value: '847',
      change: adminT(locale, 'change_from_last_month', { value: 8 }),
    },
    {
      name: adminT(locale, 'stat_total_bookings'),
      value: '24,628',
      change: adminT(locale, 'change_from_last_month', { value: 18 }),
    },
    {
      name: adminT(locale, 'stat_revenue'),
      value: '$124,892',
      change: adminT(locale, 'change_from_last_month', { value: 15 }),
    },
  ], [locale]);

  const recentBusinesses = useMemo(() => [
    {
      id: '1',
      name: 'Style Studio',
      owner: 'Diana Prince',
      category: adminT(locale, 'category_barber'),
      staff: 4,
      status: adminT(locale, 'status_active'),
    },
    {
      id: '2',
      name: 'Tech Tutors',
      owner: 'Bruce Wayne',
      category: adminT(locale, 'category_education'),
      staff: 6,
      status: adminT(locale, 'status_active'),
    },
    {
      id: '3',
      name: 'GameZone',
      owner: 'Clark Kent',
      category: adminT(locale, 'category_gaming'),
      staff: 3,
      status: adminT(locale, 'status_pending'),
    },
    {
      id: '4',
      name: 'Fitness First',
      owner: 'Barry Allen',
      category: adminT(locale, 'category_fitness'),
      staff: 8,
      status: adminT(locale, 'status_active'),
    },
  ], [locale]);

  const recentUsers = useMemo(() => [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: adminT(locale, 'role_client'),
      registered: new Date('2023-05-15T00:00:00').toLocaleDateString(localeTag, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      bookings: 12,
    },
    {
      id: '2',
      name: 'Sarah Lee',
      email: 'sarah@example.com',
      role: adminT(locale, 'role_client'),
      registered: new Date('2023-05-17T00:00:00').toLocaleDateString(localeTag, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      bookings: 8,
    },
    {
      id: '3',
      name: 'Diana Prince',
      email: 'diana@stylestudio.com',
      role: adminT(locale, 'role_business'),
      registered: new Date('2023-04-28T00:00:00').toLocaleDateString(localeTag, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      bookings: 0,
    },
    {
      id: '4',
      name: 'Alex Morgan',
      email: 'alex@stylestudio.com',
      role: adminT(locale, 'role_staff'),
      registered: new Date('2023-04-30T00:00:00').toLocaleDateString(localeTag, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      bookings: 0,
    },
  ], [locale, localeTag]);

  return { user, systemStats, recentBusinesses, recentUsers } as const;
}
