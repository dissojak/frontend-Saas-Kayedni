import type { Business } from "../businesses/types/business";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1';

/**
 * Fetch all active businesses from the backend API
 */
export async function fetchBusinesses(): Promise<Business[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }

    const data = await response.json();
    // Map backend response to Business type
    return data.map((b: any) => ({
      id: String(b.id),
      name: b.name,
      description: b.description || '',
      logo: b.firstImageUrl || b.imageUrl || b.logo || '/assets/placeholder.svg',
      rating: b.rating ?? null,
      reviewCount: b.reviewCount ?? 0,
      category: b.categoryName || b.category || '',
      location: b.location,
      phone: b.phone,
      email: b.email,
    } as Business));
  } catch (error) {
    console.error('fetchBusinesses error:', error);
    return [];
  }
}

/**
 * Fetch all categories from the backend API
 */
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    // Extract category names from the response
    const categoryNames = data.map((cat: any) => cat.name);
    return ['All', ...categoryNames];
  } catch (error) {
    console.error('fetchCategories error:', error);
    return ['All'];
  }
}

/**
 * Fetch a single business by id from the real backend API
 */
export async function fetchBusinessById(id: string): Promise<Business | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch business');
    }

    const data = await response.json();
    // Map backend response to Business type
    return {
      id: String(data.id),
      name: data.name,
      description: data.description || '',
      logo: data.firstImageUrl || data.imageUrl || data.logo || '/assets/placeholder.svg',
      rating: data.rating ?? null,
      reviewCount: data.reviewCount ?? 0,
      category: data.categoryName || data.category || '',
      location: data.location,
      phone: data.phone,
      email: data.email,
    } as Business;
  } catch (error) {
    console.error('fetchBusinessById error:', error);
    return null;
  }
}

/**
 * Fetch staff members for a business from the real backend API
 */
export async function fetchStaffByBusinessId(businessId: string, authToken?: string): Promise<any[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/staffMembers`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch staff');
    }

    const data = await response.json();
    // Map backend response (UserProfileResponse) to expected staff format
    return data.map((staff: any) => ({
      id: staff.userId,
      businessId: businessId,
      name: staff.name || staff.email,
      role: staff.role || 'Staff',
      avatar: staff.avatarUrl || staff.profilePicture || staff.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name || 'Staff')}&background=random`,
      avatarUrl: staff.avatarUrl || staff.profilePicture || staff.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name || 'Staff')}&background=random`,
      bio: staff.bio || '',
      email: staff.email,
      phoneNumber: staff.phoneNumber || staff.phone,
    }));
  } catch (error) {
    console.error('fetchStaffByBusinessId error:', error);
    return [];
  }
}

/**
 * Fetch services for a business from the real backend API
 */
export async function fetchServicesByBusinessId(businessId: string, authToken?: string): Promise<any[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/services`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch services');
    }

    const data = await response.json();
    // Map backend response to expected service format
    return data.map((service: any) => ({
      id: service.id,
      businessId: businessId,
      name: service.name,
      description: service.description || '',
      price: service.price || 0,
      duration: service.durationMinutes || service.duration || 30,
      durationMinutes: service.durationMinutes || service.duration || 30,
      category: service.categoryName || '',
      imageUrl: service.imageUrl,
      active: service.active !== false,
      staffIds: service.staffIds || [],
    }));
  } catch (error) {
    console.error('fetchServicesByBusinessId error:', error);
    return [];
  }
}

/**
 * Fetch services provided by a specific staff member from the real backend API
 */
export async function fetchServicesByStaffId(staffId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/staff/${staffId}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch staff services');
    }

    const data = await response.json();
    // Map backend ServiceResponse to expected service format
    return data.map((service: any) => ({
      id: String(service.id),
      name: service.name,
      description: service.description || '',
      price: Number(service.price ?? 0),
      duration: service.durationMinutes ?? service.duration ?? 30,
      imageUrl: service.imageUrl || null,
      staffIds: service.staffIds || [],
    }));
  } catch (error) {
    console.error('fetchServicesByStaffId error:', error);
    return [];
  }
}

/**
 * Fetch availability entries for a staff member within a date range [from, to]
 */
