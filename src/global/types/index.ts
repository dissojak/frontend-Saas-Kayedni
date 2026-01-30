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

// ============================================================================
// RESOURCE TYPES
// ============================================================================

export interface TemplateAttribute {
  attributeKey: string;
  attributeType: 'TEXT' | 'NUMBER' | 'BOOLEAN';
  required: boolean;
  displayOrder: number;
}

export interface ResourceTemplate {
  id: string;
  name: string;
  description?: string;
  businessId: string;
  attributes: TemplateAttribute[];
  createdAt: string;
  updatedAt?: string;
}

export interface ResourceAttribute {
  attributeKey: string;
  attributeValue: string;
  attributeType: 'TEXT' | 'NUMBER' | 'BOOLEAN';
  displayOrder: number;
}

export interface ResourcePricingOption {
  id?: string;
  pricingType: 'PER_HOUR' | 'PER_HALF_DAY' | 'PER_DAY' | 'PER_WEEK' | 'PER_MONTH' | 'PER_PERSON' | 'FLAT_RATE';
  price: number;
  label?: string;
  minDuration?: number;
  maxDuration?: number;
  isDefault: boolean;
}

export interface ResourceImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface StaffInfo {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface Resource {
  id: string;
  name: string;
  description?: string;
  type?: string;
  status: 'AVAILABLE' | 'OUT_OF_ORDER' | 'MAINTENANCE' | 'HOLIDAY';
  templateId?: string;
  templateName?: string;
  attributes: ResourceAttribute[];
  pricingOptions: ResourcePricingOption[];
  images: ResourceImage[];
  assignedStaff: StaffInfo[];
  businessId: string;
  businessName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ResourceAvailability {
  id: string;
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'HOLIDAY' | 'MAINTENANCE' | 'OUT_OF_ORDER';
  isBooked: boolean;
}

export interface ResourceReservation {
  id: string;
  resourceId: string;
  resourceName: string;
  resourcePrimaryImage?: string;
  clientId: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  pricingType: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BulkAvailabilityRequest {
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  slotDurationMinutes: number;
  excludeWeekends: boolean;
  excludedDates?: string[];
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
