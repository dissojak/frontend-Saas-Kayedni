export interface Booking {
  id: number;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  staffName: string;
  staffId?: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  notes?: string;
  cancellationReason?: string;
  businessId?: number;
  createdAt: string;
}
