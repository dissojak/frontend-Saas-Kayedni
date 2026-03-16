import type { Business } from "../businesses/types/business";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1';

// ========================
// Business Owner API Types
// ========================

export interface BusinessEvaluation {
  id: number;
  brandingScore: number;
  nameProfessionalismScore: number;
  emailProfessionalismScore: number;
  descriptionProfessionalismScore: number;
  locationScore: number;
  categoryScore: number;
  overallScore: number;
  nameDetails?: string;
  emailDetails?: string;
  descriptionDetails?: string;
  brandingDetails?: string;
  locationDetails?: string;
  categoryDetails?: string;
  nameSuggestions?: string;
  emailSuggestions?: string;
  descriptionSuggestions?: string;
  brandingSuggestions?: string;
  source: 'AI' | 'HEURISTIC';
  createdAt: string;
}

export interface BusinessResponse {
  id: number;
  name: string;
  location?: string;
  phone?: string;
  email?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DELETED';
  categoryId?: number;
  categoryName?: string;
  ownerId?: number;
  description?: string;
  evaluation?: BusinessEvaluation;
  firstImageUrl?: string;
  weekendDay?: string;
}

export interface BusinessUpdateRequest {
  name?: string;
  location?: string;
  phone?: string;
  email?: string;
  description?: string;
  categoryId?: number;
  weekendDay?: string;
}

// ========================
// Business Owner API Functions
// ========================

/**
 * Get the current owner's business with full evaluation details
 */
export async function fetchOwnerBusiness(authToken: string): Promise<BusinessResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      console.error('fetchOwnerBusiness failed:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('fetchOwnerBusiness error:', error);
    return null;
  }
}

/**
 * Update business information (triggers re-evaluation if relevant fields change)
 */
export async function updateOwnerBusiness(
  businessId: number,
  data: BusinessUpdateRequest,
  authToken: string
): Promise<BusinessResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('updateOwnerBusiness failed:', response.status, errorText);
      throw new Error(errorText || 'Failed to update business');
    }

    return await response.json();
  } catch (error) {
    console.error('updateOwnerBusiness error:', error);
    throw error;
  }
}

/**
 * Re-evaluate business with AI
 * Triggers a fresh AI evaluation and returns updated business with new evaluation
 */
export async function reEvaluateBusiness(
  businessId: number,
  authToken: string
): Promise<BusinessResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}/reevaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('reEvaluateBusiness failed:', response.status, errorText);
      throw new Error(errorText || 'Failed to re-evaluate business');
    }

    return await response.json();
  } catch (error) {
    console.error('reEvaluateBusiness error:', error);
    throw error;
  }
}

/**
 * Change business status (submit for review, etc.)
 */
export async function changeBusinessStatus(
  businessId: number,
  status: 'PENDING' | 'ACTIVE',
  authToken: string
): Promise<{ message: string; status: string; overallScore?: number; advice?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to change status');
    }

    return await response.json();
  } catch (error) {
    console.error('changeBusinessStatus error:', error);
    throw error;
  }
}

/**
 * Upload a business image file to Cloudinary
 */
export async function uploadBusinessImageFile(
  businessId: number,
  file: File,
  authToken: string
): Promise<{ id: number; imageUrl: string; displayOrder: number }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}/images/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('uploadBusinessImageFile error:', error);
    throw error;
  }
}

/**
 * Upload a business image by URL (legacy)
 */
export async function uploadBusinessImage(
  businessId: number,
  imageUrl: string,
  authToken: string
): Promise<{ id: number; imageUrl: string; displayOrder: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('uploadBusinessImage error:', error);
    throw error;
  }
}

/**
 * Get all images for a business (owner endpoint)
 */
