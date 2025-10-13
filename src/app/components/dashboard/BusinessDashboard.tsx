
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const BusinessDashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard
  const stats = [
    { name: "Total Bookings", value: "248", change: "+12% from last month" },
    { name: "Revenue", value: "$5,628", change: "+18% from last month" },
    { name: "New Clients", value: "36", change: "+8% from last month" },
    { name: "Completion Rate", value: "94%", change: "+2% from last month" },
  ];

  const recentBookings = [
    { id: "1", client: "John Smith", service: "Haircut & Style", staff: "Alex Morgan", date: "Today, 2:00 PM", status: "Confirmed" },
    { id: "2", client: "Sarah Lee", service: "Color & Highlights", staff: "Jamie Lee", date: "Today, 4:30 PM", status: "Confirmed" },
    { id: "3", client: "Michael Johnson", service: "Beard Trim", staff: "Alex Morgan", date: "Tomorrow, 10:00 AM", status: "Pending" },
    { id: "4", client: "Emily Chen", service: "Haircut & Style", staff: "Jamie Lee", date: "Tomorrow, 1:30 PM", status: "Pending" },
  ];

  const topStaff = [
    { name: "Alex Morgan", bookings: 87, revenue: "$4,350", rating: 4.9 },
    { name: "Jamie Lee", bookings: 72, revenue: "$3,600", rating: 4.8 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-business">Business Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Button className="bg-business hover:bg-business-dark">Add New Service</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-xs text-green-600 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="border-b w-full justify-start rounded-none">
          <TabsTrigger value="bookings" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-business">
            Recent Bookings
          </TabsTrigger>
          <TabsTrigger value="staff" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-business">
            Top Staff
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-business">
            Services
          </TabsTrigger>
        </TabsList>

        {/* Recent Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">Client</th>
                      <th className="pb-4 pr-4 font-medium">Service</th>
                      <th className="pb-4 pr-4 font-medium">Staff</th>
                      <th className="pb-4 pr-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-t">
                        <td className="py-4 pr-4">{booking.client}</td>
                        <td className="py-4 pr-4">{booking.service}</td>
                        <td className="py-4 pr-4">{booking.staff}</td>
                        <td className="py-4 pr-4">{booking.date}</td>
                        <td className="py-4">
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              booking.status === "Confirmed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full">View All Bookings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">Staff Member</th>
                      <th className="pb-4 pr-4 font-medium">Bookings</th>
                      <th className="pb-4 pr-4 font-medium">Revenue</th>
                      <th className="pb-4 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStaff.map((staff) => (
                      <tr key={staff.name} className="border-t">
                        <td className="py-4 pr-4">{staff.name}</td>
                        <td className="py-4 pr-4">{staff.bookings}</td>
                        <td className="py-4 pr-4">{staff.revenue}</td>
                        <td className="py-4 flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {staff.rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button className="bg-business hover:bg-business-dark flex-1">Add Staff</Button>
                <Button variant="outline" className="flex-1">Manage Staff</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Haircut & Styling</h3>
                    <p className="text-sm text-gray-500">60 min • $65</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Hair Coloring</h3>
                    <p className="text-sm text-gray-500">120 min • $120</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button className="bg-business hover:bg-business-dark w-full mt-4">Add New Service</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessDashboard;
