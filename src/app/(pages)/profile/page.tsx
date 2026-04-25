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
  type UserProfile,
  updateProfile,
  uploadProfileImage,
} from '@global/lib/api/profile.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Camera, Shield, User, Mail, Lock, Sparkles, Crown } from 'lucide-react';
import { useTracking } from '@global/hooks/useTracking';
import TimeOnPageTracker from '@components/tracking/TimeOnPageTracker';
import { useLocale } from '@global/hooks/useLocale';
import { profileT } from './i18n';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, updateUser, hydrated } = useAuth();
  const { trackEvent } = useTracking();
  const { locale } = useLocale();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: profile, isPending: loadingProfile } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: isAuthenticated,
    retry: false,
  });

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
