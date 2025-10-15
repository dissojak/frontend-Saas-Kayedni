// Placeholder actions for admin dashboard — replace implementations with real backend calls later
import { mockFetch } from '@global/lib/fetcher';

export async function fetchAdminOverview() {
  // In future, call backend endpoint /api/admin/overview
  return mockFetch('/api/admin/overview');
}

export async function fetchRecentBusinesses() {
  return mockFetch('/api/admin/recent-businesses');
}

export async function fetchRecentUsers() {
  return mockFetch('/api/admin/recent-users');
}
