"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Calendar, Clock, User, DollarSign, Search, Filter, ArrowUpDown } from "lucide-react";
import { fetchBookingsForBusiness, updateBookingStatus, cancelBooking } from "../../actions/backend";

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

export default function BusinessBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    // Get businessId from localStorage (user's business)
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.businessId) {
        setBusinessId(user.businessId);
      }
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      loadBookings();
    }
  }, [businessId]);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const loadBookings = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 90 days ago
      const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 90 days ahead
      
      const data = await fetchBookingsForBusiness(businessId, from, to, token);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
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
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.staffName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date + ' ' + b.startTime).getTime() - new Date(a.date + ' ' + a.startTime).getTime();
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
      const token = localStorage.getItem('token');
      await updateBookingStatus(bookingId, newStatus, token);
      await loadBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await cancelBooking(bookingId, token);
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
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const upcomingBookings = filteredBookings.filter(b => 
    new Date(b.date) >= new Date() && !['cancelled', 'completed'].includes(b.status.toLowerCase())
  );
  
  const pastBookings = filteredBookings.filter(b => 
    new Date(b.date) < new Date() || ['completed', 'cancelled'].includes(b.status.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-business mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600 mt-1">Manage all your appointments and reservations</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {bookings.length} Total
            </Badge>
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              {upcomingBookings.length} Upcoming
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by client, service, or staff..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="client">Sort by Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No upcoming bookings found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{booking.serviceName}</h3>
                              <p className="text-sm text-gray-500 mt-1">Booking ID: #{booking.id}</p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center text-gray-700">
                              <User className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">{booking.clientName}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <User className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">Staff: {booking.staffName}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Calendar className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clock className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <DollarSign className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm font-semibold">${booking.price.toFixed(2)}</span>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-600"><strong>Notes:</strong> {booking.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 md:w-48">
                          {booking.status.toLowerCase() === 'pending' && (
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            >
                              Confirm
                            </Button>
                          )}
                          {booking.status.toLowerCase() === 'confirmed' && (
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                            >
                              Mark Complete
                            </Button>
                          )}
                          {!['cancelled', 'completed'].includes(booking.status.toLowerCase()) && (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No past bookings found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="opacity-90">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{booking.serviceName}</h3>
                              <p className="text-sm text-gray-500 mt-1">Booking ID: #{booking.id}</p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center text-gray-700">
                              <User className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">{booking.clientName}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <User className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">Staff: {booking.staffName}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Calendar className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clock className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <DollarSign className="w-4 h-4 mr-2 text-business" />
                              <span className="text-sm font-semibold">${booking.price.toFixed(2)}</span>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-600"><strong>Notes:</strong> {booking.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
