import { mockFetch } from '@global/lib/fetcher';

export async function fetchBusinessStats() {
  return mockFetch('/api/business/stats');
}

export async function fetchBusinessBookings() {
  return mockFetch('/api/business/recent-bookings');
}

export async function fetchTopStaff() {
  return mockFetch('/api/business/top-staff');
}
