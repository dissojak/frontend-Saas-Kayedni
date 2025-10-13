"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useBooking } from "../../context/BookingContext";

const BookingCheckoutPage = () => {
   
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const { 
    selectedBusiness, 
    selectedService, 
    selectedStaff, 
    selectedDate, 
    selectedTimeSlot,
    createBooking
  } = useBooking();
  
  const [loading, setLoading] = useState(false);

  // If not all booking details are selected, router.push to businesses page
  if (!selectedBusiness || !selectedService || !selectedStaff || !selectedDate || !selectedTimeSlot) {
    router.push("/businesses");
    return null;
  }

  const formatTimeSlot = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSubmitBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // Process booking
      createBooking({
        businessId: selectedBusiness.id,
        serviceId: selectedService.id,
        staffId: selectedStaff.id,
        userId: user.id,
        date: selectedDate,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        price: selectedService.price,
        status: "confirmed",
      });

      // Show success toast
      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been successfully booked.",
      });

      // Navigate to bookings page
      router.push("/bookings");
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded overflow-hidden mr-4">
                    <img
                      src={selectedBusiness.logo}
                      alt={selectedBusiness.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBusiness.name}</h3>
                    <p className="text-gray-500">{selectedBusiness.address}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-500">Service</h4>
                    <p>{selectedService.name}</p>
                    <p className="text-sm">{selectedService.duration} minutes</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-500">Staff</h4>
                    <div className="flex items-center">
                      <img
                        src={selectedStaff.avatar}
                        alt={selectedStaff.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{selectedStaff.name}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-500">Date</h4>
                    <p>{selectedDate.toDateString()}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-500">Time</h4>
                    <p>{formatTimeSlot(selectedTimeSlot.startTime)} - {formatTimeSlot(selectedTimeSlot.endTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Your phone number" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special Requests (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea 
                  className="w-full border rounded-md p-2 min-h-[100px] resize-none"
                  placeholder="Any specific requirements or notes for your appointment"
                />
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{selectedService.name}</span>
                  <span>${selectedService.price.toFixed(2)}</span>
                </div>
                {/* Add taxes or fees if needed */}
              </CardContent>
              <Separator className="my-2" />
              <CardFooter className="flex justify-between pt-4">
                <span className="font-bold">Total</span>
                <span className="font-bold">${selectedService.price.toFixed(2)}</span>
              </CardFooter>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button 
                  className="w-full"
                  disabled={loading}
                  onClick={handleSubmitBooking}
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  By confirming, you agree to our{" "}
                  <a href="/terms" className="text-primary">Terms of Service</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingCheckoutPage;
