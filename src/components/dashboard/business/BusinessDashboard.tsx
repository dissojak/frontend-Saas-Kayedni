"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Calendar, Users, Package, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { fetchBookingsForBusiness, fetchStaffByBusinessId, fetchServicesByBusinessId } from "../../../app/(pages)/(business)/actions/backend";

export default function BusinessDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalStaff: 0,
    totalServices: 0,
    monthlyRevenue: 0,
    completedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    console.log('[BusinessDashboard] Checking localStorage for user data...');
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    console.log('[BusinessDashboard] User data exists:', !!userData);
    console.log('[BusinessDashboard] Token exists:', !!token);
    
    if (!userData || !token) {
      console.error('[BusinessDashboard] Missing user data or token');
      setError('Please log in to access the dashboard. If you just logged in, please refresh the page.');
      setLoading(false);
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      console.log('[BusinessDashboard] Parsed user:', user);
      
      setUserName(user.name || 'Business Owner');
      
      // Check for businessId in user object
      if (user.businessId) {
        console.log('[BusinessDashboard] Found businessId:', user.businessId);
        setBusinessId(String(user.businessId));
      } else {
        console.warn('[BusinessDashboard] No businessId found in user object');
        setError('No business associated with this account. Please log out and log in again to refresh your session, or create a business first.');
        setLoading(false);
      }
    } catch (e) {
      console.error('[BusinessDashboard] Error parsing user data:', e);
      setError('Invalid user data. Please log in again.');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (businessId) {
      console.log('[BusinessDashboard] Loading dashboard data for business:', businessId);
      loadDashboardData();
    }
  }, [businessId]);

  const loadDashboardData = async () => {
    if (!businessId) {
      console.warn('[BusinessDashboard] loadDashboardData called without businessId');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || undefined;
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      console.log('[BusinessDashboard] Fetching data with params:', { businessId, from, to, hasToken: !!token });
      
      const [bookings, staff, services] = await Promise.all([
        fetchBookingsForBusiness(businessId, from, to, token),
        fetchStaffByBusinessId(businessId, token),
        fetchServicesByBusinessId(businessId, token),
      ]);

      console.log('[BusinessDashboard] Data fetched:', {
        bookingsCount: bookings.length,
        staffCount: staff.length,
        servicesCount: services.length,
      });

      const now = new Date();
      const upcoming = bookings.filter((b: any) => 
        new Date(b.date) >= now && !['cancelled', 'completed'].includes(b.status.toLowerCase())
      );
      const completed = bookings.filter((b: any) => b.status.toLowerCase() === 'completed');
      const revenue = completed.reduce((sum: number, b: any) => sum + (b.price || 0), 0);

      setStats({
        totalBookings: bookings.length,
        upcomingBookings: upcoming.length,
        totalStaff: staff.length,
        totalServices: services.length,
        monthlyRevenue: revenue,
        completedBookings: completed.length,
      });

      setRecentBookings(bookings.slice(0, 5));
      console.log('[BusinessDashboard] Dashboard data loaded successfully');
    } catch (error) {
      console.error('[BusinessDashboard] Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-business mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userName}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/business/bookings')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                <p className="text-sm text-green-600 mt-2">
                  {stats.upcomingBookings} upcoming
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/business/staff')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Staff Members</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStaff}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Active team
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/business/services')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Services</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalServices}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Offerings
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue (30 days)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${stats.monthlyRevenue.toFixed(2)}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stats.completedBookings} completed
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/business/bookings')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
                <p className="text-sm text-gray-500 mt-1">View and manage appointments</p>
              </div>
              <ArrowRight className="w-5 h-5 text-business" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/business/staff')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Manage Staff</h3>
                <p className="text-sm text-gray-500 mt-1">Add or remove team members</p>
              </div>
              <ArrowRight className="w-5 h-5 text-business" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/business/services')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Manage Services</h3>
                <p className="text-sm text-gray-500 mt-1">Create and edit offerings</p>
              </div>
              <ArrowRight className="w-5 h-5 text-business" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Recent Bookings</CardTitle>
          <Button 
            variant="outline" 
            onClick={() => router.push('/business/bookings')}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                    <p className="text-sm text-gray-600">
                      {booking.clientName} • {new Date(booking.date).toLocaleDateString()} {booking.startTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="font-semibold text-gray-900">${booking.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
