"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
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
  Edit,
  Trash2,
  Link as LinkIcon,
  Unlink
} from "lucide-react";
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
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  fetchServicesByBusinessId, 
  fetchCurrentStaffInfo,
  fetchServicesByStaffId
} from "../../../../(business)/actions/backend";

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
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>('');
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
    let bizName = '';

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
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
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
              <h3 className="text-lg font-semibold mb-2">No Business Linked</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You need to be linked to a business to view your services.
              </p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => router.push('/staff/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
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
                My Services
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Services you currently provide ({myServices.length} total)
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
              Link to Service
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => router.push('/staff/services/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* My Services Grid */}
        {loading ? (
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
        ) : filteredMyServices.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No services found' : 'No services yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Link to existing services or create your own'}
              </p>
              {!searchTerm && (
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setLinkDialogOpen(true)}
                    disabled={availableToLink.length === 0}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link to Service
                  </Button>
                  <Button onClick={() => router.push('/staff/services/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Service
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMyServices.map((service) => (
              <Card 
                key={service.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer group border-l-4 relative ${
                  !service.active 
                    ? 'border-l-red-500 border-2 border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900/30 ring-2 ring-red-200 dark:ring-red-800' 
                    : 'border-l-emerald-500'
                }`}
                onClick={() => router.push(`/staff/services/${service.id}`)}
              >
                {!service.active && (
                  <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs font-bold text-center py-1 rounded-t-lg">
                    ⚠️ INACTIVE - Hidden from bookings
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
                        <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
                      )}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {service.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(service.durationMinutes || 30)}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                      <DollarSign className="h-4 w-4" />
                      {service.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Link to Service Dialog */}
        <AlertDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Link to a Service</AlertDialogTitle>
              <AlertDialogDescription>
                Select a service you want to provide. You'll be able to receive bookings for this service.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-3 my-4">
              {availableToLink.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  You're already linked to all available services.
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
                            {service.description || 'No description'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">${service.price}</p>
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={() => selectedServiceToLink && handleLinkToService(selectedServiceToLink.id)}
                disabled={!selectedServiceToLink || linking}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {linking ? 'Linking...' : 'Link to Service'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
