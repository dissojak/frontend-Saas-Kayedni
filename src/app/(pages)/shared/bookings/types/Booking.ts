export interface Booking {
  id: number;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  notes?: string;
  createdAt: string;
}
