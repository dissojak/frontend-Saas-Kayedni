"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { UserPlus, Users, Loader2, CheckCircle, Trash2, AlertTriangle, Trash } from "lucide-react";
import { 
  fetchBusinessClients, 
  createBusinessClient,
  deleteBusinessClient,
  checkClientBookings,
  createWalkInBooking, 
  fetchServicesByStaffId,
  type BusinessClient,
  type BusinessClientCreateRequest,
  type WalkInBookingRequest
} from "../../../(business)/actions/backend";

interface WalkInBookingProps {
  staffId: number;
  businessId: number;
  token: string;
  onBookingCreated: () => void;
}

export default function WalkInBooking({ staffId, businessId, token, onBookingCreated }: WalkInBookingProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'create' | 'book'>('select');
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteClientInfo, setDeleteClientInfo] = useState<{ id: number; name: string; info: any } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Client data
  const [clients, setClients] = useState<BusinessClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<BusinessClient | null>(null);
  const [loadingClients, setLoadingClients] = useState(false);
  
  // New client form
  const [newClient, setNewClient] = useState<BusinessClientCreateRequest>({
    name: '',
    phone: '',
    notes: ''
  });
  const [creatingClient, setCreatingClient] = useState(false);
  
  // Services
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  
  // Booking form
  const [bookingForm, setBookingForm] = useState<{
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes: string;
  }>({
    serviceId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    notes: ''
  });
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load clients and services when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      loadClients();
      loadServices();
    }
  }, [dialogOpen]);

  const loadClients = async () => {
    setLoadingClients(true);
    setError(null);
    try {
      const data = await fetchBusinessClients(businessId, token);
      setClients(data || []);
    } catch (err: any) {
      console.error('Failed to load clients:', err);
      // Only show error if it's not a 404 or empty result
      if (err.message && !err.message.includes('404')) {
        setError('Failed to load clients');
      }
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleDeleteClient = async (clientId: number, clientName: string) => {
    try {
      // Check if client has any bookings
      const bookingInfo = await checkClientBookings(businessId, clientId, token);
      
      if (bookingInfo.hasActiveBookings) {
        // This shouldn't happen - backend should prevent it
        setError('Cannot delete client with active bookings');
        return;
      }
      
      // Open delete confirmation dialog with booking info
      setDeleteClientInfo({ id: clientId, name: clientName, info: bookingInfo });
      setDeleteConfirmOpen(true);
    } catch (err: any) {
      console.error('Failed to check client bookings:', err);
      setError(err.message || 'Failed to check client bookings');
    }
  };

  const confirmDeleteClient = async () => {
    if (!deleteClientInfo) return;

    setIsDeleting(true);
    try {
      await deleteBusinessClient(businessId, deleteClientInfo.id, token);
      setClients(clients.filter(c => c.id !== deleteClientInfo.id));
      setDeleteConfirmOpen(false);
      setDeleteClientInfo(null);
      setError(null);
    } catch (err: any) {
      console.error('Failed to delete client:', err);
      setError(err.message || 'Failed to delete client');
      setDeleteConfirmOpen(false);
      setDeleteClientInfo(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      console.log('Loading services for staffId:', staffId);
      const data = await fetchServicesByStaffId(staffId.toString());
      console.log('Services returned from API:', data);
      const activeServices = data.filter((s: any) => s.active !== false);
      console.log('Active services:', activeServices);
      setServices(activeServices);
    } catch (err: any) {
      console.error('Failed to load services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.phone) {
      setError('Name and phone are required');
      return;
    }

    setCreatingClient(true);
    setError(null);
    try {
      const created = await createBusinessClient(businessId, newClient, token);
      setSelectedClient(created);
      setClients([...clients, created]);
      setStep('book');
      setNewClient({ name: '', phone: '', notes: '' });
    } catch (err: any) {
      console.error('Failed to create client:', err);
      setError(err.message || 'Failed to create client');
    } finally {
      setCreatingClient(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedClient || !bookingForm.serviceId || !bookingForm.startTime || !bookingForm.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    const selectedService = services.find(s => s.id.toString() === bookingForm.serviceId);
    if (!selectedService) {
      setError('Service not found');
      return;
    }

    setCreatingBooking(true);
    setError(null);
    try {
      const bookingData: WalkInBookingRequest = {
        serviceId: Number.parseInt(bookingForm.serviceId),
        businessClientId: selectedClient.id,
        staffId: staffId,
        date: bookingForm.date,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        notes: bookingForm.notes,
        price: selectedService.price
      };

      await createWalkInBooking(bookingData, token);
      
      // Success!
      onBookingCreated();
      handleClose();
    } catch (err: any) {
      console.error('Failed to create booking:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setCreatingBooking(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setStep('select');
    setSelectedClient(null);
    setNewClient({ name: '', phone: '', notes: '' });
    setBookingForm({
      serviceId: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      notes: ''
    });
    setError(null);
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id.toString() === serviceId);
    setBookingForm({
      ...bookingForm,
      serviceId,
      // Auto-calculate end time based on service duration
      endTime: service && bookingForm.startTime ? 
        calculateEndTime(bookingForm.startTime, service.estimatedDuration) : ''
    });
  };

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white font-semibold h-12 px-6 rounded-xl shadow-lg"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Book for Walk-in Client
      </Button>

      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {step === 'select' && 'Select or Add Client'}
              {step === 'create' && 'Create New Client'}
              {step === 'book' && `Book Service for ${selectedClient?.name}`}
            </DialogTitle>
            <DialogDescription>
              {step === 'select' && 'Choose an existing client or create a new one'}
              {step === 'create' && 'Enter the client\'s information'}
              {step === 'book' && 'Select a service and time slot'}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-4">
              {loadingClients ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Existing Clients ({clients.length})</Label>
                    {clients.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No clients yet. Create your first one!</p>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
                        {clients.map((client) => (
                          <div
                            key={client.id}
                            className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between gap-3"
                          >
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setStep('book');
                              }}
                              className="flex-1 text-left"
                            >
                              <div className="font-semibold">{client.name}</div>
                              <div className="text-sm text-muted-foreground">{client.phone}</div>
                              {client.email && (
                                <div className="text-sm text-muted-foreground">{client.email}</div>
                              )}
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClient(client.id, client.name)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 border-t" />
                    <span className="text-sm text-muted-foreground">OR</span>
                    <div className="flex-1 border-t" />
                  </div>

                  <Button
                    onClick={() => setStep('create')}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create New Client
                  </Button>
                </>
              )}
            </div>
          )}

          {step === 'create' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Client name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+1234567890"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="Any special notes about this client..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setStep('select')}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateClient}
                  disabled={creatingClient || !newClient.name || !newClient.phone}
                  className="flex-1"
                >
                  {creatingClient ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create & Continue
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'book' && selectedClient && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="font-semibold">{selectedClient.name}</div>
                <div className="text-sm text-muted-foreground">{selectedClient.phone}</div>
              </div>

              <div>
                <Label htmlFor="service">Service *</Label>
                <Select value={bookingForm.serviceId} onValueChange={handleServiceChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingServices && (
                      <div className="p-4 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </div>
                    )}
                    {!loadingServices && services.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No services available
                      </div>
                    )}
                    {!loadingServices && services.length > 0 && services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - ${service.price} ({service.estimatedDuration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={bookingForm.startTime}
                    onChange={(e) => {
                      const newStartTime = e.target.value;
                      const selectedService = services.find(s => s.id.toString() === bookingForm.serviceId);
                      setBookingForm({
                        ...bookingForm,
                        startTime: newStartTime,
                        endTime: selectedService ? calculateEndTime(newStartTime, selectedService.estimatedDuration) : ''
                      });
                    }}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={bookingForm.endTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bookingNotes">Notes (Optional)</Label>
                <Textarea
                  id="bookingNotes"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="Any special requests or notes..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setSelectedClient(null);
                    setStep('select');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateBooking}
                  disabled={creatingBooking || !bookingForm.serviceId || !bookingForm.startTime || !bookingForm.endTime}
                  className="flex-1 bg-primary"
                >
                  {creatingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Booking
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg">Delete Client</AlertDialogTitle>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogDescription className="space-y-3 py-4">
            <p className="font-medium text-gray-900">
              Are you sure you want to delete <span className="font-semibold text-gray-950">"{deleteClientInfo?.name}"</span>?
            </p>
            
            {deleteClientInfo?.info && (
              <>
                {deleteClientInfo.info.hasCompletedBookings && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">⚠️ This client has completed bookings</span> that will also be deleted. This action cannot be undone.
                    </p>
                  </div>
                )}
                
                {!deleteClientInfo.info.hasCompletedBookings && deleteClientInfo.info.count > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">📋 This client has previous bookings</span> (cancelled/no-show) that will also be deleted. This action cannot be undone.
                    </p>
                  </div>
                )}
                
                {deleteClientInfo.info.count === 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      This client has no bookings. This action cannot be undone.
                    </p>
                  </div>
                )}
              </>
            )}
          </AlertDialogDescription>
          
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="hover:bg-gray-100"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Client
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
