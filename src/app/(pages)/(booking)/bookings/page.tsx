"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBooking } from "@/(pages)/(booking)/context/BookingContext";

const BookingsPage = () => {
   
  const { user } = useAuth();
  const router = useRouter();
  const { bookings, getBookingsForUser, businesses, staff, services, cancelBooking } = useBooking();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!user) {
    router.push("/login");
    return null;
  }

  const userBookings = getBookingsForUser(user.id);
  
  // Filter bookings by status
  const upcomingBookings = userBookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending"
  );
  const pastBookings = userBookings.filter(
    (booking) => booking.status === "completed" || booking.status === "cancelled"
  );

  const getBusinessName = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    return business ? business.name : "Unknown Business";
  };

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find((s) => s.id === staffId);
    return staffMember ? staffMember.name : "Unknown Staff";
  };

  const getServiceDetails = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service || { name: "Unknown Service", price: 0, duration: 0 };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancellingId(bookingId);
    setTimeout(() => {
      cancelBooking(bookingId);
      setCancellingId(null);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Bookings</h1>
          <Button 
            onClick={() => router.push("/businesses")}
            className="mt-4 md:mt-0"
          >
            Book New Appointment
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => {
                  const service = getServiceDetails(booking.serviceId);
                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg">
                              {getBusinessName(booking.businessId)}
                            </h3>
                            <p>{service.name} with {getStaffName(booking.staffId)}</p>
                            <div className="flex flex-col md:flex-row md:items-center mt-2 md:space-x-4">
                              <p className="text-gray-600">
                                {formatDate(booking.date)}
                              </p>
                              <p className="text-gray-600">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </p>
                              <span 
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  booking.status === "confirmed" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-lg font-semibold mb-2">${service.price.toFixed(2)}</p>
                            <div className="flex space-x-3">
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                disabled={cancellingId === booking.id}
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No upcoming bookings</h3>
                <p className="text-gray-500 mb-6">You don't have any upcoming appointments scheduled.</p>
                <Button onClick={() => router.push("/businesses")}>
                  Book an Appointment
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => {
                  const service = getServiceDetails(booking.serviceId);
                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg">
                              {getBusinessName(booking.businessId)}
                            </h3>
                            <p>{service.name} with {getStaffName(booking.staffId)}</p>
                            <div className="flex flex-col md:flex-row md:items-center mt-2 md:space-x-4">
                              <p className="text-gray-600">
                                {formatDate(booking.date)}
                              </p>
                              <p className="text-gray-600">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </p>
                              <span 
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  booking.status === "completed" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-lg font-semibold mb-2">${service.price.toFixed(2)}</p>
                            <div className="flex space-x-3">
                              {booking.status === "completed" && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => router.push(`/business/${booking.businessId}`)}
                              >
                                Book Again
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No past bookings</h3>
                <p className="text-gray-500 mb-6">You don't have any past appointments.</p>
                <Button onClick={() => router.push("/businesses")}>
                  Book an Appointment
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BookingsPage;
