
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  // Mock data for system overview
  const systemStats = [
    { name: "Active Users", value: "5,832", change: "+12% from last month" },
    { name: "Businesses", value: "847", change: "+8% from last month" },
    { name: "Total Bookings", value: "24,628", change: "+18% from last month" },
    { name: "Revenue", value: "$124,892", change: "+15% from last month" },
  ];

  // Mock business data
  const recentBusinesses = [
    { id: "1", name: "Style Studio", owner: "Diana Prince", category: "Barber", staff: 4, status: "Active" },
    { id: "2", name: "Tech Tutors", owner: "Bruce Wayne", category: "Education", staff: 6, status: "Active" },
    { id: "3", name: "GameZone", owner: "Clark Kent", category: "Gaming", staff: 3, status: "Pending" },
    { id: "4", name: "Fitness First", owner: "Barry Allen", category: "Fitness", staff: 8, status: "Active" },
  ];

  // Mock user data
  const recentUsers = [
    { id: "1", name: "John Smith", email: "john@example.com", role: "Client", registered: "May 15, 2023", bookings: 12 },
    { id: "2", name: "Sarah Lee", email: "sarah@example.com", role: "Client", registered: "May 17, 2023", bookings: 8 },
    { id: "3", name: "Diana Prince", email: "diana@stylestudio.com", role: "Business", registered: "April 28, 2023", bookings: 0 },
    { id: "4", name: "Alex Morgan", email: "alex@stylestudio.com", role: "Staff", registered: "April 30, 2023", bookings: 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-admin">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name} (Administrator)</p>
        </div>
        <Button className="bg-admin hover:bg-admin-dark">System Settings</Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-xs text-green-600 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="businesses" className="space-y-4">
        <TabsList className="border-b w-full justify-start rounded-none">
          <TabsTrigger value="businesses" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">
            Businesses
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-admin">
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Businesses Tab */}
        <TabsContent value="businesses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Businesses</CardTitle>
              <Button className="bg-admin hover:bg-admin-dark">Add Business</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">Business</th>
                      <th className="pb-4 pr-4 font-medium">Owner</th>
                      <th className="pb-4 pr-4 font-medium">Category</th>
                      <th className="pb-4 pr-4 font-medium">Staff</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBusinesses.map((business) => (
                      <tr key={business.id} className="border-t">
                        <td className="py-4 pr-4">{business.name}</td>
                        <td className="py-4 pr-4">{business.owner}</td>
                        <td className="py-4 pr-4">{business.category}</td>
                        <td className="py-4 pr-4">{business.staff}</td>
                        <td className="py-4">
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              business.status === "Active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {business.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full">View All Businesses</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Users</CardTitle>
              <Button className="bg-admin hover:bg-admin-dark">Add User</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 pr-4 font-medium">Name</th>
                      <th className="pb-4 pr-4 font-medium">Email</th>
                      <th className="pb-4 pr-4 font-medium">Role</th>
                      <th className="pb-4 pr-4 font-medium">Registered</th>
                      <th className="pb-4 font-medium">Bookings</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="py-4 pr-4">{user.name}</td>
                        <td className="py-4 pr-4">{user.email}</td>
                        <td className="py-4 pr-4">
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === "Client" 
                                ? "bg-blue-100 text-blue-800" 
                                : user.role === "Business"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 pr-4">{user.registered}</td>
                        <td className="py-4">{user.bookings}</td>
                        <td className="py-4 text-right">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="mt-4 w-full">View All Users</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Analytics charts will appear here</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Categories</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                <p className="text-gray-500">Category chart will appear here</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                <p className="text-gray-500">User growth chart will appear here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Free Tier</h3>
                    <p className="text-sm text-gray-500">Basic booking functionality</p>
                    <p className="font-bold mt-2">$0 / month</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Standard</h3>
                    <p className="text-sm text-gray-500">Advanced features for growing businesses</p>
                    <p className="font-bold mt-2">$29 / month</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Premium</h3>
                    <p className="text-sm text-gray-500">Full suite of features</p>
                    <p className="font-bold mt-2">$79 / month</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button className="bg-admin hover:bg-admin-dark w-full mt-4">Add New Plan</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Revenue chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
