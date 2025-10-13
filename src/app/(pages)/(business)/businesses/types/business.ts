export interface Business {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  rating?: number | string;
  category?: string;
}

export type Category = string;
