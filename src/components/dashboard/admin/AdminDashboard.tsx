"use client";

import React from 'react';
import useAdminDashboard from './hooks/useAdminDashboard';
import AdminOverview from './components/AdminOverview';
import { useLocale } from '@global/hooks/useLocale';
import { adminT } from './i18n';
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";

export default function AdminDashboard() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const { user, systemStats, recentBusinesses, recentUsers } = useAdminDashboard();

  return (
    <div className="p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-admin">{adminT(locale, 'admin_dashboard')}</h1>
          <p className="text-gray-500">
            {adminT(locale, 'welcome_admin_name', {
              name: user?.name ?? '',
              role: adminT(locale, 'administrator'),
            })}
          </p>
        </div>
        <Button className="bg-admin hover:bg-admin-dark">{adminT(locale, 'system_settings_title')}</Button>
      </div>

      <AdminOverview stats={systemStats} />

      <Tabs defaultValue="businesses" className="space-y-4">
        <TabsList className="border-b w-full justify-start rounded-none">
          <TabsTrigger value="businesses" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">{adminT(locale, 'tab_businesses')}</TabsTrigger>
          <TabsTrigger value="users" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">{adminT(locale, 'tab_users')}</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">{adminT(locale, 'tab_analytics')}</TabsTrigger>
          <TabsTrigger value="billing" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">{adminT(locale, 'tab_billing')}</TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{adminT(locale, 'recent_businesses')}</CardTitle>
              <Button className="bg-admin hover:bg-admin-dark">{adminT(locale, 'add_business')}</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_business')}</th>
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_owner')}</th>
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_category')}</th>
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_staff')}</th>
                      <th className="pb-4 font-medium">{adminT(locale, 'table_status')}</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBusinesses.map((business) => (
                      <tr key={business.id} className="border-t">
                        <td className="py-4 pr-4">{business.name}</td>
                        <td className="py-4 pr-4">{business.owner}</td>
                        <td className="py-4 pr-4">{business.category}</td>
                        <td className="py-4 pr-4">{business.staff}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${business.status === adminT(locale, 'status_active') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {business.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button variant="outline" size="sm">{adminT(locale, 'view')}</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full">{adminT(locale, 'view_all_businesses')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{adminT(locale, 'recent_users')}</CardTitle>
              <Button className="bg-admin hover:bg-admin-dark">{adminT(locale, 'add_user')}</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_name')}</th>
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_email')}</th>
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_role')}</th>
                      <th className="pb-4 pr-4 font-medium">{adminT(locale, 'table_registered')}</th>
                      <th className="pb-4 font-medium">{adminT(locale, 'table_bookings')}</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="py-4 pr-4">{u.name}</td>
                        <td className="py-4 pr-4">{u.email}</td>
                        <td className="py-4 pr-4">{u.role}</td>
                        <td className="py-4 pr-4">{u.registered}</td>
                        <td className="py-4">{u.bookings}</td>
                        <td className="py-4 text-right">
                          <Button variant="outline" size="sm">{adminT(locale, 'view')}</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full">{adminT(locale, 'view_all_users')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{adminT(locale, 'system_analytics')}</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-gray-500">{adminT(locale, 'analytics_placeholder')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{adminT(locale, 'subscription_plans')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{adminT(locale, 'free_tier')}</h3>
                    <p className="text-sm text-gray-500">{adminT(locale, 'free_tier_desc')}</p>
                    <p className="font-bold mt-2">{adminT(locale, 'free_tier_price')}</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">{adminT(locale, 'edit')}</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button className="bg-admin hover:bg-admin-dark w-full mt-4">{adminT(locale, 'add_new_plan')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
