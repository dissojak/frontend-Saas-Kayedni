
"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Calendar, Clock, User, DollarSign, Search, XCircle, CheckCircle, AlertCircle, UserCheck, Ban, Mail, AlertTriangle, Phone } from "lucide-react";
import { fetchBookingsForStaff, updateBookingStatus } from "../../../(business)/actions/backend";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";

interface Booking {
  id: number;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
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
  const { user, token, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'cancel' | 'no_show' | null;
    bookingId: number | null;
    clientName: string;
  }>({ open: false, type: null, bookingId: null, clientName: '' });

  // Auto-update current time every 30 seconds to refresh booking states (Up Next → In Session)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, []);

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
        setFilteredBookings(data);
      } else {
        console.error('[Staff Bookings Page] Expected array but got:', typeof data, data);
        setBookings([]);
        setFilteredBookings([]);
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
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking =>
        booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting (ascending - closest dates first)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          return a.price - b.price;
        case 'client':
          return a.clientName.localeCompare(b.clientName);
        default:
          return 0;
      }
    });

    return filtered;
  };

  useEffect(() => {
    const filtered = filterAndSortBookings();
    setFilteredBookings(filtered);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'no_show': return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'pending': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'completed': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  // Helper to check if booking is today
  const isToday = (dateString: string) => {
    const bookingDate = new Date(dateString);
    return bookingDate.toDateString() === currentTime.toDateString();
  };

  // Helper to check if booking is currently active (happening now + 10 min grace period after end)
  const isCurrentlyActive = (booking: Booking) => {
    if (!isToday(booking.date)) return false;
    
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const [endHour, endMin] = booking.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Add 10 minute grace period after end time for staff to complete the session
    const endWithGrace = endMinutes + 10;
    
    return currentMinutes >= startMinutes && currentMinutes <= endWithGrace;
  };

  // Helper to check if booking is coming up next (within 30 min)
  const isUpNext = (booking: Booking) => {
    if (!isToday(booking.date) || isCurrentlyActive(booking)) return false;
    
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    const [startHour, startMin] = booking.startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    
    const diff = startMinutes - currentMinutes;
    return diff > 0 && diff <= 30;
  };

  // Helper to format time nicely (remove seconds)
  const formatTime = (time: string) => {
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
  };

  // Upcoming: All active bookings (pending, confirmed) - staff controls when they're done
  const upcomingBookings = filteredBookings.filter(booking => {
    return ['pending', 'confirmed'].includes(booking.status.toLowerCase());
  });

  // Today's bookings from upcoming (sorted by time)
  const todayBookings = upcomingBookings
    .filter(booking => isToday(booking.date))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Past: Only bookings that staff marked as completed or no_show
  // Sorted by date (most recent first) and then by start time (most recent first)
  const pastBookings = filteredBookings
    .filter(booking => {
      return ['completed', 'no_show'].includes(booking.status.toLowerCase());
    })
    .sort((a, b) => {
      // First compare by date (most recent first)
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      // If same date, sort by start time (most recent first)
      return b.startTime.localeCompare(a.startTime);
    });

  // Cancelled: Separate category - also sorted by most recent first
  const cancelledBookings = filteredBookings
    .filter(booking => {
      return booking.status.toLowerCase() === 'cancelled';
    })
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });

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

  // Booking Card Component
  const BookingCard = ({ booking, variant = 'default' }: { booking: Booking; variant?: 'default' | 'past' | 'cancelled' }) => {
    const bookingIsToday = isToday(booking.date);
    const isActive = isCurrentlyActive(booking);
    const isNext = isUpNext(booking);
    
    let cardStyle = 'bg-card border-border';
    if (variant === 'cancelled') {
      cardStyle = 'bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/30 opacity-75';
    } else if (variant === 'past') {
      cardStyle = 'bg-muted/30 dark:bg-muted/20 border-border opacity-75';
    } else if (isActive) {
      cardStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20';
    } else if (isNext) {
      cardStyle = 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700';
    } else if (bookingIsToday) {
      cardStyle = 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30';
    }

    return (
      <div className={`rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all duration-200 ${cardStyle}`}>
        <div className="p-5 sm:p-6">
          {/* Status Indicator for Active/Next */}
          {isActive && variant === 'default' && (
            <div className="flex items-center gap-2 mb-4 bg-emerald-500 text-white px-4 py-2 rounded-xl w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-bold text-sm uppercase tracking-wider">In Session Now</span>
            </div>
          )}
          {isNext && variant === 'default' && (
            <div className="flex items-center gap-2 mb-4 bg-amber-500/20 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl w-fit">
              <Clock className="w-4 h-4" />
              <span className="font-bold text-sm uppercase tracking-wider">Up Next</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
                variant === 'cancelled' 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : variant === 'past'
                  ? 'bg-muted text-muted-foreground'
                  : isActive
                  ? 'bg-emerald-500 text-white'
                  : isNext
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : bookingIsToday 
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {booking.clientName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className={`text-lg sm:text-xl font-bold ${
                  variant === 'cancelled' ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {booking.clientName}
                </h3>
                <p className="text-muted-foreground">{booking.serviceName}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(booking.status)} text-sm font-semibold px-3 py-1.5 flex items-center gap-1.5 w-fit`}>
              {getStatusIcon(booking.status)}
              {booking.status}
            </Badge>
          </div>
          
          {/* Info Grid - Balanced Layout */}
          <div className="grid grid-cols-4 gap-4 sm:gap-6 mb-6 p-4 bg-muted/30 dark:bg-muted/10 rounded-xl">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Client</p>
              <p className={`text-sm font-semibold truncate ${variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-foreground'}`}>
                {booking.clientName}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contact</p>
              <p className="text-xs text-muted-foreground truncate">{booking.clientEmail}</p>
              {booking.clientPhone && (
                <a href={`tel:${booking.clientPhone}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {booking.clientPhone}
                </a>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</p>
              <p className={`text-sm font-semibold ${
                bookingIsToday && variant === 'default' ? 'text-primary' : variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {bookingIsToday ? 'Today' : new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time</p>
              <p className={`text-sm font-semibold ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : bookingIsToday && variant === 'default' ? 'text-primary' : variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-4 lg:col-span-4 flex items-center justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
              <div className="sm:hidden">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price</p>
              </div>
              <p className={`text-lg font-bold ${variant === 'past' || variant === 'cancelled' ? 'text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'}`}>
                ${booking.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Actions - Bigger buttons for staff */}
          {variant === 'default' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {booking.status.toLowerCase() === 'pending' && (
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 text-base"
                  onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Confirm Booking
                </Button>
              )}
              {booking.status.toLowerCase() === 'confirmed' && (
                <Button
                  size="lg"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 text-base"
                  onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark Complete
                </Button>
              )}
              {!['cancelled', 'completed', 'no_show'].includes(booking.status.toLowerCase()) && (
                <div className="flex gap-3 flex-1 sm:flex-none">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-2 border-border hover:bg-muted text-muted-foreground font-semibold rounded-xl h-12 text-base"
                    onClick={() => handleMarkNotShown(booking.id, booking.clientName)}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    No Show
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 text-muted-foreground font-semibold rounded-xl h-12 text-base"
                    onClick={() => handleCancelBooking(booking.id, booking.clientName)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className={`mt-5 pt-4 border-t ${variant === 'cancelled' ? 'border-red-200/50 dark:border-red-900/30' : 'border-border'}`}>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Notes:</span> {booking.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get the currently active booking
  const activeBooking = todayBookings.find(b => isCurrentlyActive(b));
  const nextUpBooking = todayBookings.find(b => isUpNext(b));

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
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-2xl px-5 py-3">
                <p className="text-2xl sm:text-3xl font-bold text-primary">{todayBookings.length}</p>
                <p className="text-xs text-primary/70 font-medium">Today</p>
              </div>
              <div className="bg-card border border-border rounded-2xl px-5 py-3">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{upcomingBookings.length}</p>
                <p className="text-xs text-muted-foreground font-medium">All Upcoming</p>
              </div>
              <div className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-5 py-3">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{pastBookings.length}</p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">Completed</p>
              </div>
            </div>
          </div>

          {/* CURRENTLY ACTIVE BOOKING - Most Important */}
          {activeBooking && (
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Live indicator bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30">
                  <div className="h-full bg-white animate-pulse"></div>
                </div>
                
                <div className="p-6 sm:p-8">
                  {/* NOW Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                      <span className="text-white font-bold text-sm uppercase tracking-wider">In Session Now</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Client Info - Large & Clear */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl font-bold text-white">{activeBooking.clientName.charAt(0)}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-white">{activeBooking.clientName}</h2>
                          <p className="text-white/80 text-lg">{activeBooking.serviceName}</p>
                        </div>
                      </div>
                      
                      {/* Contact Quick Actions */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                          <Mail className="w-4 h-4 text-white/70" />
                          <span className="text-white/90 text-sm">{activeBooking.clientEmail}</span>
                        </div>
                        {activeBooking.clientPhone && (
                          <a 
                            href={`tel:${activeBooking.clientPhone}`} 
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            <Phone className="w-4 h-4 text-white/70" />
                            <span className="text-white/90 text-sm">{activeBooking.clientPhone}</span>
                          </a>
                        )}
                      </div>
                      
                      {/* Time & Price */}
                      <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          <span className="text-lg font-semibold">{formatTime(activeBooking.startTime)} - {formatTime(activeBooking.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <span className="text-lg font-semibold">${activeBooking.price.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {activeBooking.notes && (
                        <p className="mt-4 text-white/70 text-sm bg-white/10 rounded-xl px-4 py-2">
                          <span className="font-medium text-white/90">Note:</span> {activeBooking.notes}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons - Big & Clear */}
                    <div className="flex flex-col gap-3 lg:min-w-[200px]">
                      <Button
                        size="lg"
                        className="w-full bg-white hover:bg-white/90 text-emerald-600 font-bold text-base h-14 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => handleStatusUpdate(activeBooking.id, 'COMPLETED')}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Complete Session
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          className="bg-white/10 border-white/30 hover:bg-white/20 text-white font-semibold h-12 rounded-xl"
                          onClick={() => handleMarkNotShown(activeBooking.id, activeBooking.clientName)}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          No Show
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="bg-white/10 border-white/30 hover:bg-red-500/30 text-white font-semibold h-12 rounded-xl"
                          onClick={() => handleCancelBooking(activeBooking.id, activeBooking.clientName)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UP NEXT Booking */}
          {nextUpBooking && !activeBooking && (
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-amber-500/20 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span className="text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">Up Next</span>
                <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold px-2 py-1 rounded-full">
                  Starting Soon
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{nextUpBooking.clientName.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{nextUpBooking.clientName}</h3>
                    <p className="text-muted-foreground">{nextUpBooking.serviceName}</p>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold">{formatTime(nextUpBooking.startTime)} - {formatTime(nextUpBooking.endTime)}</p>
                  </div>
                </div>
                
                {nextUpBooking.status.toLowerCase() === 'pending' && (
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-12 px-6 rounded-xl"
                    onClick={() => handleStatusUpdate(nextUpBooking.id, 'CONFIRMED')}
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </Button>
                )}
              </div>
            </div>
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
                  const isActive = isCurrentlyActive(booking);
                  const isNext = isUpNext(booking);
                  
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  <Select value={sortBy} onValueChange={setSortBy}>
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
            <TabsList className="bg-card border border-border rounded-2xl p-1.5 h-auto w-full grid grid-cols-3 gap-1">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">Upcoming</span>
                <span className="sm:hidden">Active</span>
                <span className="ml-2 bg-primary/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {upcomingBookings.length}
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
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground">New bookings will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} variant="default" />
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
                    <BookingCard key={booking.id} booking={booking} variant="past" />
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
                    <BookingCard key={booking.id} booking={booking} variant="cancelled" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Confirmation Dialog - Enhanced UI */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: null, bookingId: null, clientName: '' })}>
        <AlertDialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
          {/* Colored Header Banner */}
          <div className={`relative pt-8 pb-6 px-6 ${
            confirmDialog.type === 'cancel' 
              ? 'bg-gradient-to-br from-red-500 to-red-600' 
              : 'bg-gradient-to-br from-amber-500 to-orange-500'
          }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            {/* Icon */}
            <div className="relative flex justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                {confirmDialog.type === 'cancel' ? (
                  <XCircle className="w-10 h-10 text-white" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-white" />
                )}
              </div>
            </div>
            
            {/* Title in Header */}
            <h2 className="text-white text-xl sm:text-2xl font-bold text-center mt-4">
              {confirmDialog.type === 'cancel' ? 'Cancel Booking?' : 'Mark as No Show?'}
            </h2>
          </div>
          
          {/* Content Area */}
          <div className="p-6 bg-card">
            {/* Client Info Card */}
            <div className="bg-muted/50 dark:bg-muted/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                  confirmDialog.type === 'cancel'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}>
                  {confirmDialog.clientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">{confirmDialog.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {confirmDialog.type === 'cancel' ? 'Booking will be cancelled' : 'Will be marked as no show'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Warning Message */}
            <div className={`flex items-start gap-3 p-3 rounded-lg mb-6 ${
              confirmDialog.type === 'cancel'
                ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50'
                : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50'
            }`}>
              <AlertCircle className={`w-5 h-5 mt-0.5 shrink-0 ${
                confirmDialog.type === 'cancel' ? 'text-red-500' : 'text-amber-500'
              }`} />
              <p className={`text-sm ${
                confirmDialog.type === 'cancel' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'
              }`}>
                {confirmDialog.type === 'cancel' 
                  ? 'This action cannot be undone. The client will need to book a new appointment.'
                  : 'This will record that the client did not attend their scheduled appointment.'
                }
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <AlertDialogCancel className="flex-1 h-12 px-6 rounded-xl font-semibold bg-muted hover:bg-muted/80 border-0">
                No, Go Back
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                className={`flex-1 h-12 px-6 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  confirmDialog.type === 'cancel'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                }`}
              >
                {confirmDialog.type === 'cancel' ? 'Yes, Cancel' : 'Yes, No Show'}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
