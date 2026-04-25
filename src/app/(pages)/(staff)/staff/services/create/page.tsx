"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { 
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Clock,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLocale } from '@global/hooks/useLocale';
import { 
  fetchCurrentStaffInfo,
  createService
} from "../../../../(business)/actions/backend";
import { staffServicesT } from '../i18n';

export default function StaffCreateServicePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { locale } = useLocale();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    price: 0,
    imageUrl: '',
    active: true,
  });

  useEffect(() => {
    loadBusinessInfo();
  }, [user, token]);

  const loadBusinessInfo = async () => {
    if (!user || !token) return;

    let bizId: string | undefined = user.businessId;

    if (!bizId) {
      const staffInfo = await fetchCurrentStaffInfo(token);
      if (staffInfo?.businessId) {
        bizId = String(staffInfo.businessId);
      }
    }

    if (bizId) {
      setBusinessId(bizId);
    } else {
      setError(staffServicesT(locale, 'error_no_business_linked'));
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('handleSubmit: businessId=', businessId, 'token=', token ? 'present' : 'MISSING');
    
    if (!businessId) {
      setError(staffServicesT(locale, 'error_missing_business_id'));
      return;
    }
    
    if (!token) {
      setError(staffServicesT(locale, 'error_auth_token_missing'));
      return;
    }
    
    setSaving(true);
    setError(null);
    
    const serviceData = {
      name: formData.name,
      description: formData.description,
      durationMinutes: formData.durationMinutes,
      price: formData.price,
      imageUrl: formData.imageUrl || undefined,
    };
    
    console.log('Creating service:', { businessId, serviceData });
    
    try {
      // Don't pass staffIds - let the backend auto-link the creator as staff
      const result = await createService(String(businessId), serviceData, token);
      console.log('Service created:', result);
      
      router.push('/staff/services/my-services');
    } catch (error: any) {
      console.error('Failed to create service:', error);
      setError(error.message || staffServicesT(locale, 'error_create_service_failed'));
    } finally {
      setSaving(false);
    }
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

  if (!businessId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardContent className="py-8 text-center">
              <Package className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{staffServicesT(locale, 'no_business_linked_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {staffServicesT(locale, 'no_business_linked_desc_create')}
              </p>
              <Button 
                variant="outline"
                onClick={() => router.push('/staff/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {staffServicesT(locale, 'back_to_dashboard')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/staff/services')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-500" />
              {staffServicesT(locale, 'create_new_service_title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {staffServicesT(locale, 'create_new_service_subtitle')}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 mb-6">
            <CardContent className="py-3 text-red-700 dark:text-red-300">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {staffServicesT(locale, 'service_name_label')}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={staffServicesT(locale, 'service_name_placeholder')}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {staffServicesT(locale, 'description_label')}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={staffServicesT(locale, 'description_placeholder')}
                  rows={4}
                />
              </div>

              {/* Duration & Price */}
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
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {staffServicesT(locale, 'duration_helper')}
                  </p>
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
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  {staffServicesT(locale, 'image_url_optional_label')}
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder={staffServicesT(locale, 'image_url_placeholder')}
                />
                {formData.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img 
                      src={formData.imageUrl} 
                      alt={staffServicesT(locale, 'preview_alt')}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                  {staffServicesT(locale, 'about_creating_services_title')}
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {staffServicesT(locale, 'about_creating_services_desc')}
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/staff/services')}
                >
                  {staffServicesT(locale, 'cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={saving || !formData.name || formData.price <= 0}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {staffServicesT(locale, 'creating')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {staffServicesT(locale, 'create_service')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
