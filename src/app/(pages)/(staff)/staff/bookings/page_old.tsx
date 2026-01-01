
"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Calendar, Clock, User, DollarSign, Search, Filter, ArrowUpDown, XCircle, UserX } from "lucide-react";
import { fetchBookingsForStaff, updateBookingStatus } from "../../../(business)/actions/backend";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";

interface Booking {
  id: number;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  notes?: string;
  createdAt: string;
}

export default function StaffBookingsPage() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (user?.id) {
      console.log('[Staff Bookings Page] User detected:', user);
      console.log('[Staff Bookings Page] Staff ID:', user.id);
      loadBookings();
    } else {
      console.warn('[Staff Bookings Page] No user or user.id found');
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const loadBookings = async () => {
    if (!user?.id) {
      console.error('[Staff Bookings Page] Cannot load bookings - no user id');
      return;
    }
    
    setLoading(true);
    try {
      console.log('[Staff Bookings Page] Loading bookings for staffId:', user.id);
      console.log('[Staff Bookings Page] Using token:', token ? 'YES' : 'NO');
      
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 90 days ago
      const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 90 days ahead
      
      console.log('[Staff Bookings Page] Date range:', from, 'to', to);
      
      const data = await fetchBookingsForStaff(user.id, from, to, token || undefined);
      console.log('[Staff Bookings Page] Fetched bookings:', data);
      setBookings(data);
    } catch (error) {
      console.error('[Staff Bookings Page] Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        // Show closest (earliest) bookings first: ascending by datetime
        return new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime();
      } else if (sortBy === 'price') {
        return b.price - a.price;
      } else if (sortBy === 'client') {
        return a.clientName.localeCompare(b.clientName);
      }
      return 0;
    });

    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus, token || undefined);
      await loadBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleMarkNotShown = async (bookingId: number) => {
    if (!confirm('Mark this client as not shown? This will cancel the booking.')) return;
    
    try {
      await updateBookingStatus(bookingId, 'NO_SHOW', token || undefined);
      await loadBookings();
    } catch (error) {
      console.error('Failed to mark as not shown:', error);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await updateBookingStatus(bookingId, 'CANCELLED', token || undefined);
      await loadBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'no_show':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const upcomingBookings = filteredBookings.filter(b => 
    new Date(b.date) >= new Date() && !['cancelled', 'completed', 'no_show'].includes(b.status.toLowerCase())
  );
  
  const pastBookings = filteredBookings.filter(b => 
    new Date(b.date) < new Date() || ['completed', 'cancelled', 'no_show'].includes(b.status.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-staff mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings 🎯</h1>
              <p className="text-gray-600">Track your appointments and level up your schedule</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-2xl shadow-lg shadow-blue-100 px-6 py-4 border border-blue-100 hover:scale-105 transition-transform duration-200">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Total Bookings</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{bookings.length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200 px-6 py-4 hover:scale-105 transition-transform duration-200">
                <p className="text-xs text-blue-100 font-semibold uppercase mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-white">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 w-5 h-5 transition-colors" />
              <Input
                placeholder="Search bookings..."
                className="pl-12 border-2 border-gray-200 bg-white/80 backdrop-blur rounded-xl h-12 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-52 border-2 border-gray-200 bg-white/80 backdrop-blur rounded-xl h-12 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="confirmed">✅ Confirmed</SelectItem>
                <SelectItem value="completed">🎉 Completed</SelectItem>
                <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                <SelectItem value="no_show">👻 No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-52 border-2 border-gray-200 bg-white/80 backdrop-blur rounded-xl h-12 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">📅 Date</SelectItem>
                <SelectItem value="price">💰 Price</SelectItem>
                <SelectItem value="client">👤 Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto justify-start gap-6">
              <TabsTrigger value="upcoming" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 bg-transparent px-1 pb-3 text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 shadow-none">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 bg-transparent px-1 pb-3 text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 shadow-none">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3 mt-4">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming bookings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-base">
                              {booking.serviceName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">{booking.serviceName}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">#{booking.id}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(booking.status)} text-xs font-medium px-2.5 py-0.5`}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-6 mb-4">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Client</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{booking.clientName}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{booking.startTime} - {booking.endTime}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">${booking.price.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {booking.status.toLowerCase() === 'pending' && (
                            <Button
                              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg h-9 text-sm"
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            >
                              Confirm
                            </Button>
                          )}
                          {booking.status.toLowerCase() === 'confirmed' && (
                            <Button
                              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg h-9 text-sm"
                              onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                            >
                              Complete
                            </Button>
                          )}
                          {!['cancelled', 'completed', 'no_show'].includes(booking.status.toLowerCase()) && (
                            <>
                              <Button
                                variant="outline"
                                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg h-9 text-sm"
                                onClick={() => handleMarkNotShown(booking.id)}
                              >
                                Not Shown
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg h-9 text-sm"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>

                        {booking.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">Notes:</span> {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-3 mt-4">
              {pastBookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No past bookings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="bg-gray-50/50 rounded-lg shadow-sm border border-gray-200 opacity-70"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-base">
                              {booking.serviceName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-600">{booking.serviceName}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">#{booking.id}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(booking.status)} text-xs font-medium px-2.5 py-0.5 opacity-80`}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-6 mb-4">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Client</p>
                            </div>
                            <p className="text-sm font-medium text-gray-600">{booking.clientName}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                            </div>
                            <p className="text-sm font-medium text-gray-600">{new Date(booking.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                            </div>
                            <p className="text-sm font-medium text-gray-600">{booking.startTime} - {booking.endTime}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
                            </div>
                            <p className="text-sm font-medium text-gray-600">${booking.price.toFixed(2)}</p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-600">Notes:</span> {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
