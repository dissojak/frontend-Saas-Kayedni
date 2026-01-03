
"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Calendar, Search, CheckCircle, UserCheck, XCircle, UserPlus, Clock } from "lucide-react";
import { fetchBookingsForStaff, updateBookingStatus } from "../../../(business)/actions/backend";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";

// Import types from shared location
import { Booking, ConfirmDialogState } from '../../../shared/bookings/types';

// Import utils from shared location
import { categorizeBookings, getStatusColor, formatTime, isCurrentlyActive, isUpNext } from '../../../shared/bookings/utils';

// Import hooks from shared location
import { useBookingFilters, useCurrentTime } from '../../../shared/bookings/hooks';

// Import components from shared location
import {
  BookingCard,
  ConfirmationDialog,
  ActiveBookingBanner,
  UpNextBookingBanner,
  QuickStats
} from '../../../shared/bookings/components';
import WalkInBooking from './WalkInBooking';

export default function StaffBookingsPage() {
  const { user, token, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<number | null>(null);
  
  // Use custom hooks
  const currentTime = useCurrentTime(30000);
  const { filteredBookings, searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy } = useBookingFilters(bookings);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ 
    open: false, 
    type: null, 
    bookingId: null, 
    clientName: '' 
  });

  useEffect(() => {
    if (user?.id && token) {
      console.log('[Staff Bookings Page] User detected:', user);
      console.log('[Staff Bookings Page] Staff ID:', user.id);
      console.log('[Staff Bookings Page] Token available:', token ? `${token.substring(0, 20)}...` : 'null');
      loadBookings();
    } else {
      console.warn('[Staff Bookings Page] Missing:', { userId: user?.id, hasToken: !!token });
      setLoading(false);
    }
  }, [user?.id, token]);

  const loadBookings = async () => {
    if (!user?.id || !token) {
      console.warn('[Staff Bookings Page] Missing user ID or token');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('[Staff Bookings Page] Fetching bookings for staff ID:', user.id);
      console.log('[Staff Bookings Page] Using token:', token.substring(0, 30) + '...');
      const data = await fetchBookingsForStaff(user.id, undefined, undefined, token);
      console.log('[Staff Bookings Page] Bookings received:', data);

      if (Array.isArray(data)) {
        setBookings(data);
        // Extract business ID from first booking if available
        if (data.length > 0 && data[0].businessId) {
          setBusinessId(data[0].businessId);
        }
      } else {
        console.error('[Staff Bookings Page] Expected array but got:', typeof data, data);
        setBookings([]);
      }
    } catch (error: any) {
      console.error('[Staff Bookings Page] Error loading bookings:', error);
      console.error('[Staff Bookings Page] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Check if it's a token error
      if (error.message?.includes('token') || error.message?.includes('401') || error.message?.includes('unauthorized')) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load bookings. Please try again.');
      }
      
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filtering is now handled by the useBookingFilters hook
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    if (!token) return;

    try {
      await updateBookingStatus(bookingId, newStatus, token);
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Show confirmation before cancel
  const handleCancelBooking = (bookingId: number, clientName: string) => {
    setConfirmDialog({ open: true, type: 'cancel', bookingId, clientName });
  };
  
  // Show confirmation before marking as no-show
  const handleMarkNotShown = (bookingId: number, clientName: string) => {
    setConfirmDialog({ open: true, type: 'no_show', bookingId, clientName });
  };
  
  // Confirm the action
  const confirmAction = async () => {
    if (!confirmDialog.bookingId || !confirmDialog.type) return;
    
    const status = confirmDialog.type === 'cancel' ? 'CANCELLED' : 'NO_SHOW';
    await handleStatusUpdate(confirmDialog.bookingId, status);
    setConfirmDialog({ open: false, type: null, bookingId: null, clientName: '' });
  };

  // Categorize bookings using utility function
  const { upcomingBookings, todayBookings, pastBookings, cancelledBookings } = categorizeBookings(filteredBookings, currentTime);
  
  // Separate pending from confirmed upcomingBookings
  const pendingBookings = upcomingBookings.filter(b => b.status === 'PENDING');
  const confirmedUpcomingBookings = upcomingBookings.filter(b => b.status === 'CONFIRMED');

  // Get the currently active booking and next up booking
  const activeBooking = todayBookings.find(b => isCurrentlyActive(b, currentTime));
  const nextUpBooking = todayBookings.find(b => isUpNext(b, currentTime));

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state - show error with retry option
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => loadBookings()} variant="outline" className="h-11 px-6">
                Try Again
              </Button>
              {error.includes('Session expired') && (
                <Button onClick={() => logout()} className="h-11 px-6 bg-primary">
                  Log In Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          {/* Header with Live Time */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">My Bookings</h1>
              <p className="text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            {/* Quick Stats */}
            <QuickStats 
              todayCount={todayBookings.length}
              upcomingCount={upcomingBookings.length}
              completedCount={pastBookings.length}
            />
          </div>

          {/* Walk-in Booking - NEW Feature */}
          {user?.id && token && businessId && (
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Walk-in Client Booking
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quickly book a service for walk-in clients. Select an existing client or create a new one.
                  </p>
                </div>
                <WalkInBooking
                  staffId={Number(user.id)}
                  businessId={businessId}
                  token={token}
                  onBookingCreated={loadBookings}
                />
              </div>
            </div>
          )}

          {/* CURRENTLY ACTIVE BOOKING - Most Important */}
          {activeBooking && (
            <ActiveBookingBanner
              booking={activeBooking}
              onStatusUpdate={handleStatusUpdate}
              onCancel={handleCancelBooking}
              onMarkNoShow={handleMarkNotShown}
            />
          )}

          {/* UP NEXT Booking */}
          {nextUpBooking && !activeBooking && (
            <UpNextBookingBanner
              booking={nextUpBooking}
              onStatusUpdate={handleStatusUpdate}
            />
          )}

          {/* Today's Schedule - Full List */}
          {todayBookings.length > 0 && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Today's Schedule</h2>
                      <p className="text-sm text-muted-foreground">{todayBookings.length} appointments</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {todayBookings.map((booking) => {
                  const isActive = isCurrentlyActive(booking, currentTime);
                  const isNext = isUpNext(booking, currentTime);
                  
                  return (
                    <div 
                      key={booking.id}
                      className={`p-4 sm:p-5 transition-all ${
                        isActive 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30' 
                          : isNext 
                          ? 'bg-amber-50/50 dark:bg-amber-950/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Time */}
                        <div className={`flex items-center gap-3 min-w-[140px] ${
                          isActive ? 'text-emerald-600 dark:text-emerald-400' : isNext ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                        }`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isActive 
                              ? 'bg-emerald-500 text-white' 
                              : isNext 
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {formatTime(booking.startTime)}
                          </div>
                          <div className="text-sm">
                            <p className="font-semibold">{formatTime(booking.startTime)}</p>
                            <p className="text-xs opacity-70">to {formatTime(booking.endTime)}</p>
                          </div>
                        </div>

                        {/* Client & Service */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{booking.clientName}</h3>
                            {isActive && (
                              <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                Now
                              </span>
                            )}
                            {isNext && (
                              <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Next
                              </span>
                            )}
                            <Badge className={`${getStatusColor(booking.status)} text-[10px]`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{booking.serviceName} • ${booking.price.toFixed(2)}</p>
                        </div>

                        {/* Actions - Bigger buttons */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          {booking.status.toLowerCase() === 'pending' && (
                            <Button
                              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 px-5 rounded-xl"
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Confirm
                            </Button>
                          )}
                          {booking.status.toLowerCase() === 'confirmed' && (
                            <Button
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 px-5 rounded-xl"
                              onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete
                            </Button>
                          )}
                          {!['cancelled', 'completed', 'no_show'].includes(booking.status.toLowerCase()) && (
                            <>
                              <Button
                                variant="outline"
                                className="border-border hover:bg-muted text-muted-foreground font-medium h-11 px-4 rounded-xl"
                                onClick={() => handleMarkNotShown(booking.id, booking.clientName)}
                              >
                                No Show
                              </Button>
                              <Button
                                variant="outline"
                                className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 text-muted-foreground font-medium h-11 px-4 rounded-xl"
                                onClick={() => handleCancelBooking(booking.id, booking.clientName)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State for Today */}
          {todayBookings.length === 0 && (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No appointments today</h3>
              <p className="text-muted-foreground">Enjoy your free day! Check the upcoming tab for future bookings.</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by client or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-background border-input rounded-xl h-12 text-base"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-full sm:w-44 bg-background border-input rounded-xl h-12 text-base">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as any)}>
                    <SelectTrigger className="w-full sm:w-40 bg-background border-input rounded-xl h-12 text-base">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">By Date</SelectItem>
                      <SelectItem value="price">By Price</SelectItem>
                      <SelectItem value="client">By Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="bg-card border border-border rounded-2xl p-1.5 h-auto w-full grid grid-cols-4 gap-1">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">Upcoming</span>
                <span className="sm:hidden">Active</span>
                <span className="ml-2 bg-primary/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {confirmedUpcomingBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">Pending</span>
                <span className="sm:hidden">Wait</span>
                <span className="ml-2 bg-amber-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pendingBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">Completed</span>
                <span className="sm:hidden">Done</span>
                <span className="ml-2 bg-emerald-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pastBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="rounded-xl data-[state=active]:bg-red-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">Cancelled</span>
                <span className="sm:hidden">Canceled</span>
                <span className="ml-2 bg-red-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {cancelledBookings.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Upcoming */}
            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {confirmedUpcomingBookings.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground">New bookings will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {confirmedUpcomingBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      variant="default"
                      currentTime={currentTime}
                      onStatusUpdate={handleStatusUpdate}
                      onCancel={handleCancelBooking}
                      onMarkNoShow={handleMarkNotShown}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Pending */}
            <TabsContent value="pending" className="mt-6 space-y-4">
              {pendingBookings.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-amber-500/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No pending bookings</h3>
                  <p className="text-muted-foreground">Pending requests will appear here waiting for confirmation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      variant="default"
                      currentTime={currentTime}
                      onStatusUpdate={handleStatusUpdate}
                      onCancel={handleCancelBooking}
                      onMarkNoShow={handleMarkNotShown}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Completed */}
            <TabsContent value="past" className="mt-6 space-y-4">
              {pastBookings.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No completed bookings yet</h3>
                  <p className="text-muted-foreground">Completed sessions will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      variant="past"
                      currentTime={currentTime}
                      onStatusUpdate={handleStatusUpdate}
                      onCancel={handleCancelBooking}
                      onMarkNoShow={handleMarkNotShown}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Cancelled */}
            <TabsContent value="cancelled" className="mt-6 space-y-4">
              {cancelledBookings.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No cancelled bookings</h3>
                  <p className="text-muted-foreground">Cancelled bookings will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cancelledBookings.map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      variant="cancelled"
                      currentTime={currentTime}
                      onStatusUpdate={handleStatusUpdate}
                      onCancel={handleCancelBooking}
                      onMarkNoShow={handleMarkNotShown}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ConfirmationDialog
        dialogState={confirmDialog}
        onClose={() => setConfirmDialog({ open: false, type: null, bookingId: null, clientName: '' })}
        onConfirm={confirmAction}
      />
    </Layout>
  );
}