export async function fetchStaffAvailability(
  staffId: string,
  from: string,
  to: string
): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/staff/${staffId}/availabilities?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    console.log(`[fetchStaffAvailability] URL:`, url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`[fetchStaffAvailability] Response not ok, status: ${response.status}`);
      if (response.status === 404) return [];
      throw new Error('Failed to fetch staff availability');
    }

    const data = await response.json();
    console.log(`[fetchStaffAvailability] Response data for ${from}-${to}:`, data);
    
    return data.map((a: any) => ({
      id: a.id,
      date: a.date, // ISO LocalDate string
      startTime: a.startTime,
      endTime: a.endTime,
      status: a.status,
      userEdited: a.userEdited,
      staffId: a.staffId,
    }));
  } catch (error) {
    console.error('fetchStaffAvailability error:', error);
    return [];
  }
}

/**
 * Fetch images for a business from the real backend API
 */
export async function fetchBusinessImages(businessId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/images`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch business images');
    }

    const data = await response.json();
    return data.map((img: any) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      displayOrder: img.displayOrder,
    }));
  } catch (error) {
    console.error('fetchBusinessImages error:', error);
    return [];
  }
}

export async function fetchAvailableSlots(businessId: string) {
  // Produce simple slots for the next 3 days based on businessId
  const slots: any[] = [];
  const now = new Date();
  for (let day = 1; day <= 3; day++) {
    const d = new Date(now);
    d.setDate(now.getDate() + day);
    // three slots per day
    [9, 11, 14].forEach((hour, idx) => {
      const start = new Date(d);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(d);
      end.setHours(hour, 30, 0, 0);
      slots.push({ id: `${businessId}-slot-${day}-${idx}`, startTime: new Date(start), endTime: new Date(end), isAvailable: true });
    });
  }
  return new Promise((resolve) => setTimeout(() => resolve(slots), 150));
}

/**
 * Generate time slots for a staff member on a specific date
 * @param staffId - The staff member ID
 * @param date - The date (YYYY-MM-DD format)
 * @param serviceDuration - Service duration in minutes
 * @returns Array of time slots with availability status
 */
export async function fetchTimeSlotsForStaffDate(
  staffId: string,
  date: string,
  serviceDuration: number = 30
): Promise<any[]> {
  try {
    // Get staff availability for that specific day
    const availabilities = await fetchStaffAvailability(staffId, date, date);
    
    console.log(`[fetchTimeSlotsForStaffDate] Got ${availabilities?.length || 0} availability records for date=${date}`);
    
    if (!availabilities || availabilities.length === 0) {
      console.log(`[fetchTimeSlotsForStaffDate] No availability data for this date`);
      return []; // No availability data for this date
    }

    const dayAvailability = availabilities[0];
    console.log(`[fetchTimeSlotsForStaffDate] Day availability:`, JSON.stringify(dayAvailability));
    
    // Extract the actual staffId from the availability response (this is the Staff entity ID)
    const resolvedStaffId = dayAvailability.staffId || staffId;
    console.log(`[fetchTimeSlotsForStaffDate] Using staffId from availability: ${resolvedStaffId}`);
    
    // If staff is not available (CLOSED, SICK, VACATION, FULL, etc.), return empty
    if (dayAvailability.status !== 'AVAILABLE') {
      console.log(`[fetchTimeSlotsForStaffDate] Staff not available - status: ${dayAvailability.status}`);
      return [];
    }

    // Parse start and end times (format: "HH:mm:ss" or "HH:mm")
    const startTime = dayAvailability.startTime; // e.g., "09:00:00"
    const endTime = dayAvailability.endTime;     // e.g., "17:00:00"
    
    if (!startTime || !endTime) {
      console.log(`[fetchTimeSlotsForStaffDate] Missing times for date ${date}:`, { startTime, endTime });
      return [];
    }

    // Generate 15-minute time slots
    const slots: any[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    console.log(`[fetchTimeSlotsForStaffDate] Time range for ${date}:`, { 
      startTime, endTime, 
      startMinutes, endMinutes,
      serviceDuration,
      slotsCondition: `currentMinutes + ${serviceDuration} <= ${endMinutes}`,
      firstSlotCondition: `${startMinutes} + ${serviceDuration} <= ${endMinutes} = ${startMinutes + serviceDuration <= endMinutes}`,
      willGenerateSlots: (startMinutes + serviceDuration <= endMinutes)
    });
    
    // Slot interval: 15 minutes
    const SLOT_INTERVAL = 15;
    
    // Create slots from start to end
    for (let currentMinutes = startMinutes; currentMinutes + serviceDuration <= endMinutes; currentMinutes += SLOT_INTERVAL) {
      const slotHour = Math.floor(currentMinutes / 60);
      const slotMin = currentMinutes % 60;
      
      const slotStartHour = Math.floor(currentMinutes / 60);
      const slotStartMin = currentMinutes % 60;
      const slotEndMin = currentMinutes + serviceDuration;
      const slotEndHour = Math.floor(slotEndMin / 60);
      const slotEndMinFinal = slotEndMin % 60;
      
      // Create Date objects for startTime and endTime
      const slotDate = new Date(date + 'T00:00:00');
      const slotStart = new Date(slotDate);
      slotStart.setHours(slotStartHour, slotStartMin, 0, 0);
      
      const slotEnd = new Date(slotDate);
      slotEnd.setHours(slotEndHour, slotEndMinFinal, 0, 0);
      
      slots.push({
        id: `${staffId}-${date}-${String(slotHour).padStart(2, '0')}${String(slotMin).padStart(2, '0')}`,
        staffId: resolvedStaffId, // Add the resolved staffId to each slot
        startTime: slotStart,
        endTime: slotEnd,
        isAvailable: true, // Will be filtered after fetching bookings
      });
    }
    
    if (slots.length === 0) {
      console.warn(`[fetchTimeSlotsForStaffDate] WARNING: No slots generated for ${date}!`, {
        date,
        startTime,
        endTime,
        startMinutes,
        endMinutes,
        serviceDuration,
        loopCondition: `startMinutes(${startMinutes}) + serviceDuration(${serviceDuration}) <= endMinutes(${endMinutes})`,
        conditionResult: (startMinutes + serviceDuration <= endMinutes)
      });
    } else {
      console.log(`[fetchTimeSlotsForStaffDate] Generated ${slots.length} raw slots for ${date}`);
    }
    return slots;
  } catch (error) {
    console.error('fetchTimeSlotsForStaffDate error:', error);
    return [];
  }
}

/**
 * Fetch existing bookings for a staff member on a specific date.
 * Used to filter out occupied time slots.
 */
export async function fetchBookingsForStaffOnDate(
  staffId: string,
  date: string
): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/staff/${staffId}/date/${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If 404 or no bookings, return empty array (not an error)
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('fetchBookingsForStaffOnDate error:', error);
    return [];
  }
}

/**
 * Generate time slots and filter out already booked ones.
 * This is the main function for getting available slots.
 */
export async function fetchAvailableTimeSlotsForStaffDate(
  staffId: string,
  date: string,
  serviceDuration: number = 30
): Promise<any[]> {
  try {
    console.log(`[fetchAvailableTimeSlotsForStaffDate] Starting for staff=${staffId}, date=${date}, duration=${serviceDuration}`);
    
    // 1. Generate all possible slots from staff availability
    const allSlots = await fetchTimeSlotsForStaffDate(staffId, date, serviceDuration);
    
    console.log(`[fetchAvailableTimeSlotsForStaffDate] Generated ${allSlots.length} raw slots`);
    
    if (allSlots.length === 0) {
      console.log(`[fetchAvailableTimeSlotsForStaffDate] No slots generated - staff may not be available`);
      return [];
    }

    // Get the resolved staffId from the first slot (all slots have the same staffId)
    const resolvedStaffId = allSlots[0]?.staffId || staffId;
    console.log(`[fetchAvailableTimeSlotsForStaffDate] Using resolved staffId: ${resolvedStaffId}`);

    // 2. Fetch existing bookings for this staff on this date
    const existingBookings = await fetchBookingsForStaffOnDate(resolvedStaffId, date);
    console.log(`[fetchAvailableTimeSlotsForStaffDate] Found ${existingBookings.length} existing bookings`);

    // 3. Filter out occupied slots
    const availableSlots = allSlots.map(slot => {
      const slotStart = slot.startTime instanceof Date ? slot.startTime : new Date(slot.startTime);
      const slotEnd = slot.endTime instanceof Date ? slot.endTime : new Date(slot.endTime);

      // Check if this slot overlaps with any existing booking
      const isOccupied = existingBookings.some((booking: any) => {
        // Parse booking times (format: "HH:mm:ss" or "HH:mm")
        const [bookingStartH, bookingStartM] = booking.startTime.split(':').map(Number);
        const [bookingEndH, bookingEndM] = booking.endTime.split(':').map(Number);
        
        const bookingStart = new Date(slotStart);
        bookingStart.setHours(bookingStartH, bookingStartM, 0, 0);
        
        const bookingEnd = new Date(slotStart);
        bookingEnd.setHours(bookingEndH, bookingEndM, 0, 0);

        // Overlap: slot starts before booking ends AND slot ends after booking starts
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      return {
        ...slot,
        isAvailable: !isOccupied,
      };
    });

    // Return only available slots for cleaner UI
    const available = availableSlots.filter(slot => slot.isAvailable);
    console.log(`[fetchAvailableTimeSlotsForStaffDate] Returning ${available.length} available slots (filtered from ${availableSlots.length})`);
    return available;
  } catch (error) {
    console.error('fetchAvailableTimeSlotsForStaffDate error:', error);
    return [];
  }
}

/**
 * Create a new booking via the backend API.
 * All validation is done server-side.
 */
export interface CreateBookingRequest {
  serviceId: number;
  staffId: number;
  clientId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm or HH:mm:ss
  endTime: string; // HH:mm or HH:mm:ss
  price: number;
  notes?: string;
}

export interface BookingResponse {
  id: number;
  serviceId: number;
  serviceName: string;
  serviceDuration?: number;
  businessId?: number | null;
  businessName?: string | null;
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientType: string;
  staffId: number;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  price: number;
  duration?: number;
  createdAt: string;
  updatedAt: string | null;
}

export async function createBooking(
  request: CreateBookingRequest,
  authToken?: string
): Promise<BookingResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create booking');
  }

  return await response.json();
}

/**
 * Fetch bookings for the authenticated user.
 */
export async function fetchMyBookings(authToken: string): Promise<BookingResponse[]> {
  if (!authToken) {
    console.error('fetchMyBookings: No auth token provided');
    return [];
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('fetchMyBookings error:', response.status, errorData);
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(errorData.error || 'Failed to fetch bookings');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('fetchMyBookings exception:', error);
    throw error;
  }
}

/**
 * Cancel a booking.
 */
export async function cancelBooking(
  bookingId: number,
  reason?: string,
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ reason: reason || '' }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cancel booking error:', response.status, errorData);
      throw new Error(errorData.error || errorData.message || 'Failed to cancel booking');
    }
  } catch (error: any) {
    console.error('cancelBooking exception:', error);
    throw error;
  }
}

/**
 * Reschedule a booking to a new date/time.
 */
export async function rescheduleBooking(
  bookingId: number,
  newDate: string,
  newStartTime: string,
  newEndTime?: string,
  authToken?: string
): Promise<BookingResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reschedule`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ 
        date: newDate, 
        startTime: newStartTime,
        endTime: newEndTime 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Reschedule booking error:', response.status, errorData);
      throw new Error(errorData.error || errorData.message || 'Failed to reschedule booking');
    }

    return await response.json();
  } catch (error: any) {
    console.error('rescheduleBooking exception:', error);
    throw error;
  }
}

