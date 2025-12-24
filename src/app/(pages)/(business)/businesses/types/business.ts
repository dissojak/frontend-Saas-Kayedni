export interface Business {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  imageUrl?: string;
  rating?: number | string;
  category?: string;
  location?: string;
  phone?: string;
  email?: string;
  reviewCount?: number;
}

export type Category = string;
