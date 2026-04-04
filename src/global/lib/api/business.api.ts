/**
 * Business Search API Service
 * Handles all business search API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api/v1';
const EXCLUDED_SIGNUP_CATEGORY_ID = 25;

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

interface BusinessListResponse {
  id: number;
  name: string;
  location?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  imageUrl?: string | null;
  firstImageUrl?: string | null;
  description?: string | null;
}

export interface SearchParams {
  query?: string;
  location?: string;
  categoryId?: number;
  date?: string;
}

export interface CategorySearchResult {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
}

export interface PagedBusinessesResponse {
  items: BusinessSearchResult[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Search businesses with advanced filters
 * GET /api/v1/businesses/search/advanced?q=query&location=location&categoryId=id
 */
export async function searchBusinesses(params: SearchParams): Promise<BusinessSearchResult[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.query?.trim()) {
      searchParams.append('q', params.query.trim());
    }
    if (params.location?.trim()) {
      searchParams.append('location', params.location.trim());
    }
    if (params.categoryId) {
      searchParams.append('categoryId', params.categoryId.toString());
    }
    if (params.date) {
      searchParams.append('date', params.date);
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
 * Search businesses with advanced filters and pagination
 * GET /api/v1/businesses/search/advanced/paged
 */
export async function searchBusinessesPage(
  params: SearchParams,
  page = 0,
  size = 12,
): Promise<PagedBusinessesResponse> {
  try {
    const searchParams = new URLSearchParams();

    if (params.query?.trim()) {
      searchParams.append('q', params.query.trim());
    }
    if (params.location?.trim()) {
      searchParams.append('location', params.location.trim());
    }
    if (params.categoryId) {
      searchParams.append('categoryId', params.categoryId.toString());
    }
    if (params.date) {
      searchParams.append('date', params.date);
    }

    searchParams.append('page', String(page));
    searchParams.append('size', String(size));

    const response = await fetch(`${API_BASE_URL}/businesses/search/advanced/paged?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Search pagination failed');
    }

    const data: any = await response.json();
    const content = Array.isArray(data?.content) ? data.content : [];

    return {
      items: content as BusinessSearchResult[],
      page: Number(data?.page ?? page),
      size: Number(data?.size ?? size),
      totalElements: Number(data?.totalElements ?? 0),
      totalPages: Number(data?.totalPages ?? 0),
      hasNext: Boolean(data?.hasNext),
      hasPrevious: Boolean(data?.hasPrevious),
    };
  } catch (error) {
    console.error('Search Page API Error:', error);
    throw error;
  }
}

/**
 * Search categories with optional query and limit
 * GET /api/v1/categories/search?q=query&limit=12
 */
export async function searchCategories(query?: string, limit = 12): Promise<CategorySearchResult[]> {
  try {
    const searchParams = new URLSearchParams();
    if (query?.trim()) {
      searchParams.append('q', query.trim());
    }
    searchParams.append('limit', String(limit));

    const response = await fetch(`${API_BASE_URL}/categories/search?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Category search failed');
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter((item) => {
      const id = Number((item as CategorySearchResult).id);
      return Number.isFinite(id) && id !== EXCLUDED_SIGNUP_CATEGORY_ID;
    });
  } catch (error) {
    console.error('Category API Error:', error);
    throw error;
  }
}

/**
 * Simple search by name only
 * GET /api/v1/businesses/search?name=query
 */
export async function searchByName(name: string): Promise<BusinessSearchResult[]> {
  try {
    if (!name?.trim()) {
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

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return (data as BusinessListResponse[]).map((item) => ({
      id: item.id,
      name: item.name,
      location: item.location ?? '',
      categoryId: item.categoryId ?? null,
      categoryName: item.categoryName ?? null,
      category: item.categoryName ?? null,
      rating: item.rating ?? null,
      reviewCount: item.reviewCount ?? null,
      imageUrl: item.imageUrl ?? item.firstImageUrl ?? null,
      description: item.description ?? null,
    }));
  } catch (error) {
    console.error('Businesses API Error:', error);
    throw error;
  }
}

/**
 * Get paged active businesses
 * GET /api/v1/businesses/paged?page=0&size=12
 */
export async function getBusinessesPage(page = 0, size = 12): Promise<PagedBusinessesResponse> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('page', String(page));
    searchParams.append('size', String(size));

    const response = await fetch(`${API_BASE_URL}/businesses/paged?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch paged businesses');
    }

    const data: any = await response.json();
    const content = Array.isArray(data?.content) ? data.content : [];

    return {
      items: (content as BusinessListResponse[]).map((item) => ({
        id: item.id,
        name: item.name,
        location: item.location ?? '',
        categoryId: item.categoryId ?? null,
        categoryName: item.categoryName ?? null,
        category: item.categoryName ?? null,
        rating: item.rating ?? null,
        reviewCount: item.reviewCount ?? null,
        imageUrl: item.imageUrl ?? item.firstImageUrl ?? null,
        description: item.description ?? null,
      })),
      page: Number(data?.page ?? 0),
      size: Number(data?.size ?? size),
      totalElements: Number(data?.totalElements ?? 0),
      totalPages: Number(data?.totalPages ?? 0),
      hasNext: Boolean(data?.hasNext),
      hasPrevious: Boolean(data?.hasPrevious),
    };
  } catch (error) {
    console.error('Businesses Page API Error:', error);
    throw error;
  }
}
