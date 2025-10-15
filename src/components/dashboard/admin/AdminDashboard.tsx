"use client";

import React from 'react';
import useAdminDashboard from './hooks/useAdminDashboard';
import AdminOverview from './components/AdminOverview';
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";

export default function AdminDashboard() {
  const { user, systemStats, recentBusinesses, recentUsers } = useAdminDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-admin">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name} (Administrator)</p>
        </div>
        <Button className="bg-admin hover:bg-admin-dark">System Settings</Button>
      </div>

      <AdminOverview stats={systemStats} />

      <Tabs defaultValue="businesses" className="space-y-4">
        <TabsList className="border-b w-full justify-start rounded-none">
          <TabsTrigger value="businesses" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">Businesses</TabsTrigger>
          <TabsTrigger value="users" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">Users</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">Analytics</TabsTrigger>
          <TabsTrigger value="billing" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Businesses</CardTitle>
              <Button className="bg-admin hover:bg-admin-dark">Add Business</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">Business</th>
                      <th className="pb-4 pr-4 font-medium">Owner</th>
                      <th className="pb-4 pr-4 font-medium">Category</th>
                      <th className="pb-4 pr-4 font-medium">Staff</th>
                      <th className="pb-4 font-medium">Status</th>
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
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${business.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {business.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full">View All Businesses</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Users</CardTitle>
              <Button className="bg-admin hover:bg-admin-dark">Add User</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">Name</th>
                      <th className="pb-4 pr-4 font-medium">Email</th>
                      <th className="pb-4 pr-4 font-medium">Role</th>
                      <th className="pb-4 pr-4 font-medium">Registered</th>
                      <th className="pb-4 font-medium">Bookings</th>
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
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full">View All Users</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Analytics charts will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Free Tier</h3>
                    <p className="text-sm text-gray-500">Basic booking functionality</p>
                    <p className="font-bold mt-2">$0 / month</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button className="bg-admin hover:bg-admin-dark w-full mt-4">Add New Plan</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
