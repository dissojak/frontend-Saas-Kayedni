"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Calendar, Search, CheckCircle, UserCheck, XCircle } from "lucide-react";
import { fetchBookingsForBusiness, updateBookingStatus, fetchBusinessById } from "../../actions/backend";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useLocale } from '@global/hooks/useLocale';
import BusinessQrDialog from '@components/business/BusinessQrDialog';
import {
  businessBookingsDateLocale,
  businessBookingsT,
  businessBookingStatusT,
} from './i18n';
import type { Business } from "../../businesses/types/business";

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
  QuickStats,
} from '../../../shared/bookings/components';
import TelegramOnboardingPrompt from '@components/telegram/TelegramOnboardingPrompt';

export default function BusinessBookingsPage() {
  const { activeMode, user } = useAuth();
  const { locale } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  
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
  const dialogAuthToken =
    globalThis.window
      ? localStorage.getItem('token') || localStorage.getItem('accessToken') || undefined
      : undefined;

  // Filter bookings based on active mode
  const displayedBookings = activeMode === 'staff' && user?.staffId
    ? filteredBookings.filter(booking => booking.staffId === Number.parseInt(user.staffId as string, 10))
    : filteredBookings;

  useEffect(() => {
    // Get businessId from localStorage (user's business)
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.businessId) {
        setBusinessId(String(user.businessId));
      }
    }
  }, []);

  useEffect(() => {
    if (!businessId) {
      setBusiness(null);
      return;
    }

    let active = true;

    const loadBusiness = async () => {
      try {
        const data = await fetchBusinessById(businessId);
        if (active) {
          setBusiness(data);
        }
      } catch (loadError) {
        console.error('[Business Bookings] Error loading business:', loadError);
        if (active) {
          setBusiness(null);
        }
      }
    };

    void loadBusiness();

    return () => {
      active = false;
    };
  }, [businessId]);

  useEffect(() => {
    if (businessId) {
      loadBookings();
    }
  }, [businessId]);

  const loadBookings = async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const data = await fetchBookingsForBusiness(businessId, from, to, token || undefined);
      
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error('[Business Bookings] Expected array but got:', typeof data);
        setBookings([]);
      }
    } catch (error: any) {
      console.error('[Business Bookings] Error loading bookings:', error);
      setError(businessBookingsT(locale, 'error_load_bookings'));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) return;

    try {
      await updateBookingStatus(bookingId, newStatus, token);
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleCancelBooking = (bookingId: number, clientName: string) => {
    setConfirmDialog({ open: true, type: 'cancel', bookingId, clientName });
  };
  
  const handleMarkNotShown = (bookingId: number, clientName: string) => {
    setConfirmDialog({ open: true, type: 'no_show', bookingId, clientName });
  };
  
  const confirmAction = async () => {
    if (!confirmDialog.bookingId || !confirmDialog.type) return;
    
    const status = confirmDialog.type === 'cancel' ? 'CANCELLED' : 'NO_SHOW';
    await handleStatusUpdate(confirmDialog.bookingId, status);
    setConfirmDialog({ open: false, type: null, bookingId: null, clientName: '' });
  };

  // Categorize bookings using utility function
  const { upcomingBookings, todayBookings, pastBookings, cancelledBookings } = categorizeBookings(displayedBookings, currentTime);

  // Get the currently active booking and next up booking
  const activeBooking = todayBookings.find(b => isCurrentlyActive(b, currentTime));
  const nextUpBooking = todayBookings.find(b => isUpNext(b, currentTime));

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">{businessBookingsT(locale, 'loading_bookings')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{businessBookingsT(locale, 'error_title')}</h2>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => loadBookings()} variant="outline" className="h-11 px-6">
              {businessBookingsT(locale, 'error_retry')}
            </Button>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{businessBookingsT(locale, 'title')}</h1>
              <p className="text-muted-foreground mt-1">
                {new Date().toLocaleDateString(businessBookingsDateLocale(locale), {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            
            {/* Quick Stats */}
            <QuickStats 
              todayCount={todayBookings.length}
              upcomingCount={upcomingBookings.length}
              completedCount={pastBookings.length}
            />
          </div>

          {business && (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{businessBookingsT(locale, 'qr_panel_title')}</p>
                  <h2 className="text-lg font-bold text-foreground">{business.name}</h2>
                  <p className="text-sm text-muted-foreground max-w-2xl">{businessBookingsT(locale, 'qr_panel_desc')}</p>
                  {business.qrUpdatedAt && (
                    <p className="text-xs text-muted-foreground">{businessBookingsT(locale, 'qr_panel_updated')}: {new Date(business.qrUpdatedAt).toLocaleString(locale)}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl px-5"
                    onClick={() => setIsQrDialogOpen(true)}
                  >
                    {businessBookingsT(locale, 'qr_view')}
                  </Button>
                  <Button
                    type="button"
                    className="h-11 rounded-xl px-5"
                    onClick={() => setIsQrDialogOpen(true)}
                    disabled={!business.qrCodeUrl}
                  >
                    {businessBookingsT(locale, 'qr_share_business')}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <BusinessQrDialog
            open={isQrDialogOpen}
            onOpenChange={setIsQrDialogOpen}
            business={business}
          />

          <TelegramOnboardingPrompt
            audience="staff"
            userId={user?.id}
            phone={user?.phone}
            botLabel="KayedniBuissnessBot"
            botUrl="https://t.me/KayedniBuissnessBot"
          />

          {/* CURRENTLY ACTIVE BOOKING */}
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

          {/* Today's Schedule */}
          {todayBookings.length > 0 && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{businessBookingsT(locale, 'today_schedule')}</h2>
                      <p className="text-sm text-muted-foreground">{businessBookingsT(locale, 'appointments_count', { count: todayBookings.length })}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {todayBookings.map((booking) => {
                  const isActive = isCurrentlyActive(booking, currentTime);
                  const isNext = isUpNext(booking, currentTime);
                  let rowBgClass = 'hover:bg-muted/50';
                  if (isActive) {
                    rowBgClass = 'bg-emerald-50 dark:bg-emerald-950/30';
                  } else if (isNext) {
                    rowBgClass = 'bg-amber-50/50 dark:bg-amber-950/20';
                  }

                  let timeTextClass = 'text-muted-foreground';
                  if (isActive) {
                    timeTextClass = 'text-emerald-600 dark:text-emerald-400';
                  } else if (isNext) {
                    timeTextClass = 'text-amber-600 dark:text-amber-400';
                  }

                  let timeBadgeClass = 'bg-muted text-muted-foreground';
                  if (isActive) {
                    timeBadgeClass = 'bg-emerald-500 text-white';
                  } else if (isNext) {
                    timeBadgeClass = 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
                  }
                  
                  return (
                    <div 
                      key={booking.id}
                      className={`p-4 sm:p-5 transition-all ${rowBgClass}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Time */}
                        <div className={`flex items-center gap-3 min-w-[140px] ${timeTextClass}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${timeBadgeClass}`}>
                            {formatTime(booking.startTime)}
                          </div>
                          <div className="text-sm">
                            <p className="font-semibold">{formatTime(booking.startTime)}</p>
                            <p className="text-xs opacity-70">{businessBookingsT(locale, 'time_to')} {formatTime(booking.endTime)}</p>
                          </div>
                        </div>

                        {/* Client & Service */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{booking.clientName}</h3>
                            {isActive && (
                              <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                {businessBookingsT(locale, 'card_today')}
                              </span>
                            )}
                            {isNext && (
                              <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {businessBookingsT(locale, 'banner_up_next')}
                              </span>
                            )}
                            <Badge className={`${getStatusColor(booking.status)} text-[10px]`}>
                              {businessBookingStatusT(locale, booking.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{booking.serviceName} • ${booking.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{businessBookingsT(locale, 'staff_label')}: {booking.staffName}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          {booking.status.toLowerCase() === 'pending' && (
                            <Button
                              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 px-5 rounded-xl"
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              {businessBookingsT(locale, 'action_confirm_booking')}
                            </Button>
                          )}
                          {booking.status.toLowerCase() === 'confirmed' && (
                            <Button
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 px-5 rounded-xl"
                              onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {businessBookingsT(locale, 'action_mark_complete')}
                            </Button>
                          )}
                          {!['cancelled', 'completed', 'no_show'].includes(booking.status.toLowerCase()) && (
                            <>
                              <Button
                                variant="outline"
                                className="border-border hover:bg-muted text-muted-foreground font-medium h-11 px-4 rounded-xl"
                                onClick={() => handleMarkNotShown(booking.id, booking.clientName)}
                              >
                                {businessBookingsT(locale, 'action_no_show')}
                              </Button>
                              <Button
                                variant="outline"
                                className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 text-muted-foreground font-medium h-11 px-4 rounded-xl"
                                onClick={() => handleCancelBooking(booking.id, booking.clientName)}
                              >
                                {businessBookingsT(locale, 'action_cancel')}
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
              <h3 className="text-lg font-semibold text-foreground mb-2">{businessBookingsT(locale, 'no_appointments_today_title')}</h3>
              <p className="text-muted-foreground">{businessBookingsT(locale, 'no_appointments_today_desc')}</p>
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
                    placeholder={businessBookingsT(locale, 'search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-background border-input rounded-xl h-12 text-base"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-full sm:w-44 bg-background border-input rounded-xl h-12 text-base">
                      <SelectValue placeholder={businessBookingsT(locale, 'status_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{businessBookingsT(locale, 'status_all')}</SelectItem>
                      <SelectItem value="pending">{businessBookingsT(locale, 'status_pending')}</SelectItem>
                      <SelectItem value="confirmed">{businessBookingsT(locale, 'status_confirmed')}</SelectItem>
                      <SelectItem value="completed">{businessBookingsT(locale, 'status_completed')}</SelectItem>
                      <SelectItem value="cancelled">{businessBookingsT(locale, 'status_cancelled')}</SelectItem>
                      <SelectItem value="no_show">{businessBookingsT(locale, 'status_no_show')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as any)}>
                    <SelectTrigger className="w-full sm:w-40 bg-background border-input rounded-xl h-12 text-base">
                      <SelectValue placeholder={businessBookingsT(locale, 'sort_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">{businessBookingsT(locale, 'sort_date')}</SelectItem>
                      <SelectItem value="price">{businessBookingsT(locale, 'sort_price')}</SelectItem>
                      <SelectItem value="client">{businessBookingsT(locale, 'sort_client')}</SelectItem>
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
                <span className="hidden sm:inline">{businessBookingsT(locale, 'tab_upcoming')}</span>
                <span className="sm:hidden">{businessBookingsT(locale, 'tab_active_short')}</span>
                <span className="ml-2 bg-primary/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {upcomingBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">{businessBookingsT(locale, 'tab_completed')}</span>
                <span className="sm:hidden">{businessBookingsT(locale, 'tab_done_short')}</span>
                <span className="ml-2 bg-emerald-500/20 data-[state=active]:bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pastBookings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="rounded-xl data-[state=active]:bg-red-600 data-[state=active]:text-white py-3 text-sm font-semibold text-muted-foreground shadow-none transition-all"
              >
                <span className="hidden sm:inline">{businessBookingsT(locale, 'tab_cancelled')}</span>
                <span className="sm:hidden">{businessBookingsT(locale, 'tab_canceled_short')}</span>
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">{businessBookingsT(locale, 'empty_upcoming_title')}</h3>
                  <p className="text-muted-foreground">{businessBookingsT(locale, 'empty_upcoming_desc')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">{businessBookingsT(locale, 'empty_completed_title')}</h3>
                  <p className="text-muted-foreground">{businessBookingsT(locale, 'empty_completed_desc')}</p>
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">{businessBookingsT(locale, 'empty_cancelled_title')}</h3>
                  <p className="text-muted-foreground">{businessBookingsT(locale, 'empty_cancelled_desc')}</p>
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
        businessId={businessId ? Number.parseInt(businessId, 10) : null}
        authToken={dialogAuthToken}
      />
    </Layout>
  );
}
