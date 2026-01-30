'use server';

import { Resource, ResourceAvailability, ResourceReservation, ResourceReservationRequest } from '@/global/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// ============================================================================
// PUBLIC RESOURCE SEARCH & BROWSE
// ============================================================================

export async function searchResources(
  query?: string,
  type?: string,
  minPrice?: number,
  maxPrice?: number,
  page: number = 0,
  pageSize: number = 20
): Promise<{ resources: Resource[]; totalPages: number; total: number }> {
  const params = new URLSearchParams();

  if (query) params.append('query', query);
  if (type) params.append('type', type);
  if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
  if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
  params.append('page', page.toString());
  params.append('size', pageSize.toString());

  const response = await fetch(
    `${API_BASE_URL}/v1/resources/search?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search resources');
  }

  return response.json();
}

export async function fetchResourceById(resourceId: string): Promise<Resource> {
  const response = await fetch(
    `${API_BASE_URL}/v1/resources/${resourceId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch resource');
  }

  return response.json();
}

// ============================================================================
// AVAILABILITY
// ============================================================================

export async function fetchResourceAvailableSlots(
  resourceId: string,
  from: string,
  to: string
): Promise<ResourceAvailability[]> {
  const params = new URLSearchParams();
  params.append('from', from);
  params.append('to', to);

  const response = await fetch(
    `${API_BASE_URL}/v1/resources/${resourceId}/availabilities?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch available slots');
  }

  return response.json();
}

// ============================================================================
// RESERVATIONS (CLIENT)
// ============================================================================

export async function createResourceReservation(
  resourceId: string,
  data: ResourceReservationRequest,
  authToken: string
): Promise<ResourceReservation> {
  const response = await fetch(
    `${API_BASE_URL}/v1/resources/${resourceId}/reservations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create resource reservation');
  }

  return response.json();
}

export async function fetchMyResourceReservations(
  authToken: string
): Promise<ResourceReservation[]> {
  const response = await fetch(
    `${API_BASE_URL}/v1/resources/reservations/my`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch your reservations');
  }

  return response.json();
}

export async function cancelResourceReservation(
  reservationId: string,
  authToken: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/resources/reservations/${reservationId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to cancel reservation');
  }
}
