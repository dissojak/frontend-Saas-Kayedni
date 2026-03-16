"use client";

import React, { useState, useEffect, useCallback } from 'react';
import useClientDashboard from './hooks/useClientDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { cancelBooking, rescheduleBooking, fetchAvailableTimeSlotsForStaffDate } from '@/(pages)/(business)/actions/backend';
import { createBusinessSlug } from '@global/lib/businessSlug';
import { ReviewDialog, type ReviewBookingInfo } from '@components/reviews';
import type { ClientBooking } from './types';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Star, 
  User, 
  Scissors,
  DollarSign,
  CalendarCheck,
  History,
  Sparkles,
  Heart,
  HelpCircle,
  CreditCard,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';

// Status badge styling
const getStatusBadge = (status: ClientBooking['status']) => {
  const styles = {
    pending: 'bg-yellow-100/50 text-yellow-800 border-yellow-200/50',
    confirmed: 'bg-green-100/50 text-green-800 border-green-200/50',
    completed: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    cancelled: 'bg-red-100/50 text-red-800 border-red-200/50',
    no_show: 'bg-gray-100/50 text-gray-800 border-gray-200/50',
  };
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };
  return (
    <Badge variant="outline" className={`${styles[status]} font-bold rounded-lg px-3 py-1`}>
      {labels[status]}
    </Badge>
  );
};

// Booking Card Component
interface BookingCardProps {
  readonly booking: ClientBooking;
  readonly type: 'upcoming' | 'past';
  readonly onReschedule: (booking: ClientBooking) => void;
  readonly onCancel: (booking: ClientBooking) => void;
  readonly onReview: (booking: ClientBooking) => void;
  readonly onBookAgain: (booking: ClientBooking) => void;
}