export async function fetchOwnerBusinessImages(
  businessId: number,
  authToken: string
): Promise<{ id: number; imageUrl: string; displayOrder: number }[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}/images`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('fetchOwnerBusinessImages error:', error);
    return [];
  }
}

/**
 * Delete a business image
 */
export async function deleteBusinessImage(
  businessId: number,
  imageId: number,
  authToken: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete image');
    }
  } catch (error) {
    console.error('deleteBusinessImage error:', error);
    throw error;
  }
}

/**
 * Reorder business images
 */
export async function reorderBusinessImages(
  businessId: number,
  imageIds: number[],
  authToken: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/owner/businesses/${businessId}/images/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ imageIds }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to reorder images');
    }
  } catch (error) {
    console.error('reorderBusinessImages error:', error);
    throw error;
  }
}

/**
 * Check AI health status
 */
export async function checkAIHealth(): Promise<{ ok: boolean; message: string; model?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health/ai`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return {
        ok: true,
        message: data.message || 'AI is available and working',
        model: data.model,
      };
    } else {
      return {
        ok: false,
        message: data.message || 'AI service is unavailable',
      };
    }
  } catch (error) {
    console.error('checkAIHealth error:', error);
    return { ok: false, message: 'Failed to check AI health' };
  }
}

/**
 * Fetch current staff member's info including their business
 */
export async function fetchCurrentStaffInfo(authToken: string): Promise<{
  staffId: number;
  name?: string;
  email?: string;
  hasBusiness: boolean;
  businessId?: number;
  businessName?: string;
} | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/staff/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      console.error('fetchCurrentStaffInfo failed:', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchCurrentStaffInfo error:', error);
    return null;
  }
}

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
export async function fetchServicesByBusinessId(
  businessId: string, 
  authToken?: string,
  includeInactive: boolean = false
): Promise<any[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const url = includeInactive 
      ? `${API_BASE_URL}/businesses/${businessId}/services?includeInactive=true`
      : `${API_BASE_URL}/businesses/${businessId}/services`;
      
    const response = await fetch(url, {
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
      id: service.id,
      name: service.name,
      description: service.description || '',
      price: Number(service.price ?? 0),
      duration: service.durationMinutes ?? service.duration ?? 30,
      estimatedDuration: service.durationMinutes ?? service.duration ?? 30,
      imageUrl: service.imageUrl || null,
      staffIds: service.staffIds || [],
      active: service.active ?? true,
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
  authToken?: string,
  initiatedByClient: boolean = false
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
      body: JSON.stringify({ reason: reason || '', initiatedByClient }),
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
 * Get predefined cancellation/rejection reason templates for a business.
 */
export async function getCancellationReasons(
  businessId: number,
  authToken?: string
): Promise<{ id: number; reason: string }[]> {
  const headers: Record<string, string> = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const response = await fetch(`${API_BASE_URL}/cancellation-reasons?businessId=${businessId}`, { headers });
  if (!response.ok) return [];
  return response.json();
}

/**
 * Add a new predefined cancellation reason for a business.
 */
export async function addCancellationReason(
  businessId: number,
  reason: string,
  authToken?: string
): Promise<{ id: number; reason: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const response = await fetch(`${API_BASE_URL}/cancellation-reasons`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ businessId, reason }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to add reason');
  }
  return response.json();
}

/**
 * Delete a predefined cancellation reason by ID.
 */
export async function deleteCancellationReason(
  id: number,
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const response = await fetch(`${API_BASE_URL}/cancellation-reasons/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Failed to delete reason');
}

/**
 * Reschedule a booking to a new date/time.
 */
export async function rescheduleBooking(
  bookingId: number,
  newDate: string,
  newStartTime: string,
  newEndTime?: string,
  authToken?: string,
  initiatedByClient: boolean = false
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
        endTime: newEndTime,
        initiatedByClient
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
 * Fetch bookings for a staff member within a date range
 */
export async function fetchBookingsForStaff(
  staffId: string,
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
    let url = `${API_BASE_URL}/bookings/staff/${staffId}`;
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (params.toString()) url += `?${params.toString()}`;

    console.log('[fetchBookingsForStaff] URL:', url);
    console.log('[fetchBookingsForStaff] Headers:', { ...headers, Authorization: authToken ? 'Bearer ***' : 'none' });

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('[fetchBookingsForStaff] Response status:', response.status);
    console.log('[fetchBookingsForStaff] Response ok:', response.ok);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('[fetchBookingsForStaff] 404 - No bookings found');
        return [];
      }
      const errorText = await response.text();
      console.error('[fetchBookingsForStaff] Error response:', errorText);
      throw new Error('Failed to fetch bookings');
    }

    const data = await response.json();
    console.log('[fetchBookingsForStaff] Data received:', data);
    return data;
  } catch (error) {
    console.error('[fetchBookingsForStaff] error:', error);
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
 * Send an immediate staff-triggered reminder for an upcoming booking.
 */
export async function sendStaffReminderNow(
  bookingId: number,
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/staff-reminder-now`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send reminder');
    }
  } catch (error: any) {
    console.error('sendStaffReminderNow exception:', error);
    throw error;
  }
}

/**
 * Add staff to business by email with optional work hours
 */
export async function addStaffToBusinessByEmail(
  businessId: string,
  email: string,
  authToken?: string,
  workHours?: { startTime: string; endTime: string }
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const body: Record<string, string> = { email };
  if (workHours?.startTime && workHours?.endTime) {
    body.startTime = workHours.startTime;
    body.endTime = workHours.endTime;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/staff`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
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
    console.log('createService: POST', `${API_BASE_URL}/businesses/${businessId}/services`, data);
    
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/services`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('createService error response:', response.status, errorText);
      
      // Handle specific HTTP status codes
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to create services for this business.');
      }
      
      let errorMessage = 'Failed to create service';
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
      }
      throw new Error(errorMessage);
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

// ==========================================
// STAFF AVAILABILITY & SCHEDULE API
// ==========================================

/**
 * Fetch availabilities for a staff member within a date range
 */
export async function fetchStaffAvailabilities(
  staffId: string,
  from: string,
  to: string,
  authToken?: string
): Promise<any[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const url = `${API_BASE_URL}/staff/${staffId}/availabilities?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    console.log('[fetchStaffAvailabilities] URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('[fetchStaffAvailabilities] 404 - No availabilities found');
        return [];
      }
      throw new Error('Failed to fetch availabilities');
    }

    const data = await response.json();
    console.log('[fetchStaffAvailabilities] Data received:', data);
    return data;
  } catch (error) {
    console.error('[fetchStaffAvailabilities] error:', error);
    return [];
  }
}

/**
 * Update a staff availability slot
 */
export async function updateStaffAvailability(
  staffId: string,
  availabilityId: number,
  updates: {
    startTime?: string;
    endTime?: string;
    status?: string;
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
    const response = await fetch(`${API_BASE_URL}/staff/${staffId}/availabilities/${availabilityId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update availability');
    }

    return await response.json();
  } catch (error: any) {
    console.error('updateStaffAvailability exception:', error);
    throw error;
  }
}