// ==========================================
// BUSINESS MANAGEMENT API
// ==========================================

/**
 * Fetch bookings for a business within a date range
 */
export async function fetchBookingsForBusiness(
  businessId: string,
  from?: string,
  to?: string,
  authToken?: string
): Promise<any[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    let url = `${API_BASE_URL}/bookings/business/${businessId}`;
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (params.toString()) url += `?${params.toString()}`;

    console.log('[fetchBookingsForBusiness] URL:', url);
    console.log('[fetchBookingsForBusiness] Headers:', { ...headers, Authorization: authToken ? 'Bearer ***' : 'none' });

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('[fetchBookingsForBusiness] Response status:', response.status);
    console.log('[fetchBookingsForBusiness] Response ok:', response.ok);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('[fetchBookingsForBusiness] 404 - No bookings found');
        return [];
      }
      const errorText = await response.text();
      console.error('[fetchBookingsForBusiness] Error response:', errorText);
      throw new Error('Failed to fetch bookings');
    }

    const data = await response.json();
    console.log('[fetchBookingsForBusiness] Data received:', data);
    return data;
  } catch (error) {
    console.error('[fetchBookingsForBusiness] error:', error);
    return [];
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: number,
  status: string,
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update booking status');
    }
  } catch (error: any) {
    console.error('updateBookingStatus exception:', error);
    throw error;
  }
}

