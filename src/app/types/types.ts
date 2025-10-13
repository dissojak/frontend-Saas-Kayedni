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
