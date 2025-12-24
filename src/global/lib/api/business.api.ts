/**
 * Business Search API Service
 * Handles all business search API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1';

export interface BusinessSearchResult {
  id: number;
  name: string;
  location: string;
  categoryId: number | null;
  categoryName: string | null;
  category?: string | null;
  rating: number | null;
  reviewCount?: number | null;
  imageUrl: string | null;
  description: string | null;
}

export interface SearchParams {
  query?: string;
  location?: string;
  categoryId?: number;
}

/**
 * Search businesses with advanced filters
 * GET /api/v1/businesses/search/advanced?q=query&location=location&categoryId=id
 */
export async function searchBusinesses(params: SearchParams): Promise<BusinessSearchResult[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.query && params.query.trim()) {
      searchParams.append('q', params.query.trim());
    }
    if (params.location && params.location.trim()) {
      searchParams.append('location', params.location.trim());
    }
    if (params.categoryId) {
      searchParams.append('categoryId', params.categoryId.toString());
    }

    // If no params, return empty
    if (!searchParams.toString()) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/businesses/search/advanced?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search API Error:', error);
    throw error;
  }
}

/**
 * Simple search by name only
 * GET /api/v1/businesses/search?name=query
 */
export async function searchByName(name: string): Promise<BusinessSearchResult[]> {
  try {
    if (!name || !name.trim()) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/businesses/search?name=${encodeURIComponent(name.trim())}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search API Error:', error);
    throw error;
  }
}

/**
 * Get all businesses (for initial listing)
 * GET /api/v1/businesses
 */
export async function getAllBusinesses(): Promise<BusinessSearchResult[]> {
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
    return data;
  } catch (error) {
    console.error('Businesses API Error:', error);
    throw error;
  }
}
