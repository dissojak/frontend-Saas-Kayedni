"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Calendar } from "@components/ui/calendar";
// (Removed searchable popovers per request; enhancing card selection UI instead)
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";
import { extractBusinessIdFromSlug, createBusinessSlug } from "@global/lib/businessSlug";

import useBusinessDetail from "./hooks/useBusinessDetail";
import BusinessHeader from "./components/BusinessHeader";

const BusinessDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  
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
    router.push("/booking/checkout");
  };

  // Page state is declared earlier to keep hook order stable.

  // Get the main image to display (first from images array, or fallback to logo/placeholder)
  const mainImage = images.length > 0 
    ? images[0].imageUrl 
    : (business as any).logo || (business as any).imageUrl || "/assets/placeholder.svg";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BusinessHeader business={business as any} onBook={() => setSelectedTabId("booking")} />

        <div className="mb-8">
          <img src={mainImage} alt={(business as any).name} className="w-full h-64 object-cover rounded-lg" />
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {images.slice(1).map((img: any, idx: number) => (
                <img
                  key={`image-${idx}-${img?.id ?? img?.imageUrl ?? 'unknown'}`}
                  src={img.imageUrl}
                  alt={(business as any).name}
                  className="h-20 w-32 object-cover rounded-md flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="about" value={selectedTabId} onValueChange={setSelectedTabId} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About {(business as any).name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{(business as any).description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">Services</h3>
                    <ul className="space-y-2">
                      {services.map((service: any) => (
                        <li key={service.id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span className="font-medium">${service.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Business Hours</h3>
                    <ul className="space-y-1">
                      <li className="flex justify-between"><span>Monday - Friday</span><span>9:00 AM - 7:00 PM</span></li>
                      <li className="flex justify-between"><span>Saturday</span><span>10:00 AM - 5:00 PM</span></li>
                      <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meet Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((member: any, idx: number) => (
                    <Card key={`team-${idx}-${staffKey(member, idx)}`} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-gray-500 mb-2">{member.role}</p>
                        <p className="text-sm">{member.bio}</p>
                        <Button className="w-full mt-4" onClick={() => { setSelectedStaff(member); setSelectedTabId("booking"); }}>Book with {member.name.split(" ")[0]}</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Staff-first booking: Select Staff -> Select Service -> Date & Time */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card>
                    <CardHeader><h3 className="font-semibold">1. Select Staff</h3></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {staff.map((member: any, idx: number) => (
                          <Card
                            key={`staff-${idx}-${staffKey(member, idx)}`}
                            className={`p-3 cursor-pointer transition-all ${
                              selectedStaff?.id === member.id
                                ? "border-2 border-primary ring-2 ring-primary bg-primary/5 shadow-md"
                                : "hover:bg-gray-50 hover:ring-1 hover:ring-gray-300"
                            }`}
                            onClick={() => setSelectedStaff(member)}
                          >
                            <div className="flex items-center gap-3">
                              <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                <h4 className="font-medium">{member.name}</h4>
                                <p className="text-sm text-gray-500">{member.role}</p>
                              </div>
                              {selectedStaff?.id === member.id && (
                                <span className="ml-auto text-xs font-semibold text-primary">Selected</span>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={selectedStaff ? "" : "opacity-60 pointer-events-none"}>
                    <CardHeader><h3 className="font-semibold">2. Select a Service</h3></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(selectedStaff ? staffServices : []).map((service: any, idx: number) => (
                          <Card
                            key={`staff-service-${idx}-${service?.id ?? service?.name ?? 'unknown'}`}
                            className={`p-3 cursor-pointer transition-all ${
                              selectedService?.id === service.id
                                ? "border-2 border-primary ring-2 ring-primary bg-primary/5 shadow-md"
                                : "hover:bg-gray-50 hover:ring-1 hover:ring-gray-300"
                            }`}
                            onClick={() => setSelectedService(service)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-gray-500">{service.duration} min</p>
                              </div>
                              <span className="font-bold">${service.price}</span>
                            </div>
                            {selectedService?.id === service.id && (
                              <div className="mt-2 text-xs font-semibold text-primary">Selected</div>
                            )}
                          </Card>
                        ))}
                        {selectedStaff && (!staffServices || staffServices.length === 0) && (
                          <p className="text-gray-500">No services available for the selected staff.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={selectedStaff ? "" : "opacity-60 pointer-events-none"}>
                    <CardHeader><h3 className="font-semibold">3. Select Date & Time</h3></CardHeader>
                    <CardContent>
                      {!selectedStaff ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                          <div className="mb-4 text-5xl">📅</div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">Select a Staff Member First</h4>
                          <p className="text-center text-gray-500 text-sm max-w-xs">Choose a staff member from the left to view their available dates and book an appointment</p>
                        </div>
                      ) : (
                      <div className="mb-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate ?? undefined}
                          onSelect={(date) => {
                            if (!selectedStaff) return; // Must select staff first
                            if (!date) {
                              setSelectedDate(null);
                              return;
                            }
                            const key = formatDateKey(date);
                            const status = statusByDate.get(key);
                            // Block selecting non-available days (including FULL days)
                            if (status && status !== "AVAILABLE") return;
                            setSelectedDate(date);
                          }}
                          disabled={disabledDays as any}
                          onDayMouseEnter={(day, _modifiers, e) => {
                            if (!selectedStaff) return; // Only show tooltip if staff selected
                            const key = formatDateKey(day);
                            const status = statusByDate.get(key) ?? "UNAVAILABLE";
                            // Show tooltip for ALL dates (available and non-available)
                            setHoveredTooltip({
                              status,
                              date: key,
                              x: e.clientX + 12,
                              y: e.clientY + 12,
                            });
                            // Only apply hover highlight color for AVAILABLE dates
                            if (status === "AVAILABLE") {
                              setHoveredDay(day);
                            }
                          }}
                          onDayMouseLeave={() => {
                            setHoveredDay(null);
                            setHoveredTooltip(null);
                          }}
                          modifiers={{
                            available: availabilityByStatus.AVAILABLE || [],
                            full: availabilityByStatus.FULL || [],
                            closed: availabilityByStatus.CLOSED || [],
                            sick: availabilityByStatus.SICK || [],
                            vacation: availabilityByStatus.VACATION || [],
                            dayOff: availabilityByStatus.DAY_OFF || [],
                            unavailable: availabilityByStatus.UNAVAILABLE || [],
                            // Only apply hovered modifier to AVAILABLE dates
                            hovered: hoveredDay && statusByDate.get(formatDateKey(hoveredDay)) === "AVAILABLE" ? [hoveredDay] : [],
                          }}
                          modifiersClassNames={{
                            // Non-available statuses: prevent default button hover state from changing color
                            full: "bg-orange-100 text-orange-700 hover:bg-orange-100",
                            closed: "bg-slate-200 text-slate-500 hover:bg-slate-200",
                            sick: "bg-rose-100 text-rose-700 hover:bg-rose-100",
                            vacation: "bg-amber-100 text-amber-700 hover:bg-amber-100",
                            dayOff: "bg-blue-100 text-blue-700 hover:bg-blue-100",
                            unavailable: "bg-gray-200 text-gray-500 hover:bg-gray-200",
                            // Only AVAILABLE gets a background color
                            available: "bg-emerald-50 text-emerald-700 hover:bg-blue-400 hover:text-white",
                            // Hovered (only for AVAILABLE dates) shows purple highlight
                            hovered: "bg-purple-300 text-purple-800 font-semibold",
                          }}
                          className="rounded-md border p-3 pointer-events-auto"
                        />
                      </div>
                      )}

                      {selectedDate && (
                        <div>
                          <h4 className="font-medium mb-2">Available Times</h4>
                          {slotsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                              <span className="ml-2 text-gray-500">Loading slots...</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {filteredTimeSlots.length > 0 ? filteredTimeSlots.map((slot: any, idx: number) => (
                                <Button
                                  key={`slot-${idx}-${slot?.id ?? formatTimeSlot(slot.startTime)}`}
                                  variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                                  className={selectedTimeSlot?.id === slot.id ? "ring-2 ring-primary" : ""}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                >
                                  {formatTimeSlot(slot.startTime)}
                                </Button>
                              )) : (
                                <p className="text-gray-500 col-span-full text-center py-2">No available slots on this date</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {selectedService && selectedStaff && selectedDate && selectedTimeSlot && (
                  <Card className="mt-8">
                    <CardHeader><CardTitle>Booking Summary</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium">Service</h4>
                          <p>{selectedService.name}</p>
                          <p className="text-gray-500">${selectedService.price}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Staff</h4>
                          <p>{selectedStaff.name}</p>
                          <p className="text-gray-500">{selectedStaff.role}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Date & Time</h4>
                          <p>{selectedDate.toDateString()}</p>
                          <p className="text-gray-500">{formatTimeSlot(selectedTimeSlot.startTime)} - {formatTimeSlot(selectedTimeSlot.endTime)}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Total</h4>
                          <p className="text-xl font-bold">${selectedService.price}</p>
                        </div>
                      </div>
                      <Button className="w-full" onClick={handleContinueBooking}>Continue to Checkout</Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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
    </Layout>
  );
};

export default BusinessDetailPage;
