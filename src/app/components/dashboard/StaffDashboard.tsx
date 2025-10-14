"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { Button } from "@/components/ui/button";

const StaffDashboard = () => {
  const { user } = useAuth();

  // Mock upcoming appointments
  const upcomingAppointments = [
    { 
      id: "1", 
      client: "John Smith", 
      service: "Haircut & Style", 
      time: "2:00 PM - 3:00 PM", 
      status: "Confirmed" 
    },
    { 
      id: "2", 
      client: "Sarah Lee", 
      service: "Color & Highlights", 
      time: "4:30 PM - 6:30 PM", 
      status: "Confirmed" 
    },
  ];

  // Mock tomorrow's appointments
  const tomorrowAppointments = [
    { 
      id: "3", 
      client: "Michael Johnson", 
      service: "Beard Trim", 
      time: "10:00 AM - 10:30 AM", 
      status: "Confirmed" 
    },
    { 
      id: "4", 
      client: "Emily Chen", 
      service: "Haircut & Style", 
      time: "1:30 PM - 2:30 PM", 
      status: "Pending" 
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-staff">Staff Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name}</p>
        </div>
        <Button className="bg-staff hover:bg-staff-dark">Update Schedule</Button>
      </div>

      {/* Today's Overview */}
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
                <h3 className="text-2xl font-bold">
                  {upcomingAppointments.filter(a => a.status === "Confirmed").length}
                </h3>
                <p className="text-gray-500">Confirmed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold">
                  {upcomingAppointments.filter(a => a.status === "Pending").length}
                </h3>
                <p className="text-gray-500">Pending</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
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
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          appointment.status === "Confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button className="bg-staff hover:bg-staff-dark" size="sm">
                        Complete
                      </Button>
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

      {/* Tomorrow's Appointments */}
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
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          appointment.status === "Confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
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
};

export default StaffDashboard;