/**
 * Add staff to business by email
 */
export async function addStaffToBusinessByEmail(
  businessId: string,
  email: string,
  authToken?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/staff`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add staff');
    }

    return await response.json();
  } catch (error: any) {
    console.error('addStaffToBusinessByEmail exception:', error);
    throw error;
  }
}

/**
 * Remove staff from business
 */
export async function removeStaffFromBusiness(
  businessId: string,
  staffId: number,
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/staff/${staffId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to remove staff');
    }
  } catch (error: any) {
    console.error('removeStaffFromBusiness exception:', error);
    throw error;
  }
}

/**
 * Create a new service
 */
export async function createService(
  businessId: string,
  data: {
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
    imageUrl?: string;
    staffIds?: number[];
  },
  authToken?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/services`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create service');
    }

    return await response.json();
  } catch (error: any) {
    console.error('createService exception:', error);
    throw error;
  }
}

/**
 * Update a service
 */
export async function updateService(
  businessId: string,
  serviceId: number,
  data: {
    name?: string;
    description?: string;
    durationMinutes?: number;
    price?: number;
    imageUrl?: string;
    staffIds?: number[];
    active?: boolean;
  },
  authToken?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/services/${serviceId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update service');
    }

    return await response.json();
  } catch (error: any) {
    console.error('updateService exception:', error);
    throw error;
  }
}

