"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { Separator } from "@components/ui/separator";
import { 
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Edit,
  X,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Link as LinkIcon,
  Unlink,
  Trash2,
  User,
  AlertTriangle,
  Search,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useLocale } from '@global/hooks/useLocale';
import { useRouter, useParams } from "next/navigation";
import { 
  fetchCurrentStaffInfo,
  updateService
} from "../../../../(business)/actions/backend";
import { staffServicesLocaleTag, staffServicesT } from '../i18n';

interface StaffInfo {
  id: number;
  name: string;
  avatarUrl?: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  active: boolean;
  createdById?: number;
  createdByName?: string;
  staffIds?: number[];
  staffProviders?: StaffInfo[];
  createdAt?: string;
  updatedAt?: string;
}

export default function StaffServiceDetailPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { locale } = useLocale();
  const serviceId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linking, setLinking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [checkingDelete, setCheckingDelete] = useState(false);
  const [deleteCheckResult, setDeleteCheckResult] = useState<{
    totalBookings: number;
    activeBookings: number;
    safeToDelete: boolean;
    message: string;
  } | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [staffList, setStaffList] = useState<StaffInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    price: 0,
    imageUrl: '',
    active: true,
  });

  const canEdit = service?.createdById === Number(user?.id);

  useEffect(() => {
    loadBusinessInfo();
  }, [user, token]);

  useEffect(() => {
    if (businessId && serviceId) {
      loadService();
    }
  }, [businessId, serviceId]);

  const loadBusinessInfo = async () => {
    if (!user || !token) return;

    let bizId = user.businessId;

    if (!bizId) {
      const staffInfo = await fetchCurrentStaffInfo(token);
      if (staffInfo?.businessId) {
        bizId = String(staffInfo.businessId);
      }
    }

    if (bizId) {
      setBusinessId(String(bizId));
    } else {
      setLoading(false);
      setError(staffServicesT(locale, 'error_no_business_linked'));
    }
  };

  const loadService = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'}/businesses/${businessId}/services/${serviceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(staffServicesT(locale, 'error_service_not_found'));
      }

      const data = await response.json();
      setService(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        durationMinutes: data.durationMinutes || 30,
        price: data.price || 0,
        imageUrl: data.imageUrl || '',
        active: data.active !== false,
      });
      
      // Check if current user is linked to this service
      setIsLinked(data.staffIds?.includes(Number(user?.id)) || false);
      
      // Use staffProviders from the API response directly (now includes full staff info)
      if (data.staffProviders && data.staffProviders.length > 0) {
        setStaffList(data.staffProviders);
      } else {
        setStaffList([]);
      }
    } catch (error) {
      console.error('Failed to load service:', error);
      setError(staffServicesT(locale, 'error_failed_load_service'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setSaving(true);
    try {
      await updateService(businessId, Number(serviceId), formData, token);
      await loadService();
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to update service:', error);
      setError(staffServicesT(locale, 'error_failed_update_service'));
    } finally {
      setSaving(false);
    }
  };

  const handleLinkToService = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setLinking(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'}/businesses/${businessId}/services/${serviceId}/staff/me`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await loadService();
      } else {
        setError(staffServicesT(locale, 'error_failed_link_service'));
      }
    } catch (error) {
      console.error('Error linking to service:', error);
      setError(staffServicesT(locale, 'error_error_link_service'));
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkFromService = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setLinking(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'}/businesses/${businessId}/services/${serviceId}/staff/me`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await loadService();
      } else {
        setError(staffServicesT(locale, 'error_failed_unlink_service'));
      }
    } catch (error) {
      console.error('Error unlinking from service:', error);
      setError(staffServicesT(locale, 'error_error_unlink_service'));
    } finally {
      setLinking(false);
    }
  };

  const handleCheckDeleteSafety = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setCheckingDelete(true);
    setDeleteCheckResult(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'}/businesses/${businessId}/services/${serviceId}/delete-check`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDeleteCheckResult(data);
      } else {
        setDeleteCheckResult({
          totalBookings: -1,
          activeBookings: -1,
          safeToDelete: false,
          message: staffServicesT(locale, 'error_failed_check_delete_safety')
        });
      }
    } catch (error) {
      console.error('Error checking delete safety:', error);
      setDeleteCheckResult({
        totalBookings: -1,
        activeBookings: -1,
        safeToDelete: false,
        message: staffServicesT(locale, 'error_error_check_delete_safety')
      });
    } finally {
      setCheckingDelete(false);
    }
  };

  const openDeleteDialog = () => {
    setDeleteCheckResult(null);
    setShowDeleteDialog(true);
  };

  const handleDeleteService = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setDeleting(true);
    setShowDeleteDialog(false);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'}/businesses/${businessId}/services/${serviceId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        router.push('/staff/services/my-services');
      } else {
        const errorText = await response.text();
        setError(errorText || staffServicesT(locale, 'error_failed_delete_service'));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setError(staffServicesT(locale, 'error_error_delete_service'));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeactivateService = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setDeactivating(true);
    setShowDeleteDialog(false);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'}/businesses/${businessId}/services/${serviceId}/deactivate`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Reload the service to show updated status
        await loadService();
      } else {
        const errorText = await response.text();
        setError(errorText || staffServicesT(locale, 'error_failed_deactivate_service'));
      }
    } catch (error) {
      console.error('Error deactivating service:', error);
      setError(staffServicesT(locale, 'error_error_deactivate_service'));
    } finally {
      setDeactivating(false);
    }
  };

  const handleReactivateService = async () => {
    if (!businessId || !serviceId || !token) return;
    
    setReactivating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1'}/businesses/${businessId}/services/${serviceId}/activate`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Reload the service to show updated status
        await loadService();
      } else {
        const errorText = await response.text();
        setError(errorText || staffServicesT(locale, 'error_failed_reactivate_service'));
      }
    } catch (error) {
      console.error('Error reactivating service:', error);
      setError(staffServicesT(locale, 'error_error_reactivate_service'));
    } finally {
      setReactivating(false);
    }
  };

  const cancelEdit = () => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        durationMinutes: service.durationMinutes || 30,
        price: service.price || 0,
        imageUrl: service.imageUrl || '',
        active: service.active !== false,
      });
    }
    setIsEditMode(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return staffServicesT(locale, 'duration_minutes_long', { count: minutes });
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return staffServicesT(locale, 'duration_hours_short', { hours, minutes: remainingMinutes });
    }

    return staffServicesT(locale, hours > 1 ? 'duration_hours_long' : 'duration_hour_long', { count: hours });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(staffServicesLocaleTag(locale), {
      style: 'currency',
      currency: 'TND',
    }).format(price);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) {
      return staffServicesT(locale, 'na');
    }

    return new Date(dateStr).toLocaleDateString(staffServicesLocaleTag(locale), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="py-8 text-center">
              <Package className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{error || staffServicesT(locale, 'error_service_not_found')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {staffServicesT(locale, 'service_not_found_desc')}
              </p>
              <Button 
                variant="outline"
                onClick={() => router.push('/staff/services')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {staffServicesT(locale, 'back_to_services')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push('/staff/services')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? staffServicesT(locale, 'edit_service') : staffServicesT(locale, 'service_details')}
                </h1>
                {!service.active && (
                  <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20">
                    <XCircle className="h-3 w-3 mr-1" />
                    {staffServicesT(locale, 'status_inactive')}
                  </Badge>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {isEditMode ? staffServicesT(locale, 'update_service_information') : staffServicesT(locale, 'view_service_information')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isLinked && !isEditMode && (
              <Button 
                variant="outline"
                onClick={handleLinkToService}
                disabled={linking}
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                {linking ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <LinkIcon className="h-4 w-4 mr-2" />
                )}
                {staffServicesT(locale, 'link_me_to_service')}
              </Button>
            )}

            {isLinked && !isEditMode && (
              <Button 
                variant="outline"
                onClick={handleUnlinkFromService}
                disabled={linking}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                {linking ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Unlink className="h-4 w-4 mr-2" />
                )}
                {staffServicesT(locale, 'unlink_me')}
              </Button>
            )}
            
            {canEdit && !isEditMode && (
              <>
                <Button 
                  onClick={() => setIsEditMode(true)}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {staffServicesT(locale, 'edit_service')}
                </Button>
                {!service.active && (
                  <Button 
                    variant="outline"
                    onClick={handleReactivateService}
                    disabled={reactivating}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    {reactivating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {staffServicesT(locale, 'reactivate')}
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={openDeleteDialog}
                  disabled={deleting}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {staffServicesT(locale, 'delete')}
                </Button>
              </>
            )}
            
            {isEditMode && (
              <>
                <Button 
                  variant="outline"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  {staffServicesT(locale, 'cancel')}
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saving || !formData.name || formData.price <= 0}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {staffServicesT(locale, 'save_changes')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Linked Badge */}
        {isLinked && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              {staffServicesT(locale, 'linked_to_service_notice')}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            {(service.imageUrl || isEditMode) && (
              <Card>
                <CardContent className="p-0">
                  {isEditMode ? (
                    <div className="p-6 space-y-4">
                      <Label htmlFor="imageUrl" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        {staffServicesT(locale, 'image_url_label')}
                      </Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.imageUrl && (
                        <div className="rounded-lg overflow-hidden border">
                          <img 
                            src={formData.imageUrl} 
                            alt={staffServicesT(locale, 'preview_alt')} 
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : service.imageUrl ? (
                    <div className="relative h-64 overflow-hidden rounded-lg">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  {staffServicesT(locale, 'service_information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditMode ? (
                  <>
                    {/* Edit Mode Form */}
                    <div className="space-y-2">
                      <Label htmlFor="name">{staffServicesT(locale, 'service_name_label')}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={staffServicesT(locale, 'service_name_placeholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{staffServicesT(locale, 'description_label')}</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={staffServicesT(locale, 'description_placeholder')}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {staffServicesT(locale, 'duration_minutes_label')}
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          min="5"
                          step="5"
                          value={formData.durationMinutes}
                          onChange={(e) => setFormData({ ...formData, durationMinutes: Number.parseInt(e.target.value, 10) || 30 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price" className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {staffServicesT(locale, 'price_label')}
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <Label htmlFor="active" className="font-medium">{staffServicesT(locale, 'active_status_label')}</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {staffServicesT(locale, 'active_status_desc')}
                        </p>
                      </div>
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {service.name}
                        </h2>
                        <Badge 
                          className={`mt-2 ${service.active 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
                        >
                          {service.active ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> {staffServicesT(locale, 'status_active')}</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" /> {staffServicesT(locale, 'status_inactive')}</>
                          )}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatPrice(service.price)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {staffServicesT(locale, 'description_label')}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {service.description || staffServicesT(locale, 'no_description_available')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{staffServicesT(locale, 'duration_label')}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatDuration(service.durationMinutes)}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{staffServicesT(locale, 'staff_providers_label')}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {staffServicesT(locale, 'staff_count', { count: service.staffIds?.length || 0 })}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Staff Providers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-blue-600" />
                  {staffServicesT(locale, 'staff_providers_label')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {staffList.length > 0 ? (
                  <div className="space-y-3">
                    {staffList.map((staff) => (
                      <div 
                        key={staff.id} 
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          staff.id === Number(user?.id) 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
                            : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          {staff.avatarUrl ? (
                            <img src={staff.avatarUrl} alt={staff.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {staff.name}
                            {staff.id === Number(user?.id) && (
                              <span className="text-emerald-600 text-xs ml-2">{staffServicesT(locale, 'you_suffix')}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    {staffServicesT(locale, 'no_staff_assigned')}
                  </p>
                )}
                
                {!isLinked && (
                  <Button 
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleLinkToService}
                    disabled={linking}
                  >
                    {linking ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LinkIcon className="h-4 w-4 mr-2" />
                    )}
                    {staffServicesT(locale, 'join_as_provider')}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Service Meta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  {staffServicesT(locale, 'service_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {service.createdByName && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">{staffServicesT(locale, 'created_by')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.createdByName}
                      {service.createdById === Number(user?.id) && (
                        <span className="text-emerald-600 text-xs ml-2">{staffServicesT(locale, 'you_suffix')}</span>
                      )}
                    </p>
                  </div>
                )}
                {service.createdAt && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">{staffServicesT(locale, 'created')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(service.createdAt)}
                    </p>
                  </div>
                )}
                {service.updatedAt && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">{staffServicesT(locale, 'last_updated')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(service.updatedAt)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Can Edit Notice */}
            {canEdit && !isEditMode && (
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                <CardContent className="py-4 text-center">
                  <Edit className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {staffServicesT(locale, 'can_edit_notice')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              {staffServicesT(locale, 'delete_service_title')}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  {staffServicesT(locale, 'delete_confirm_question', {
                    name: service?.name ?? '',
                  })}
                </p>
                <p className="text-red-600 font-medium">{staffServicesT(locale, 'delete_cannot_undo')}</p>
                
                {/* Check for bookings button */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Search className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-300">{staffServicesT(locale, 'check_related_bookings')}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleCheckDeleteSafety}
                      disabled={checkingDelete}
                      className="shrink-0"
                    >
                      {checkingDelete ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          {staffServicesT(locale, 'checking')}
                        </>
                      ) : (
                        staffServicesT(locale, 'check_now')
                      )}
                    </Button>
                  </div>
                  
                  {/* Check result */}
                  {deleteCheckResult && (
                    <div className={`mt-3 p-2 rounded-md ${
                      deleteCheckResult.safeToDelete 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
                        : deleteCheckResult.activeBookings > 0
                          ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                          : 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800'
                    }`}>
                      <div className="flex items-start gap-2">
                        {deleteCheckResult.safeToDelete ? (
                          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : deleteCheckResult.activeBookings > 0 ? (
                          <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="text-sm">
                          <p className={`font-medium ${
                            deleteCheckResult.safeToDelete 
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : deleteCheckResult.activeBookings > 0
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-amber-700 dark:text-amber-300'
                          }`}>
                            {deleteCheckResult.safeToDelete
                              ? staffServicesT(locale, 'delete_safe')
                              : deleteCheckResult.activeBookings > 0
                                ? staffServicesT(locale, 'delete_not_recommended')
                                : staffServicesT(locale, 'delete_caution')}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {deleteCheckResult.message}
                          </p>
                          {deleteCheckResult.totalBookings > 0 && (
                            <div className="flex gap-3 mt-2 text-xs">
                              <span className="text-gray-500">
                                {staffServicesT(locale, 'total_label')}: <strong>{deleteCheckResult.totalBookings}</strong>
                              </span>
                              {deleteCheckResult.activeBookings > 0 && (
                                <span className="text-red-600">
                                  {staffServicesT(locale, 'active_label')}: <strong>{deleteCheckResult.activeBookings}</strong>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Options explanation */}
                <div className="text-sm space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="font-medium text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      {staffServicesT(locale, 'deactivate_recommended_title')}
                    </p>
                    <ul className="list-disc list-inside text-amber-600 dark:text-amber-400 text-xs mt-1 space-y-0.5">
                      <li>{staffServicesT(locale, 'deactivate_bullet_hidden')}</li>
                      <li>{staffServicesT(locale, 'deactivate_bullet_preserved')}</li>
                      <li>{staffServicesT(locale, 'deactivate_bullet_reactivate')}</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      {staffServicesT(locale, 'delete_permanently_title')}
                    </p>
                    <ul className="list-disc list-inside text-red-600 dark:text-red-400 text-xs mt-1 space-y-0.5">
                      <li>{staffServicesT(locale, 'delete_bullet_links_removed')}</li>
                      <li>{staffServicesT(locale, 'delete_bullet_stats_lost')}</li>
                      <li>{staffServicesT(locale, 'delete_bullet_cannot_undo')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={deleting || deactivating}>{staffServicesT(locale, 'cancel')}</AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              onClick={handleDeactivateService}
              disabled={deleting || deactivating}
              className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              {deactivating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {staffServicesT(locale, 'deactivating')}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  {staffServicesT(locale, 'deactivate')}
                </>
              )}
            </Button>
            <AlertDialogAction
              onClick={handleDeleteService}
              disabled={deleting || deactivating}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {staffServicesT(locale, 'deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {staffServicesT(locale, 'delete')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
