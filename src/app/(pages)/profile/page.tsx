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
import { Loader2, Save, Camera, Shield, User, Mail, Phone, Lock, Sparkles, Crown } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, updateUser, hydrated } = useAuth();
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
        title: 'Profile updated successfully!', 
        description: 'Your changes have been saved securely.', 
        variant: 'success' 
      });
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
      const message = error?.message || 'Failed to update profile.';
      toast({ 
        title: 'Update failed', 
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
        title: 'Password changed successfully!', 
        description: 'Your account security has been updated.', 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to change password.';
      toast({ 
        title: 'Password change failed', 
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
        title: 'Profile photo updated!', 
        description: 'Your new profile picture has been saved successfully.', 
        variant: 'success' 
      });
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to upload image.';
      toast({ 
        title: 'Upload failed', 
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Header with Glass Effect */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {profile?.name || 'Your Profile'}
                  </h1>
                </div>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Customize your digital identity and manage your account with style
                </p>
              </div>
              
              {/* Avatar Hero Section */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-2xl ring-4 ring-white/50">
                    <AvatarImage src={currentAvatar ?? undefined} alt="Profile" className="object-cover" />
                    <AvatarFallback className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {displayInitials}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Avatar Upload Loading Overlay */}
                  {uploadAvatarMutation.isPending && (
                    <div className="absolute inset-0 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center z-10">
                      <div className="relative">
                        {/* Animated Ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-r-purple-400 border-b-pink-400 border-l-yellow-400 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-transparent border-b-blue-400 border-l-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                        
                        {/* Center Content */}
                        <div className="relative flex items-center justify-center w-20 h-20">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto drop-shadow-lg" />
                            <p className="text-white text-[10px] mt-1 font-bold drop-shadow-md">Uploading</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadAvatarMutation.isPending}
                    className="absolute bottom-0 right-0 p-2.5 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-500"
                  >
                    {uploadAvatarMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    ) : (
                      <Camera className="h-5 w-5 text-blue-600" />
                    )}
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
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Profile & Security */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Information Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                <Card className="relative border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                  
                  {/* Profile Save Loading Overlay */}
                  {updateProfileMutation.isPending && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center rounded-2xl">
                      <div className="text-center space-y-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                          <Loader2 className="h-16 w-16 animate-spin text-blue-600 relative z-10" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">Saving your profile...</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">This will only take a moment</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Profile Information
                          </CardTitle>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Keep your details up to date
                        </p>
                      </div>
                      <Button 
                        onClick={handleProfileSubmit} 
                        disabled={updateProfileMutation.isPending || loadingProfile}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    
                    {/* Name Input */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Full Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-4 pr-4 py-6 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          Email Address
                        </Label>
                        <div className="relative">
                          <Input 
                            id="email" 
                            value={email} 
                            readOnly 
                            disabled 
                            className="pl-4 pr-4 py-6 text-base border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Managed by support team
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-600" />
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="pl-4 pr-4 py-6 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                <Card className="relative border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-purple-600" />
                          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Security Settings
                          </CardTitle>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Protect your account with a strong password
                        </p>
                      </div>
                      <Button
                        onClick={handlePasswordSubmit}
                        disabled={changePasswordMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {changePasswordMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Shield className="h-4 w-4 mr-2" />
                        )}
                        Update Password
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-purple-600" />
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="pl-4 pr-4 py-6 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                      />
                    </div>

                    {/* New Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-purple-600" />
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          className="pl-4 pr-4 py-6 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-purple-600" />
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="pl-4 pr-4 py-6 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-purple-800 dark:text-purple-200 font-medium">
                        💡 Password requirements: At least 8 characters, mix of letters, numbers & symbols
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Account Info & Stats */}
            <div className="space-y-6">
              
              {/* Account Details Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                <Card className="relative border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-emerald-600" />
                      <CardTitle className="text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Account Details
                      </CardTitle>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Your account information
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    
                    {/* User Info Display */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Display Name</p>
                            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{name || profile?.name || 'Not set'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                            <Mail className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Email</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                            <Crown className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Role</p>
                            <p className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                              {profile?.role ?? 'User'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Note */}
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <div className="flex gap-3">
                        <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">Protected Information</p>
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                            Email and role changes require admin approval
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Stats Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                <Card className="relative border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-orange-600" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Completion</span>
                      <span className="text-lg font-bold text-blue-600">{phone ? '100%' : '85%'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Security Score</span>
                      <span className="text-lg font-bold text-purple-600">High</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Status</span>
                      <span className="text-lg font-bold text-emerald-600">Active</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