/**
 * Delete a service
 */
export async function deleteService(
  businessId: string,
  serviceId: number,
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/services/${serviceId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete service');
    }
  } catch (error: any) {
    console.error('deleteService exception:', error);
    throw error;
  }
}

// ==========================================
// RATING API (Using ServiceRating and BusinessRating tables)
// ==========================================

export interface RatingCreateRequest {
  bookingId: number;
  serviceRating?: number;
  businessRating?: number;
  serviceComment?: string;
  businessComment?: string;
}

export interface RatingResponse {
  bookingId: number;
  serviceId: number;
  serviceName: string;
  businessId: number | null;
  businessName: string | null;
  clientName: string;
  serviceRatingId: number | null;
  serviceRating: number | null;
  serviceComment: string | null;
  serviceRatingDate: string | null;
  businessRatingId: number | null;
  businessRating: number | null;
  businessComment: string | null;
  businessRatingDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  hasExistingRating: boolean;
}

/**
 * Create or update ratings for a completed booking.
 * Uses the new Rating API with ServiceRating and BusinessRating entities.
 */
export async function createOrUpdateRating(
  request: RatingCreateRequest,
  authToken: string
): Promise<RatingResponse> {
  // Clean up undefined/null values to avoid validation issues
  const cleanRequest = {
    bookingId: request.bookingId,
    ...(request.serviceRating !== undefined && request.serviceRating !== null && { serviceRating: request.serviceRating }),
    ...(request.businessRating !== undefined && request.businessRating !== null && { businessRating: request.businessRating }),
    ...(request.serviceComment && { serviceComment: request.serviceComment }),
    ...(request.businessComment && { businessComment: request.businessComment }),
  };

  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(cleanRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit rating');
  }

  return await response.json();
}

/**
 * Get existing rating for a booking.
 * Returns the service and business ratings if they exist.
 */
export async function getRatingForBooking(
  bookingId: number,
  authToken: string
): Promise<RatingResponse> {
  const response = await fetch(`${API_BASE_URL}/ratings/booking/${bookingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get rating');
  }

  return await response.json();
}

/**
 * Check if a booking has been rated.
 */
export async function checkRatingExists(
  bookingId: number,
  authToken: string
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/ratings/booking/${bookingId}/exists`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.hasRating === true;
}
