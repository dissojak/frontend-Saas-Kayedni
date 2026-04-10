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
  Users, 
  Package, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLocale } from '@global/hooks/useLocale';
import { fetchServicesByBusinessId, fetchCurrentStaffInfo } from "../../../(business)/actions/backend";
import { staffServicesT } from './i18n';

interface Service {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  active: boolean;
  staffIds?: number[];
}

export default function StaffAllServicesPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { locale } = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>('');

  useEffect(() => {
    loadBusinessInfo();
  }, [user, token]);

  useEffect(() => {
    if (businessId) {
      loadServices();
    }
  }, [businessId]);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm]);

  const loadBusinessInfo = async () => {
    if (!user || !token) return;

    // Try to get businessId from user object first
    let bizId: string | undefined = user.businessId;
    let bizName = '';

    // If not in user object, fetch from API
    if (!bizId) {
      const staffInfo = await fetchCurrentStaffInfo(token);
      if (staffInfo?.businessId) {
        bizId = String(staffInfo.businessId);
        bizName = staffInfo.businessName || '';
      }
    }

    if (bizId) {
      setBusinessId(bizId);
      setBusinessName(bizName);
    } else {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      // Include inactive services so staff can see all services
      const data = await fetchServicesByBusinessId(String(businessId), token || undefined, true);
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
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

  let servicesContent: React.ReactNode;
  if (loading) {
    servicesContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
  } else if (filteredServices.length === 0) {
    servicesContent = (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? staffServicesT(locale, 'no_services_found') : staffServicesT(locale, 'no_services_yet')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm
              ? staffServicesT(locale, 'try_adjust_search')
              : staffServicesT(locale, 'create_first_service')}
          </p>
          {!searchTerm && (
            <Button onClick={() => router.push('/staff/services/create')}>
              <Plus className="h-4 w-4 mr-2" />
              {staffServicesT(locale, 'create_service')}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  } else {
    servicesContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={`hover:shadow-lg transition-shadow cursor-pointer group relative ${
              service.active
                ? ''
                : 'border-2 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900/30 ring-2 ring-red-200 dark:ring-red-800'
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
                <div className="flex items-center gap-4">
                  <span className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDuration(service.durationMinutes)}
                  </span>
                  <span className="flex items-center text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    {service.staffIds?.length || 0}
                  </span>
                </div>
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
                {staffServicesT(locale, 'all_business_services_title')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {businessName
                  ? staffServicesT(locale, 'services_offered_by_business', { business: businessName })
                  : staffServicesT(locale, 'services_offered_by_your_business')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => router.push('/staff/services/my-services')}
            >
              <Users className="h-4 w-4 mr-2" />
              {staffServicesT(locale, 'my_services')}
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
            placeholder={staffServicesT(locale, 'search_services')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Services Grid */}
        {servicesContent}

        {/* Summary */}
        {!loading && filteredServices.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {staffServicesT(locale, 'showing_services_summary', {
              filtered: filteredServices.length,
              total: services.length,
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
