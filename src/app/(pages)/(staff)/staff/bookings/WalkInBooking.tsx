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
import { useLocale } from '@global/hooks/useLocale';
import { staffBookingsT } from './i18n';
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

export default function WalkInBooking({ staffId, businessId, token, onBookingCreated }: Readonly<WalkInBookingProps>) {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
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
        setError(staffBookingsT(locale, 'walkin_error_load_clients'));
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
        setError(staffBookingsT(locale, 'walkin_error_active_bookings'));
        return;
      }
      
      // Open delete confirmation dialog with booking info
      setDeleteClientInfo({ id: clientId, name: clientName, info: bookingInfo });
      setDeleteConfirmOpen(true);
    } catch (err: any) {
      console.error('Failed to check client bookings:', err);
      setError(err.message || staffBookingsT(locale, 'walkin_error_check_client_bookings'));
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
      setError(err.message || staffBookingsT(locale, 'walkin_error_delete_client'));
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
      setError(staffBookingsT(locale, 'walkin_error_name_phone_required'));
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
      setError(err.message || staffBookingsT(locale, 'walkin_error_create_client'));
    } finally {
      setCreatingClient(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedClient || !bookingForm.serviceId || !bookingForm.startTime || !bookingForm.endTime) {
      setError(staffBookingsT(locale, 'walkin_error_required_fields'));
      return;
    }

    const selectedService = services.find(s => s.id.toString() === bookingForm.serviceId);
    if (!selectedService) {
      setError(staffBookingsT(locale, 'walkin_error_service_not_found'));
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
      setError(err.message || staffBookingsT(locale, 'walkin_error_create_booking'));
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
        <UserPlus className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
        {staffBookingsT(locale, 'walkin_button')}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`max-w-2xl max-h-[90vh] overflow-y-auto ${isArabic ? 'text-right [&>button]:left-4 [&>button]:right-auto' : ''}`}
        >
          <DialogHeader className={isArabic ? 'text-right sm:text-right' : undefined}>
            <DialogTitle className="text-2xl font-bold">
              {step === 'select' && staffBookingsT(locale, 'walkin_step_select_title')}
              {step === 'create' && staffBookingsT(locale, 'walkin_step_create_title')}
              {step === 'book' && staffBookingsT(locale, 'walkin_step_book_title', { name: selectedClient?.name ?? '' })}
            </DialogTitle>
            <DialogDescription>
              {step === 'select' && staffBookingsT(locale, 'walkin_step_select_desc')}
              {step === 'create' && staffBookingsT(locale, 'walkin_step_create_desc')}
              {step === 'book' && staffBookingsT(locale, 'walkin_step_book_desc')}
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
                    <Label className="text-base font-semibold">{staffBookingsT(locale, 'walkin_existing_clients', { count: clients.length })}</Label>
                    {clients.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{staffBookingsT(locale, 'walkin_no_clients_title')}. {staffBookingsT(locale, 'walkin_no_clients_desc')}</p>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
                        {clients.map((client) => (
                          <div
                            key={client.id}
                            className={`p-4 hover:bg-muted/50 transition-colors flex items-center justify-between gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}
                          >
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setStep('book');
                              }}
                              className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}
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
                    <span className="text-sm text-muted-foreground">{staffBookingsT(locale, 'walkin_or')}</span>
                    <div className="flex-1 border-t" />
                  </div>

                  <Button
                    onClick={() => setStep('create')}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <UserPlus className={`w-5 h-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    {staffBookingsT(locale, 'walkin_create_new_client')}
                  </Button>
                </>
              )}
            </div>
          )}

          {step === 'create' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{staffBookingsT(locale, 'walkin_name_label')}</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder={staffBookingsT(locale, 'walkin_client_name_placeholder')}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="phone">{staffBookingsT(locale, 'walkin_phone_label')}</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder={staffBookingsT(locale, 'walkin_phone_placeholder')}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="notes">{staffBookingsT(locale, 'walkin_notes_optional')}</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder={staffBookingsT(locale, 'walkin_client_notes_placeholder')}
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
                  {staffBookingsT(locale, 'walkin_back')}
                </Button>
                <Button
                  onClick={handleCreateClient}
                  disabled={creatingClient || !newClient.name || !newClient.phone}
                  className="flex-1"
                >
                  {creatingClient ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {staffBookingsT(locale, 'walkin_creating')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {staffBookingsT(locale, 'walkin_create_continue')}
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
                <Label htmlFor="service">{staffBookingsT(locale, 'walkin_service_label')}</Label>
                <Select value={bookingForm.serviceId} onValueChange={handleServiceChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={staffBookingsT(locale, 'walkin_select_service')} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingServices && (
                      <div className="p-4 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      </div>
                    )}
                    {!loadingServices && services.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {staffBookingsT(locale, 'walkin_no_services_available')}
                      </div>
                    )}
                    {!loadingServices && services.length > 0 && services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {staffBookingsT(locale, 'walkin_service_option', {
                          name: service.name,
                          price: `$${service.price}`,
                          duration: service.estimatedDuration,
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">{staffBookingsT(locale, 'walkin_date_label')}</Label>
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
                  <Label htmlFor="startTime">{staffBookingsT(locale, 'walkin_start_time_label')}</Label>
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
                  <Label htmlFor="endTime">{staffBookingsT(locale, 'walkin_end_time_label')}</Label>
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
                <Label htmlFor="bookingNotes">{staffBookingsT(locale, 'walkin_booking_notes_label')}</Label>
                <Textarea
                  id="bookingNotes"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder={staffBookingsT(locale, 'walkin_booking_notes_placeholder')}
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
                  {staffBookingsT(locale, 'walkin_back')}
                </Button>
                <Button
                  onClick={handleCreateBooking}
                  disabled={creatingBooking || !bookingForm.serviceId || !bookingForm.startTime || !bookingForm.endTime}
                  className="flex-1 bg-primary"
                >
                  {creatingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {staffBookingsT(locale, 'walkin_creating')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {staffBookingsT(locale, 'walkin_create_booking')}
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
        <AlertDialogContent
          dir={isArabic ? 'rtl' : 'ltr'}
          className={`max-w-md ${isArabic ? 'text-right' : ''}`}
        >
          <AlertDialogHeader>
            <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-lg">{staffBookingsT(locale, 'walkin_delete_client_title')}</AlertDialogTitle>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogDescription className="space-y-3 py-4">
            <p className="font-medium text-gray-900">
              {staffBookingsT(locale, 'walkin_delete_client_confirm', { name: deleteClientInfo?.name ?? '' })}
            </p>
            
            {deleteClientInfo?.info && (
              <>
                {deleteClientInfo.info.hasCompletedBookings && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">{staffBookingsT(locale, 'walkin_delete_completed_warning_title')}</span> {staffBookingsT(locale, 'walkin_delete_completed_warning_desc')}
                    </p>
                  </div>
                )}
                
                {!deleteClientInfo.info.hasCompletedBookings && deleteClientInfo.info.count > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">{staffBookingsT(locale, 'walkin_delete_previous_warning_title')}</span> {staffBookingsT(locale, 'walkin_delete_previous_warning_desc')}
                    </p>
                  </div>
                )}
                
                {deleteClientInfo.info.count === 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      {staffBookingsT(locale, 'walkin_delete_no_bookings_desc')}
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
              {staffBookingsT(locale, 'cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {staffBookingsT(locale, 'walkin_deleting')}
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 mr-2" />
                  {staffBookingsT(locale, 'walkin_delete_client_action')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
