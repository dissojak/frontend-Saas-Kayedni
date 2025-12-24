"use client";

import React from 'react';
import useClientDashboard from './hooks/useClientDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { redirect } from 'next/navigation';

export default function ClientDashboard() {
  const { user, upcomingBookings, pastBookings, recommendedBusinesses } = useClientDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-client">Hello, {user?.name}</h1>
        <Button className="bg-client hover:bg-client-dark" onClick={() => redirect('/businesses')}>Book a New Appointment</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                            <p className="text-gray-500">{booking.date} • {booking.time}</p>
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
              <Button variant="outline" className="w-full mt-4" onClick={() => redirect('/bookings')}>View All Bookings</Button>
            </CardContent>
          </Card>

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
                            <p className="text-gray-500">{booking.date} • {booking.time}</p>
                          </div>
                          <div className="flex space-x-3 self-end md:self-center">
                            <Button variant={booking.reviewed ? 'outline' : 'default'} className={booking.reviewed ? '' : 'bg-client hover:bg-client-dark'} size="sm" disabled={booking.reviewed}>
                              {booking.reviewed ? 'Reviewed' : 'Leave Review'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => redirect(`/businesses/${booking.id}`)}>Book Again</Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedBusinesses.map((business) => (
                  <div key={business.id} className="flex items-center space-x-4">
                    <img src={business.image} alt={business.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold">{business.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm">
                          {typeof business.rating === 'number'
                            ? business.rating.toFixed(1)
                            : (business.rating ? String(business.rating) : '—')}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">{business.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-client hover:bg-client-dark" onClick={() => redirect('/businesses')}>Explore More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">Account Settings</Button>
                <Button variant="outline" className="w-full justify-start">Help & Support</Button>
                <Button variant="outline" className="w-full justify-start">Payment Methods</Button>
                <Button variant="outline" className="w-full justify-start">Notifications</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
