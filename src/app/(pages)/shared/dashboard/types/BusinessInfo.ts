export interface BusinessInfo {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  category?: string;
  location?: string;
  phone?: string;
  email?: string;
  rating?: number | string | null;
  reviewCount?: number;
}

export interface BusinessImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}
