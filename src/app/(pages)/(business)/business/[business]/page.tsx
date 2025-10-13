"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";

const BusinessDetailPage = () => {
  const { business: businessId } = useParams<{ business: string }>();
   
  const { 
    getBusinessById, 
    getStaffByBusinessId, 
    getServicesByBusinessId,
    selectedStaff, 
    setSelectedStaff,
    selectedService,
    setSelectedService,
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot,
    availableSlots
  } = useBooking();
  
  const [selectedTabId, setSelectedTabId] = useState<string>("about");
  const router = useRouter();

  // Get business details
  const business = getBusinessById(businessId || "");
  const staff = getStaffByBusinessId(businessId || "");
  const services = getServicesByBusinessId(businessId || "");

  // Reset selections when unmounting
  useEffect(() => {
    return () => {
      setSelectedStaff(null);
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
    };
  }, [setSelectedStaff, setSelectedService, setSelectedDate, setSelectedTimeSlot]);

  // If business is not found
  if (!business) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
          <p className="text-gray-600 mb-8">
            The business you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/businesses")}>
            Back to Businesses
          </Button>
        </div>
      </Layout>
    );
  }

  // Filter time slots for selected date
  const filteredTimeSlots = selectedDate && selectedStaff 
    ? availableSlots.filter(slot => {
        const slotDate = new Date(slot.startTime);
        return (
          slotDate.getDate() === selectedDate.getDate() &&
          slotDate.getMonth() === selectedDate.getMonth() &&
          slotDate.getFullYear() === selectedDate.getFullYear() &&
          slot.isAvailable
        );
      })
    : [];

  const formatTimeSlot = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleContinueBooking = () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTimeSlot) {
      return;
    }
    
    // In a real app, navigate to checkout page
    router.push("/booking/checkout");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Business Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <Button onClick={() => setSelectedTabId("booking")}>Book Now</Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{business.category}</span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{business.rating}</span>
            </div>
            <span className="text-gray-600">{business.address}</span>
          </div>
        </div>

        {/* Business Image */}
        <div className="mb-8">
          <img
            src={business.logo.replace('w=200', 'w=1200')}
            alt={business.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        {/* Business Details Tabs */}
        <Tabs defaultValue="about" value={selectedTabId} onValueChange={setSelectedTabId} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About {business.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  {business.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">Services</h3>
                    <ul className="space-y-2">
                      {services.map((service) => (
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
                      <li className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 7:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 5:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meet Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-gray-500 mb-2">{member.role}</p>
                        <p className="text-sm">{member.bio}</p>
                        <Button 
                          className="w-full mt-4"
                          onClick={() => {
                            setSelectedStaff(member);
                            setSelectedTabId("booking");
                          }}
                        >
                          Book with {member.name.split(" ")[0]}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Tab */}
          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Step 1: Select Service */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold">1. Select a Service</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <Card 
                            key={service.id}
                            className={`p-3 cursor-pointer transition-all ${
                              selectedService?.id === service.id 
                                ? "border-2 border-primary" 
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedService(service)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {service.duration} min
                                </p>
                              </div>
                              <span className="font-bold">${service.price}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 2: Select Staff */}
                  <Card className={selectedService ? "" : "opacity-60 pointer-events-none"}>
                    <CardHeader>
                      <h3 className="font-semibold">2. Select Staff</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {staff.map((member) => (
                          <Card 
                            key={member.id}
                            className={`p-3 cursor-pointer transition-all ${
                              selectedStaff?.id === member.id 
                                ? "border-2 border-primary" 
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedStaff(member)}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-medium">{member.name}</h4>
                                <p className="text-sm text-gray-500">{member.role}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 3: Select Date & Time */}
                  <Card className={selectedService && selectedStaff ? "" : "opacity-60 pointer-events-none"}>
                    <CardHeader>
                      <h3 className="font-semibold">3. Select Date & Time</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate ?? undefined}
                          onSelect={(date) => setSelectedDate(date ?? null)}
                          disabled={(date) => {
                            // Disable past dates
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            // Disable dates more than 30 days in the future
                            const thirtyDaysFromNow = new Date();
                            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                            return date < today || date > thirtyDaysFromNow;
                          }}
                          className="rounded-md border p-3 pointer-events-auto"
                        />
                      </div>

                      {selectedDate && (
                        <div>
                          <h4 className="font-medium mb-2">Available Times</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {filteredTimeSlots.length > 0 ? (
                              filteredTimeSlots.map((slot) => (
                                <Button
                                  key={slot.id}
                                  variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                >
                                  {formatTimeSlot(slot.startTime)}
                                </Button>
                              ))
                            ) : (
                              <p className="text-gray-500 col-span-full text-center py-2">
                                No available slots on this date
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Booking Summary */}
                {selectedService && selectedStaff && selectedDate && selectedTimeSlot && (
                  <Card className="mt-8">
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
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
    </Layout>
  );
};

export default BusinessDetailPage;