/**
 * Fetch staff work hours (default start/end time)
 */
export async function fetchStaffWorkHours(
  staffId: string,
  authToken?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    console.log('[fetchStaffWorkHours] Fetching for staffId:', staffId);
    console.log('[fetchStaffWorkHours] Token:', authToken ? 'YES' : 'NO');
    
    // Call the workTime endpoint - backend returns current values when req is null
    const response = await fetch(`${API_BASE_URL}/staff/${staffId}/workTime`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(null),
    });

    console.log('[fetchStaffWorkHours] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[fetchStaffWorkHours] Error response:', errorText);
      throw new Error('Failed to fetch work hours');
    }

    const data = await response.json();
    console.log('[fetchStaffWorkHours] Data received:', data);
    return data;
  } catch (error: any) {
    console.error('fetchStaffWorkHours exception:', error);
    throw error;
  }
}

/**
 * Update staff work hours (default start/end time)
 */
export async function updateStaffWorkHours(
  staffId: string,
  defaultStartTime: string,
  defaultEndTime: string,
  authToken?: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/staff/${staffId}/workTime`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ defaultStartTime, defaultEndTime }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update work hours');
    }

    return await response.json();
  } catch (error: any) {
    console.error('updateStaffWorkHours exception:', error);
    throw error;
  }
}

/**
 * Staff resigns from business (becomes normal client)
 * DELETE /v1/businesses/{businessId}/staff/{staffId}
 */
export async function staffResignFromBusiness(
  businessId: string,
  staffId: string,
  authToken: string
): Promise<{ message: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/staff/${staffId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to resign from business');
    }

    // Handle empty response (204 No Content) or responses with JSON
    const text = await response.text();
    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        return { message: 'Successfully resigned from business' };
      }
    }
    return { message: 'Successfully resigned from business' };
  } catch (error: any) {
    console.error('staffResignFromBusiness exception:', error);
    throw error;
  }
}

/**
 * Get staff's booking stats (total, completed, cancelled, no_show)
 */
export async function fetchStaffStats(
  staffId: string,
  authToken: string
): Promise<{
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
}> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    // Fetch all bookings for the staff to calculate stats
    const response = await fetch(`${API_BASE_URL}/bookings/staff/${staffId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch staff bookings for stats');
    }

    const bookings = await response.json();
    
    // Calculate stats from bookings
    const stats = {
      totalBookings: bookings.length,
      completedBookings: bookings.filter((b: any) => b.status === 'COMPLETED').length,
      cancelledBookings: bookings.filter((b: any) => b.status === 'CANCELLED').length,
      noShowBookings: bookings.filter((b: any) => b.status === 'NO_SHOW').length,
      pendingBookings: bookings.filter((b: any) => b.status === 'PENDING').length,
      confirmedBookings: bookings.filter((b: any) => b.status === 'CONFIRMED').length,
    };

    return stats;
  } catch (error: any) {
    console.error('fetchStaffStats exception:', error);
    throw error;
  }
}

