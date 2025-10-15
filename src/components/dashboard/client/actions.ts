import { mockFetch } from '@global/lib/fetcher';

export async function fetchClientUpcoming() {
  return mockFetch('/api/client/upcoming');
}

export async function fetchClientPast() {
  return mockFetch('/api/client/past');
}

export async function fetchRecommended() {
  return mockFetch('/api/client/recommended');
}
