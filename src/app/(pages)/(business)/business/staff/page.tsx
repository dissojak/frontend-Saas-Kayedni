"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@components/ui/alert-dialog";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { User, Mail, Phone, Search, UserPlus, UserMinus, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { fetchStaffByBusinessId, addStaffToBusinessByEmail, removeStaffFromBusiness } from "../../actions/backend";
import { useToast } from "@global/hooks/use-toast";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: string;
}

export default function BusinessStaffPage() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffStartTime, setNewStaffStartTime] = useState('09:00');
  const [newStaffEndTime, setNewStaffEndTime] = useState('17:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<{ open: boolean; staffId: number | null; staffName: string }>({ open: false, staffId: null, staffName: '' });
  const [user, setUser] = useState<any>(null);
  const [isAddingSelfAsStaff, setIsAddingSelfAsStaff] = useState(false);
  const [boWorkHoursDialogOpen, setBoWorkHoursDialogOpen] = useState(false);
  const [boStartTime, setBoStartTime] = useState('09:00');
  const [boEndTime, setBoEndTime] = useState('17:00');

  useEffect(() => {
    // Get businessId from localStorage (user's business)
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.businessId) {
        setBusinessId(parsedUser.businessId);
      }
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      loadStaff();
    }
  }, [businessId]);

  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm]);

  const loadStaff = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const data = await fetchStaffByBusinessId(businessId, token || undefined);
      setStaff(data);
    } catch (error: any) {
      console.error('Failed to load staff:', error);
      toast({
        variant: "error",
        title: "Failed to load staff",
        description: error.message || "Unable to fetch staff members. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = [...staff];

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStaff(filtered);
  };

  const handleAddStaff = async () => {
    if (!newStaffEmail || !businessId) return;
    
    // Validate work hours: both must be provided and start < end
    if (!newStaffStartTime || !newStaffEndTime) {
      toast({
        variant: "error",
        title: "Work hours required",
        description: "Please set both start and end working times for the staff member.",
      });
      return;
    }
    
    if (newStaffStartTime >= newStaffEndTime) {
      toast({
        variant: "error",
        title: "Invalid work hours",
        description: "Start time must be before end time.",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      await addStaffToBusinessByEmail(
        businessId, 
        newStaffEmail, 
        token || undefined,
        { startTime: newStaffStartTime, endTime: newStaffEndTime }
      );
      
      toast({
        variant: "success",
        title: "Staff member added successfully",
        description: `${newStaffEmail} has been added to your team with their schedule auto-generated.`,
      });
      
      setIsAddDialogOpen(false);
      setNewStaffEmail('');
      setNewStaffStartTime('09:00');
      setNewStaffEndTime('17:00');
      await loadStaff();
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast({
        variant: "error",
        title: "Failed to add staff member",
        description: error.message || "The user might not exist or is already part of your staff.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStaff = (staffId: number, staffName: string) => {
    setConfirmRemove({ open: true, staffId, staffName });
  };

  const confirmRemoveStaff = async () => {
    if (!businessId || !confirmRemove.staffId) return;
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      await removeStaffFromBusiness(businessId, confirmRemove.staffId, token || undefined);
      
      toast({
        variant: "success",
        title: "Staff member removed",
        description: `${confirmRemove.staffName} has been removed from your team.`,
      });
      
      setConfirmRemove({ open: false, staffId: null, staffName: '' });
      await loadStaff();
    } catch (error: any) {
      console.error('Failed to remove staff:', error);
      toast({
        variant: "error",
        title: "Failed to remove staff member",
        description: error.message || "Unable to remove staff member. Please try again.",
      });
      setConfirmRemove({ open: false, staffId: null, staffName: '' });
    }
  };

  const handleAddSelfAsStaff = async () => {
    if (!businessId) return;

    setIsAddingSelfAsStaff(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/v1/businesses/${businessId}/staff/self`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startTime: boStartTime,
          endTime: boEndTime,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add yourself as staff');
      }

      const data = await response.json();
      
      toast({
        variant: "success",
        title: "Great! You're now working as staff",
        description: "Your availability has been set and services are waiting to be assigned.",
      });

      // Update user state
      const updatedUser = { ...user, isAlsoStaff: true, staffId: data.staffId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Close dialog and reload page
      setBoWorkHoursDialogOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error adding yourself as staff:', error);
      toast({
        variant: "error",
        title: "Failed to add yourself as staff",
        description: error.message || "Unable to add yourself as staff. Please try again.",
      });
    } finally {
      setIsAddingSelfAsStaff(false);
    }
  };

  const handleRemoveSelfAsStaff = async () => {
    if (!businessId) return;

    setIsAddingSelfAsStaff(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/v1/businesses/${businessId}/staff/self`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove yourself from staff');
      }

      toast({
        variant: "success",
        title: "You stopped working as staff",
        description: "You're now only managing your business.",
      });

      // Update user state
      const updatedUser = { ...user, isAlsoStaff: false, staffId: undefined };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Reload page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error removing yourself from staff:', error);
      toast({
        variant: "error",
        title: "Failed to remove yourself from staff",
        description: error.message || "Unable to remove yourself from staff. Please try again.",
      });
    } finally {
      setIsAddingSelfAsStaff(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-business border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground font-medium">Loading staff members...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their access</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {staff.length} Staff Members
            </Badge>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-business hover:bg-business-dark shadow-lg">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-business/10">
                    <UserPlus className="h-6 w-6 text-business" />
                  </div>
                  <DialogTitle className="text-center text-2xl">Add Staff Member</DialogTitle>
                  <DialogDescription className="text-center">
                    Enter the email and set the default working hours. Schedule will be auto-generated.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="staff@example.com"
                        className="pl-10"
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Work Hours Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-business" />
                      <Label className="text-sm font-medium">
                        Default Working Hours <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-xs text-muted-foreground">
                          Start Time
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newStaffStartTime}
                          onChange={(e) => setNewStaffStartTime(e.target.value)}
                          className="text-center"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-xs text-muted-foreground">
                          End Time
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newStaffEndTime}
                          onChange={(e) => setNewStaffEndTime(e.target.value)}
                          className="text-center"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Schedule will be automatically generated for the next month.
                    </p>
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setNewStaffEmail('');
                      setNewStaffStartTime('09:00');
                      setNewStaffEndTime('17:00');
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-business hover:bg-business-dark"
                    onClick={handleAddStaff}
                    disabled={isSubmitting || !newStaffEmail.trim() || !newStaffStartTime || !newStaffEndTime}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Add Staff
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Self as Staff Card */}
        {user?.role === 'BUSINESS_OWNER' && (
          <Card className={`border-2 ${user?.isAlsoStaff ? 'border-business/50 bg-business/5' : 'border-dashed'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.isAlsoStaff ? '✓ You\'re working as staff' : 'Do you also work here?'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {user?.isAlsoStaff 
                      ? 'You are registered as a staff member. You can switch between Manager and Staff modes in the navbar.'
                      : 'Add yourself as a staff member to work alongside your team and manage your own schedule.'}
                  </p>
                </div>
                <div>
                  {user?.isAlsoStaff ? (
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleRemoveSelfAsStaff}
                      disabled={isAddingSelfAsStaff}
                    >
                      {isAddingSelfAsStaff ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4 mr-2" />
                          Stop working as staff
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="bg-business hover:bg-business-dark"
                      onClick={() => setBoWorkHoursDialogOpen(true)}
                      disabled={isAddingSelfAsStaff}
                    >
                      {isAddingSelfAsStaff ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          I also work here
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search staff by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        {filteredStaff.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No staff members found matching your search' : 'No staff members yet'}
              </p>
              {!searchTerm && (
                <Button 
                  className="bg-business hover:bg-business-dark mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Your First Staff Member
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-business/20">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar */}
                    <Avatar className="w-24 h-24 ring-4 ring-business/10">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback className="bg-business text-white text-2xl font-bold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="space-y-2 w-full">
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <Badge className="bg-business-light text-business font-semibold">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {member.role}
                      </Badge>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2 w-full text-left bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Mail className="w-4 h-4 mr-2 text-business flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phoneNumber && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Phone className="w-4 h-4 mr-2 text-business flex-shrink-0" />
                          <span>{member.phoneNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="w-full pt-4 border-t">
                      <Button
                        variant="destructive"
                        className="w-full shadow-sm"
                        onClick={() => handleRemoveStaff(member.id, member.name)}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove Staff
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">About Staff Management</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Staff members can manage services and bookings for your business</li>
                  <li>• They need to be registered on the platform before you can add them</li>
                  <li>• Staff members will receive notifications about their assignments</li>
                  <li>• You can remove staff members at any time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remove Staff Confirmation Dialog */}
      <AlertDialog open={confirmRemove.open} onOpenChange={(open) => !open && setConfirmRemove({ open: false, staffId: null, staffName: '' })}>
        <AlertDialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
          <div className="p-6 border-t-4 border-red-500 bg-red-50/50 dark:bg-red-950/20">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                  <UserMinus className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <AlertDialogTitle className="text-xl font-bold text-foreground">
                  Remove Staff Member?
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed">
                Are you sure you want to remove{' '}
                <span className="font-semibold text-foreground">{confirmRemove.staffName}</span>
                {' '}from your team?
                <br />
                <span className="text-sm mt-2 block text-amber-600 dark:text-amber-400">
                  This action cannot be undone. They will lose access to manage your business.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmRemove({ open: false, staffId: null, staffName: '' })}
                className="w-full sm:w-auto border-2 border-border hover:bg-muted font-semibold h-11 rounded-xl"
              >
                Go Back
              </Button>
              <Button
                onClick={confirmRemoveStaff}
                className="w-full sm:w-auto font-bold h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Yes, Remove Staff
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Work Hours Setup Dialog for BO */}
      <Dialog open={boWorkHoursDialogOpen} onOpenChange={setBoWorkHoursDialogOpen}>
        <DialogContent className="max-w-sm sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">Set Your Working Hours</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                When you work as staff, clients can book services with you during these hours. You can change this later.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="bo-start-time" className="text-sm font-semibold mb-2 block">
                  Start Time
                </Label>
                <Input
                  id="bo-start-time"
                  type="time"
                  value={boStartTime}
                  onChange={(e) => setBoStartTime(e.target.value)}
                  className="h-11 rounded-lg border-2"
                />
              </div>

              <div>
                <Label htmlFor="bo-end-time" className="text-sm font-semibold mb-2 block">
                  End Time
                </Label>
                <Input
                  id="bo-end-time"
                  type="time"
                  value={boEndTime}
                  onChange={(e) => setBoEndTime(e.target.value)}
                  className="h-11 rounded-lg border-2"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setBoWorkHoursDialogOpen(false)}
                className="w-full sm:w-auto border-2 border-border hover:bg-muted font-semibold h-11 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSelfAsStaff}
                disabled={isAddingSelfAsStaff}
                className="w-full sm:w-auto font-bold h-11 rounded-xl bg-business hover:bg-business-dark text-white"
              >
                {isAddingSelfAsStaff ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Become Staff
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
