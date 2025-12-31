"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { User, Mail, Phone, Search, UserPlus, UserMinus, Briefcase } from "lucide-react";
import { fetchStaffByBusinessId, addStaffToBusinessByEmail, removeStaffFromBusiness } from "../../actions/backend";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: string;
}

export default function BusinessStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get businessId from localStorage (user's business)
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.businessId) {
        setBusinessId(user.businessId);
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
      const token = localStorage.getItem('token') || undefined;
      const data = await fetchStaffByBusinessId(businessId, token);
      setStaff(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
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
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || undefined;
      await addStaffToBusinessByEmail(businessId, newStaffEmail, token);
      setIsAddDialogOpen(false);
      setNewStaffEmail('');
      await loadStaff();
    } catch (error: any) {
      alert(error.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStaff = async (staffId: number) => {
    if (!businessId) return;
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    
    try {
      const token = localStorage.getItem('token') || undefined;
      await removeStaffFromBusiness(businessId, staffId, token);
      await loadStaff();
    } catch (error) {
      console.error('Failed to remove staff:', error);
      alert('Failed to remove staff member');
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
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-business mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading staff...</p>
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
                <Button className="bg-business hover:bg-business-dark">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Staff Member</DialogTitle>
                  <DialogDescription>
                    Enter the email address of the user you want to add as staff. They must already be registered on the platform.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@example.com"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-business hover:bg-business-dark"
                    onClick={handleAddStaff}
                    disabled={isSubmitting || !newStaffEmail}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Staff'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar */}
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback className="bg-business text-white text-2xl">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="space-y-2 w-full">
                      <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                      <Badge className="bg-business-light text-business">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {member.role}
                      </Badge>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2 w-full text-left">
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
                        className="w-full"
                        onClick={() => handleRemoveStaff(member.id)}
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
    </Layout>
  );
}
