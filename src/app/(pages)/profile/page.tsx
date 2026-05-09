'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { useToast } from '@global/hooks/use-toast';
import { useAuth } from '@/(pages)/(auth)/context/AuthContext';
import { buildUserFromDb } from '@/(pages)/(auth)/context/auth/utils';
import {
  changePassword,
  fetchProfile,
  setupTwoFactorAPI,
  enableTwoFactorAPI,
  disableTwoFactorAPI,
  sendTwoFactorSetupCodeAPI,
  regenerateBackupCodesAPI,
  type UserProfile,
  updateProfile,
  uploadProfileImage,
  type TwoFactorSetupResponse,
} from '@global/lib/api/profile.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Camera, Shield, User, Mail, Lock, Sparkles, Crown, QrCode, Download } from 'lucide-react';
import { useTracking } from '@global/hooks/useTracking';
import TimeOnPageTracker from '@components/tracking/TimeOnPageTracker';
import { useLocale } from '@global/hooks/useLocale';
import { profileT } from './i18n';
import type { TwoFactorMethod } from '@/(pages)/(auth)/types';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, updateUser, hydrated, token } = useAuth();
  const { trackEvent } = useTracking();
  const { locale } = useLocale();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: profile, isPending: loadingProfile } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: isAuthenticated,
    retry: false,
  });

  const isTwoFactorEnabled = Boolean(profile?.twoFactorEnabled);

  // Sync profile to auth context when data loads
  useEffect(() => {
    if (profile) {
      updateUser(buildUserFromDb({
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        avatarUrl: profile.avatarUrl,
        role: profile.role as any,
      }));
    }
  }, [profile, updateUser]);

  useEffect(() => {
    // Wait until auth state has been hydrated from storage to avoid
    // a false-negative redirect while the client reads localStorage.
    if (hydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetupResponse | null>(null);
  const [selectedTwoFactorMethod, setSelectedTwoFactorMethod] = useState<TwoFactorMethod>('APP');
  const [latestBackupCodes, setLatestBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setEmail(profile.email);
      setPhone(profile.phoneNumber ?? '');
      setCurrentAvatar(profile.avatarUrl ?? null);
    }
  }, [profile]);

  const displayInitials = useMemo(() => {
    const fromName = name?.trim();
    if (fromName) return fromName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  }, [name, email]);

  const methodOptions = useMemo<TwoFactorMethod[]>(() => {
    const fromProfile = (profile?.twoFactorMethods || []) as TwoFactorMethod[];
    const fromSetup = (twoFactorSetup?.availableMethods || []) as TwoFactorMethod[];
    const merged = [...new Set<TwoFactorMethod>(['APP', ...fromProfile, ...fromSetup])];
    return merged;
  }, [profile?.twoFactorMethods, twoFactorSetup?.availableMethods]);

  const downloadBackupCodesAsTxt = (codes: string[]) => {
    if (!codes.length) return;
    const content = [
      'Kayedni Backup Codes',
      `Generated: ${new Date().toISOString()}`,
      '',
      ...codes,
      '',
      'Each code can be used once.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kayedni-backup-codes.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      setCurrentAvatar(data.avatarUrl ?? currentAvatar);
      toast({ 
        title: profileT(locale, 'profile_toast_update_success_title'), 
        description: profileT(locale, 'profile_toast_update_success_desc'), 
        variant: 'success' 
      });
      trackEvent('profile_update', { fields: ['name', 'email', 'phone'].filter(Boolean) });
      updateUser(
        buildUserFromDb({
          userId: data.userId,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          avatarUrl: data.avatarUrl,
          role: data.role as any,
        })
      );
    },
    onError: (error: any) => {
      const message = error?.message || profileT(locale, 'profile_toast_update_failed_desc');
      toast({ 
        title: profileT(locale, 'profile_toast_update_failed_title'), 
        description: message, 
        variant: 'error' 
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ 
        title: profileT(locale, 'profile_toast_password_success_title'), 
        description: profileT(locale, 'profile_toast_password_success_desc'), 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const message = error?.message || profileT(locale, 'profile_toast_password_failed_desc');
      toast({ 
        title: profileT(locale, 'profile_toast_password_failed_title'), 
        description: message, 
        variant: 'error' 
      });
    },
  });

  const setupTwoFactorMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Authentication token not available');
      }
      return setupTwoFactorAPI(token);
    },
    onSuccess: (data) => {
      setTwoFactorSetup(data);
      if (data.backupCodes?.length) {
        setLatestBackupCodes(data.backupCodes);
      }
      setTwoFactorCode('');
      toast({
        title: profileT(locale, 'profile_toast_2fa_setup_ready_title'),
        description: data.message || profileT(locale, 'profile_toast_2fa_setup_ready_desc'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, 'profile_toast_2fa_setup_failed_title'),
        description: error?.message || profileT(locale, 'profile_toast_2fa_setup_failed_desc'),
        variant: 'error',
      });
    },
  });

  const sendTwoFactorSetupCodeMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Authentication token not available');
      }
      if (selectedTwoFactorMethod !== 'EMAIL' && selectedTwoFactorMethod !== 'SMS') {
        throw new Error('Method does not support sending codes');
      }
      return sendTwoFactorSetupCodeAPI(token, { method: selectedTwoFactorMethod });
    },
    onSuccess: (data) => {
      toast({
        title: profileT(locale, 'profile_toast_2fa_code_sent_title'),
        description: data.message || profileT(locale, 'profile_toast_2fa_code_sent_desc'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, 'profile_toast_2fa_code_send_failed_title'),
        description: error?.message || profileT(locale, 'profile_toast_2fa_code_send_failed_desc'),
        variant: 'error',
      });
    },
  });

  const enableTwoFactorMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Authentication token not available');
      }
      return enableTwoFactorAPI(token, { code: twoFactorCode, method: selectedTwoFactorMethod });
    },
    onSuccess: (data: TwoFactorSetupResponse) => {
      setTwoFactorSetup(null);
      setTwoFactorCode('');
      if (data.backupCodes?.length) {
        setLatestBackupCodes(data.backupCodes);
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: profileT(locale, 'profile_toast_2fa_enabled_title'),
        description: profileT(locale, 'profile_toast_2fa_enabled_desc'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, 'profile_toast_2fa_enable_failed_title'),
        description: error?.message || profileT(locale, 'profile_toast_2fa_enable_failed_desc'),
        variant: 'error',
      });
    },
  });

  const disableTwoFactorMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Authentication token not available');
      }
      return disableTwoFactorAPI(token, { code: twoFactorCode, method: selectedTwoFactorMethod });
    },
    onSuccess: () => {
      setTwoFactorSetup(null);
      setTwoFactorCode('');
      setLatestBackupCodes([]);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: profileT(locale, 'profile_toast_2fa_disabled_title'),
        description: profileT(locale, 'profile_toast_2fa_disabled_desc'),
        variant: 'success',
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, 'profile_toast_2fa_disable_failed_title'),
        description: error?.message || profileT(locale, 'profile_toast_2fa_disable_failed_desc'),
        variant: 'error',
      });
    },
  });

  const regenerateBackupCodesMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Authentication token not available');
      }
      return regenerateBackupCodesAPI(token, { code: twoFactorCode, method: selectedTwoFactorMethod });
    },
    onSuccess: (data) => {
      setLatestBackupCodes(data.backupCodes || []);
      toast({
        title: profileT(locale, 'profile_toast_backup_codes_title'),
        description: profileT(locale, 'profile_toast_backup_codes_desc'),
        variant: 'success',
      });
      if (data.backupCodes?.length) {
        downloadBackupCodesAsTxt(data.backupCodes);
      }
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, 'profile_toast_backup_codes_failed_title'),
        description: error?.message || profileT(locale, 'profile_toast_backup_codes_failed_desc'),
        variant: 'error',
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      setCurrentAvatar(data.url);
      const cached = queryClient.getQueryData<UserProfile>(['profile']);
      if (cached) {
        queryClient.setQueryData<UserProfile>(['profile'], { ...cached, avatarUrl: data.url });
        updateUser(
          buildUserFromDb({
            userId: cached.userId,
            name: cached.name,
            email: cached.email,
            phoneNumber: cached.phoneNumber,
            avatarUrl: data.url,
            role: cached.role as any,
          })
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
      toast({ 
        title: profileT(locale, 'profile_toast_photo_success_title'), 
        description: profileT(locale, 'profile_toast_photo_success_desc'), 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const message = error?.message || profileT(locale, 'profile_toast_photo_failed_desc');
      toast({ 
        title: profileT(locale, 'profile_toast_photo_failed_title'), 
        description: message, 
        variant: 'error' 
      });
    },
  });

  const handleProfileSubmit = () => {
    if (!profile) return;
    updateProfileMutation.mutate({
      name,
      phoneNumber: phone || undefined,
      avatarUrl: profile?.avatarUrl ?? undefined,
    });
  };

  const handlePasswordSubmit = () => {
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    });
  };

  const onSelectAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCurrentAvatar(URL.createObjectURL(file));
    uploadAvatarMutation.mutate(file);
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <TimeOnPageTracker pageName="profile" />
      
      {/* Background with animated elements (Skeuomorphic Touch) */}
      <div className="fixed inset-0 z-0 bg-background overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-brand-orange/5 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Hero Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-card border border-white/20 shadow-xl dark:shadow-none dark:border-border/50 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
            {/* Skeuomorphic Glass Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent dark:from-white/5 dark:via-white/0 pointer-events-none" />
            
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-brand-purple to-brand-orange rounded-full opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
              <div className="relative">
                <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-background shadow-2xl ring-2 ring-primary/20">
                  <AvatarImage src={currentAvatar ?? undefined} alt="Profile" className="object-cover" />
                  <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                    {displayInitials}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload Loading UI */}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity">
                    <Loader2 className="h-8 w-8 animate-spin text-white drop-shadow-md" />
                  </div>
                )}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadAvatarMutation.isPending}
                  className="absolute bottom-1 right-1 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ring-2 ring-background"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onSelectAvatar}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-2 z-10">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {profile?.name || profileT(locale, 'profile_default_name')}
                </h1>
                {profile?.role === 'ADMIN' && <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
              </div>
              <p className="text-muted-foreground text-lg max-w-xl">
                {profileT(locale, 'profile_subtitle')}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                 <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                    <Shield className="w-3 h-3 mr-1" /> {profileT(locale, 'profile_verified_user')}
                 </div>
                 {profile?.email && (
                   <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                      {profile.email}
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile & Security */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Profile Information Card */}
              <div className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-brand-purple/30 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                <Card className="relative border border-border/60 shadow-sm bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                  
                  {/* Loading State */}
                  {updateProfileMutation.isPending && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-2xl">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">{profileT(locale, 'profile_saving_changes')}</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">{profileT(locale, 'profile_personal_info_title')}</CardTitle>
                          <p className="text-sm text-muted-foreground">{profileT(locale, 'profile_personal_info_desc')}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleProfileSubmit} 
                        disabled={updateProfileMutation.isPending || loadingProfile}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                      >
                         <Save className="h-4 w-4 mr-2" /> {profileT(locale, 'profile_save')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    
                    {/* Name Input */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{profileT(locale, 'profile_full_name')}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={profileT(locale, 'profile_name_placeholder')}
                        className="h-12 border-input/60 focus-visible:ring-primary bg-background/50"
                      />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <div className="flex justify-between">
                           <Label htmlFor="email">{profileT(locale, 'profile_email_address')}</Label>
                           <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3"/> {profileT(locale, 'profile_read_only')}</span>
                         </div>
                        <Input 
                          id="email" 
                          value={email} 
                          readOnly 
                          disabled 
                          className="h-12 bg-muted/50 text-muted-foreground border-transparent cursor-not-allowed"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">{profileT(locale, 'profile_phone_number')}</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={profileT(locale, 'profile_phone_placeholder')}
                          className="h-12 border-input/60 focus-visible:ring-primary bg-background/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Two-Factor Authentication Card */}
              <div className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-teal/25 to-primary/25 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                <Card className="relative border border-border/60 shadow-sm bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-teal/10 text-brand-teal">
                          <QrCode className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">{profileT(locale, 'profile_2fa_title')}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {profileT(locale, 'profile_2fa_desc')}
                          </p>
                        </div>
                      </div>
                      {isTwoFactorEnabled ? (
                        <Button
                          onClick={() => disableTwoFactorMutation.mutate()}
                          disabled={disableTwoFactorMutation.isPending || !token || !twoFactorCode}
                          variant="outline"
                          className="border-destructive/40 text-destructive hover:bg-destructive/5 transition-all hover:-translate-y-0.5"
                        >
                          {disableTwoFactorMutation.isPending ? profileT(locale, 'profile_2fa_disabling') : profileT(locale, 'profile_2fa_disable')}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setupTwoFactorMutation.mutate()}
                          disabled={setupTwoFactorMutation.isPending || !token}
                          className="bg-brand-teal hover:bg-brand-teal/90 text-white shadow-lg shadow-brand-teal/20 transition-all hover:-translate-y-0.5"
                        >
                          {setupTwoFactorMutation.isPending ? profileT(locale, 'profile_2fa_preparing') : profileT(locale, 'profile_2fa_setup')}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="twoFactorMethod">{profileT(locale, 'profile_2fa_method_label')}</Label>
                        <select
                          id="twoFactorMethod"
                          value={selectedTwoFactorMethod}
                          onChange={(e) => setSelectedTwoFactorMethod(e.target.value as TwoFactorMethod)}
                          className="h-12 w-full rounded-xl border border-border/60 bg-background/50 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                        >
                          {methodOptions.map((method) => (
                            <option key={method} value={method}>
                              {method === 'APP' && profileT(locale, 'profile_2fa_method_app')}
                              {method === 'EMAIL' && profileT(locale, 'profile_2fa_method_email')}
                              {method === 'SMS' && profileT(locale, 'profile_2fa_method_sms')}
                              {method === 'BACKUP_CODE' && profileT(locale, 'profile_2fa_method_backup')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twoFactorCode">{profileT(locale, 'profile_2fa_code_label')}</Label>
                        <Input
                          id="twoFactorCode"
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          placeholder={selectedTwoFactorMethod === 'BACKUP_CODE' ? 'ABCD-1234' : '123456'}
                          inputMode={selectedTwoFactorMethod === 'BACKUP_CODE' ? 'text' : 'numeric'}
                          autoComplete="one-time-code"
                          className="h-12 border-input/60 focus-visible:ring-brand-teal bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{profileT(locale, 'profile_2fa_status_label')}</Label>
                        <div className="h-12 rounded-xl border border-border/60 bg-background/50 px-4 flex items-center text-sm text-muted-foreground">
                          {profile?.twoFactorEnabled ? profileT(locale, 'profile_2fa_status_enabled') : profileT(locale, 'profile_2fa_status_disabled')}
                        </div>
                      </div>
                    </div>

                    {(selectedTwoFactorMethod === 'EMAIL' || selectedTwoFactorMethod === 'SMS') && (
                      <Button
                        onClick={() => sendTwoFactorSetupCodeMutation.mutate()}
                        disabled={sendTwoFactorSetupCodeMutation.isPending || !token}
                        variant="outline"
                        className="border-brand-teal/40 text-brand-teal hover:bg-brand-teal/5"
                      >
                        {sendTwoFactorSetupCodeMutation.isPending
                          ? profileT(locale, 'profile_2fa_sending_code')
                          : profileT(locale, 'profile_2fa_send_code')}
                      </Button>
                    )}

                    {!isTwoFactorEnabled && twoFactorSetup?.qrCodeDataUrl && (
                      <div className="grid gap-4 lg:grid-cols-[220px_1fr] items-start">
                        <div className="rounded-2xl border border-border/60 bg-background p-4 flex items-center justify-center">
                          <img
                            src={twoFactorSetup.qrCodeDataUrl}
                            alt="Two-factor QR code"
                            className="h-48 w-48 rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {profileT(locale, 'profile_2fa_qr_help')}
                          </p>
                          {twoFactorSetup.manualEntryKey && (
                            <div className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{profileT(locale, 'profile_2fa_manual_key_label')}</p>
                              <p className="font-mono break-all">{twoFactorSetup.manualEntryKey}</p>
                            </div>
                          )}
                          <Button
                            onClick={() => enableTwoFactorMutation.mutate()}
                            disabled={enableTwoFactorMutation.isPending || !twoFactorCode}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                          >
                            {enableTwoFactorMutation.isPending ? profileT(locale, 'profile_2fa_enabling') : profileT(locale, 'profile_2fa_enable')}
                          </Button>
                        </div>
                      </div>
                    )}

                    {isTwoFactorEnabled && (
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => enableTwoFactorMutation.mutate()}
                          disabled={enableTwoFactorMutation.isPending || !twoFactorCode}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {enableTwoFactorMutation.isPending ? profileT(locale, 'profile_2fa_enabling') : profileT(locale, 'profile_2fa_enable')}
                        </Button>
                        <Button
                          onClick={() => regenerateBackupCodesMutation.mutate()}
                          disabled={regenerateBackupCodesMutation.isPending || !twoFactorCode}
                          variant="outline"
                        >
                          {regenerateBackupCodesMutation.isPending
                            ? profileT(locale, 'profile_2fa_regenerating_backup')
                            : profileT(locale, 'profile_2fa_regenerate_backup')}
                        </Button>
                        <Button
                          onClick={() => downloadBackupCodesAsTxt(latestBackupCodes)}
                          disabled={!latestBackupCodes.length}
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {profileT(locale, 'profile_2fa_download_backup')}
                        </Button>
                      </div>
                    )}

                    {latestBackupCodes.length > 0 && (
                      <div className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm">
                        <p className="mb-2 text-muted-foreground">{profileT(locale, 'profile_2fa_backup_note')}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          {latestBackupCodes.map((code) => (
                            <span key={code} className="rounded bg-muted px-2 py-1">{code}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile?.twoFactorEnabled && (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
                        {profileT(locale, 'profile_2fa_active_note')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Security Card */}
              <div className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-orange/30 to-brand-teal/30 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                <Card className="relative border border-border/60 shadow-sm bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                  
                   {/* Password Loading Overlay */}
                   {changePasswordMutation.isPending && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-2xl">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">{profileT(locale, 'profile_updating_password')}</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                            <Shield className="h-5 w-5" />
                         </div>
                         <div>
                           <CardTitle className="text-lg font-semibold text-foreground">{profileT(locale, 'profile_security_title')}</CardTitle>
                           <p className="text-sm text-muted-foreground">{profileT(locale, 'profile_security_desc')}</p>
                         </div>
                      </div>
                      <Button 
                        onClick={handlePasswordSubmit} 
                        disabled={!currentPassword || !newPassword || !confirmPassword || changePasswordMutation.isPending}
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/20 transition-all hover:-translate-y-0.5"
                      >
                        <Lock className="h-4 w-4 mr-2" /> {profileT(locale, 'profile_update_password')}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{profileT(locale, 'profile_current_password')}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={profileT(locale, 'profile_current_password_placeholder')}
                        className="h-12 border-input/60 focus-visible:ring-brand-orange bg-background/50"
                      />
                    </div>

                    {/* New Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">{profileT(locale, 'profile_new_password')}</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={profileT(locale, 'profile_new_password_placeholder')}
                          className="h-12 border-input/60 focus-visible:ring-brand-orange bg-background/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                         <Label htmlFor="confirmPassword">{profileT(locale, 'profile_confirm_password')}</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={profileT(locale, 'profile_confirm_password_placeholder')}
                          className="h-12 border-input/60 focus-visible:ring-brand-orange bg-background/50"
                        />
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50 flex gap-3 text-sm text-muted-foreground">
                       <Shield className="w-5 h-5 flex-shrink-0 text-brand-teal" />
                       <p>{profileT(locale, 'profile_password_requirements')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Account Info & Stats */}
            <div className="space-y-6">
              
              {/* Account Details Card */}
              <div className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/30 to-brand-blue/30 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                <Card className="relative border border-border/60 shadow-sm bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-xl bg-background border border-border/50 text-foreground">
                          <User className="h-5 w-5" />
                       </div>
                        <CardTitle className="text-lg font-semibold text-foreground">{profileT(locale, 'profile_account_details')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    
                    {/* User Info Display */}
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between group/item hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                             <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{profileT(locale, 'profile_display_name')}</p>
                            <p className="text-sm font-semibold text-foreground">{name || profile?.name || profileT(locale, 'profile_not_set')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between group/item hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                             <Mail className="h-4 w-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs text-muted-foreground">{profileT(locale, 'profile_email_label')}</p>
                            <p className="text-sm font-semibold text-foreground truncate max-w-[150px]">{email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between group/item hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                             <Crown className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{profileT(locale, 'profile_role')}</p>
                            <p className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">
                              {profile?.role ?? profileT(locale, 'profile_role_fallback_user')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Note */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex gap-2">
                        <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{profileT(locale, 'profile_protected_account')}</p>
                          <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 leading-tight mt-0.5">
                            {profileT(locale, 'profile_protected_account_desc')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            <div className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-brand-orange/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                <Card className="relative border border-border/60 shadow-sm bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border/40 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand-orange" />
                      <span className="font-semibold text-sm">{profileT(locale, 'profile_account_status')}</span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="text-2xl font-bold text-primary mb-1">{phone ? '100%' : '85%'}</div>
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{profileT(locale, 'profile_completion')}</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-brand-teal/5 border border-brand-teal/10">
                        <div className="text-2xl font-bold text-brand-teal mb-1">{profileT(locale, 'profile_active')}</div>
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{profileT(locale, 'profile_status')}</div>
                      </div>
                  </div>
                </Card>
            </div>


            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
