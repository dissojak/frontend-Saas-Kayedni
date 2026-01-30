'use server';

import { ResourceTemplateCreateRequest, ResourceTemplateResponse, ResourceCreateRequest, ResourceResponse, ResourceUpdateRequest, ResourceImageDTO, ResourceAvailabilityDTO, ResourceAvailabilityRequest, ResourceAvailabilityBulkRequest, ResourceReservationResponse, ResourceReservationRequest } from '@/global/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// ============================================================================
// TEMPLATE MANAGEMENT
// ============================================================================

export async function fetchResourceTemplates(
  businessId: string,
  authToken?: string
): Promise<ResourceTemplateResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resource-templates`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch resource templates');
  }

  return response.json();
}

export async function createResourceTemplate(
  businessId: string,
  data: ResourceTemplateCreateRequest,
  authToken?: string
): Promise<ResourceTemplateResponse> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resource-templates`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create resource template');
  }

  return response.json();
}

export async function updateResourceTemplate(
  businessId: string,
  templateId: string,
  data: ResourceTemplateCreateRequest,
  authToken?: string
): Promise<ResourceTemplateResponse> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resource-templates/${templateId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update resource template');
  }

  return response.json();
}

export async function deleteResourceTemplate(
  businessId: string,
  templateId: string,
  authToken?: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resource-templates/${templateId}`,
    {
      method: 'DELETE',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete resource template');
  }
}

// ============================================================================
// RESOURCE MANAGEMENT
// ============================================================================

export async function fetchResources(
  businessId: string,
  authToken?: string
): Promise<ResourceResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch resources');
  }

  return response.json();
}

export async function createResource(
  businessId: string,
  data: ResourceCreateRequest,
  authToken?: string
): Promise<ResourceResponse> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create resource');
  }

  return response.json();
}

export async function updateResource(
  businessId: string,
  resourceId: string,
  data: ResourceUpdateRequest,
  authToken?: string
): Promise<ResourceResponse> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update resource');
  }

  return response.json();
}

export async function deleteResource(
  businessId: string,
  resourceId: string,
  authToken?: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}`,
    {
      method: 'DELETE',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete resource');
  }
}

// ============================================================================
// STAFF ASSIGNMENT
// ============================================================================

export async function assignStaffToResource(
  businessId: string,
  resourceId: string,
  staffId: string,
  authToken?: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/staff/${staffId}`,
    {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to assign staff to resource');
  }
}

export async function removeStaffFromResource(
  businessId: string,
  resourceId: string,
  staffId: string,
  authToken?: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/staff/${staffId}`,
    {
      method: 'DELETE',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to remove staff from resource');
  }
}

// ============================================================================
// IMAGE MANAGEMENT
// ============================================================================

export async function addResourceImage(
  businessId: string,
  resourceId: string,
  imageUrl: string,
  isPrimary?: boolean,
  authToken?: string
): Promise<ResourceImageDTO> {
  const params = new URLSearchParams();
  params.append('imageUrl', imageUrl);
  if (isPrimary !== undefined) {
    params.append('isPrimary', isPrimary.toString());
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/images?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to add resource image');
  }

  return response.json();
}

export async function removeResourceImage(
  businessId: string,
  resourceId: string,
  imageId: string,
  authToken?: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/images/${imageId}`,
    {
      method: 'DELETE',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to remove resource image');
  }
}

export async function reorderResourceImages(
  businessId: string,
  resourceId: string,
  imageIds: string[],
  authToken?: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/images/reorder`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(imageIds),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to reorder resource images');
  }
}

// ============================================================================
// AVAILABILITY MANAGEMENT
// ============================================================================

export async function fetchResourceAvailabilities(
  businessId: string,
  resourceId: string,
  from: string,
  to: string,
  authToken?: string
): Promise<ResourceAvailabilityDTO[]> {
  const params = new URLSearchParams();
  params.append('from', from);
  params.append('to', to);

  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/availabilities?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch resource availabilities');
  }

  return response.json();
}

export async function createResourceAvailability(
  businessId: string,
  resourceId: string,
  data: ResourceAvailabilityRequest,
  authToken?: string
): Promise<ResourceAvailabilityDTO> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/availabilities`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create resource availability');
  }

  return response.json();
}

export async function createBulkResourceAvailabilities(
  businessId: string,
  resourceId: string,
  data: ResourceAvailabilityBulkRequest,
  authToken?: string
): Promise<ResourceAvailabilityDTO[]> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/availabilities/bulk`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create bulk resource availabilities');
  }

  return response.json();
}

export async function updateResourceAvailability(
  businessId: string,
  resourceId: string,
  availabilityId: string,
  data: ResourceAvailabilityRequest,
  authToken?: string
): Promise<ResourceAvailabilityDTO> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/availabilities/${availabilityId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update resource availability');
  }

  return response.json();
}

export async function deleteResourceAvailability(
  businessId: string,
  resourceId: string,
  availabilityId: string,
  authToken?: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/availabilities/${availabilityId}`,
    {
      method: 'DELETE',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete resource availability');
  }
}

// ============================================================================
// RESERVATION MANAGEMENT
// ============================================================================

export async function fetchResourceReservations(
  businessId: string,
  resourceId: string,
  authToken?: string
): Promise<ResourceReservationResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/reservations`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch resource reservations');
  }

  return response.json();
}

export async function confirmReservation(
  businessId: string,
  resourceId: string,
  reservationId: string,
  authToken?: string
): Promise<ResourceReservationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/reservations/${reservationId}/confirm`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to confirm reservation');
  }

  return response.json();
}

export async function completeReservation(
  businessId: string,
  resourceId: string,
  reservationId: string,
  authToken?: string
): Promise<ResourceReservationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/v1/businesses/${businessId}/resources/${resourceId}/reservations/${reservationId}/complete`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to complete reservation');
  }

  return response.json();
}
