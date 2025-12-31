"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Search, Plus, Clock, DollarSign, Edit, Trash2, Package } from "lucide-react";
import { fetchServicesByBusinessId, createService, updateService, deleteService, fetchStaffByBusinessId } from "../../actions/backend";

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

interface StaffMember {
  id: number;
  name: string;
}

export default function BusinessServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    price: 0,
    imageUrl: '',
    staffIds: [] as number[],
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.businessId) {
        setBusinessId(user.businessId);
      }
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      loadServices();
      loadStaff();
    }
  }, [businessId]);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm]);

  const loadServices = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || undefined;
      const data = await fetchServicesByBusinessId(businessId, token);
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    if (!businessId) return;
    
    try {
      const token = localStorage.getItem('token') || undefined;
      const data = await fetchStaffByBusinessId(businessId, token);
      setStaff(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
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

  const openDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: service.price,
        imageUrl: service.imageUrl || '',
        staffIds: service.staffIds || [],
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        durationMinutes: 30,
        price: 0,
        imageUrl: '',
        staffIds: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!businessId || !formData.name || formData.price <= 0) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token') || undefined;
      
      if (editingService) {
        await updateService(businessId, editingService.id, formData, token);
      } else {
        await createService(businessId, formData, token);
      }
      
      setIsDialogOpen(false);
      await loadServices();
    } catch (error: any) {
      alert(error.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (!businessId) return;
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const token = localStorage.getItem('token') || undefined;
      await deleteService(businessId, serviceId, token);
      await loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service');
    }
  };

  const toggleStaffSelection = (staffId: number) => {
    setFormData(prev => ({
      ...prev,
      staffIds: prev.staffIds.includes(staffId)
        ? prev.staffIds.filter(id => id !== staffId)
        : [...prev.staffIds, staffId]
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-business mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage your business offerings and pricing</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {services.length} Services
            </Badge>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-business hover:bg-business-dark" onClick={() => openDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingService ? 'Edit Service' : 'Create New Service'}</DialogTitle>
                  <DialogDescription>
                    {editingService ? 'Update the details of your service' : 'Add a new service to your business offerings'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Haircut & Styling"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your service..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes) *</Label>
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
                      <Label htmlFor="price">Price ($) *</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                  {staff.length > 0 && (
                    <div className="space-y-2">
                      <Label>Assign Staff (Optional)</Label>
                      <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto">
                        {staff.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`staff-${member.id}`}
                              checked={formData.staffIds.includes(member.id)}
                              onChange={() => toggleStaffSelection(member.id)}
                              className="w-4 h-4 text-business focus:ring-business border-gray-300 rounded"
                            />
                            <Label htmlFor={`staff-${member.id}`} className="cursor-pointer">
                              {member.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-business hover:bg-business-dark"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.name || formData.price <= 0}
                  >
                    {isSubmitting ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No services found matching your search' : 'No services yet'}
              </p>
              {!searchTerm && (
                <Button 
                  className="bg-business hover:bg-business-dark mt-4"
                  onClick={() => openDialog()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Service
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Service Image */}
                    {service.imageUrl && (
                      <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Service Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                        {service.active && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                      )}
                    </div>

                    {/* Service Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-business" />
                        <span className="text-sm">{service.durationMinutes} minutes</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="w-4 h-4 mr-2 text-business" />
                        <span className="text-lg font-semibold">${service.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => openDialog(service)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-2">About Services</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Create and manage services your business offers</li>
                  <li>• Set duration and pricing for each service</li>
                  <li>• Assign staff members who can provide each service</li>
                  <li>• Services can be edited or removed at any time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
