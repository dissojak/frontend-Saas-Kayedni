import type { Business } from "../businesses/types/business";
import { mockBusinesses, mockStaff, mockServices, mockCategories } from "../../../global/data";

/**
 * Simulated backend call to fetch businesses.
 * Replace this with a real fetch() / client when backend is available.
 */
export async function fetchBusinesses(): Promise<Business[]> {
  // small artificial delay to mimic network
  return new Promise((resolve) => setTimeout(() => resolve(mockBusinesses as Business[]), 250));
}
// backend real use EXEMPLE :
// export async function fetchBusinesses(): Promise<Business[]> {
//   const res = await fetch('/api/businesses');
//   if (!res.ok) throw new Error('Failed to fetch businesses');
//   return res.json();
// }

/**
 * Simulated backend call to fetch categories.
 * Currently derives categories from the dummy data.
 */
export async function fetchCategories(): Promise<string[]> {
  // Simulate fetching from a dedicated categories table/source
  return new Promise((resolve) => setTimeout(() => resolve(mockCategories), 150));
}

/**
 * Fetch a single business by id (dummy)
 */
export async function fetchBusinessById(id: string) {
  return new Promise((resolve) => setTimeout(() => resolve(mockBusinesses.find((b: any) => b.id === id) ?? null), 200));
}

/**
 * Dummy staff and services for the detail page. Replace with real backend calls.
 */
export async function fetchStaffByBusinessId(businessId: string) {
  const staff = mockStaff.filter((s: any) => s.businessId === businessId);
  return new Promise((resolve) => setTimeout(() => resolve(staff), 200));
}

export async function fetchServicesByBusinessId(businessId: string) {
  const services = mockServices.filter((s: any) => s.businessId === businessId);
  return new Promise((resolve) => setTimeout(() => resolve(services), 200));
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
