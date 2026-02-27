export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  logo: string;
  rating: number;
}

export interface Staff {
  id: string;
  businessId: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

export interface TimeSlot {
  id: string;
  staffId: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  businessId: string;
  staffId: string;
  serviceId: string;
  userId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

export interface BookingContextType {
  businesses: Business[];
  staff: Staff[];
  services: Service[];
  bookings: Booking[];
  availableSlots: TimeSlot[];
  selectedBusiness: Business | null;
  selectedStaff: Staff | null;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot | null;
  setSelectedBusiness: (business: Business | null) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  getBusinessById: (id: string) => Business | undefined;
  getStaffByBusinessId: (businessId: string) => Staff[];
  getServicesByBusinessId: (businessId: string) => Service[];
  createBooking: (booking: Omit<Booking, 'id'>) => void;
  getBookingsForUser: (userId: string) => Booking[];
  getBookingsForBusiness: (businessId: string) => Booking[];
  getBookingsForStaff: (staffId: string) => Booking[];
  cancelBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
}

// Tracking Types
export type EventType =
  | "page_view"
  | "click"
  | "search"
  | "search_query"
  | "business_view"
  | "business_impression"
  | "service_view"
  | "booking_started"
  | "booking_completed"
  | "booking_abandoned"
  | "review_submitted"
  | "review_read"
  | "category_browsed"
  | "scroll_depth"
  | "time_on_page"
  | "filter_used"
  | "sort_used"
  | "outbound_click"
  | "click_phone"
  | "click_location"
  | "favorite_action"
  | "login"
  | "signup"
  | "logout"
  | "profile_update";

export interface TrackingEvent {
  userId?: string | null;
  anonymousId?: string;
  sessionId: string;
  eventType: EventType;
  page: string;
  properties?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  timestamp?: number;
}

export interface TrackingContextType {
  sessionId: string | null;
  trackEvent: (
    eventType: EventType,
    properties?: Record<string, any>
  ) => void;
  trackPageView: (page?: string) => void;
  flushEvents: () => Promise<void>;
}
