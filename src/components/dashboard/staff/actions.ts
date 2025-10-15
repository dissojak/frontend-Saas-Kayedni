import { mockFetch } from '@global/lib/fetcher';

export async function fetchStaffSchedule() {
  return mockFetch('/api/staff/schedule');
}

export async function fetchTomorrow() {
  return mockFetch('/api/staff/tomorrow');
}
