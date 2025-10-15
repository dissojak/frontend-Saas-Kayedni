export interface BusinessStat {
  name: string;
  value: string;
  change: string;
}

export interface BookingSummary {
  id: string;
  client: string;
  service: string;
  staff: string;
  date: string;
  status: string;
}

export interface StaffSummary {
  name: string;
  bookings: number;
  revenue: string;
  rating: number;
}
