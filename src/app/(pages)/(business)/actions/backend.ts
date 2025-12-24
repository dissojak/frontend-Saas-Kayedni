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
export async function fetchStaffByBusinessId(businessId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/staffMembers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
      id: String(staff.userId),
      businessId: businessId,
      name: staff.name || staff.email,
      role: staff.role || 'Staff',
      avatar: staff.avatarUrl || staff.profilePicture || staff.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name || 'Staff')}&background=random`,
      bio: staff.bio || '',
      email: staff.email,
    }));
  } catch (error) {
    console.error('fetchStaffByBusinessId error:', error);
    return [];
  }
}

/**
 * Fetch services for a business from the real backend API
 */
export async function fetchServicesByBusinessId(businessId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
      id: String(service.id),
      businessId: businessId,
      name: service.name,
      description: service.description || '',
      price: service.price || 0,
      duration: service.durationMinutes || service.duration || 30,
      category: service.categoryName || '',
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
    const response = await fetch(`${API_BASE_URL}/staff/${staffId}/availabilities?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Failed to fetch staff availability');
    }

    const data = await response.json();
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
