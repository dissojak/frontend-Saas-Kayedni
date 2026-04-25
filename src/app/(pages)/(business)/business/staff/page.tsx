"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
import { useLocale } from "@global/hooks/useLocale";
import { businessStaffT, type BusinessStaffKey } from "./i18n";

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
  const { locale } = useLocale();
  const t = useCallback(
    (key: BusinessStaffKey, params?: Record<string, string | number>) => businessStaffT(locale, key, params),
    [locale],
  );
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

  const loadStaff = useCallback(async () => {
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
        title: t('toast_failed_load_title'),
        description: error.message || t('toast_failed_load_desc'),
      });
    } finally {
      setLoading(false);
    }
  }, [businessId, t, toast]);

  const filterStaff = useCallback(() => {
    let filtered = [...staff];

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStaff(filtered);
  }, [staff, searchTerm]);

  useEffect(() => {
    if (businessId) {
      void loadStaff();
    }
  }, [businessId, loadStaff]);

  useEffect(() => {
    filterStaff();
  }, [filterStaff]);

  const handleAddStaff = async () => {
    if (!newStaffEmail || !businessId) return;
    
    // Validate work hours: both must be provided and start < end
    if (!newStaffStartTime || !newStaffEndTime) {
      toast({
        variant: "error",
        title: t('toast_work_hours_required_title'),
        description: t('toast_work_hours_required_desc'),
      });
      return;
    }
    
    if (newStaffStartTime >= newStaffEndTime) {
      toast({
        variant: "error",
        title: t('toast_invalid_hours_title'),
        description: t('toast_invalid_hours_desc'),
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
        title: t('toast_add_success_title'),
        description: t('toast_add_success_desc', { email: newStaffEmail }),
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
        title: t('toast_add_failed_title'),
        description: error.message || t('toast_add_failed_desc'),
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
        title: t('toast_remove_success_title'),
        description: t('toast_remove_success_desc', { name: confirmRemove.staffName }),
      });
      
      setConfirmRemove({ open: false, staffId: null, staffName: '' });
      await loadStaff();
    } catch (error: any) {
      console.error('Failed to remove staff:', error);
      toast({
        variant: "error",
        title: t('toast_remove_failed_title'),
        description: error.message || t('toast_remove_failed_desc'),
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
        throw new Error(error.message || t('toast_add_self_failed_title'));
      }

      const data = await response.json();
      
      toast({
        variant: "success",
        title: t('toast_add_self_success_title'),
        description: t('toast_add_self_success_desc'),
      });

      // Update user state
      const updatedUser = { ...user, isAlsoStaff: true, staffId: data.staffId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Close dialog and reload page
      setBoWorkHoursDialogOpen(false);
      setTimeout(() => {
        globalThis.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error adding yourself as staff:', error);
      toast({
        variant: "error",
        title: t('toast_add_self_failed_title'),
        description: error.message || t('toast_add_self_failed_desc'),
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
        throw new Error(error.message || t('toast_remove_self_failed_title'));
      }

      toast({
        variant: "success",
        title: t('toast_remove_self_success_title'),
        description: t('toast_remove_self_success_desc'),
      });

      // Update user state
      const updatedUser = { ...user, isAlsoStaff: false, staffId: undefined };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Reload page
      setTimeout(() => {
        globalThis.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error removing yourself from staff:', error);
      toast({
        variant: "error",
        title: t('toast_remove_self_failed_title'),
        description: error.message || t('toast_remove_self_failed_desc'),
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
            <p className="mt-4 text-muted-foreground font-medium">{t('loading_staff')}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {t('staff_count', { count: staff.length })}
            </Badge>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-business hover:bg-business-dark shadow-lg">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('add_staff')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-business/10">
                    <UserPlus className="h-6 w-6 text-business" />
                  </div>
                  <DialogTitle className="text-center text-2xl">{t('add_staff_member_title')}</DialogTitle>
                  <DialogDescription className="text-center">
                    {t('add_staff_member_desc')}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t('email_address')} <span className="text-red-500">*</span>
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
                        {t('default_working_hours')} <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-xs text-muted-foreground">
                          {t('start_time')}
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
                          {t('end_time')}
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
                      {t('schedule_hint')}
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
                    {t('cancel')}
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
                        {t('adding')}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {t('add_staff')}
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
                    {user?.isAlsoStaff ? `✓ ${t('self_card_title_active')}` : t('self_card_title_inactive')}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {user?.isAlsoStaff 
                      ? t('self_card_desc_active')
                      : t('self_card_desc_inactive')}
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
                          {t('removing')}
                        </>
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4 mr-2" />
                          {t('remove_self')}
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
                          {t('adding')}
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          {t('also_work_here')}
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
                placeholder={t('search_placeholder')}
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
                {searchTerm ? t('empty_search') : t('empty_default')}
              </p>
              {!searchTerm && (
                <Button 
                  className="bg-business hover:bg-business-dark mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('add_first_staff')}
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
                        {t('remove_staff')}
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
                <h3 className="font-semibold text-blue-900 mb-2">{t('about_title')}</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {t('about_1')}</li>
                  <li>• {t('about_2')}</li>
                  <li>• {t('about_3')}</li>
                  <li>• {t('about_4')}</li>
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
                  {t('remove_dialog_title')}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed">
                {t('remove_dialog_desc', { name: confirmRemove.staffName })}
                <br />
                <span className="text-sm mt-2 block text-amber-600 dark:text-amber-400">
                  {t('remove_dialog_hint')}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmRemove({ open: false, staffId: null, staffName: '' })}
                className="w-full sm:w-auto border-2 border-border hover:bg-muted font-semibold h-11 rounded-xl"
              >
                {t('go_back')}
              </Button>
              <Button
                onClick={confirmRemoveStaff}
                className="w-full sm:w-auto font-bold h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                {t('yes_remove_staff')}
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
              <DialogTitle className="text-2xl font-bold text-foreground">{t('setup_hours_title')}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                {t('setup_hours_desc')}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="bo-start-time" className="text-sm font-semibold mb-2 block">
                  {t('start_time')}
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
                  {t('end_time')}
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
                {t('cancel')}
              </Button>
              <Button
                onClick={handleAddSelfAsStaff}
                disabled={isAddingSelfAsStaff}
                className="w-full sm:w-auto font-bold h-11 rounded-xl bg-business hover:bg-business-dark text-white"
              >
                {isAddingSelfAsStaff ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('setting_up')}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('become_staff')}
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
