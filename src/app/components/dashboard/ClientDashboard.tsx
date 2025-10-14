"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { redirect } from "next/navigation";

const ClientDashboard = () => {
  const { user } = useAuth();
   

  // Mock upcoming bookings
  const upcomingBookings = [
    { 
      id: "1", 
      business: "Style Studio", 
      service: "Haircut & Style", 
      staff: "Alex Morgan",
      date: "Today", 
      time: "2:00 PM" 
    },
    { 
      id: "2", 
      business: "Tech Tutors", 
      service: "Private Coding Lesson", 
      staff: "Taylor Swift",
      date: "May 25", 
      time: "10:00 AM" 
    },
  ];

  // Mock past bookings
  const pastBookings = [
    { 
      id: "3", 
      business: "GameZone", 
      service: "VR Gaming Session", 
      staff: "Chris Evans",
      date: "May 15", 
      time: "4:00 PM",
      reviewed: true
    },
    { 
      id: "4", 
      business: "Style Studio", 
      service: "Haircut & Style", 
      staff: "Jamie Lee",
      date: "May 2", 
      time: "11:30 AM",
      reviewed: false
    },
  ];

  // Mock recommended businesses
  const recommendedBusinesses = [
    {
      id: "biz-1",
      name: "Style Studio",
      category: "Barber",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "biz-2",
      name: "Tech Tutors",
      category: "Education",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "biz-3",
      name: "GameZone",
      category: "Gaming",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-client">Hello, {user?.name}</h1>
        <Button 
          className="bg-client hover:bg-client-dark"
          onClick={() => redirect("/businesses")}
        >
          Book a New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-semibold">{booking.business}</h3>
                            <p className="text-gray-500">{booking.service} with {booking.staff}</p>
                            <p className="text-gray-500">
                              {booking.date} • {booking.time}
                            </p>
                          </div>
                          <div className="flex space-x-3 self-end md:self-center">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="destructive" size="sm">Cancel</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-gray-500">No upcoming appointments.</p>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => redirect("/bookings")}
              >
                View All Bookings
              </Button>
            </CardContent>
          </Card>

          {/* Past Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {pastBookings.length > 0 ? (
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-semibold">{booking.business}</h3>
                            <p className="text-gray-500">{booking.service} with {booking.staff}</p>
                            <p className="text-gray-500">
                              {booking.date} • {booking.time}
                            </p>
                          </div>
                          <div className="flex space-x-3 self-end md:self-center">
                            <Button 
                              variant={booking.reviewed ? "outline" : "default"} 
                              className={booking.reviewed ? "" : "bg-client hover:bg-client-dark"}
                              size="sm"
                              disabled={booking.reviewed}
                            >
                              {booking.reviewed ? "Reviewed" : "Leave Review"}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => redirect(`/businesses/${booking.id}`)}
                            >
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-gray-500">No past appointments.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Recommended Businesses */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedBusinesses.map((business) => (
                  <div key={business.id} className="flex items-center space-x-4">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{business.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm">{business.rating}</span>
                        <span className="text-sm text-gray-500 ml-2">{business.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full mt-4 bg-client hover:bg-client-dark"
                onClick={() => redirect("/businesses")}
              >
                Explore More
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Help & Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
