"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { 
  Search, 
  Clock, 
  DollarSign, 
  Package, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLocale } from '@global/hooks/useLocale';
import { 
  fetchServicesByBusinessId, 
  fetchCurrentStaffInfo,
  fetchServicesByStaffId
} from "../../../../(business)/actions/backend";
import { staffServicesT } from '../i18n';

interface Service {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  active: boolean;
  staffIds?: number[];
  createdById?: number;
}

export default function StaffMyServicesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { locale } = useLocale();
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedServiceToLink, setSelectedServiceToLink] = useState<Service | null>(null);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    loadBusinessInfo();
  }, [user, token]);

  useEffect(() => {
    if (businessId && user?.id) {
      loadServices();
    }
  }, [businessId, user?.id]);

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
      setLoading(false);
    }
  };

  const loadServices = async () => {
    if (!businessId || !user?.id) return;
    
    setLoading(true);
    try {
      // Fetch staff's own services
      const myServicesData = await fetchServicesByStaffId(String(user.id));
      setMyServices(myServicesData);

      // Fetch all business services for linking (including inactive)
      const allServicesData = await fetchServicesByBusinessId(String(businessId), token || undefined, true);
      setAllServices(allServicesData);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return staffServicesT(locale, 'duration_min_short', { count: minutes });
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return staffServicesT(locale, 'duration_hours_short', {
        hours,
        minutes: remainingMinutes,
      });
    }

    return staffServicesT(locale, 'duration_hour_short', { count: hours });
  };

  const formatPrice = (price: number) => {
    let localeTag = 'en-US';
    if (locale === 'fr') {
      localeTag = 'fr-FR';
    }
    if (locale === 'ar') {
      localeTag = 'ar-TN';
    }

    return new Intl.NumberFormat(localeTag, {
      style: 'currency',
      currency: 'TND',
    }).format(price);
  };

  const handleLinkToService = async (serviceId: number) => {
    if (!businessId || !token) return;
    
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
        await loadServices();
        setLinkDialogOpen(false);
        setSelectedServiceToLink(null);
      } else {
        console.error('Failed to link to service');
      }
    } catch (error) {
      console.error('Error linking to service:', error);
    } finally {
      setLinking(false);
    }
  };

  // Services I can link to (not already providing)
  const availableToLink = allServices.filter(
    service => !myServices.some(ms => ms.id === service.id) && service.active
  );

  // Filter my services by search
  const filteredMyServices = myServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!businessId && !loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardContent className="py-8 text-center">
              <Package className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{staffServicesT(locale, 'no_business_linked_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {staffServicesT(locale, 'no_business_linked_desc_view')}
              </p>
              <Button 
                className="mt-4" 
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

  let myServicesContent: React.ReactNode;
  if (loading) {
    myServicesContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else if (filteredMyServices.length === 0) {
    myServicesContent = (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? staffServicesT(locale, 'no_services_found') : staffServicesT(locale, 'no_services_yet')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm
              ? staffServicesT(locale, 'try_adjust_search')
              : staffServicesT(locale, 'link_or_create_services')}
          </p>
          {!searchTerm && (
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setLinkDialogOpen(true)}
                disabled={availableToLink.length === 0}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                {staffServicesT(locale, 'link_to_service')}
              </Button>
              <Button onClick={() => router.push('/staff/services/create')}>
                <Plus className="h-4 w-4 mr-2" />
                {staffServicesT(locale, 'create_service')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } else {
    myServicesContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMyServices.map((service) => (
          <Card
            key={service.id}
            className={`hover:shadow-lg transition-shadow cursor-pointer group border-l-4 relative ${
              service.active
                ? 'border-l-emerald-500'
                : 'border-l-red-500 border-2 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900/30 ring-2 ring-red-200 dark:ring-red-800'
            }`}
            onClick={() => router.push(`/staff/services/${service.id}`)}
          >
            {service.active ? null : (
              <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs font-bold text-center py-1 rounded-t-lg">
                {`⚠️ ${staffServicesT(locale, 'inactive_hidden_from_bookings')}`}
              </div>
            )}
            {service.imageUrl && (
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardContent className={service.imageUrl ? "p-4" : "p-6"}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <Badge
                  variant={service.active ? "default" : "secondary"}
                  className={service.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                >
                  {service.active ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> {staffServicesT(locale, 'status_active')}</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> {staffServicesT(locale, 'status_inactive')}</>
                  )}
                </Badge>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {service.description || staffServicesT(locale, 'no_description_available')}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(service.durationMinutes || 30)}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <DollarSign className="h-4 w-4" />
                  {formatPrice(service.price)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push('/staff/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {staffServicesT(locale, 'my_services_title')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {staffServicesT(locale, 'my_services_subtitle_total', { total: myServices.length })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setLinkDialogOpen(true)}
              disabled={availableToLink.length === 0}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {staffServicesT(locale, 'link_to_service')}
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => router.push('/staff/services/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              {staffServicesT(locale, 'create_service')}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={staffServicesT(locale, 'search_your_services')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* My Services Grid */}
        {myServicesContent}

        {/* Link to Service Dialog */}
        <AlertDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>{staffServicesT(locale, 'link_dialog_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {staffServicesT(locale, 'link_dialog_desc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-3 my-4">
              {availableToLink.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {staffServicesT(locale, 'all_services_already_linked')}
                </p>
              ) : (
                availableToLink.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all ${
                      selectedServiceToLink?.id === service.id 
                        ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedServiceToLink(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {service.description || staffServicesT(locale, 'no_description')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">{formatPrice(service.price)}</p>
                          <p className="text-xs text-gray-500">
                            {formatDuration(service.durationMinutes)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>{staffServicesT(locale, 'cancel')}</AlertDialogCancel>
              <Button
                onClick={() => selectedServiceToLink && handleLinkToService(selectedServiceToLink.id)}
                disabled={!selectedServiceToLink || linking}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {linking ? staffServicesT(locale, 'linking') : staffServicesT(locale, 'link_to_service')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