// ===========================
// Business Client API
// ===========================

export interface BusinessClient {
  id: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BusinessClientCreateRequest {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

/**
 * Get all business clients for a business
 */
export async function fetchBusinessClients(
  businessId: number,
  authToken: string
): Promise<BusinessClient[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/business/${businessId}/clients`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch business clients: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('fetchBusinessClients exception:', error);
    throw error;
  }
}

/**
 * Create a new business client
 */
export async function createBusinessClient(
  businessId: number,
  clientData: BusinessClientCreateRequest,
  authToken: string
): Promise<BusinessClient> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/business/${businessId}/clients`, {
      method: 'POST',
      headers,
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create business client: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('createBusinessClient exception:', error);
    throw error;
  }
}

/**
 * Delete a business client (only if no active bookings exist)
 */
export async function deleteBusinessClient(
  businessId: number,
  clientId: number,
  authToken: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/business/${businessId}/clients/${clientId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete business client: ${response.status}`);
    }
  } catch (error: any) {
    console.error('deleteBusinessClient exception:', error);
    throw error;
  }
}

/**
 * Check if a business client has bookings (for UI purposes)
 */
export async function checkClientBookings(
  businessId: number,
  clientId: number,
  authToken: string
): Promise<{ hasActiveBookings: boolean; hasCompletedBookings: boolean; count: number }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/business/${businessId}/clients/${clientId}/bookings/summary`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      // If endpoint doesn't exist, return safe defaults
      if (response.status === 404) {
        return { hasActiveBookings: false, hasCompletedBookings: false, count: 0 };
      }
      throw new Error(`Failed to check client bookings: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('checkClientBookings exception:', error);
    // Return safe defaults on error
    return { hasActiveBookings: false, hasCompletedBookings: false, count: 0 };
  }
}

/**
 * Create a booking for a business client (walk-in)
 */
export interface WalkInBookingRequest {
  serviceId: number;
  businessClientId: number;
  staffId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  notes?: string;
  price: number;
}

export async function createWalkInBooking(
  bookingData: WalkInBookingRequest,
  authToken: string
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...bookingData,
        status: 'CONFIRMED', // Walk-in bookings are auto-confirmed
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create booking: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('createWalkInBooking exception:', error);
    throw error;
  }
}
