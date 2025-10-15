export interface ClientBooking {
  id: string;
  business: string;
  service: string;
  staff: string;
  date: string;
  time: string;
  reviewed?: boolean;
}

export interface RecommendedBusiness {
  id: string;
  name: string;
  category: string;
  rating: number;
  image?: string;
}
