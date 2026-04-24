"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Calendar, Settings, BarChart3, Bell } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { useLocale } from '@global/hooks/useLocale';
import { adminT } from '@components/dashboard/admin/i18n';

export default function AdminControlPanel() {
  const router = useRouter();
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      
      if (!storedUser || !token) {
        router.push('/admin/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      
      if (userData.role !== 'admin') {
        router.push('/admin/login');
        return;
      }

      setUser(userData);
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/admin/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{adminT(locale, 'loading')}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: adminT(locale, 'total_users'), value: '1,234', icon: Users, color: 'text-blue-600' },
    { title: adminT(locale, 'total_bookings'), value: '5,678', icon: Calendar, color: 'text-green-600' },
    { title: adminT(locale, 'active_businesses'), value: '89', icon: BarChart3, color: 'text-purple-600' },
    { title: adminT(locale, 'pending_reviews'), value: '23', icon: Bell, color: 'text-orange-600' },
  ];

  const quickActions = [
    {
      title: adminT(locale, 'manage_users_title'),
      href: '/admin/users',
      icon: Users,
      description: adminT(locale, 'manage_users_desc'),
    },
    {
      title: adminT(locale, 'view_analytics_title'),
      href: '/admin/analytics',
      icon: BarChart3,
      description: adminT(locale, 'view_analytics_desc'),
    },
    {
      title: adminT(locale, 'business_overview_title'),
      href: '/admin/businesses',
      icon: Shield,
      description: adminT(locale, 'business_overview_desc'),
    },
    {
      title: adminT(locale, 'system_settings_title'),
      href: '/admin/settings',
      icon: Settings,
      description: adminT(locale, 'system_settings_desc'),
    },
  ];

  const recentActivities = [
    {
      action: adminT(locale, 'activity_new_user_registered'),
      user: 'john.doe@example.com',
      time: adminT(locale, 'activity_time_5_minutes'),
    },
    {
      action: adminT(locale, 'activity_business_verified'),
      user: 'ABC Salon',
      time: adminT(locale, 'activity_time_1_hour'),
    },
    {
      action: adminT(locale, 'activity_booking_created'),
      user: 'jane.smith@example.com',
      time: adminT(locale, 'activity_time_2_hours'),
    },
    {
      action: adminT(locale, 'activity_payment_processed'),
      user: 'XYZ Spa',
      time: adminT(locale, 'activity_time_3_hours'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{adminT(locale, 'admin_control_panel')}</h1>
                <p className="text-sm text-gray-500">{adminT(locale, 'management_system_name')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                {adminT(locale, 'logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {adminT(locale, 'welcome_back_name', { name: user.name })}
          </h2>
          <p className="text-gray-600">
            {adminT(locale, 'control_panel_subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{adminT(locale, 'quick_actions')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(action.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <action.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{adminT(locale, 'recent_activity')}</CardTitle>
            <CardDescription>{adminT(locale, 'recent_activity_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
