"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Calendar } from "@components/ui/calendar";
import { Textarea } from "@components/ui/textarea";
import { Clock, ArrowRight, Tag, ChevronLeft, ChevronRight, Star, MessageSquare, ThumbsUp, Image as ImageIcon, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@components/ui/alert-dialog";
// (Removed searchable popovers per request; enhancing card selection UI instead)
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { extractBusinessIdFromSlug, createBusinessSlug } from "@global/lib/businessSlug";
import { useTracking } from "@global/hooks/useTracking";
import TimeOnPageTracker from "@components/tracking/TimeOnPageTracker";
import ScrollDepthTracker from "@components/tracking/ScrollDepthTracker";

import useBusinessDetail from "./hooks/useBusinessDetail";
import BusinessHeader from "./components/BusinessHeader";
import InlinePhotoGallery from "./components/InlinePhotoGallery";

const BusinessDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { trackEvent } = useTracking();
  const { user } = useAuth();
  
  // Extract the business ID from the slug (e.g., "glamour-salon-spa-1" -> "1")
  const businessId = slug ? extractBusinessIdFromSlug(slug) : undefined;

  // Booking context provides selection state and actions (keeps existing behavior)
  const {
    selectedStaff,
    setSelectedStaff,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    setSelectedBusiness,
  } = useBooking();

  const { business, staff, services, staffServices, staffAvailability, loadServicesForStaff, loadAvailabilityForStaff, clearStaffAvailability, loadTimeSlotsForDate, clearSlots, slots, slotsLoading, images, loading } = useBusinessDetail(businessId ?? undefined);
  
  // Track business_view when business loads
  useEffect(() => {
    if (business) {
      trackEvent('business_view', {
        businessId: String((business as any).id),
        businessName: (business as any).name,
        category: (business as any).category ?? 'unknown',
        source: 'direct',
      });
    }
  }, [business, trackEvent]);
  
  // Redirect to correct slug URL if business is loaded but slug doesn't match
  useEffect(() => {
    if (business && slug) {
      const correctSlug = createBusinessSlug((business as any).name, (business as any).id);
      if (slug !== correctSlug) {
        router.replace(`/business/${correctSlug}`);
      }
    }
  }, [business, slug, router]);

  // Reset selections when unmounting
  useEffect(() => {
    return () => {
      setSelectedStaff(null);
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
    };
  }, [setSelectedStaff, setSelectedService, setSelectedDate, setSelectedTimeSlot]);

  // When staff changes, load services for that staff and clear previously selected service/time
  useEffect(() => {
    if (!selectedStaff?.id) {
      setSelectedService(null);
      clearStaffAvailability();
      clearSlots();
      return;
    }
    const staffId = String(selectedStaff.id);
    loadServicesForStaff(staffId);
    // Fetch availability for the next 30 days
    const today = new Date(); today.setHours(0,0,0,0);
    const to = new Date(today); to.setDate(today.getDate() + 30);
    // Format dates in local timezone (not UTC) to avoid date shifting
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    loadAvailabilityForStaff(staffId, fmt(today), fmt(to));
    setSelectedService(null);
    setSelectedTimeSlot(null);
    clearSlots();
  }, [selectedStaff]);

  // When date or service changes, generate time slots
  useEffect(() => {
    if (!selectedStaff?.id || !selectedDate) {
      console.log('[page.tsx] Skipping slot load - missing:', { staffId: selectedStaff?.id, date: selectedDate });
      return;
    }
    const staffId = String(selectedStaff.id);
    // Use service duration from selected service, or default to 30 minutes
    const serviceDuration = selectedService?.duration || 30;
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    console.log('[page.tsx] Loading slots for:', { staffId, date: dateStr, serviceDuration });
    loadTimeSlotsForDate(staffId, selectedDate, serviceDuration);
  }, [selectedStaff, selectedDate, selectedService]);

  // Page state (moved up so hooks order is stable)
  const [selectedTabId, setSelectedTabId] = useState<string>("about");
  const [hoveredTooltip, setHoveredTooltip] = useState<{ status: string; date: string; x: number; y: number } | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // New state for modals and multi-step booking
  const [bookingStep, setBookingStep] = useState(1);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

  // Fake reviews data
  const fakeReviews = [
    { id: 1, author: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=1", rating: 5, date: "2 days ago", content: "Absolutely amazing experience! The staff was so professional and the service was top-notch. Will definitely be coming back.", likes: 12 },
    { id: 2, author: "Michael Chen", avatar: "https://i.pravatar.cc/150?u=2", rating: 4, date: "1 week ago", content: "Great place, very clean and relaxing. The wait time was a bit long but the service made up for it.", likes: 5 },
    { id: 3, author: "Emily Rodriguez", avatar: "https://i.pravatar.cc/150?u=3", rating: 5, date: "2 weeks ago", content: "I've been looking for a place like this for months. They really know what they're doing. Highly recommended!", likes: 8 },
    { id: 4, author: "David Smith", avatar: "https://i.pravatar.cc/150?u=4", rating: 5, date: "1 month ago", content: "Perfect from start to finish. The booking process was easy and the actual appointment was even better.", likes: 24 },
    { id: 5, author: "Jessica Taylor", avatar: "https://i.pravatar.cc/150?u=5", rating: 5, date: "2 months ago", content: "Love the atmosphere here. The staff is always so welcoming and friendly.", likes: 15 },
  ];

  // Helper to reset booking state
  const resetBookingState = () => {
    setSelectedStaff(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setBookingStep(1);
  };

  const handleCancelBooking = () => {
    setIsCancelAlertOpen(false);
    setIsBookingMode(false);
    resetBookingState();
  };

  // Scroll to booking section when entering booking mode
useEffect(() => {
  if (isBookingMode) {
    // 200ms-300ms is the "sweet spot" for React to finish rendering DOM changes
    const timer = setTimeout(() => {
      const bookingSection = document.getElementById('booking-section');
      
      if (bookingSection) {
        bookingSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',  // Vertically centers the element
          inline: 'nearest' // Avoids horizontal snapping
        });
      }
    }, 250); 

    return () => clearTimeout(timer); // Cleanup to prevent memory leaks
  }
}, [isBookingMode]);

  // Availability mapping for calendar modifiers (keep hooks above conditional returns to avoid hook order changes)
  const availabilityByStatus = useMemo(() => {
    const acc: Record<string, Date[]> = {
      AVAILABLE: [],
      FULL: [],
      CLOSED: [],
      SICK: [],
      VACATION: [],
      DAY_OFF: [],
      UNAVAILABLE: [],
    };
    staffAvailability.forEach((a: any) => {
      if (!a?.date) return;
      const d = new Date(a.date + 'T00:00:00');
      const key = a.status || 'UNAVAILABLE';
      if (!acc[key]) acc[key] = [];
      acc[key].push(d);
    });
    return acc;
  }, [staffAvailability]);

  const statusByDate = useMemo(() => {
    const map = new Map<string, string>();
    staffAvailability.forEach((a: any) => {
      if (!a?.date) return;
      map.set(a.date, a.status || "UNAVAILABLE");
    });
    return map;
  }, [staffAvailability]);

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const maxDate = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + 30); return d; }, [today]);
  // Only hard-disable out-of-range; status days stay hoverable but selection is blocked manually
  const disabledDays = useMemo(() => (
    [
      { before: today },
      { after: maxDate },
    ]
  ), [today, maxDate]);

  const formatDateKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: "Available",
      FULL: "Fully Booked",
      CLOSED: "Closed",
      SICK: "Sick",
      VACATION: "Vacation",
      DAY_OFF: "Day off",
      UNAVAILABLE: "Unavailable",
    };
    return labels[status] || "Unavailable";
  };

  const statusDotClass = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "bg-emerald-500",
      FULL: "bg-orange-500",
      CLOSED: "bg-slate-400",
      SICK: "bg-rose-500",
      VACATION: "bg-amber-500",
      DAY_OFF: "bg-blue-500",
      UNAVAILABLE: "bg-gray-400",
    };
    return colors[status] || "bg-gray-400";
  };

  // If still loading
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
      </Layout>
    );
  }

  // If business not found
  if (!business) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
          <p className="text-gray-600 mb-8">The business you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/businesses")}>Back to Businesses</Button>
        </div>
      </Layout>
    );
  }

  // Time slots are already filtered by date from loadTimeSlotsForDate
  // Just filter to ensure isAvailable is true (should already be, but extra safety)
  const filteredTimeSlots = selectedDate && selectedStaff
    ? slots.filter((slot: any) => slot.isAvailable !== false)
    : [];

  const formatTimeSlot = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Stable keys/identifiers for items that may lack IDs
  const staffKey = (m: any, i: number) => String(m?.id ?? m?.email ?? m?.name ?? `staff-${i}`);
  const serviceKey = (s: any, i: number) => String(s?.id ?? s?.name ?? `service-${i}`);

  const handleContinueBooking = () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTimeSlot) return;
    
    // Track booking_started
    trackEvent('booking_started', {
      businessId: String((business as any).id),
      businessName: (business as any).name,
      serviceId: String(selectedService.id),
      serviceName: selectedService.name,
      staffId: String(selectedStaff.id),
      staffName: selectedStaff.name,
      price: selectedService.price,
    });

    // Store all booking data in localStorage to persist across navigation
    const bookingData = {
      business: business,
      staff: selectedStaff,
      service: selectedService,
      date: selectedDate.toISOString(), // Store as ISO string
      timeSlot: {
        id: selectedTimeSlot.id,
        staffId: selectedTimeSlot.staffId,
        startTime: selectedTimeSlot.startTime instanceof Date ? selectedTimeSlot.startTime.toISOString() : selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime instanceof Date ? selectedTimeSlot.endTime.toISOString() : selectedTimeSlot.endTime,
        isAvailable: selectedTimeSlot.isAvailable,
      },
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    console.log('[page.tsx] Stored booking data:', {
      business: bookingData.business?.name,
      staff: bookingData.staff?.name,
      service: bookingData.service?.name,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
    });
    
    router.push("/booking/checkout");
  };

  // Page state is declared earlier to keep hook order stable.

  return (
    <Layout>
      {/* Tracking Components */}
      <TimeOnPageTracker pageName="business_detail" />
      <ScrollDepthTracker pageName="business_detail" />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BusinessHeader business={business as any} onBook={() => {
          setIsBookingMode(true);
        }} />

        {!isBookingMode ? (
          <>
            {/* Inline Photo Gallery */}
            <InlinePhotoGallery
              images={images}
              businessName={(business as any).name ?? ""}
            />

        {/* Main Content Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About {(business as any).name}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{(business as any).description}</p>
            </section>

            <hr className="border-gray-200" />

            {/* Staff Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Meet Our Team</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {staff.map((member: any) => (
                  <div key={member.id ?? member.name} className="flex flex-col items-center text-center group">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-transparent group-hover:ring-primary/20 transition-all">
                      <img src={member.avatar} alt={member.name} width={96} height={96} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Reviews Section (Facebook Style) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  Reviews
                </h2>
                <Button variant="outline" onClick={() => setIsReviewsModalOpen(true)}>
                  View All Reviews
                </Button>
              </div>
              
              <div className="space-y-6 mb-6">
                {fakeReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={review.avatar} alt={review.author} width={40} height={40} className="w-10 h-10 rounded-full" />
                        <div>
                          <h4 className="font-semibold text-sm">{review.author}</h4>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={`star-${review.id}-${star}`} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">{review.content}</p>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" /> {review.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4" /> Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Write a Review Section */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative overflow-hidden">
                <h3 className="font-semibold mb-3">Leave a Review</h3>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400 hover:fill-yellow-400 transition-colors" />
                  ))}
                </div>
                <Textarea 
                  placeholder="Share your experience..." 
                  className="min-h-[100px] bg-white resize-none"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <div className="mt-3 flex justify-end">
                  <Button>Post Review</Button>
                </div>

                {!user && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-white/30 flex flex-col items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm mx-4">
                      <h4 className="font-bold text-lg mb-2">Join the conversation</h4>
                      <p className="text-gray-500 text-sm mb-4">You need to be logged in to leave a review and share your experience.</p>
                      <Button onClick={() => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))} className="w-full">
                        Login to Review
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Ready to book?</h3>
                  <p className="text-gray-500 text-sm mb-6">Schedule your appointment in just a few clicks.</p>
                  <Button size="lg" className="w-full text-lg h-14" onClick={() => {
                    setIsBookingMode(true);
                  }}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between items-center"><span className="text-gray-600">Monday - Friday</span><span className="font-medium">9:00 AM - 7:00 PM</span></li>
                    <li className="flex justify-between items-center"><span className="text-gray-600">Saturday</span><span className="font-medium">10:00 AM - 5:00 PM</span></li>
                    <li className="flex justify-between items-center"><span className="text-gray-600">Sunday</span><span className="font-medium text-red-500">Closed</span></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </>
        ) : (
        <div className="mt-8 animate-in fade-in duration-500">
          <Button variant="ghost" onClick={() => setIsBookingMode(false)} className="mb-6 -ml-4 text-gray-500 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Business Profile
          </Button>
          
          {/* Booking Section (Option 1) */}
          <section id="booking-section" className="-scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
              
              {bookingStep === 1 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Staff Selection */}
                    <div className={`p-6 transition-all duration-500 ease-in-out ${selectedStaff ? 'md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50' : 'w-full'}`}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        <span>Select Professional</span>
                      </h3>
                      <div className={`grid gap-3 ${selectedStaff ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                        {staff.map((member: any, idx: number) => (
                          <button
                            type="button"
                            key={member.id ?? `book-staff-${idx}`}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 bg-white relative overflow-hidden text-left ${
                              selectedStaff?.id === member.id
                                ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                                : "border-transparent shadow-sm hover:border-gray-200"
                            }`}
                            onClick={() => setSelectedStaff(member)}
                          >
                            {selectedStaff?.id === member.id && (
                              <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-lg">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                            <img src={member.avatar} alt={member.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">{member.name}</h4>
                              {!selectedStaff && <p className="text-xs text-gray-500">{member.role}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Service Selection (Slides in) */}
                    {selectedStaff && (
                      <div className="p-6 md:w-2/3 animate-in slide-in-from-right-8 duration-500">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                          <span>Select Service</span>
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {(staffServices || []).map((service: any, idx: number) => (
                            <button
                              type="button"
                              key={service.id ?? `book-service-${idx}`}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all bg-white relative overflow-hidden text-left w-full ${
                                selectedService?.id === service.id
                                  ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                                  : "border-transparent shadow-sm hover:border-gray-200"
                              }`}
                              onClick={() => setSelectedService(service)}
                            >
                              {selectedService?.id === service.id && (
                                <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-lg">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3" /> {service.duration} min
                                  </p>
                                </div>
                                <span className="font-bold text-lg">${service.price}</span>
                              </div>
                            </button>
                          ))}
                          {(!staffServices || staffServices.length === 0) && (
                            <div className="text-center py-8 text-gray-500">No services available for {selectedStaff.name}.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Bar */}
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center animate-in fade-in duration-300">
                    <Button variant="outline" onClick={() => setIsCancelAlertOpen(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Cancel
                    </Button>
                    {selectedStaff && selectedService && (
                      <Button size="lg" onClick={() => setBookingStep(2)}>
                        Confirm and pick a date <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right-8 duration-500">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                      Choose Date & Time
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setBookingStep(1)}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  </div>
                  
                  <div className="p-6 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <Calendar
                        mode="single"
                        selected={selectedDate ?? undefined}
                        onSelect={(date) => {
                          if (!date) {
                            setSelectedDate(null);
                            return;
                          }
                          const key = formatDateKey(date);
                          const status = statusByDate.get(key);
                          if (status && status !== "AVAILABLE") return;
                          setSelectedDate(date);
                        }}
                        disabled={disabledDays as any}
                        modifiers={{
                          available: availabilityByStatus.AVAILABLE || [],
                          full: availabilityByStatus.FULL || [],
                          closed: availabilityByStatus.CLOSED || [],
                          sick: availabilityByStatus.SICK || [],
                          vacation: availabilityByStatus.VACATION || [],
                          dayOff: availabilityByStatus.DAY_OFF || [],
                          unavailable: availabilityByStatus.UNAVAILABLE || [],
                        }}
                        modifiersClassNames={{
                          full: "bg-orange-100 text-orange-700 hover:bg-orange-100",
                          closed: "bg-slate-200 text-slate-500 hover:bg-slate-200",
                          sick: "bg-rose-100 text-rose-700 hover:bg-rose-100",
                          vacation: "bg-amber-100 text-amber-700 hover:bg-amber-100",
                          dayOff: "bg-blue-100 text-blue-700 hover:bg-blue-100",
                          unavailable: "bg-gray-200 text-gray-500 hover:bg-gray-200",
                          available: "bg-emerald-50 text-emerald-700 hover:bg-blue-400 hover:text-white",
                        }}
                        className="w-full border rounded-xl p-3"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium mb-4 text-gray-900">Available Times</h4>
                      {(() => {
                        if (!selectedDate) {
                          return (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 h-[300px] flex items-center justify-center">
                              Select a date on the calendar
                            </div>
                          );
                        }
                        if (slotsLoading) {
                          return (
                            <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 h-[300px]">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                            {filteredTimeSlots.length > 0 ? filteredTimeSlots.map((slot: any) => (
                              <Button
                                key={slot.id ?? `slot-${slot.startTime}`}
                                variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                                className={`w-full h-12 relative overflow-hidden transition-all ${selectedTimeSlot?.id === slot.id ? "ring-2 ring-primary ring-offset-2 shadow-md bg-primary text-primary-foreground" : "bg-white hover:border-primary/50"}`}
                                onClick={() => setSelectedTimeSlot(slot)}
                              >
                                {selectedTimeSlot?.id === slot.id && (
                                  <div className="absolute top-0 right-0 bg-white/20 text-white p-0.5 rounded-bl-lg">
                                    <Check className="w-3 h-3" />
                                  </div>
                                )}
                                {formatTimeSlot(slot.startTime)}
                              </Button>
                            )) : (
                              <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No slots available for this date
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center animate-in fade-in duration-300">
                    <Button variant="outline" onClick={() => setIsCancelAlertOpen(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Cancel
                    </Button>
                    {selectedDate && selectedTimeSlot && (
                      <Button size="lg" onClick={() => {
                        setBookingStep(3);
                        setTimeout(() => {
                          const bookingSection = document.getElementById('booking-section');
                          if (bookingSection) {
                            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, 100);
                      }}>
                        Review Booking <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right-8 duration-500">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                      Confirm Details
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setBookingStep(2)}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  </div>

                  {selectedService && selectedStaff && selectedDate && selectedTimeSlot && (
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                              <Tag className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Service</p>
                              <p className="font-medium text-lg text-gray-900">{selectedService.name}</p>
                              <p className="text-gray-500">{selectedService.duration} min</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                              <img src={selectedStaff.avatar} alt={selectedStaff.name} width={48} height={48} className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Professional</p>
                              <p className="font-medium text-lg text-gray-900">{selectedStaff.name}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                              <p className="font-medium text-lg text-gray-900">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              <p className="text-gray-500">{formatTimeSlot(selectedTimeSlot.startTime)} - {formatTimeSlot(selectedTimeSlot.endTime)}</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                            <p className="text-3xl font-bold text-gray-900">${selectedService.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
                    <Button variant="outline" onClick={() => setIsCancelAlertOpen(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Cancel
                    </Button>
                    <Button size="lg" onClick={handleContinueBooking} className="px-8">
                      Confirm & Checkout <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Reviews Modal */}
      <Dialog open={isReviewsModalOpen} onOpenChange={setIsReviewsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              All Reviews
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {fakeReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.author} width={40} height={40} className="w-10 h-10 rounded-full" />
                    <div>
                      <h4 className="font-semibold text-sm">{review.author}</h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={`modal-star-${review.id}-${star}`} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.content}</p>
              </div>
            ))}
          </div>
          <div className="p-6 border-t bg-gray-50 relative">
            <h3 className="font-semibold mb-3">Leave a Review</h3>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400 hover:fill-yellow-400 transition-colors" />
              ))}
            </div>
            <Textarea 
              placeholder="Share your experience..." 
              className="min-h-[100px] bg-white resize-none"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="mt-3 flex justify-end">
              <Button>Post Review</Button>
            </div>

            {!user && (
              <div className="absolute inset-0 backdrop-blur-sm bg-white/30 flex flex-col items-center justify-center z-10">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm mx-4">
                  <h4 className="font-bold text-lg mb-2">Join the conversation</h4>
                  <p className="text-gray-500 text-sm mb-4">You need to be logged in to leave a review and share your experience.</p>
                  <Button onClick={() => router.push('/login')} className="w-full">
                    Login to Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {hoveredTooltip && (
        <div
          className="pointer-events-none fixed z-50 inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-lg"
          style={{ top: hoveredTooltip.y, left: hoveredTooltip.x }}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${statusDotClass(hoveredTooltip.status)}`} />
          <span className="font-medium">{statusLabel(hoveredTooltip.status)}</span>
          <span className="text-xs text-gray-500">{hoveredTooltip.date}</span>
        </div>
      )}

      {/* Cancel Confirmation Alert */}
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel? All your selected details will be lost and you will need to start over.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancelAlertOpen(false)}>
              No, continue booking
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-red-500 hover:bg-red-600">
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default BusinessDetailPage;
