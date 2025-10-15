"use client";

import React from 'react';
import useStaffDashboard from './hooks/useStaffDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';

export default function StaffDashboard() {
  const { user, upcomingAppointments, tomorrowAppointments } = useStaffDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-staff">Staff Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name}</p>
        </div>
        <Button className="bg-staff hover:bg-staff-dark">Update Schedule</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold">{upcomingAppointments.length}</h3>
                <p className="text-gray-500">Today's Appointments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold">{upcomingAppointments.filter(a => a.status === 'Confirmed').length}</h3>
                <p className="text-gray-500">Confirmed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold">{upcomingAppointments.filter(a => a.status === 'Pending').length}</h3>
                <p className="text-gray-500">Pending</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{appointment.client}</h3>
                        <p className="text-gray-500">{appointment.service}</p>
                        <p className="text-gray-500">{appointment.time}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{appointment.status}</span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button className="bg-staff hover:bg-staff-dark" size="sm">Complete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">No appointments for today.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tomorrow's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {tomorrowAppointments.length > 0 ? (
            <div className="space-y-4">
              {tomorrowAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{appointment.client}</h3>
                        <p className="text-gray-500">{appointment.service}</p>
                        <p className="text-gray-500">{appointment.time}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{appointment.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">No appointments for tomorrow.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
