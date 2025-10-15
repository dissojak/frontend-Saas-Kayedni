export interface AdminStat {
  name: string;
  value: string;
  change: string;
}

export interface AdminBusiness {
  id: string;
  name: string;
  owner: string;
  category: string;
  staff: number;
  status: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  registered: string;
  bookings: number;
}
