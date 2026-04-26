export interface Business {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  imageUrl?: string;
  qrCodeUrl?: string;
  qrUpdatedAt?: string;
  rating?: number | string;
  category?: string;
  location?: string;
  phone?: string;
  email?: string;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type Category = string;
