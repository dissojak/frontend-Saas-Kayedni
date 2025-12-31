export interface ClientBooking {
  id: string;
  businessId: string;
  businessName: string;
  businessImage?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration?: number;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reviewed?: boolean;
}

export interface RecommendedBusiness {
  id: string;
  name: string;
  category: string;
  rating: number | null;
  image?: string;
  location?: string;
}

export interface SavedBusiness {
  id: string;
  name: string;
  category: string;
  image?: string;
}

export interface ReviewFormData {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface RescheduleFormData {
  bookingId: string;
  newDate: string;
  newTime: string;
}
