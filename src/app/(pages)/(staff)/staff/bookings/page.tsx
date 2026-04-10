
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Calendar, Search, CheckCircle, UserCheck, XCircle, UserPlus, Clock, Bell } from "lucide-react";
import { fetchBookingsForStaff, updateBookingStatus, cancelBooking, sendStaffReminderNow } from "../../../(business)/actions/backend";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useLocale } from '@global/hooks/useLocale';
import { useToast } from "@global/hooks/use-toast";
import { staffBookingsLocaleTag, staffBookingsT } from './i18n';

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
import TelegramOnboardingPrompt from '@components/telegram/TelegramOnboardingPrompt';

export default function StaffBookingsPage() {
  const { user, token, logout } = useAuth();
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [sendingReminderIds, setSendingReminderIds] = useState<Record<number, boolean>>({});
  const bootstrapFetchKeyRef = useRef<string | null>(null);
  
  // Use custom hooks
  const currentTime = useCurrentTime(30000);
  const { filteredBookings, searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy } = useBookingFilters(bookings);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    type: null,
    bookingId: null,
    clientName: '',
    bookingStatus: undefined,
  });

  const loadBookings = useCallback(async () => {
    if (!user?.id || !token) {
      console.warn('[Staff Bookings Page] Missing user ID or token');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSessionExpired(false);
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
        setSessionExpired(true);
        setError(staffBookingsT(locale, 'session_expired_error'));
      } else {
        setSessionExpired(false);
        setError(staffBookingsT(locale, 'failed_load_error'));
      }
      
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [locale, token, user?.id]);

  useEffect(() => {
    if (user?.id && token) {
      const fetchKey = `${user.id}:${token}`;
      if (bootstrapFetchKeyRef.current === fetchKey) {
        return;
      }

      bootstrapFetchKeyRef.current = fetchKey;
      console.log('[Staff Bookings Page] User detected:', user);
      console.log('[Staff Bookings Page] Staff ID:', user.id);
      console.log('[Staff Bookings Page] Token available:', token ? `${token.substring(0, 20)}...` : 'null');
      loadBookings();
    } else {
      bootstrapFetchKeyRef.current = null;
      console.warn('[Staff Bookings Page] Missing:', { userId: user?.id, hasToken: !!token });
      setLoading(false);
    }
  }, [loadBookings, token, user]);

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    if (!token) return;

    try {
      await updateBookingStatus(bookingId, newStatus, token);
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleSendReminderNow = async (bookingId: number) => {
    if (!token) return;

    try {
      setSendingReminderIds((prev) => ({ ...prev, [bookingId]: true }));
      await sendStaffReminderNow(bookingId, token);
      toast({
        title: staffBookingsT(locale, 'reminder_sent_title'),
        description: staffBookingsT(locale, 'reminder_sent_desc'),
      });
    } catch (error: any) {
      console.error('Error sending immediate reminder:', error);
      toast({
        title: staffBookingsT(locale, 'reminder_failed_title'),
        description: error?.message || staffBookingsT(locale, 'reminder_failed_desc'),
        variant: 'destructive',
      });
    } finally {
      setSendingReminderIds((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // Show confirmation before cancel
  const handleCancelBooking = (bookingId: number, clientName: string, bookingStatus?: string) => {
    setConfirmDialog({ open: true, type: 'cancel', bookingId, clientName, bookingStatus });
  };
  
  // Show confirmation before marking as no-show
  const handleMarkNotShown = (bookingId: number, clientName: string) => {
    setConfirmDialog({ open: true, type: 'no_show', bookingId, clientName, bookingStatus: undefined });
  };

  const confirmActionWithReason = async (reason: string) => {
    if (!confirmDialog.bookingId || !confirmDialog.type) return;
    try {
      if (confirmDialog.type === 'cancel') {
        await cancelBooking(confirmDialog.bookingId, reason || undefined, token || undefined);
        await loadBookings();
      } else {
        await handleStatusUpdate(confirmDialog.bookingId, 'NO_SHOW');
      }
    } catch (error) {
      console.error('Error in confirmActionWithReason:', error);
    } finally {
      setConfirmDialog({ open: false, type: null, bookingId: null, clientName: '', bookingStatus: undefined });
    }
  };

  // Categorize bookings using utility function
  const { upcomingBookings, todayBookings, pastBookings } = categorizeBookings(filteredBookings, currentTime);

  const cancelledBookings = filteredBookings
    .filter((booking) => booking.status.toLowerCase() === 'cancelled')
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });

  const rejectedBookings = filteredBookings
    .filter((booking) => booking.status.toLowerCase() === 'rejected')
    .sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });
  
  // Separate pending from confirmed upcomingBookings
  const pendingBookings = upcomingBookings.filter(b => b.status === 'PENDING');
  const confirmedUpcomingBookings = upcomingBookings.filter(b => b.status === 'CONFIRMED');

  // Get the currently active booking and next up booking
  const activeBooking = todayBookings.find(b => isCurrentlyActive(b, currentTime));
  const nextUpBooking = todayBookings.find(b => isUpNext(b, currentTime));

  const isFutureBooking = (booking: Booking) => {
    const bookingStart = new Date(`${booking.date}T${booking.startTime}`);
    return bookingStart.getTime() > currentTime.getTime();
  };

  if (loading) {
    return (
      <Layout>
        <div dir={isArabic ? 'rtl' : 'ltr'} className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">{staffBookingsT(locale, 'loading_bookings')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state - show error with retry option
  if (error) {
    return (
      <Layout>
        <div dir={isArabic ? 'rtl' : 'ltr'} className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{staffBookingsT(locale, 'error_title')}</h2>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => loadBookings()} variant="outline" className="h-11 px-6">
                {staffBookingsT(locale, 'try_again')}
              </Button>
              {sessionExpired && (
                <Button onClick={() => logout()} className="h-11 px-6 bg-primary">
                  {staffBookingsT(locale, 'log_in_again')}
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
      <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          {/* Header with Live Time */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{staffBookingsT(locale, 'title')}</h1>
              <p className="text-muted-foreground mt-1">
                {new Date().toLocaleDateString(staffBookingsLocaleTag(locale), { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            {/* Quick Stats */}
            <QuickStats 
              todayCount={todayBookings.length}
              upcomingCount={upcomingBookings.length}
              completedCount={pastBookings.length}
            />
          </div>

          <TelegramOnboardingPrompt
            audience="staff"
            userId={user?.id}
            phone={user?.phone}
            botLabel="KayedniBuissnessBot"
            botUrl="https://t.me/KayedniBuissnessBot"
          />

          {/* Walk-in Booking - NEW Feature */}
          {user?.id != null && typeof token === 'string' && businessId !== null && (
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    {staffBookingsT(locale, 'walk_in_title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {staffBookingsT(locale, 'walk_in_desc')}
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
                      <h2 className="text-lg font-bold text-foreground">{staffBookingsT(locale, 'today_schedule_title')}</h2>
                      <p className="text-sm text-muted-foreground">{staffBookingsT(locale, 'appointments_count', { count: todayBookings.length })}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {todayBookings.map((booking) => {
                  const isActive = isCurrentlyActive(booking, currentTime);
                  const isNext = isUpNext(booking, currentTime);
                  let rowClass = 'hover:bg-muted/50';
                  let timeTextClass = 'text-muted-foreground';
                  let timeBadgeClass = 'bg-muted text-muted-foreground';

                  if (isActive) {
                    rowClass = 'bg-emerald-50 dark:bg-emerald-950/30';
                    timeTextClass = 'text-emerald-600 dark:text-emerald-400';
                    timeBadgeClass = 'bg-emerald-500 text-white';
                  } else if (isNext) {
                    rowClass = 'bg-amber-50/50 dark:bg-amber-950/20';
                    timeTextClass = 'text-amber-600 dark:text-amber-400';
                    timeBadgeClass = 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
                  }
                  
                  return (
                    <div 
                      key={booking.id}
                      className={`p-4 sm:p-5 transition-all ${rowClass}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Time */}
                        <div className={`flex items-center gap-3 min-w-[140px] ${timeTextClass}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${timeBadgeClass}`}>
                            {formatTime(booking.startTime)}
                          </div>
                          <div className="text-sm">
                            <p className="font-semibold">{formatTime(booking.startTime)}</p>
                            <p className="text-xs opacity-70">{staffBookingsT(locale, 'time_to')} {formatTime(booking.endTime)}</p>
                          </div>
                        </div>

                        {/* Client & Service */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{booking.clientName}</h3>
                            {isActive && (
                              <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                {staffBookingsT(locale, 'now_badge')}
                              </span>
                            )}
                            {isNext && (
                              <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {staffBookingsT(locale, 'next_badge')}
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
                              {staffBookingsT(locale, 'confirm')}
                            </Button>
                          )}
                          {booking.status.toLowerCase() === 'confirmed' && (
                            <>
                              <Button
                                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 px-5 rounded-xl"
                                onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {staffBookingsT(locale, 'complete')}
                              </Button>
                              {isFutureBooking(booking) && (
                                <Button
                                  variant="outline"
                                  className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20 font-medium h-11 px-4 rounded-xl"
                                  onClick={() => handleSendReminderNow(booking.id)}
                                  disabled={!!sendingReminderIds[booking.id]}
                                >
                                  <Bell className="w-4 h-4 mr-2" />
                                  {sendingReminderIds[booking.id]
                                    ? staffBookingsT(locale, 'sending')
                                    : staffBookingsT(locale, 'call_client_now')}
                                </Button>
                              )}
                            </>
                          )}
                          {!['cancelled', 'rejected', 'completed', 'no_show'].includes(booking.status.toLowerCase()) && (
                            <>
                              <Button
                                variant="outline"
                                className="border-border hover:bg-muted text-muted-foreground font-medium h-11 px-4 rounded-xl"
                                onClick={() => handleMarkNotShown(booking.id, booking.clientName)}
                              >
                                {staffBookingsT(locale, 'no_show')}
                              </Button>
                              <Button
                                variant="outline"
                                className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 text-muted-foreground font-medium h-11 px-4 rounded-xl"
                                onClick={() => setConfirmDialog({ open: true, type: 'cancel', bookingId: booking.id, clientName: booking.clientName, bookingStatus: booking.status })}
                              >
                                {booking.status.toUpperCase() === 'PENDING'
                                  ? staffBookingsT(locale, 'reject')
                                  : staffBookingsT(locale, 'cancel')}
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
              <h3 className="text-lg font-semibold text-foreground mb-2">{staffBookingsT(locale, 'no_appointments_today_title')}</h3>
              <p className="text-muted-foreground">{staffBookingsT(locale, 'no_appointments_today_desc')}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isArabic ? 'right-4' : 'left-4'}`} />
                  <Input
                    type="text"
                    placeholder={staffBookingsT(locale, 'search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`bg-background border-input rounded-xl h-12 text-base ${isArabic ? 'pr-12' : 'pl-12'}`}
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-full sm:w-44 bg-background border-input rounded-xl h-12 text-base">
                      <SelectValue placeholder={staffBookingsT(locale, 'status_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{staffBookingsT(locale, 'status_all')}</SelectItem>
                      <SelectItem value="pending">{staffBookingsT(locale, 'status_pending')}</SelectItem>
                      <SelectItem value="confirmed">{staffBookingsT(locale, 'status_confirmed')}</SelectItem>
                      <SelectItem value="completed">{staffBookingsT(locale, 'status_completed')}</SelectItem>
                      <SelectItem value="cancelled">{staffBookingsT(locale, 'status_cancelled')}</SelectItem>
                      <SelectItem value="rejected">{staffBookingsT(locale, 'status_rejected')}</SelectItem>
                      <SelectItem value="no_show">{staffBookingsT(locale, 'status_no_show')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as any)}>
                    <SelectTrigger className="w-full sm:w-40 bg-background border-input rounded-xl h-12 text-base">
                      <SelectValue placeholder={staffBookingsT(locale, 'sort_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">{staffBookingsT(locale, 'sort_date')}</SelectItem>
                      <SelectItem value="price">{staffBookingsT(locale, 'sort_price')}</SelectItem>
                      <SelectItem value="client">{staffBookingsT(locale, 'sort_client')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="bg-card border border-border rounded-2xl p-1.5 h-auto w-full grid grid-cols-5 gap-1">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">{staffBookingsT(locale, 'tab_upcoming')}</span>
                <span className="sm:hidden">{staffBookingsT(locale, 'tab_upcoming_mobile')}</span>
                <span className="ml-2 bg-primary/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {confirmedUpcomingBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="rounded-xl data-[state=active]:bg-amber-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">{staffBookingsT(locale, 'tab_pending')}</span>
                <span className="sm:hidden">{staffBookingsT(locale, 'tab_pending_mobile')}</span>
                <span className="ml-2 bg-amber-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pendingBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">{staffBookingsT(locale, 'tab_completed')}</span>
                <span className="sm:hidden">{staffBookingsT(locale, 'tab_completed_mobile')}</span>
                <span className="ml-2 bg-emerald-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pastBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="rounded-xl data-[state=active]:bg-red-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">{staffBookingsT(locale, 'tab_cancelled')}</span>
                <span className="sm:hidden">{staffBookingsT(locale, 'tab_cancelled_mobile')}</span>
                <span className="ml-2 bg-red-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {cancelledBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="rounded-xl data-[state=active]:bg-rose-700 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">{staffBookingsT(locale, 'tab_rejected')}</span>
                <span className="sm:hidden">{staffBookingsT(locale, 'tab_rejected_mobile')}</span>
                <span className="ml-2 bg-rose-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {rejectedBookings.length}
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">{staffBookingsT(locale, 'no_upcoming_title')}</h3>
                  <p className="text-muted-foreground">{staffBookingsT(locale, 'no_upcoming_desc')}</p>
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
                      onSendReminderNow={handleSendReminderNow}
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">{staffBookingsT(locale, 'no_pending_title')}</h3>
                  <p className="text-muted-foreground">{staffBookingsT(locale, 'no_pending_desc')}</p>
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
                      onSendReminderNow={handleSendReminderNow}
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">{staffBookingsT(locale, 'no_completed_title')}</h3>
                  <p className="text-muted-foreground">{staffBookingsT(locale, 'no_completed_desc')}</p>
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">{staffBookingsT(locale, 'no_cancelled_title')}</h3>
                  <p className="text-muted-foreground">{staffBookingsT(locale, 'no_cancelled_desc')}</p>
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

            {/* Rejected */}
            <TabsContent value="rejected" className="mt-6 space-y-4">
              {rejectedBookings.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-rose-500/60" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{staffBookingsT(locale, 'no_rejected_title')}</h3>
                  <p className="text-muted-foreground">{staffBookingsT(locale, 'no_rejected_desc')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rejectedBookings.map((booking) => (
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
        onClose={() => setConfirmDialog({ open: false, type: null, bookingId: null, clientName: '', bookingStatus: undefined })}
        onConfirm={confirmActionWithReason}
        businessId={businessId}
        authToken={token || undefined}
      />
    </Layout>
  );
}
