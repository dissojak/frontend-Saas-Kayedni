"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { useToast } from "@global/hooks/use-toast";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { buildUserFromDb } from "@/(pages)/(auth)/context/auth/utils";
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
} from "@global/lib/api/profile.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Save,
  Camera,
  Shield,
  User,
  Mail,
  Lock,
  Sparkles,
  Crown,
  QrCode,
  Download,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Send,
  Key,
  X,
} from "lucide-react";
import { useTracking } from "@global/hooks/useTracking";
import TimeOnPageTracker from "@components/tracking/TimeOnPageTracker";
import { useLocale } from "@global/hooks/useLocale";
import { profileT } from "./i18n";
import type { TwoFactorMethod } from "@/(pages)/(auth)/types";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, updateUser, hydrated, token } = useAuth();
  const { trackEvent } = useTracking();
  const { locale } = useLocale();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: profile, isPending: loadingProfile } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: isAuthenticated,
    retry: false,
  });

  const isTwoFactorEnabled = Boolean(profile?.twoFactorEnabled);

  // Sync profile to auth context when data loads
  useEffect(() => {
    if (profile) {
      updateUser(
        buildUserFromDb({
          userId: profile.userId,
          name: profile.name,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          avatarUrl: profile.avatarUrl,
          role: profile.role as any,
        }),
      );
    }
  }, [profile, updateUser]);

  useEffect(() => {
    // Wait until auth state has been hydrated from storage to avoid
    // a false-negative redirect while the client reads localStorage.
    if (hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetupResponse | null>(null);
  const [selectedTwoFactorMethod, setSelectedTwoFactorMethod] = useState<TwoFactorMethod>("APP");
  const [latestBackupCodes, setLatestBackupCodes] = useState<string[]>([]);
  const [activeMethod, setActiveMethod] = useState<TwoFactorMethod | null>(null);
  const [activeFlow, setActiveFlow] = useState<"setup" | "disable" | null>(null);
  const [backupFlowOpen, setBackupFlowOpen] = useState(false);
  const [backupVerifyCode, setBackupVerifyCode] = useState("");
  const [backupCodeSent, setBackupCodeSent] = useState(false);
  const [removePanelCodeSent, setRemovePanelCodeSent] = useState(false);
  const [useBackupCodeForRemove, setUseBackupCodeForRemove] = useState(false);

  // Refs to prevent duplicate auto-sends
  const lastAutoRemoveSendRef = useRef<string | null>(null);
  const lastAutoBackupSendRef = useRef<boolean>(false);

  const enabledMethodSet = useMemo(() => {
    return new Set((profile?.twoFactorMethods ?? []) as TwoFactorMethod[]);
  }, [profile?.twoFactorMethods]);

  // ── Auto-send code when remove panel opens for EMAIL / SMS ──────────────
  useEffect(() => {
    if (
      activeFlow !== "disable" ||
      !activeMethod ||
      (activeMethod !== "EMAIL" && activeMethod !== "SMS") ||
      !token
    ) {
      return;
    }
    const key = `${activeMethod}-disable`;
    if (lastAutoRemoveSendRef.current === key) return;
    lastAutoRemoveSendRef.current = key;
    sendTwoFactorSetupCodeMutation.mutate(
      {
        method: activeMethod as Exclude<TwoFactorMethod, "APP" | "BACKUP_CODE">,
        context: "DISABLE_METHOD",
      },
      { onSuccess: () => setRemovePanelCodeSent(true) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFlow, activeMethod, token]);

  // ── Auto-send code when backup flow opens (if EMAIL is active) ───────────
  useEffect(() => {
    if (!backupFlowOpen || !token || !enabledMethodSet.has("EMAIL")) return;
    if (lastAutoBackupSendRef.current) return;
    lastAutoBackupSendRef.current = true;
    sendTwoFactorSetupCodeMutation.mutate(
      { method: "EMAIL", context: "BACKUP_CODES" },
      { onSuccess: () => setBackupCodeSent(true) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backupFlowOpen, token]);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setEmail(profile.email);
      setPhone(profile.phoneNumber ?? "");
      setCurrentAvatar(profile.avatarUrl ?? null);
    }
  }, [profile]);

  const displayInitials = useMemo(() => {
    const fromName = name?.trim();
    if (fromName) return fromName.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  }, [name, email]);

  // All selectable methods (always show APP, EMAIL, SMS/Telegram)

  const downloadBackupCodesAsTxt = (codes: string[]) => {
    if (!codes.length) return;
    const content = [
      "Kayedni Backup Codes",
      `Generated: ${new Date().toISOString()}`,
      "",
      ...codes,
      "",
      "Each code can be used once.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kayedni-backup-codes.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      setCurrentAvatar(data.avatarUrl ?? currentAvatar);
      toast({
        title: profileT(locale, "profile_toast_update_success_title"),
        description: profileT(locale, "profile_toast_update_success_desc"),
        variant: "success",
      });
      trackEvent("profile_update", { fields: ["name", "email", "phone"].filter(Boolean) });
      updateUser(
        buildUserFromDb({
          userId: data.userId,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          avatarUrl: data.avatarUrl,
          role: data.role as any,
        }),
      );
    },
    onError: (error: any) => {
      const message = error?.message || profileT(locale, "profile_toast_update_failed_desc");
      toast({
        title: profileT(locale, "profile_toast_update_failed_title"),
        description: message,
        variant: "error",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: profileT(locale, "profile_toast_password_success_title"),
        description: profileT(locale, "profile_toast_password_success_desc"),
        variant: "success",
      });
    },
    onError: (error: any) => {
      const message = error?.message || profileT(locale, "profile_toast_password_failed_desc");
      toast({
        title: profileT(locale, "profile_toast_password_failed_title"),
        description: message,
        variant: "error",
      });
    },
  });

  const setupTwoFactorMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Authentication token not available");
      }
      return setupTwoFactorAPI(token);
    },
    onSuccess: (data) => {
      setTwoFactorSetup(data);
      if (data.backupCodes?.length) {
        setLatestBackupCodes(data.backupCodes);
      }
      setTwoFactorCode("");
      toast({
        title: profileT(locale, "profile_toast_2fa_setup_ready_title"),
        description: data.message || profileT(locale, "profile_toast_2fa_setup_ready_desc"),
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, "profile_toast_2fa_setup_failed_title"),
        description: error?.message || profileT(locale, "profile_toast_2fa_setup_failed_desc"),
        variant: "error",
      });
    },
  });

  const sendTwoFactorSetupCodeMutation = useMutation({
    mutationFn: async ({
      method,
      context,
    }: {
      method: Exclude<TwoFactorMethod, "APP" | "BACKUP_CODE">;
      context?: string;
    }) => {
      if (!token) throw new Error("Authentication token not available");
      return sendTwoFactorSetupCodeAPI(token, { method, context });
    },
    onSuccess: (data) => {
      toast({
        title: profileT(locale, "profile_toast_2fa_code_sent_title"),
        description: data.message || profileT(locale, "profile_toast_2fa_code_sent_desc"),
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, "profile_toast_2fa_code_send_failed_title"),
        description: error?.message || profileT(locale, "profile_toast_2fa_code_send_failed_desc"),
        variant: "error",
      });
    },
  });

  const enableTwoFactorMutation = useMutation({
    mutationFn: async (method: TwoFactorMethod) => {
      if (!token) throw new Error("Authentication token not available");
      return enableTwoFactorAPI(token, { code: twoFactorCode, method });
    },
    onSuccess: (data: TwoFactorSetupResponse) => {
      setTwoFactorSetup(null);
      setTwoFactorCode("");
      setActiveMethod(null);
      setActiveFlow(null);
      if (data.backupCodes?.length) {
        setLatestBackupCodes(data.backupCodes);
        // Auto-download backup codes the moment they're first generated
        downloadBackupCodesAsTxt(data.backupCodes);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: profileT(locale, "profile_toast_2fa_enabled_title"),
        description: profileT(locale, "profile_toast_2fa_enabled_desc"),
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, "profile_toast_2fa_enable_failed_title"),
        description: error?.message || profileT(locale, "profile_toast_2fa_enable_failed_desc"),
        variant: "error",
      });
    },
  });

  const disableTwoFactorMutation = useMutation({
    mutationFn: async ({ method, useBackup }: { method: TwoFactorMethod; useBackup: boolean }) => {
      if (!token) throw new Error("Authentication token not available");
      return disableTwoFactorAPI(token, {
        code: twoFactorCode,
        method: useBackup ? "BACKUP_CODE" : method,
      });
    },
    onSuccess: () => {
      setTwoFactorSetup(null);
      setTwoFactorCode("");
      setActiveMethod(null);
      setActiveFlow(null);
      setUseBackupCodeForRemove(false);
      setLatestBackupCodes([]);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: profileT(locale, "profile_toast_2fa_disabled_title"),
        description: profileT(locale, "profile_toast_2fa_disabled_desc"),
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, "profile_toast_2fa_disable_failed_title"),
        description: error?.message || profileT(locale, "profile_toast_2fa_disable_failed_desc"),
        variant: "error",
      });
    },
  });

  const regenerateBackupCodesMutation = useMutation({
    mutationFn: async ({ method, code }: { method: TwoFactorMethod; code: string }) => {
      if (!token) throw new Error("Authentication token not available");
      return regenerateBackupCodesAPI(token, { code, method });
    },
    onSuccess: (data) => {
      setLatestBackupCodes(data.backupCodes || []);
      setBackupFlowOpen(false);
      setBackupVerifyCode("");
      setBackupCodeSent(false);
      toast({
        title: profileT(locale, "profile_toast_backup_codes_title"),
        description: profileT(locale, "profile_toast_backup_codes_desc"),
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: profileT(locale, "profile_toast_backup_codes_failed_title"),
        description: error?.message || profileT(locale, "profile_toast_backup_codes_failed_desc"),
        variant: "error",
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      setCurrentAvatar(data.url);
      const cached = queryClient.getQueryData<UserProfile>(["profile"]);
      if (cached) {
        queryClient.setQueryData<UserProfile>(["profile"], { ...cached, avatarUrl: data.url });
        updateUser(
          buildUserFromDb({
            userId: cached.userId,
            name: cached.name,
            email: cached.email,
            phoneNumber: cached.phoneNumber,
            avatarUrl: data.url,
            role: cached.role as any,
          }),
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
      toast({
        title: profileT(locale, "profile_toast_photo_success_title"),
        description: profileT(locale, "profile_toast_photo_success_desc"),
        variant: "success",
      });
    },
    onError: (error: any) => {
      const message = error?.message || profileT(locale, "profile_toast_photo_failed_desc");
      toast({
        title: profileT(locale, "profile_toast_photo_failed_title"),
        description: message,
        variant: "error",
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
                  <AvatarImage
                    src={currentAvatar ?? undefined}
                    alt="Profile"
                    className="object-cover"
                  />
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
                  {profile?.name || profileT(locale, "profile_default_name")}
                </h1>
                {profile?.role === "ADMIN" && (
                  <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <p className="text-muted-foreground text-lg max-w-xl">
                {profileT(locale, "profile_subtitle")}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                  <Shield className="w-3 h-3 mr-1" /> {profileT(locale, "profile_verified_user")}
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
                        <span className="text-sm font-medium text-muted-foreground">
                          {profileT(locale, "profile_saving_changes")}
                        </span>
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
                          <CardTitle className="text-lg font-semibold text-foreground">
                            {profileT(locale, "profile_personal_info_title")}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {profileT(locale, "profile_personal_info_desc")}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleProfileSubmit}
                        disabled={updateProfileMutation.isPending || loadingProfile}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                      >
                        <Save className="h-4 w-4 mr-2" /> {profileT(locale, "profile_save")}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{profileT(locale, "profile_full_name")}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={profileT(locale, "profile_name_placeholder")}
                        className="h-12 border-input/60 focus-visible:ring-primary bg-background/50"
                      />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="email">{profileT(locale, "profile_email_address")}</Label>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Lock className="w-3 h-3" /> {profileT(locale, "profile_read_only")}
                          </span>
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
                        <Label htmlFor="phone">{profileT(locale, "profile_phone_number")}</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={profileT(locale, "profile_phone_placeholder")}
                          className="h-12 border-input/60 focus-visible:ring-primary bg-background/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ═══ Two-Factor Authentication — Redesigned ═══ */}
              <div className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                <Card className="relative border border-border/60 shadow-sm bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                  {/* ── Header ── */}
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">
                            {profileT(locale, "profile_2fa_title")}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {profileT(locale, "profile_2fa_desc")}
                          </p>
                        </div>
                      </div>
                      {/* Global status pill */}
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isTwoFactorEnabled
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isTwoFactorEnabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"}`}
                        />
                        {isTwoFactorEnabled
                          ? profileT(locale, "profile_2fa_protected_badge")
                          : profileT(locale, "profile_2fa_not_enabled_badge")}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    {/* ══ METHOD ROWS ══ */}
                    {(
                      [
                        {
                          method: "APP" as TwoFactorMethod,
                          label: profileT(locale, "profile_2fa_method_app"),
                          desc: profileT(locale, "profile_2fa_method_app_desc"),
                          Icon: QrCode,
                          color: "violet",
                          supportsSend: false,
                        },
                        {
                          method: "EMAIL" as TwoFactorMethod,
                          label: profileT(locale, "profile_2fa_method_email"),
                          desc: profileT(locale, "profile_2fa_method_email_desc"),
                          Icon: Mail,
                          color: "blue",
                          supportsSend: true,
                        },
                        {
                          method: "SMS" as TwoFactorMethod,
                          label: profileT(locale, "profile_2fa_method_telegram"),
                          desc: profileT(locale, "profile_2fa_method_telegram_desc"),
                          Icon: MessageSquare,
                          color: "sky",
                          supportsSend: true,
                        },
                      ] as const
                    ).map(({ method, label, desc, Icon, color, supportsSend }) => {
                      const isOn = enabledMethodSet.has(method);
                      const isActive = activeMethod === method;
                      const isSetup = isActive && activeFlow === "setup";
                      const isRemove = isActive && activeFlow === "disable";

                      const colorMap: Record<string, string> = {
                        violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                        blue: "bg-blue-500/10   text-blue-600   dark:text-blue-400",
                        sky: "bg-sky-500/10    text-sky-600    dark:text-sky-400",
                      };

                      const closePanel = () => {
                        setActiveMethod(null);
                        setActiveFlow(null);
                        setTwoFactorCode("");
                        setTwoFactorSetup(null);
                        setRemovePanelCodeSent(false);
                        setUseBackupCodeForRemove(false);
                        lastAutoRemoveSendRef.current = null;
                      };

                      return (
                        <div
                          key={method}
                          className={`border-b border-border/30 last:border-0 transition-colors ${isActive ? "bg-muted/20" : ""}`}
                        >
                          {/* Row header */}
                          <div className="flex items-center justify-between gap-3 px-6 py-4">
                            <div className="flex items-center gap-4 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${colorMap[color]}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold text-foreground">
                                    {label}
                                  </span>
                                  {isOn && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                                      <CheckCircle2 className="w-3 h-3" /> Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isOn ? (
                                isRemove ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={closePanel}
                                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    {profileT(locale, "profile_2fa_cancel")}
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setActiveMethod(method);
                                      setActiveFlow("disable");
                                      setTwoFactorCode("");
                                    }}
                                    className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/20"
                                  >
                                    {profileT(locale, "profile_2fa_remove")}
                                  </Button>
                                )
                              ) : isSetup ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={closePanel}
                                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  {profileT(locale, "profile_2fa_cancel")}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setActiveMethod(method);
                                    setActiveFlow("setup");
                                    setTwoFactorCode("");
                                    if (method === "APP") setupTwoFactorMutation.mutate();
                                  }}
                                  disabled={
                                    setupTwoFactorMutation.isPending &&
                                    method === "APP" &&
                                    !isActive
                                  }
                                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
                                >
                                  {profileT(locale, "profile_2fa_add")}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* ── Setup panel ── */}
                          {isSetup && (
                            <div className="px-6 pb-5 pt-1 space-y-4 border-t border-border/30 bg-muted/10">
                              {/* APP → QR code */}
                              {method === "APP" &&
                                (setupTwoFactorMutation.isPending ? (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                                  </div>
                                ) : (
                                  twoFactorSetup?.qrCodeDataUrl && (
                                    <div className="flex flex-col sm:flex-row gap-5 items-start pt-3">
                                      <div className="rounded-2xl border border-border/60 bg-white p-3 shadow-sm flex-shrink-0">
                                        <img
                                          src={twoFactorSetup.qrCodeDataUrl}
                                          alt="QR code"
                                          className="w-36 h-36 rounded-lg"
                                        />
                                      </div>
                                      <div className="space-y-3 flex-1 pt-1">
                                        <p className="text-sm text-muted-foreground">
                                          {profileT(locale, "profile_2fa_qr_help")}
                                        </p>
                                        {twoFactorSetup.manualEntryKey && (
                                          <div className="rounded-xl bg-background border border-border/50 p-3">
                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                                              {profileT(locale, "profile_2fa_manual_key_label")}
                                            </p>
                                            <p className="font-mono text-sm break-all select-all">
                                              {twoFactorSetup.manualEntryKey}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )
                                ))}

                              {/* EMAIL / SMS → send code (manual resend) */}
                              {supportsSend && (
                                <div className="pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      sendTwoFactorSetupCodeMutation.mutate({
                                        method: method as Exclude<
                                          TwoFactorMethod,
                                          "APP" | "BACKUP_CODE"
                                        >,
                                        context: "SETUP",
                                      })
                                    }
                                    disabled={sendTwoFactorSetupCodeMutation.isPending || !token}
                                    className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
                                  >
                                    {sendTwoFactorSetupCodeMutation.isPending ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                        {profileT(locale, "profile_2fa_sending_code")}
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-3.5 h-3.5 mr-1.5" />
                                        {profileT(locale, "profile_2fa_send_code")}
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}

                              {/* Code input + Enable */}
                              {(method !== "APP" || twoFactorSetup?.qrCodeDataUrl) && (
                                <div className="flex gap-3 items-end">
                                  <div className="flex-1 space-y-1.5">
                                    <Label className="text-xs font-medium">
                                      {profileT(locale, "profile_2fa_code_label")}
                                    </Label>
                                    <Input
                                      value={twoFactorCode}
                                      onChange={(e) => setTwoFactorCode(e.target.value)}
                                      placeholder="123456"
                                      inputMode="numeric"
                                      autoComplete="one-time-code"
                                      className="h-11 border-input/60 focus-visible:ring-primary bg-background"
                                    />
                                  </div>
                                  <Button
                                    onClick={() => enableTwoFactorMutation.mutate(method)}
                                    disabled={enableTwoFactorMutation.isPending || !twoFactorCode}
                                    className="h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                                  >
                                    {enableTwoFactorMutation.isPending ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                        {profileT(locale, "profile_2fa_enabling")}
                                      </>
                                    ) : (
                                      profileT(locale, "profile_2fa_enable")
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── Remove/Disable panel ── */}
                          {isRemove && (
                            <div className="px-6 pb-5 pt-3 space-y-3 border-t border-red-200/40 dark:border-red-900/20 bg-red-50/20 dark:bg-red-900/5">
                              {/* Auto-sent notice for EMAIL / SMS */}
                              {(method === "EMAIL" || method === "SMS") &&
                                !useBackupCodeForRemove && (
                                  <div className="space-y-1.5">
                                    {removePanelCodeSent ? (
                                      <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {profileT(locale, "profile_2fa_remove_code_sent_notice")}
                                      </p>
                                    ) : sendTwoFactorSetupCodeMutation.isPending ? (
                                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        {profileT(locale, "profile_2fa_sending_code")}
                                      </p>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">
                                        {profileT(locale, "profile_2fa_remove_send_code_first")}
                                      </p>
                                    )}
                                    {/* Resend button (for when auto-send fails or user wants a fresh code) */}
                                    {removePanelCodeSent && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          sendTwoFactorSetupCodeMutation.mutate(
                                            {
                                              method: method as Exclude<
                                                TwoFactorMethod,
                                                "APP" | "BACKUP_CODE"
                                              >,
                                              context: "DISABLE_METHOD",
                                            },
                                            { onSuccess: () => setRemovePanelCodeSent(true) },
                                          )
                                        }
                                        disabled={
                                          sendTwoFactorSetupCodeMutation.isPending || !token
                                        }
                                        className="h-7 text-xs text-muted-foreground px-2"
                                      >
                                        <Send className="w-3 h-3 mr-1" /> Resend code
                                      </Button>
                                    )}
                                  </div>
                                )}

                              {/* Backup code toggle */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUseBackupCodeForRemove(!useBackupCodeForRemove);
                                    setTwoFactorCode("");
                                  }}
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <Key className="w-3 h-3" />
                                  {useBackupCodeForRemove
                                    ? "Use verification code instead"
                                    : "Use backup code instead"}
                                </button>
                              </div>

                              {/* Code input + Remove (shown for APP immediately, for EMAIL/SMS after code is sent, or when using backup) */}
                              {(method === "APP" ||
                                removePanelCodeSent ||
                                useBackupCodeForRemove) && (
                                <div className="flex gap-3 items-end">
                                  <div className="flex-1 space-y-1.5">
                                    <Label className="text-xs font-medium">
                                      {useBackupCodeForRemove
                                        ? "Backup code"
                                        : profileT(locale, "profile_2fa_code_label")}
                                    </Label>
                                    <Input
                                      value={twoFactorCode}
                                      onChange={(e) => setTwoFactorCode(e.target.value)}
                                      placeholder={useBackupCodeForRemove ? "XXXX-XXXX" : "123456"}
                                      inputMode={useBackupCodeForRemove ? "text" : "numeric"}
                                      autoComplete="one-time-code"
                                      className="h-11 border-red-200/60 focus-visible:ring-red-400 bg-background"
                                    />
                                  </div>
                                  <Button
                                    onClick={() => {
                                      setRemovePanelCodeSent(false);
                                      disableTwoFactorMutation.mutate({
                                        method,
                                        useBackup: useBackupCodeForRemove,
                                      });
                                    }}
                                    disabled={disableTwoFactorMutation.isPending || !twoFactorCode}
                                    variant="destructive"
                                    className="h-11 px-5 shadow-md"
                                  >
                                    {disableTwoFactorMutation.isPending ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                        {profileT(locale, "profile_2fa_removing")}
                                      </>
                                    ) : (
                                      profileT(locale, "profile_2fa_remove")
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* ══ BACKUP CODES ROW ══ */}
                    <div className="px-6 py-5 space-y-4">
                      {/* Row header */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <Key className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {profileT(locale, "profile_2fa_method_backup")}
                              </span>
                              {latestBackupCodes.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-medium border border-amber-500/20">
                                  <CheckCircle2 className="w-3 h-3" /> Ready
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {profileT(locale, "profile_2fa_method_backup_desc")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {isTwoFactorEnabled && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setBackupFlowOpen(!backupFlowOpen);
                                setBackupVerifyCode("");
                                setBackupCodeSent(false);
                                lastAutoBackupSendRef.current = false;
                              }}
                              className="h-8 text-xs"
                            >
                              {backupFlowOpen
                                ? profileT(locale, "profile_2fa_backup_close")
                                : profileT(locale, "profile_2fa_regenerate_backup")}
                            </Button>
                          )}
                          {latestBackupCodes.length > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadBackupCodesAsTxt(latestBackupCodes)}
                              className="h-8 text-xs"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              {profileT(locale, "profile_2fa_download_backup")}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* ── Email-verified backup code generation flow ── */}
                      {backupFlowOpen && (
                        <div className="rounded-xl border border-amber-500/25 bg-amber-50/30 dark:bg-amber-900/10 p-4 space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {profileT(locale, "profile_2fa_backup_flow_title")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {profileT(locale, "profile_2fa_backup_flow_desc")}
                            </p>
                          </div>

                          {/* Step 1 – Send email verification code */}
                          {enabledMethodSet.has("EMAIL") && (
                            <div className="flex items-center gap-3 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  sendTwoFactorSetupCodeMutation.mutate(
                                    { method: "EMAIL", context: "BACKUP_CODES" },
                                    { onSuccess: () => setBackupCodeSent(true) },
                                  )
                                }
                                disabled={sendTwoFactorSetupCodeMutation.isPending || !token}
                                className="h-9 text-sm border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
                              >
                                {sendTwoFactorSetupCodeMutation.isPending ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                    {profileT(locale, "profile_2fa_backup_sending_email")}
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5 mr-1.5" />
                                    {profileT(locale, "profile_2fa_backup_send_email")}
                                  </>
                                )}
                              </Button>
                              {backupCodeSent && (
                                <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {profileT(locale, "profile_2fa_backup_code_sent_notice")}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Step 2 – Enter code + confirm */}
                          {(backupCodeSent || !enabledMethodSet.has("EMAIL")) && (
                            <div className="flex gap-3 items-end">
                              <div className="flex-1 space-y-1.5">
                                <Label className="text-xs font-medium">
                                  {profileT(locale, "profile_2fa_code_label")}
                                </Label>
                                <Input
                                  value={backupVerifyCode}
                                  onChange={(e) => setBackupVerifyCode(e.target.value)}
                                  placeholder="123456"
                                  inputMode="numeric"
                                  autoComplete="one-time-code"
                                  className="h-11 border-amber-300/60 focus-visible:ring-amber-400 bg-background"
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  regenerateBackupCodesMutation.mutate({
                                    method: enabledMethodSet.has("EMAIL") ? "EMAIL" : "APP",
                                    code: backupVerifyCode,
                                  })
                                }
                                disabled={
                                  regenerateBackupCodesMutation.isPending || !backupVerifyCode
                                }
                                className="h-11 px-5 bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
                              >
                                {regenerateBackupCodesMutation.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                    {profileT(locale, "profile_2fa_backup_generating")}
                                  </>
                                ) : (
                                  profileT(locale, "profile_2fa_backup_generate_btn")
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {latestBackupCodes.length > 0 && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10 p-4">
                          <p className="text-xs text-amber-700 dark:text-amber-300 mb-3 font-medium">
                            {profileT(locale, "profile_2fa_backup_note")}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {latestBackupCodes.map((code) => (
                              <span
                                key={code}
                                className="font-mono text-xs bg-background/80 border border-border/40 rounded-lg px-2 py-1.5 text-center select-all"
                              >
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {isTwoFactorEnabled && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                          <p className="text-xs text-emerald-800 dark:text-emerald-200">
                            {profileT(locale, "profile_2fa_active_note")}
                          </p>
                        </div>
                      )}
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
                        <span className="text-sm font-medium text-muted-foreground">
                          {profileT(locale, "profile_updating_password")}
                        </span>
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
                          <CardTitle className="text-lg font-semibold text-foreground">
                            {profileT(locale, "profile_security_title")}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {profileT(locale, "profile_security_desc")}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handlePasswordSubmit}
                        disabled={
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword ||
                          changePasswordMutation.isPending
                        }
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white shadow-lg shadow-brand-orange/20 transition-all hover:-translate-y-0.5"
                      >
                        <Lock className="h-4 w-4 mr-2" />{" "}
                        {profileT(locale, "profile_update_password")}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        {profileT(locale, "profile_current_password")}
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={profileT(locale, "profile_current_password_placeholder")}
                        className="h-12 border-input/60 focus-visible:ring-brand-orange bg-background/50"
                      />
                    </div>

                    {/* New Password Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          {profileT(locale, "profile_new_password")}
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={profileT(locale, "profile_new_password_placeholder")}
                          className="h-12 border-input/60 focus-visible:ring-brand-orange bg-background/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          {profileT(locale, "profile_confirm_password")}
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={profileT(locale, "profile_confirm_password_placeholder")}
                          className="h-12 border-input/60 focus-visible:ring-brand-orange bg-background/50"
                        />
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50 flex gap-3 text-sm text-muted-foreground">
                      <Shield className="w-5 h-5 flex-shrink-0 text-brand-teal" />
                      <p>{profileT(locale, "profile_password_requirements")}</p>
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
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {profileT(locale, "profile_account_details")}
                      </CardTitle>
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
                            <p className="text-xs text-muted-foreground">
                              {profileT(locale, "profile_display_name")}
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {name || profile?.name || profileT(locale, "profile_not_set")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between group/item hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                            <Mail className="h-4 w-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs text-muted-foreground">
                              {profileT(locale, "profile_email_label")}
                            </p>
                            <p className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                              {email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between group/item hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                            <Crown className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {profileT(locale, "profile_role")}
                            </p>
                            <p className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">
                              {profile?.role ?? profileT(locale, "profile_role_fallback_user")}
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
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                            {profileT(locale, "profile_protected_account")}
                          </p>
                          <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 leading-tight mt-0.5">
                            {profileT(locale, "profile_protected_account_desc")}
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
                    <span className="font-semibold text-sm">
                      {profileT(locale, "profile_account_status")}
                    </span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {phone ? "100%" : "85%"}
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {profileT(locale, "profile_completion")}
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-brand-teal/5 border border-brand-teal/10">
                      <div className="text-2xl font-bold text-brand-teal mb-1">
                        {profileT(locale, "profile_active")}
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        {profileT(locale, "profile_status")}
                      </div>
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