function BookingCard({ 
  booking, 
  type,
  onReschedule,
  onCancel,
  onReview,
  onBookAgain,
}: BookingCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    // Handle HH:mm:ss format
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = Number.parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${hours % 12 || 12}:${minutes} ${ampm}`;
    }
    return timeStr;
  };

  return (
    <Card className="group border-none shadow-skeuo hover:shadow-skeuo-inner transition-all duration-300 rounded-2xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-6">
          {/* Header with Business Name and Status */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{booking.businessName}</h3>
              <p className="text-sm font-medium text-muted-foreground">{booking.serviceName}</p>
            </div>
            {getStatusBadge(booking.status)}
          </div>
          
          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col gap-1">
               <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</span>
               <div className="flex items-center gap-2 font-medium text-foreground">
                   <Calendar className="h-4 w-4 text-primary" />
                   {formatDate(booking.date)}
               </div>
            </div>
             <div className="flex flex-col gap-1">
               <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time</span>
               <div className="flex items-center gap-2 font-medium text-foreground">
                   <Clock className="h-4 w-4 text-primary" />
                   {formatTime(booking.startTime)}
               </div>
            </div>
             <div className="flex flex-col gap-1">
               <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Staff</span>
               <div className="flex items-center gap-2 font-medium text-foreground">
                   <User className="h-4 w-4 text-primary" />
                   {booking.staffName}
               </div>
            </div>
             <div className="flex flex-col gap-1">
               <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</span>
               <div className="flex items-center gap-2 font-medium text-foreground">
                   <DollarSign className="h-4 w-4 text-primary" />
                   ${booking.servicePrice.toFixed(2)}
               </div>
            </div>
          </div>

          {/* Duration/Notes Section */}
            {(booking.serviceDuration || booking.notes) && (
                <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                     {booking.serviceDuration && (
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <Scissors className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.serviceDuration} min service</span>
                        </div>
                    )}
                     {booking.notes && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground italic">
                            <span className="font-semibold not-italic">Note:</span> {booking.notes}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className="bg-muted/20 px-6 py-4 flex flex-wrap gap-3 justify-end border-t border-border/50">
          {type === 'upcoming' ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 rounded-lg hover:border-primary hover:text-primary"
                onClick={() => onReschedule(booking)}
              >
                <Calendar className="h-4 w-4" />
                Reschedule
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                className="gap-2 rounded-lg shadow-sm"
                onClick={() => onCancel(booking)}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              {booking.status === 'completed' && (
                <Button 
                  size="sm"
                  variant={booking.reviewed ? "outline" : "default"}
                  className={`gap-1.5 ${booking.reviewed ? '' : 'bg-client hover:bg-client-dark'}`}
                  onClick={() => onReview(booking)}
                >
                  <Star className={`h-4 w-4 ${booking.reviewed ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {booking.reviewed ? 'Edit Review' : 'Leave Review'}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1.5"
                onClick={() => onBookAgain(booking)}
              >
                <CalendarCheck className="h-4 w-4" />
                Book Again
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Link Item Component
interface QuickLinkItemProps {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly onClick: () => void;
  readonly comingSoon?: boolean;
}

function QuickLinkItem({ 
  icon: Icon, 
  label, 
  onClick,
  comingSoon = false 
}: QuickLinkItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
        comingSoon 
          ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
          : 'bg-white hover:bg-client/5 hover:border-client text-gray-700 hover:text-client'
      } border border-gray-200`}
    >
      <div className={`p-2 rounded-full ${comingSoon ? 'bg-gray-100' : 'bg-client/10'}`}>
        <Icon className={`h-4 w-4 ${comingSoon ? 'text-gray-400' : 'text-client'}`} />
      </div>
      <span className="flex-1 text-left font-medium">{label}</span>
      {comingSoon ? (
        <Badge variant="secondary" className="text-xs">Soon</Badge>
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}

export default function ClientDashboard() {
  const router = useRouter();
  const { token } = useAuth();
  const { 
    user, 
    upcomingBookings, 
    pastBookings, 
    recommendedBusinesses,
    userCategories, 
    loading, 
    error,
    refreshBookings 
  } = useClientDashboard();

  // Modal states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ClientBooking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<ReviewBookingInfo | null>(null);
  
  // Reschedule form states
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<Array<{ startTime: Date; endTime: Date; display: string }>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Common form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load available slots when date changes for reschedule
  const loadAvailableSlots = useCallback(async (date: string, staffId: string, duration: number) => {
    if (!date || !staffId) return;
    
    setLoadingSlots(true);
    try {
      const slots = await fetchAvailableTimeSlotsForStaffDate(staffId, date, duration);
      setAvailableSlots(slots.map((s: any) => ({
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        display: new Date(s.startTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      })));
    } catch (err) {
      console.error('Failed to load slots:', err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Effect to load slots when reschedule date changes
  useEffect(() => {
    if (rescheduleDialogOpen && rescheduleDate && selectedBooking?.staffId) {
      loadAvailableSlots(rescheduleDate, selectedBooking.staffId, selectedBooking.serviceDuration || 30);
    }
  }, [rescheduleDate, rescheduleDialogOpen, selectedBooking, loadAvailableSlots]);

  // Handlers
  const handleReschedule = (booking: ClientBooking) => {
    setSelectedBooking(booking);
    setRescheduleDate('');
    setRescheduleTime('');
    setAvailableSlots([]);
    setSubmitError(null);
    setRescheduleDialogOpen(true);
  };

  const handleCancel = (booking: ClientBooking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleReview = (booking: ClientBooking) => {
    setSelectedBookingForReview({
      id: booking.id,
      businessName: booking.businessName,
      serviceName: booking.serviceName,
      staffName: booking.staffName,
    });
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = async () => {
    await refreshBookings();
    setSelectedBookingForReview(null);
  };

  const handleBookAgain = (booking: ClientBooking) => {
    if (booking.businessId && booking.businessName) {
      const slug = createBusinessSlug(booking.businessName, booking.businessId);
      router.push(`/business/${slug}`);
    }
  };

  const confirmCancel = async () => {
    if (!selectedBooking || !token) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await cancelBooking(Number.parseInt(selectedBooking.id, 10), undefined, token, true);
      await refreshBookings();
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to cancel booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmReschedule = async () => {
    if (!selectedBooking || !token || !rescheduleDate || !rescheduleTime) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Find the selected slot to get the end time
      const selectedSlot = availableSlots.find(s => s.display === rescheduleTime);
      const endTime = selectedSlot 
        ? selectedSlot.endTime.toTimeString().slice(0, 5) 
        : undefined;
      
      // Convert display time back to 24h format
      const startTime24 = selectedSlot
        ? selectedSlot.startTime.toTimeString().slice(0, 5)
        : rescheduleTime;
      
      await rescheduleBooking(
        Number.parseInt(selectedBooking.id, 10),
        rescheduleDate,
        startTime24,
        endTime,
        token,
        true
      );
      await refreshBookings();
      setRescheduleDialogOpen(false);
      setSelectedBooking(null);
      setRescheduleDate('');
      setRescheduleTime('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to reschedule booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date for reschedule (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-client to-client-dark rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-white/80 mt-1">
                {upcomingBookings.length > 0 
                  ? `You have ${upcomingBookings.length} upcoming appointment${upcomingBookings.length > 1 ? 's' : ''}`
                  : 'Ready to book your next appointment?'
                }
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-white text-client hover:bg-white/90 font-semibold shadow-md"
              onClick={() => router.push('/businesses')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Upcoming Appointments */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-client" />
                  <CardTitle>Upcoming Appointments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-client" />
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        type="upcoming"
                        onReschedule={handleReschedule}
                        onCancel={handleCancel}
                        onReview={handleReview}
                        onBookAgain={handleBookAgain}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No upcoming appointments</p>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/businesses')}
                    >
                      Browse Services
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => router.push('/bookings')}
                >
                  View All Bookings
                </Button>
              </CardContent>
            </Card>

            {/* Past Appointments */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-500" />
                  <CardTitle>Past Appointments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : pastBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pastBookings.slice(0, 3).map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        type="past"
                        onReschedule={handleReschedule}
                        onCancel={handleCancel}
                        onReview={handleReview}
                        onBookAgain={handleBookAgain}
                      />
                    ))}
                    {pastBookings.length > 3 && (
                      <p className="text-center text-sm text-gray-500">
                        +{pastBookings.length - 3} more past appointments
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No past appointments yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Categories - Based on booking history */}
            {userCategories.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-client" />
                    <CardTitle className="text-base">Your Favorites</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userCategories.map((category) => (
                      <Badge 
                        key={category} 
                        variant="secondary"
                        className="bg-client/10 text-client hover:bg-client/20 cursor-pointer"
                        onClick={() => router.push(`/search?category=${encodeURIComponent(category)}`)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Businesses - Based on booking history */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-client" />
                  <CardTitle className="text-base">Recommended for You</CardTitle>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {userCategories.length > 0 
                    ? 'Based on your booking history'
                    : 'Top-rated businesses'
                  }
                </p>
              </CardHeader>
              <CardContent>
                {recommendedBusinesses.length > 0 ? (
                  <div className="space-y-3">
                    {recommendedBusinesses.slice(0, 4).map((business) => (
                      <button
                        type="button"
                        key={business.id} 
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-left"
                        onClick={() => {
                          const slug = createBusinessSlug(business.name, business.id);
                          router.push(`/business/${slug}`);
                        }}
                      >
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-client/20 to-client/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {business.image ? (
                            <img 
                              src={business.image} 
                              alt={business.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Scissors className="h-5 w-5 text-client" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{business.name}</h4>
                          <div className="flex items-center gap-2">
                            {business.rating !== null && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{business.rating.toFixed(1)}</span>
                              </div>
                            )}
                            <span className="text-xs text-gray-500">{business.category}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Sparkles className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recommendations yet</p>
                  </div>
                )}
                <Button 
                  className="w-full mt-4 bg-client hover:bg-client-dark" 
                  onClick={() => router.push('/businesses')}
                >
                  Explore All Services
                </Button>
              </CardContent>
            </Card>

            {/* Near You - Coming Soon */}
            <Card className="shadow-sm border-dashed">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-base text-gray-500">Near You</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Location-based recommendations</p>
                  <p className="text-xs text-gray-400">Find great services near your location</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <QuickLinkItem
                  icon={Heart}
                  label="Saved Businesses"
                  onClick={() => router.push('/profile')}
                />
                <QuickLinkItem
                  icon={HelpCircle}
                  label="Help & Support"
                  onClick={() => {}}
                  comingSoon
                />
                <QuickLinkItem
                  icon={CreditCard}
                  label="Payment Methods"
                  onClick={() => {}}
                  comingSoon
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your appointment at{' '}
              <span className="font-semibold">{selectedBooking?.businessName}</span> for{' '}
              <span className="font-semibold">{selectedBooking?.serviceName}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {submitError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {submitError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Dialog - Using Shared Component */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        booking={selectedBookingForReview}
        token={token}
        onSuccess={handleReviewSuccess}
      />

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for your appointment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Current Booking Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="font-semibold">{selectedBooking?.businessName}</p>
              <p className="text-sm text-gray-600">{selectedBooking?.serviceName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Current: {selectedBooking?.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedBooking?.startTime}
                </span>
              </div>
            </div>

            {/* New Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => {
                  setRescheduleDate(e.target.value);
                  setRescheduleTime(''); // Reset time when date changes
                }}
                min={getMinDate()}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            {/* New Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="reschedule-time">New Time</Label>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-client" />
                  <span className="ml-2 text-sm text-gray-500">Loading available times...</span>
                </div>
              ) : rescheduleDate ? (
                availableSlots.length > 0 ? (
                  <Select 
                    value={rescheduleTime} 
                    onValueChange={setRescheduleTime}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map((slot, idx) => (
                        <SelectItem key={idx} value={slot.display}>
                          {slot.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                    No available time slots for this date. Please select another date.
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-md">
                  Please select a date first to see available times
                </p>
              )}
            </div>

            {submitError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {submitError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRescheduleDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmReschedule}
              disabled={isSubmitting || !rescheduleDate || !rescheduleTime}
              className="bg-client hover:bg-client-dark"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
